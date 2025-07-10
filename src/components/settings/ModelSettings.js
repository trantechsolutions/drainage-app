import { Switch } from '@headlessui/react';

const ModelSettings = ({ useAIPredictions, onToggle }) => {
    return (
        <section className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-lg shadow-md no-print">
            <h2 className="text-2xl font-semibold mb-4 border-b dark:border-gray-700 pb-2">AI Settings</h2>
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium">Enable AI Predictions</h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        Allow the app to train a model on your local data to forecast future outputs. This can be resource-intensive.
                    </p>
                </div>
                <Switch
                    checked={useAIPredictions}
                    onChange={onToggle}
                    className={`${useAIPredictions ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'}
                      relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white/75`}
                >
                    <span className="sr-only">Enable AI Predictions</span>
                    <span
                        aria-hidden="true"
                        className={`${useAIPredictions ? 'translate-x-5' : 'translate-x-0'}
                        pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                    />
                </Switch>
            </div>
        </section>
    );
};

export default ModelSettings;