import { Button, Input } from '@headlessui/react';

const DataManagement = ({ onExport, onImport }) => {
    return (
        <section className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-lg shadow-md no-print">
            <h2 className="text-2xl font-semibold mb-4 border-b dark:border-gray-700 pb-2">Data Management</h2>
            <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={onExport} className="flex-1 bg-purple-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-purple-600 transition duration-300 shadow">Export Data (JSON)</Button>
                <label htmlFor="import-data-input" className="flex-1 bg-yellow-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-yellow-600 transition duration-300 shadow text-center cursor-pointer">
                    Import Data (JSON)
                    <Input type="file" id="import-data-input" onChange={onImport} className="hidden" accept=".json" />
                </label>
            </div>
        </section>
    );
};

export default DataManagement;