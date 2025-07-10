import useAppData from './hooks/useAppData';

import Header from './components/Header';
import LogOutputModal from './components/LogOutputModal';
import EditLogModal from './components/EditLogModal';
import MessageModal from './components/MessageModal';
import ChangelogModal from './components/ChangelogModal';

import DashboardView from './views/DashboardView';
import SummaryView from './views/SummaryView';
import LogView from './views/LogView';
import SettingsView from './views/SettingsView';
import ResourcesView from './views/ResourcesView';

export default function App() {
    const {
        appData,
        handleAddDrain,
        handleDeleteDrain,
        handleAddLog,
        handleEditLog,
        handleDeleteLog,
        handleBulkDelete,
        handleAddRule,
        handleDeleteRule,
        handleRuleReorder,
        handleAddResource,
        handleDeleteResource,
        handleAIPredictionToggle,
        handleIndicatorModeChange,
        handleToggleTheme,
        handleExport,
        handlePrint,
        handleImport,
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
        isDark,
        draggedItem,
        dragOverItem,
        isChangelogOpen,
        setIsChangelogOpen,
    } = useAppData();


    return (
        <div className="container mx-auto p-4 md:p-6 max-w-4xl pb-24 dark:bg-gray-900 bg-gray-100 transition-colors duration-300">
            <Header onToggleTheme={handleToggleTheme} isDark={isDark} />
            
            <main className="pb-24">
                {currentPage === 'dashboard-page' && <DashboardView appData={appData} isDark={isDark} />}
                
                {currentPage === 'summary-page' && <SummaryView appData={appData} handlePrint={handlePrint} />}

                {currentPage === 'log-page' && (
                    <LogView 
                        appData={appData}
                        setLogToEdit={setLogToEdit}
                        setIsEditModalOpen={setIsEditModalOpen}
                        handleDeleteLog={handleDeleteLog}
                        handleBulkDelete={handleBulkDelete}
                    />
                )}
                
                {currentPage === 'settings-page' && (
                    <SettingsView 
                        appData={appData}
                        handleAddDrain={handleAddDrain}
                        handleDeleteDrain={handleDeleteDrain}
                        handleAddRule={handleAddRule}
                        handleDeleteRule={handleDeleteRule}
                        handleRuleReorder={handleRuleReorder}
                        draggedItem={draggedItem}
                        dragOverItem={dragOverItem}
                        handleIndicatorModeChange={handleIndicatorModeChange}
                        handleExport={handleExport}
                        handleImport={handleImport}
                        handleAIPredictionToggle={handleAIPredictionToggle}
                        onOpenChangelog={() => setIsChangelogOpen(true)}
                    />
                )}
                
                {currentPage === 'resources-page' && (
                    <ResourcesView
                        resources={appData.resources}
                        onAddResource={handleAddResource}
                        onDeleteResource={handleDeleteResource}
                    />
                )}
            </main>

            <LogOutputModal isOpen={isLogModalOpen} onClose={() => setIsLogModalOpen(false)} drains={appData.drains} onAddLog={handleAddLog} />
            <EditLogModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} drains={appData.drains} log={logToEdit} onEditLog={handleEditLog} />
            <MessageModal message={message} onClose={() => setMessage('')} />
            <ChangelogModal isOpen={isChangelogOpen} onClose={() => setIsChangelogOpen(false)} />

            {/* --- FLOATING ACTION BUTTONS --- */}
            <button 
                onClick={() => setIsLogModalOpen(true)} 
                className="fixed bottom-24 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 no-print"
                aria-label="Add new log"
            >
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
                            {page === 'resources' && <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
                            <span className="text-xs capitalize">{page}</span>
                        </button>
                    );
                 })}
            </nav>
        </div>
    );
}