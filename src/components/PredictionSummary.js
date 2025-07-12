import { useState, useEffect } from 'react';
import { trainPredictionModel } from '../helpers/analytics';

const PredictionSummary = ({ logs, drains, rules = [] }) => {
    const [predictions, setPredictions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const calculatePredictions = async () => {
            if (drains.length === 0) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            const NUM_DAYS_TO_ANALYZE = 7;

            const predictionPromises = drains.map(async (drain) => {
                const dailyTotals = Array(NUM_DAYS_TO_ANALYZE).fill(0);
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const relevantLogs = logs.filter(log => log.drainId === drain.id);
                relevantLogs.forEach(log => {
                    const logDate = new Date(log.date);
                    logDate.setHours(0, 0, 0, 0);
                    const diffDays = Math.floor((today - logDate) / (1000 * 60 * 60 * 24));
                    if (diffDays >= 0 && diffDays < NUM_DAYS_TO_ANALYZE) {
                        dailyTotals[NUM_DAYS_TO_ANALYZE - 1 - diffDays] += parseFloat(log.amount || 0);
                    }
                });

                if (relevantLogs.length < 2) {
                    return { id: drain.id, name: drain.name, hasEnoughData: false };
                }

                const { slope, nextValue } = await trainPredictionModel(dailyTotals);
                return { id: drain.id, name: drain.name, slope, nextValue, hasEnoughData: true };
            });

            const results = await Promise.all(predictionPromises);
            setPredictions(results);
            setIsLoading(false);
        };

        calculatePredictions();
    }, [logs, drains]);

    if (drains.length === 0) {
        return <p className="text-center text-sm text-gray-500 dark:text-gray-400">Add drains to see predictions.</p>;
    }
    
    if (isLoading) {
        return <p className="text-center text-sm text-gray-500 dark:text-gray-400">🧠 Training prediction models...</p>;
    }

    return (
        <div className="space-y-3">
            {predictions.map(pred => (
                <div key={pred.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">{pred.name}</h4>
                    {pred.hasEnoughData ? (
                        <>
                            <div className="flex justify-between items-center mt-1">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Trend: 
                                        <span className={`font-bold ${pred.slope < -0.1 ? 'text-green-500' : pred.slope > 0.1 ? 'text-red-500' : 'text-gray-500'}`}>
                                            {pred.slope < -0.1 ? ' Decreasing' : pred.slope > 0.1 ? ' Increasing' : ' Stable'}
                                        </span>
                                        <span> (~{pred.slope.toFixed(1)} cc/day)</span>
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                        {(pred.nextValue < 0 ? 0 : pred.nextValue).toFixed(1)} cc
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Tomorrow's Estimate</p>
                                </div>
                            </div>
                            
                            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 space-y-2">
                                <div>
                                    <h5 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Exceed Forecast</h5>
                                    {rules.length > 0 ? (
                                        rules.map(rule => {
                                            let forecastText = '';
                                            if (pred.slope > 0.1) {
                                                if (pred.nextValue > rule.amount) {
                                                    forecastText = `Currently exceeding threshold.`;
                                                } else {
                                                    const daysToExceed = (rule.amount - pred.nextValue) / pred.slope;
                                                    const tomorrow = new Date();
                                                    tomorrow.setDate(tomorrow.getDate() + 1);
                                                    const targetDate = new Date(tomorrow);
                                                    targetDate.setDate(tomorrow.getDate() + Math.ceil(daysToExceed));
                                                    const formattedDate = targetDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
                                                    forecastText = `May exceed threshold around ${formattedDate} (~${Math.ceil(daysToExceed)} days).`;
                                                }
                                            } else {
                                                forecastText = `Not expected to exceed threshold (trend is stable or decreasing).`;
                                            }
                                            return <p key={rule.id} className="text-sm text-gray-600 dark:text-gray-300"><span className="font-semibold">&lt; {rule.amount}cc Rule:</span> {forecastText}</p>;
                                        })
                                    ) : (
                                        <p className="text-sm text-gray-500 dark:text-gray-400">No threshold rules defined.</p>
                                    )}
                                </div>
                                
                                {/* --- NEW REMOVAL FORECAST LOGIC --- */}
                                <div>
                                    <h5 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Removal Forecast</h5>
                                    {rules.length > 0 ? (
                                        rules.map(rule => {
                                            let removalForecastText = '';
                                            // Prediction is only relevant if trend is decreasing and output is currently above the threshold
                                            if (pred.slope < -0.1 && pred.nextValue > rule.amount) {
                                                const daysToMeet = (rule.amount - pred.nextValue) / pred.slope; // A negative divided by a negative
                                                const finalDayOffset = daysToMeet + (rule.days - 1);
                                                
                                                const tomorrow = new Date();
                                                tomorrow.setDate(tomorrow.getDate() + 1);
                                                const targetDate = new Date(tomorrow);
                                                targetDate.setDate(tomorrow.getDate() + Math.ceil(finalDayOffset));

                                                const formattedDate = targetDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
                                                removalForecastText = `Eligible for removal around ${formattedDate}.`;

                                            } else if (pred.nextValue <= rule.amount) {
                                                removalForecastText = `Already meets daily output threshold.`;
                                            } else {
                                                removalForecastText = `Not trending towards removal eligibility.`;
                                            }
                                            return <p key={rule.id} className="text-sm text-gray-600 dark:text-gray-300"><span className="font-semibold">&lt; {rule.amount}cc Rule:</span> {removalForecastText}</p>;
                                        })
                                    ) : (
                                        <p className="text-sm text-gray-500 dark:text-gray-400">No threshold rules defined.</p>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Not enough data to predict.</p>
                    )}
                </div>
            ))}
        </div>
    );
};

export default PredictionSummary;