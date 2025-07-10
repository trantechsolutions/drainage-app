const ThresholdsSummary = ({ drains, logs, rules = [] }) => {
    if (rules.length === 0) {
        return <div className="text-gray-500 dark:text-gray-400 text-center">No thresholds defined. Go to Settings to add one.</div>;
    }

    // Helper to format dates for display (e.g., "Yesterday", "July 8")
    const formatDateLabel = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        if (date.getTime() === today.getTime()) return "Today";
        if (date.getTime() === yesterday.getTime()) return "Yesterday";
        
        return date.toLocaleDateString(undefined, { month: 'long', day: 'numeric' });
    };

    return rules.map(rule => {
        return (
            <div key={rule.id} className="w-full p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                <h3 className="font-bold text-lg text-center mb-3">Rule: &lt; {rule.amount}cc / day for {rule.days} consecutive day(s)</h3>
                <div className="space-y-4">
                    {drains.map(drain => {
                        // --- 1. Calculate Daily Totals and Results ---
                        const dailyTotals = logs
                            .filter(log => log.drainId === drain.id)
                            .reduce((acc, log) => {
                                const logDate = new Date(log.date);
                                logDate.setHours(0, 0, 0, 0);
                                const dateString = logDate.toISOString().split('T')[0];
                                acc[dateString] = (acc[dateString] || 0) + parseFloat(log.amount);
                                return acc;
                            }, {});

                        // --- THIS LOGIC IS UPDATED TO START FROM YESTERDAY ---
                        const yesterday = new Date();
                        yesterday.setHours(0, 0, 0, 0);
                        yesterday.setDate(yesterday.getDate() - 1);

                        const daysToCheck = Array.from({ length: rule.days }, (_, i) => {
                            const date = new Date(yesterday);
                            date.setDate(yesterday.getDate() - i);
                            return date;
                        }).reverse(); // Reverse to show oldest day first

                        const dailyResults = daysToCheck.map(date => {
                            const dateString = date.toISOString().split('T')[0];
                            const total = dailyTotals[dateString] || 0;
                            return {
                                date: date,
                                total: total,
                                meetsThreshold: total <= rule.amount,
                            };
                        });
                        
                        const combinedTotal = dailyResults.reduce((sum, day) => sum + day.total, 0);
                        const overallStatusMet = dailyResults.every(day => day.meetsThreshold);
                        const overallColorClass = overallStatusMet ? 'bg-green-500' : 'bg-red-500';

                        // --- 2. Render the Detailed Breakdown ---
                        return (
                            <div key={drain.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-semibold text-lg">{drain.name}</span>
                                    <div className="flex items-center gap-x-2">
                                        <span className="font-medium text-gray-700 dark:text-gray-300">
                                            {rule.days}-Day Total: {combinedTotal.toFixed(1)} cc
                                        </span>
                                        <span className={`w-5 h-5 rounded-full ${overallColorClass}`}></span>
                                    </div>
                                </div>
                                <ul className="space-y-1 pl-2 border-l-2 dark:border-gray-600">
                                    {dailyResults.map(result => (
                                        <li key={result.date.toISOString()} className="flex justify-between items-center text-sm">
                                            <span>{formatDateLabel(result.date)}:</span>
                                            <div className="flex items-center gap-x-2">
                                                <span className="font-mono text-gray-800 dark:text-gray-200">{result.total.toFixed(1)} cc</span>
                                                <span className={`w-3 h-3 rounded-full ${result.meetsThreshold ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    });
};

export default ThresholdsSummary;