import PrintableSummary from '../components/PrintableSummary';

const SummaryView = ({ appData, handlePrint }) => {
    return (
        <div className="page space-y-8">
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
    );
};

export default SummaryView;