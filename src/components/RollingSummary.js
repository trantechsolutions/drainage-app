const RollingSummary = ({ drains, logs, settings }) => {
    if (drains.length === 0) {
        return <li className="text-gray-500 dark:text-gray-400 col-span-full text-center">No drains to summarize.</li>;
    }

    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
    const fortyEightHoursAgo = new Date(now.getTime() - (48 * 60 * 60 * 1000));
    const threshold = settings.threshold;

    return [...drains].sort((a, b) => a.name.localeCompare(b.name)).map(drain => {
        const logs24h = logs.filter(log => log.drainId === drain.id && new Date(log.date) >= twentyFourHoursAgo);
        const total24h = logs24h.reduce((sum, log) => sum + parseFloat(log.amount), 0);

        const logs48h = logs.filter(log => log.drainId === drain.id && new Date(log.date) >= fortyEightHoursAgo);
        const total48h = logs48h.reduce((sum, log) => sum + parseFloat(log.amount), 0);

        let colorClass = 'bg-gray-400';
        if (total24h <= threshold) colorClass = 'bg-green-500';
        else if (total24h > threshold && total24h <= threshold * 1.5) colorClass = 'bg-yellow-500';
        else colorClass = 'bg-red-500';

        return (
            <li key={drain.id} className="text-center p-3 bg-white dark:bg-gray-700/50 rounded-lg shadow min-w-[150px]">
                <div className="flex items-center justify-center font-semibold text-gray-800 dark:text-gray-200">
                    <span className={`w-3 h-3 rounded-full mr-2 ${colorClass}`}></span>
                    <span>{drain.name}</span>
                </div>
                <div className="mt-2 flex justify-around items-center text-sm">
                    <div className="text-gray-500 dark:text-gray-400 text-center">
                        <div>24h:</div>
                        <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{total24h.toFixed(1)}</div>
                    </div>
                     <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>
                    <div className="text-gray-500 dark:text-gray-400 text-center">
                        <div>48h:</div>
                        <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{total48h.toFixed(1)}</div>
                    </div>
                </div>
            </li>
        );
    });
};

export default RollingSummary;