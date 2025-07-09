import { Fragment, useState, useMemo } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon, TrashIcon } from '@heroicons/react/20/solid';

const DetailedLogHistory = ({ logs, drains, onEdit, onDelete, onBulkDelete }) => {
    const [selectedLogs, setSelectedLogs] = useState([]);
    const [selectedDrain, setSelectedDrain] = useState(null);

    // Memoize filtered logs to prevent recalculating on every render
    const filteredLogs = useMemo(() => {
        return logs
            .filter(log => !selectedDrain || log.drainId === selectedDrain.id)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [logs, selectedDrain]);

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            const allVisibleLogIds = filteredLogs.map(log => log.id);
            setSelectedLogs(allVisibleLogIds);
        } else {
            setSelectedLogs([]);
        }
    };

    const handleSelectOne = (logId) => {
        if (selectedLogs.includes(logId)) {
            setSelectedLogs(selectedLogs.filter(id => id !== logId));
        } else {
            setSelectedLogs([...selectedLogs, logId]);
        }
    };
    
    const handleDeleteSelected = () => {
        // A new handler passed via props to manage bulk deletion in the parent component
        onBulkDelete(selectedLogs);
        setSelectedLogs([]);
    };

    const isAllSelected = filteredLogs.length > 0 && selectedLogs.length === filteredLogs.length;

    // Add an "All Drains" option for the filter
    const filterOptions = [{ id: null, name: 'All Drains' }, ...drains];
    const currentFilterName = selectedDrain ? selectedDrain.name : 'All Drains';

    if (logs.length === 0) {
        return <p className="text-center py-4 text-gray-500 dark:text-gray-400">No logs recorded yet.</p>;
    }

    return (
        <div>
            {/* Toolbar for Filtering and Bulk Actions */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-4 px-1 py-2">
                <div className="w-full md:w-72">
                    <Listbox value={selectedDrain} onChange={setSelectedDrain}>
                        <div className="relative">
                            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white dark:bg-gray-800 py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                                <span className="block truncate">{currentFilterName}</span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </span>
                            </Listbox.Button>
                            <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                                    {filterOptions.map((drain) => (
                                        <Listbox.Option key={drain ? drain.id : 'all'} className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-gray-100'}`} value={drain.id === null ? null : drain}>
                                            {({ selected }) => (
                                                <>
                                                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{drain.name}</span>
                                                    {selected ? (<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600"><CheckIcon className="h-5 w-5" aria-hidden="true" /></span>) : null}
                                                </>
                                            )}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </Transition>
                        </div>
                    </Listbox>
                </div>
                <div className="flex items-center mt-3 md:mt-0">
                    {selectedLogs.length > 0 && (
                        <>
                            <span className="text-sm text-gray-600 dark:text-gray-300 mr-4">
                                {selectedLogs.length} selected
                            </span>
                            <button onClick={handleDeleteSelected} className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 disabled:opacity-50 disabled:cursor-not-allowed">
                                <TrashIcon className="h-5 w-5 mr-2" />
                                Delete Selected
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Detailed Log Table */}
            <div className="overflow-x-auto border rounded-lg dark:border-gray-700">
                <table className="min-w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th scope="col" className="p-4">
                                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500" checked={isAllSelected} onChange={handleSelectAll} />
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Drain</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date & Time</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Output (cc)</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Notes</th>
                            <th scope="col" className="relative px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredLogs.map(log => {
                            const drain = drains.find(d => d.id === log.drainId);
                            const isSelected = selectedLogs.includes(log.id);
                            return (
                                <tr key={log.id} className={`${isSelected ? 'bg-blue-50 dark:bg-blue-900/50' : 'bg-white dark:bg-gray-800'}`}>
                                    <td className="p-4">
                                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500" checked={isSelected} onChange={() => handleSelectOne(log.id)} />
                                    </td>
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
                 {filteredLogs.length === 0 && (
                    <p className="text-center py-4 text-gray-500 dark:text-gray-400">No logs match the current filter.</p>
                )}
            </div>
        </div>
    );
};

export default DetailedLogHistory;