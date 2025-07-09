import { Button } from '@headlessui/react';

const IndicatorLogic = ({ indicatorMode, onModeChange }) => {
    return (
        <section className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-lg shadow-md no-print">
            <h2 className="text-2xl font-semibold mb-4 border-b dark:border-gray-700 pb-2">Indicator Logic</h2>
            <div className="flex items-center space-x-4">
                <span className="text-gray-700 dark:text-gray-300">Base indicator on:</span>
                <div className="flex gap-2">
                    <Button onClick={() => onModeChange('total')} className={`py-2 px-4 rounded-lg ${indicatorMode === 'total' ? 'bg-blue-500 text-white border-2 border-blue-800' : 'bg-gray-200 dark:bg-gray-600 border border-transparent'}`}>Total</Button>
                    <Button onClick={() => onModeChange('average')} className={`py-2 px-4 rounded-lg ${indicatorMode === 'average' ? 'bg-blue-500 text-white border-2 border-blue-800' : 'bg-gray-200 dark:bg-gray-600 border border-transparent'}`}>Average</Button>
                </div>
            </div>
        </section>
    );
};

export default IndicatorLogic;