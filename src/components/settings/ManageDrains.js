import { Button, Input } from '@headlessui/react';

const ManageDrains = ({ drains, onAddDrain }) => {
    return (
        <section className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-lg shadow-md no-print">
            <h2 className="text-2xl font-semibold mb-4 border-b dark:border-gray-700 pb-2">Manage Drains</h2>
            <form onSubmit={onAddDrain} className="flex items-end gap-4 mb-6">
                <div className="flex-grow">
                    <label htmlFor="drain-name-input" className="block text-sm font-medium">New Drain Name</label>
                    <Input id="drain-name-input" type="text" className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" required />
                </div>
                <Button type="submit" className="bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-600">Add Drain</Button>
            </form>
            <div className="space-y-2">
                {drains.map(drain => (
                    <div key={drain.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <span className={`font-medium ${drain.isRemoved ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
                            {drain.name}
                            {drain.isRemoved && <span className="ml-2 text-xs font-normal text-gray-400">(Removed)</span>}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ManageDrains;