// src/components/CondensedPrintableSummary.js

import React from 'react';
import './PrintStyles.css'; // Import print-specific styles

const CondensedPrintableSummary = ({ drains, logs }) => {
    const sortedDrains = [...drains].sort((a, b) => a.name.localeCompare(b.name));

    if (sortedDrains.length === 0) {
        return <p>Add drains to see the summary.</p>;
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
        <div className="printable-summary">
            <table> 
                <thead>
                    <tr>
                        <th>Time</th>
                        {sortedDrains.map(drain => (
                            <th key={drain.id}>{drain.name}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {logs.length === 0 ? (
                        <tr><td colSpan={sortedDrains.length + 1}>No logs recorded yet.</td></tr>
                    ) : sortedDates.map(date => {
                        const logsForDay = logsByDay[date].sort((a, b) => new Date(a.date) - new Date(b.date));
                        
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
                                <tr className="day-header">
                                    <td colSpan={sortedDrains.length + 1}>Day: {date}</td>
                                </tr>
                                {timeClumps.map(clump => {
                                    const formattedTime = new Date(clump.clumpTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                    return (
                                        <tr key={clump.clumpTime}>
                                            <td>{formattedTime}</td>
                                            {sortedDrains.map(drain => {
                                                const amount = clump.outputs[drain.id] || 0;
                                                dailyTotals[drain.id] = (dailyTotals[drain.id] || 0) + amount;
                                                return <td key={drain.id}>{amount > 0 ? `${amount.toFixed(1)} cc` : '-'}</td>;
                                            })}
                                        </tr>
                                    );
                                })}
                                <tr className="total-row">
                                    <td>Total</td>
                                    {sortedDrains.map(drain => (
                                        <td key={drain.id}>{(dailyTotals[drain.id] || 0).toFixed(1)} cc</td>
                                    ))}
                                </tr>
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default CondensedPrintableSummary;