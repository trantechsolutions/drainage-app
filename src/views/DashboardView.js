import ThresholdsSummary from '../components/ThresholdsSummary';
import { DrainLineChart, DrainBarChart } from '../components/DrainCharts';
import PredictionSummary from '../components/PredictionSummary';

const DashboardView = ({ appData, isDark }) => {
    // Calculate totals for each drain individually
    const totalsByDrain = appData.drains.reduce((acc, drain) => {
        // Initialize each drain with a name and a starting total of 0
        acc[drain.id] = { name: drain.name, total: 0 };
        return acc;
    }, {});

    // Sum the logs for each drain
    appData.logs.forEach(log => {
        if (totalsByDrain[log.drainId]) {
            totalsByDrain[log.drainId].total += parseFloat(log.amount || 0);
        }
    });

    // Calculate the overall total by summing the individual drain totals
    const overallTotal = Object.values(totalsByDrain).reduce((sum, drainData) => sum + drainData.total, 0);

    return (
        <div className="page space-y-8">
            {/* --- Updated Totals Section --- */}
            <section className="mb-8 p-4 bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-inner no-print">
                <h2 className="text-xl font-semibold text-center mb-2 text-gray-800 dark:text-gray-200">Total Output</h2>
                {/* Overall Total Display */}
                <div className="text-center">
                    <span className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                        {overallTotal.toFixed(1)}
                    </span>
                    <span className="ml-2 text-xl text-gray-600 dark:text-gray-400">cc</span>
                </div>

                <hr className="my-4 border-gray-200 dark:border-gray-600" />

                {/* Individual Drain Totals Display */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
                    {Object.values(totalsByDrain).map(drain => (
                        <div key={drain.name}>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate" title={drain.name}>
                                {drain.name}
                            </h3>
                            <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                                {drain.total.toFixed(1)}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {appData.settings.useAIPredictions && (
                <section className="mb-8 p-4 bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-inner no-print">
                    <h2 className="text-xl font-semibold text-center mb-4 text-gray-800 dark:text-gray-200">🔮 Output Forecast</h2>
                    <PredictionSummary logs={appData.logs} drains={appData.drains} />
                </section>
            )}
            
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
    );
};

export default DashboardView;