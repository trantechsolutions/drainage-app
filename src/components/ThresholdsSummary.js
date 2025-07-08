const ThresholdsSummary = ({ drains, logs, rules = [], indicatorMode }) => {
    if (rules.length === 0) {
        return <div className="text-gray-500 dark:text-gray-400 text-center">No thresholds defined. Go to Settings to add one.</div>;
    }

    return rules.map(rule => {
        const now = new Date();
        const timeframeAgo = new Date(now.getTime() - (rule.hours * 60 * 60 * 1000));
        const interval = rule.interval || rule.hours; // Backward compatibility
        const numIntervals = rule.hours / interval;

        return (
            <div key={rule.id} className="w-full p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                <h3 className="font-bold text-lg text-center mb-2">Rule: Avg &lt; {rule.amount}cc / {interval}h (over {rule.hours}h)</h3>
                <ul className="space-y-2">
                    {drains.map(drain => {
                        const relevantLogs = logs.filter(log => log.drainId === drain.id && new Date(log.date) >= timeframeAgo);
                        const total = relevantLogs.reduce((sum, log) => sum + parseFloat(log.amount), 0);
                        const average = numIntervals > 0 ? total / numIntervals : 0;
                        
                        const valueToCheck = indicatorMode === 'average' ? average : total;
                        const meetsThreshold = valueToCheck <= rule.amount;
                        const colorClass = meetsThreshold ? 'bg-green-500' : 'bg-red-500';

                        return (
                            <li key={drain.id} className="flex justify-between items-center p-2 bg-gray-200 dark:bg-gray-700/50 rounded-md">
                                <span className="font-medium">{drain.name}</span>
                                <div className="flex items-center">
                                    <span className="font-semibold mr-2">Avg: {average.toFixed(1)} cc | Total: {total.toFixed(1)} cc</span>
                                    <span className={`w-4 h-4 rounded-full ${colorClass}`} title={`Indicator based on ${indicatorMode}`}></span>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    });
};


export default ThresholdsSummary;