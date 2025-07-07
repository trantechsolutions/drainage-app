const RollingSummary = ({ drains, logs, settings }) => {
    if (drains.length === 0) {
        return <div className="text-gray-500 dark:text-gray-400 col-span-full text-center">No drains to summarize.</div>;
    }

    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
    const fortyEightHoursAgo = new Date(now.getTime() - (48 * 60 * 60 * 1000));
    const threshold = settings.threshold;

    return [...drains].sort((a, b) => a.name.localeCompare(b.name)).map(drain => {
        const logs24h = logs.filter(log => log.drainId === drain.id && new Date(log.date) >= twentyFourHoursAgo);
        const total24h = logs24h.reduce((sum, log) => sum + parseFloat(log.amount), 0);
        const avg24h_6hr = total24h / 4; // Average per 6-hour interval
        const avg24h_4hr = total24h / 6; // Average per 4-hour interval

        const logs48h = logs.filter(log => log.drainId === drain.id && new Date(log.date) >= fortyEightHoursAgo);
        const total48h = logs48h.reduce((sum, log) => sum + parseFloat(log.amount), 0);

        const getColorClass = (avg) => {
            if (avg <= threshold) return 'bg-green-500';
            if (avg > threshold && avg <= threshold * 1.5) return 'bg-yellow-500';
            return 'bg-red-500';
        };

        return (
            <div key={drain.id} className="text-center p-4 bg-white dark:bg-gray-700 rounded-lg shadow min-w-[200px]">
                <div className="flex items-center justify-center font-semibold text-lg text-dark dark:text-white">
                    <span>{drain.name}</span>
                </div>
                <div className="mt-2 space-y-2 text-sm">
                    <div className="flex justify-between text-gray-500 dark:text-gray-400">
                        <span>24h Total:</span>
                        <span className="font-bold text-xl text-black dark:text-white">{total24h.toFixed(1)} cc</span>
                    </div>
                    <div className="flex justify-between text-gray-500 dark:text-gray-400">
                        <span>48h Total:</span>
                        <span className="font-bold text-xl text-black dark:text-white">{total48h.toFixed(1)} cc</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
                        <span>Avg/4h:</span>
                        <div className="flex items-center">
                            <span className={`w-3 h-3 rounded-full mr-2 ${getColorClass(avg24h_4hr)}`}></span>
                            <span className="font-bold text-lg text-black dark:text-white">{avg24h_4hr.toFixed(1)} cc</span>
                        </div>
                    </div>
                     <div className="flex justify-between items-center text-gray-500 dark:text-gray-400">
                        <span>Avg/6h:</span>
                        <div className="flex items-center">
                            <span className={`w-3 h-3 rounded-full mr-2 ${getColorClass(avg24h_6hr)}`}></span>
                            <span className="font-bold text-lg text-black dark:text-white">{avg24h_6hr.toFixed(1)} cc</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    });
};

export default RollingSummary;