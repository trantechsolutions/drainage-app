import useAppData from './hooks/useAppData';

import Header from './components/Header';
import ThresholdsSummary from './components/ThresholdsSummary';
import { DrainLineChart, DrainBarChart } from './components/DrainCharts';
import PrintableSummary from './components/PrintableSummary';
import DetailedLogHistory from './components/DetailedLogHistory';
import LogOutputModal from './components/LogOutputModal';
import EditLogModal from './components/EditLogModal';
import MessageModal from './components/MessageModal';

// --- Main App Component ---
export default function App() {
    const {
        appData,
        handleAddDrain,
        handleDeleteDrain,
        handleAddLog,
        handleEditLog,
        handleDeleteLog,
        handleAddRule,
        handleDeleteRule,
        handleRuleReorder,
        handleIndicatorModeChange,
        handleExport,
        handleImport,
        draggedItem,
        dragOverItem,
        handleToggleTheme,
        isDark,
        currentPage,
        setCurrentPage,
        isLogModalOpen,
        setIsLogModalOpen,
        isEditModalOpen,
        setIsEditModalOpen,
        logToEdit,
        setLogToEdit,
        message,
        setMessage,
        handlePrint
    } = useAppData();

    return (
        <div className="container mx-auto p-4 md:p-6 max-w-4xl pb-24 dark:bg-gray-900 bg-gray-100 transition-colors duration-300">
            <Header onToggleTheme={handleToggleTheme} isDark={isDark} />
            
            <main className="pb-24">
                <div className={`page space-y-8 ${currentPage === 'dashboard-page' ? '' : 'hidden'}`}>
                    <section className="mb-8 p-4 bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-inner no-print">
                        <h2 className="text-xl font-semibold text-center mb-4 text-gray-800 dark:text-gray-200">Thresholds</h2>
                        <div className="flex flex-wrap justify-center gap-4">
                            <ThresholdsSummary drains={appData.drains} logs={appData.logs} rules={appData.settings.rules} indicatorMode={appData.settings.indicatorMode} />
                        </div>
                    </section>
                    <section className="mb-8 p-4 bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-inner no-print">
                        <h2 className="text-xl font-semibold text-center mb-4 text-gray-800 dark:text-gray-200">Line Graph</h2>
                        <div className="flex flex-wrap justify-center gap-4">
                            <DrainLineChart drains={appData.drains} logs={appData.logs} isDark={isDark} />
                        </div>
                    </section>
                    <section className="mb-8 p-4 bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-inner no-print">
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
                            <button onClick={handlePrint} className="bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-300 shadow no-print">Print</button>
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
                        <h2 className="text-2xl font-semibold mb-4 border-b dark:border-gray-700 pb-2">Indicator Logic</h2>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700 dark:text-gray-300">Base indicator on:</span>
                            <div className="flex gap-2">
                                <button onClick={() => handleIndicatorModeChange('total')} className={`py-2 px-4 rounded-lg ${appData.settings.indicatorMode === 'total' ? 'bg-blue-500 text-white border-2 border-blue-800' : 'bg-white-200 dark:bg-gray-800 border border-gray-400 dark:border-gray-700 text-gray-400 dark:text-gray-700'}`}>Total</button>
                                <button onClick={() => handleIndicatorModeChange('average')} className={`py-2 px-4 rounded-lg ${appData.settings.indicatorMode === 'average' ? 'bg-blue-500 text-white border-2 border-blue-800' : 'bg-white-200 dark:bg-gray-800 border border-gray-400 dark:border-gray-700 text-gray-400 dark:text-gray-700'}`}>Average</button>
                            </div>
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
                    <section className="p-6 no-print rounded-lg shadow-md bg-white dark:bg-gray-800">
                        <h2 className="pb-2 mb-4 text-2xl font-semibold border-b dark:border-gray-700 dark:text-white">
                            Privacy and Data Storage
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-medium dark:text-white">Your Data Stays on Your Device</h3>
                                <p className="mt-1 text-gray-600 dark:text-gray-300">
                                    This website is designed to respect your privacy. All data generated during your session is stored locally on your device's browser. No information is saved to our servers or any other external location. This means your data is for your use only, right on the computer or mobile device you are using to access this site.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium dark:text-white">Data Removal</h3>
                                <p className="mt-1 text-gray-600 dark:text-gray-300">
                                    You have full control over your data. To completely wipe all information stored by this website, simply clear your browser's cache for this site. Once the cache is cleared, all associated data will be permanently removed from your device.
                                </p>
                            </div>
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
