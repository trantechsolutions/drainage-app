import { useState, useEffect, useCallback, useRef } from 'react';

import Header from './components/Header';
import ThresholdsSummary from './components/ThresholdsSummary';
import { DrainLineChart, DrainBarChart } from './components/DrainCharts';
import PrintableSummary from './components/PrintableSummary';
import DetailedLogHistory from './components/DetailedLogHistory';
import LogOutputModal from './components/LogOutputModal';
import EditLogModal from './components/EditLogModal';
import MessageModal from './components/MessageModal';

const generateId = () => `id_${new Date().getTime()}_${Math.random().toString(36).substr(2, 9)}`;

// --- Main App Component ---
export default function App() {
    const [appData, setAppData] = useState({ drains: [], logs: [], settings: { rules: [] } });
    const [currentPage, setCurrentPage] = useState('dashboard-page');
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [logToEdit, setLogToEdit] = useState(null);
    const [message, setMessage] = useState('');
    const [isDark, setIsDark] = useState(false);
    const draggedItem = useRef(null);
    const dragOverItem = useRef(null);

    const loadData = useCallback(() => {
        const data = localStorage.getItem('drainTrackerData');
        if (data) {
            const parsedData = JSON.parse(data);
            let settings = { rules: [] }; // Default new structure

            // Check if settings exist and migrate if it's the old format
            if (parsedData.settings) {
                if (parsedData.settings.threshold && !parsedData.settings.rules) {
                    // Old format detected: migrate to new rule-based format
                    settings.rules.push({
                        id: generateId(),
                        amount: parsedData.settings.threshold,
                        hours: 24 // Sensible default for the old single threshold
                    });
                } else if (parsedData.settings.rules) {
                    // New format, use it as is
                    settings = parsedData.settings;
                }
            }
            
            setAppData({
                drains: parsedData.drains || [],
                logs: parsedData.logs || [],
                settings: settings
            });
        }
    }, []);
    const saveData = useCallback((data) => {
        localStorage.setItem('drainTrackerData', JSON.stringify(data));
    }, []);

    useEffect(() => {
        loadData();
        const savedTheme = localStorage.getItem('theme');
        const initialIsDark = savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDark(initialIsDark);
    }, [loadData]);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    useEffect(() => {
        const isDark = localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
        document.documentElement.classList.toggle('dark', isDark);
        document.getElementById('sun-icon')?.classList.toggle('hidden', isDark);
        document.getElementById('moon-icon')?.classList.toggle('hidden', !isDark);
    }, []);

    const handleToggleTheme = () => {
        const newIsDark = !isDark;
        setIsDark(newIsDark);
        localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
    };

    const handleAddDrain = (e) => {
        e.preventDefault();
        const drainName = e.target.elements['drain-name-input'].value.trim();
        if (drainName) {
            const newDrain = { id: generateId(), name: drainName };
            const newData = { ...appData, drains: [...appData.drains, newDrain] };
            setAppData(newData);
            saveData(newData);
            setMessage(`Drain "${drainName}" added.`);
            e.target.reset();
        }
    };
    
    const handleDeleteDrain = (id, name) => {
        if (window.confirm(`Delete drain "${name}" and all its logs?`)) {
            const newDrains = appData.drains.filter(d => d.id !== id);
            const newLogs = appData.logs.filter(l => l.drainId !== id);
            const newData = { ...appData, drains: newDrains, logs: newLogs };
            setAppData(newData);
            saveData(newData);
            setMessage('Drain and logs deleted.');
        }
    };

    const handleAddLog = (logData) => {
        const newLog = { ...logData, id: generateId() };
        const newData = { ...appData, logs: [...appData.logs, newLog] };
        setAppData(newData);
        saveData(newData);
        setIsLogModalOpen(false);
        setMessage('Log added successfully.');
    };

    const handleEditLog = (updatedLog) => {
        const newLogs = appData.logs.map(log => log.id === updatedLog.id ? updatedLog : log);
        const newData = { ...appData, logs: newLogs };
        setAppData(newData);
        saveData(newData);
        setIsEditModalOpen(false);
        setLogToEdit(null);
        setMessage('Log updated successfully.');
    };
    
    const handleDeleteLog = (id) => {
        if (window.confirm('Delete this log entry?')) {
            const newLogs = appData.logs.filter(log => log.id !== id);
            const newData = { ...appData, logs: newLogs };
            setAppData(newData);
            saveData(newData);
            setMessage('Log entry deleted.');
        }
    };

    const handleAddRule = (e) => {
        e.preventDefault();
        const amount = parseFloat(e.target.elements['rule-amount'].value);
        const hours = parseInt(e.target.elements['rule-hours'].value, 10);
        const interval = parseInt(e.target.elements['rule-interval'].value, 10);
        
        if (!isNaN(amount) && !isNaN(hours) && !isNaN(interval) && amount > 0 && hours > 0 && interval > 0) {
             if (hours % interval !== 0) {
                setMessage('Timeframe must be divisible by the interval.');
                return;
            }
            const newRule = { id: generateId(), amount, hours, interval };
            const newRules = [...appData.settings.rules, newRule];
            const newData = { ...appData, settings: { ...appData.settings, rules: newRules } };
            setAppData(newData);
            saveData(newData);
            setMessage('New threshold rule added.');
            e.target.reset();
        } else {
            setMessage('Please enter valid numbers for all fields.');
        }
    };

    const handleDeleteRule = (id) => {
        const newRules = appData.settings.rules.filter(rule => rule.id !== id);
        const newData = { ...appData, settings: { ...appData.settings, rules: newRules } };
        setAppData(newData);
        saveData(newData);
        setMessage('Threshold rule deleted.');
    };

    const handleRuleReorder = () => {
        const rules = [...appData.settings.rules];
        const draggedItemContent = rules.splice(draggedItem.current, 1)[0];
        rules.splice(dragOverItem.current, 0, draggedItemContent);
        draggedItem.current = null;
        dragOverItem.current = null;
        const newData = { ...appData, settings: { ...appData.settings, rules: rules } };
        setAppData(newData);
        saveData(newData);
    };
    
    const handleExport = () => {
        const dataStr = JSON.stringify(appData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `drain-tracker-data-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleImport = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                if (importedData && Array.isArray(importedData.drains) && Array.isArray(importedData.logs)) {
                   if (window.confirm('Are you sure you want to import this data? This will overwrite all current data.')) {
                        const newData = {
                            drains: importedData.drains,
                            logs: importedData.logs,
                            settings: importedData.settings || { rules: [] }
                        };
                        setAppData(newData);
                        saveData(newData);
                        setMessage('Data imported successfully!');
                    }
                } else {
                    throw new Error('Invalid file format.');
                }
            } catch (error) {
                setMessage(`Error importing file: ${error.message}`);
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    };

    const handlePrint = () => {
        const wasDark = document.documentElement.classList.contains('dark');
        
        const afterPrintHandler = () => {
            if (wasDark) {
                document.documentElement.classList.add('dark');
            }
            window.removeEventListener('afterprint', afterPrintHandler);
        };
        window.addEventListener('afterprint', afterPrintHandler);

        if (wasDark) {
            document.documentElement.classList.remove('dark');
        }

        setTimeout(() => {
            window.print();
        }, 100);
    };
    
    return (
        <div className="container mx-auto p-4 md:p-6 max-w-4xl pb-24 dark:bg-gray-900 bg-gray-100 transition-colors duration-300">
            <Header onToggleTheme={handleToggleTheme} />
            
            <main class="pb-24">
                <div className={`page space-y-8 ${currentPage === 'dashboard-page' ? '' : 'hidden'}`}>
                    <section className="mb-8 p-4 bg-gray-100 dark:bg-gray-700/20 dark:text-white rounded-lg shadow-inner no-print">
                        <h2 className="text-xl font-semibold text-center mb-4 text-gray-800 dark:text-gray-200">Thresholds</h2>
                        <div className="flex flex-wrap justify-center gap-4">
                            <ThresholdsSummary drains={appData.drains} logs={appData.logs} rules={appData.settings.rules} />
                        </div>
                    </section>
                    <section className="mb-8 p-4 bg-gray-100 dark:bg-gray-700/20 dark:text-white rounded-lg shadow-inner no-print">
                        <h2 className="text-xl font-semibold text-center mb-4 text-gray-800 dark:text-gray-200">Line Graph</h2>
                        <div className="flex flex-wrap justify-center gap-4">
                            <DrainLineChart drains={appData.drains} logs={appData.logs} isDark={isDark} />
                        </div>
                    </section>
                    <section className="mb-8 p-4 bg-gray-100 dark:bg-gray-700/20 dark:text-white rounded-lg shadow-inner no-print">
                        <h2 className="text-xl font-semibold text-center mb-4 text-gray-800 dark:text-gray-200">Bar Graph</h2>
                        <div className="flex flex-wrap justify-center gap-4">
                            <DrainBarChart drains={appData.drains} logs={appData.logs} isDark={isDark} />
                        </div>
                    </section>
                </div>
                
                <div className={`page space-y-8 ${currentPage === 'summary-page' ? '' : 'hidden'}`}>
                    <section className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold">Time-Grouped Summary</h2>
                            <button onClick={() => window.print()} className="bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-300 shadow no-print">Print</button>
                        </div>
                        <div id="printable-area" className="overflow-x-auto">
                            <PrintableSummary drains={appData.drains} logs={appData.logs} />
                        </div>
                    </section>
                </div>

                <div className={`page space-y-8 ${currentPage === 'log-page' ? '' : 'hidden'}`}>
                    <section className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-lg shadow-md no-print">
                        <h2 className="text-2xl font-semibold mb-4 border-b dark:border-gray-700 pb-2">Detailed Log History</h2>
                        <DetailedLogHistory logs={appData.logs} drains={appData.drains} onEdit={(log) => { setLogToEdit(log); setIsEditModalOpen(true); }} onDelete={handleDeleteLog} />
                    </section>
                </div>
                
                <div className={`page space-y-8 ${currentPage === 'settings-page' ? '' : 'hidden'}`}>
                    <section className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-lg shadow-md no-print">
                        <h2 className="text-2xl font-semibold mb-4 border-b dark:border-gray-700 pb-2">Manage Drains</h2>
                        <form onSubmit={handleAddDrain} className="flex flex-col sm:flex-row gap-4">
                            <input type="text" name="drain-name-input" placeholder="Enter new drain name" className="flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700" required />
                            <button type="submit" className="bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-600 transition duration-300 shadow">Add Drain</button>
                        </form>
                        <div className="mt-6">
                            <h3 className="text-xl font-semibold mb-2">Your Drains:</h3>
                            <ul className="space-y-2">
                                {[...appData.drains].sort((a, b) => a.name.localeCompare(b.name)).map(drain => (
                                    <li key={drain.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                        <span className="font-medium">{drain.name}</span>
                                        <button onClick={() => handleDeleteDrain(drain.id, drain.name)} className="text-red-500 hover:text-red-700 font-semibold">Delete</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>
                    <section className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-lg shadow-md no-print">
                         <h2 className="text-2xl font-semibold mb-4 border-b dark:border-gray-700 pb-2">Manage Thresholds</h2>
                         <form onSubmit={handleAddRule} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                            <div className="sm:col-span-1">
                                <label htmlFor="rule-amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount (cc)</label>
                                <input type="number" name="rule-amount" min="0" className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" required />
                            </div>
                             <div className="sm:col-span-1">
                                <label htmlFor="rule-hours" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Timeframe (hours)</label>
                                <input type="number" name="rule-hours" min="1" className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" required />
                            </div>
                            <div className="sm:col-span-1">
                                <label htmlFor="rule-interval" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Interval (hours)</label>
                                <input type="number" name="rule-interval" min="1" className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" required />
                            </div>
                            <button type="submit" className="sm:col-span-1 bg-green-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-600">Add Rule</button>
                         </form>
                         <div className="mt-6">
                            <h3 className="text-xl font-semibold mb-2">Current Rules:</h3>
                            <ul className="space-y-2">
                                {appData.settings.rules.map((rule, index) => (
                                    <li 
                                        key={rule.id} 
                                        className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-grab"
                                        draggable
                                        onDragStart={(e) => (draggedItem.current = index)}
                                        onDragEnter={(e) => (dragOverItem.current = index)}
                                        onDragEnd={handleRuleReorder}
                                        onDragOver={(e) => e.preventDefault()}
                                    >
                                        <span>Avg &lt; {rule.amount}cc / {rule.interval}h (over {rule.hours}h)</span>
                                        <button onClick={() => handleDeleteRule(rule.id)} className="text-red-500 hover:text-red-700 font-semibold">Delete</button>
                                    </li>
                                ))}
                             </ul>
                         </div>
                    </section>
                    <section className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-lg shadow-md no-print">
                        <h2 className="text-2xl font-semibold mb-4 border-b dark:border-gray-700 pb-2">Data Management</h2>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button onClick={handleExport} className="flex-1 bg-purple-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-purple-600 transition duration-300 shadow">Export Data (JSON)</button>
                            <label htmlFor="import-data-input" className="flex-1 bg-yellow-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-yellow-600 transition duration-300 shadow text-center cursor-pointer">
                                Import Data (JSON)
                                <input type="file" id="import-data-input" onChange={handleImport} className="hidden" accept=".json" />
                            </label>
                        </div>
                    </section>
                </div>
            </main>

            <LogOutputModal isOpen={isLogModalOpen} onClose={() => setIsLogModalOpen(false)} drains={appData.drains} onAddLog={handleAddLog} />
            <EditLogModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} drains={appData.drains} log={logToEdit} onEditLog={handleEditLog} />
            <MessageModal message={message} onClose={() => setMessage('')} />

            <button onClick={() => setIsLogModalOpen(true)} className="fixed bottom-24 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 no-print">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            </button>

            <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-around no-print">
                 {['dashboard', 'summary', 'log', 'settings'].map(page => {
                    const isActive = currentPage === `${page}-page`;
                    return (
                        <button key={page} onClick={() => setCurrentPage(`${page}-page`)} className={`nav-btn flex-1 p-3 text-center rounded-t-lg ${isActive ? 'text-blue-600 dark:text-blue-400 bg-gray-100 dark:bg-gray-700' : 'text-gray-500 dark:text-gray-400'}`}>
                            {page === 'dashboard' && <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
                            {page === 'summary' && <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>}
                            {page === 'log' && <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>}
                            {page === 'settings' && <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                            <span className="text-xs capitalize">{page}</span>
                        </button>
                    );
                 })}
            </nav>
        </div>
    );
}
