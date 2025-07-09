import { Button, Input } from '@headlessui/react';

const ManageDrains = ({ drains, onAddDrain, onDeleteDrain }) => {
    return (
        <section className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-lg shadow-md no-print">
            <h2 className="text-2xl font-semibold mb-4 border-b dark:border-gray-700 pb-2">Manage Drains</h2>
            <form onSubmit={onAddDrain} className="flex flex-col sm:flex-row gap-4">
                <Input type="text" name="drain-name-input" placeholder="Enter new drain name" className="flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700" required />
                <Button type="submit" className="bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-600 transition duration-300 shadow">Add Drain</Button>
            </form>
            <div className="mt-6">
                <h3 className="text-xl font-semibold mb-2">Your Drains:</h3>
                <ul className="space-y-2">
                    {[...drains].sort((a, b) => a.name.localeCompare(b.name)).map(drain => (
                        <li key={drain.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <span className="font-medium">{drain.name}</span>
                            <Button onClick={() => onDeleteDrain(drain.id, drain.name)} className="text-red-500 hover:text-red-700 font-semibold">Delete</Button>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default ManageDrains;