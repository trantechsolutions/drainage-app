const DetailedLogHistory = ({ logs, drains, onEdit, onDelete }) => {
    if (logs.length === 0) {
        return <p className="text-center py-4 text-gray-500 dark:text-gray-400">No logs recorded yet.</p>;
    }

    const sortedLogs = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Drain</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date & Time</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Output (cc)</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Notes</th>
                        <th scope="col" className="relative px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {sortedLogs.map(log => {
                        const drain = drains.find(d => d.id === log.drainId);
                        return (
                            <tr key={log.id} className="bg-white dark:bg-gray-800">
                                <td className="px-6 py-4 whitespace-nowrap">{drain ? drain.name : 'Unknown Drain'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{new Date(log.date).toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{parseFloat(log.amount).toFixed(1)} cc</td>
                                <td className="px-6 py-4 whitespace-normal">{log.notes || ''}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => onEdit(log)} className="edit-log-btn text-blue-500 hover:text-blue-700 font-semibold mr-4">Edit</button>
                                    <button onClick={() => onDelete(log.id)} className="delete-log-btn text-red-500 hover:text-red-700 font-semibold">Delete</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default DetailedLogHistory;