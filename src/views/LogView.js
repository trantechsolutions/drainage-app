import DetailedLogHistory from '../components/DetailedLogHistory';

const LogView = ({ appData, setLogToEdit, setIsEditModalOpen, handleDeleteLog, handleBulkDelete }) => {
    return (
        <div className="page space-y-8">
            <section className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-lg shadow-md no-print">
                <h2 className="text-2xl font-semibold mb-4 border-b dark:border-gray-700 pb-2">Detailed Log History</h2>
                <DetailedLogHistory 
                    logs={appData.logs} 
                    drains={appData.drains} 
                    onEdit={(log) => { setLogToEdit(log); setIsEditModalOpen(true); }} 
                    onDelete={handleDeleteLog}
                    onBulkDelete={handleBulkDelete}
                />
            </section>
        </div>
    );
};

export default LogView;