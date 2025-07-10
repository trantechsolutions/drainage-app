import { Button, Input } from '@headlessui/react';

const ManageThresholds = ({ rules, onAddRule, onDeleteRule, onRuleReorder, draggedItem, dragOverItem }) => {
    return (
        <section className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-lg shadow-md no-print">
             <h2 className="text-2xl font-semibold mb-4 border-b dark:border-gray-700 pb-2">Manage Thresholds</h2>
             <form onSubmit={onAddRule} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                 <div className="sm:col-span-1">
                    <label htmlFor="rule-days" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Consecutive Days</label>
                    <Input type="number" name="rule-days" min="1" className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" required />
                </div>
                <div className="sm:col-span-1">
                    <label htmlFor="rule-amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Daily Amount (cc)</label>
                    <Input type="number" name="rule-amount" min="0" step="0.1"  className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" required />
                </div>
                <Button type="submit" className="sm:col-span-1 bg-green-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-600">Add Rule</Button>
             </form>
             <div className="mt-6">
                <h3 className="text-xl font-semibold mb-2">Current Rules:</h3>
                <ul className="space-y-2">
                    {rules.map((rule, index) => (
                        <li 
                            key={rule.id} 
                            className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-grab"
                            draggable
                            onDragStart={() => (draggedItem.current = index)}
                            onDragEnter={() => (dragOverItem.current = index)}
                            onDragEnd={onRuleReorder}
                            onDragOver={(e) => e.preventDefault()}
                        >
                            {/* --- THIS LINE IS UPDATED --- */}
                            <span>&lt; {rule.amount}cc / day for {rule.days} consecutive day(s)</span>
                            <Button onClick={() => onDeleteRule(rule.id)} className="text-red-500 hover:text-red-700 font-semibold">Delete</Button>
                        </li>
                    ))}
                 </ul>
             </div>
        </section>
    );
};

export default ManageThresholds;