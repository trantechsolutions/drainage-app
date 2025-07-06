import React from 'react';

const PrintableSummary = ({ drains, logs }) => {
    const sortedDrains = [...drains].sort((a, b) => a.name.localeCompare(b.name));

    if (sortedDrains.length === 0) {
        return <p className="text-center py-4 text-gray-500 dark:text-gray-400">Add drains to see the summary.</p>;
    }

    const logsByDay = logs.reduce((acc, log) => {
        const date = new Date(log.date);
        const dateKey = new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString().split('T')[0];
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(log);
        return acc;
    }, {});

    const sortedDates = Object.keys(logsByDay).sort((a, b) => new Date(b) - new Date(a));

    return (
        <table className="min-w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Time</th>
                    {sortedDrains.map(drain => (
                        <th key={drain.id} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{drain.name}</th>
                    ))}
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {logs.length === 0 ? (
                    <tr><td colSpan={sortedDrains.length + 1} className="text-center py-4 text-gray-500 dark:text-gray-400">No logs recorded yet.</td></tr>
                ) : sortedDates.map(date => {
                    const logsForDay = logsByDay[date].sort((a,b) => new Date(a.date) - new Date(b.date));
                    
                    const timeClumps = [];
                    let currentClump = null;

                    logsForDay.forEach(log => {
                        const logTime = new Date(log.date);
                        if (!currentClump || (logTime.getTime() - new Date(currentClump.clumpTime).getTime()) > 10 * 60 * 1000) {
                            if (currentClump) timeClumps.push(currentClump);
                            currentClump = { clumpTime: log.date, outputs: {} };
                        }
                        currentClump.outputs[log.drainId] = (currentClump.outputs[log.drainId] || 0) + parseFloat(log.amount);
                    });
                    if (currentClump) timeClumps.push(currentClump);
                    
                    const dailyTotals = {};

                    return (
                        <React.Fragment key={date}>
                            <tr className="bg-gray-100 dark:bg-gray-800">
                                <td colSpan={sortedDrains.length + 1} className="px-6 py-3 text-left text-sm font-bold text-gray-900 dark:text-white">Day: {date}</td>
                            </tr>
                            {timeClumps.map(clump => {
                                const formattedTime = new Date(clump.clumpTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                return (
                                    <tr key={clump.clumpTime} className="bg-white dark:bg-gray-800/50">
                                        <td className="px-6 py-4 whitespace-nowrap font-medium">{formattedTime}</td>
                                        {sortedDrains.map(drain => {
                                            const amount = clump.outputs[drain.id] || 0;
                                            dailyTotals[drain.id] = (dailyTotals[drain.id] || 0) + amount;
                                            return <td key={drain.id} className="px-6 py-4 whitespace-nowrap">{amount > 0 ? `${amount.toFixed(1)} cc` : '-'}</td>;
                                        })}
                                    </tr>
                                );
                            })}
                            <tr className="bg-gray-200 dark:bg-gray-700 font-bold">
                                <td className="px-6 py-4 whitespace-nowrap">Total</td>
                                {sortedDrains.map(drain => (
                                    <td key={drain.id} className="px-6 py-4 whitespace-nowrap">{(dailyTotals[drain.id] || 0).toFixed(1)} cc</td>
                                ))}
                            </tr>
                        </React.Fragment>
                    );
                })}
            </tbody>
        </table>
    );
};

export default PrintableSummary;