import { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition, Select, Input, Button, Textarea } from '@headlessui/react';
import { getLocalISOString } from '../helpers/utils';

const LogOutputModal = ({ isOpen, onClose, drains, onAddLog }) => {
    const [formData, setFormData] = useState({ drainId: '', amount: '', date: '', notes: '' });

    // Filter out removed drains for the dropdown
    const activeDrains = drains.filter(drain => !drain.isRemoved);

    useEffect(() => {
        if (isOpen) {
            setFormData({
                drainId: activeDrains.length > 0 ? activeDrains[0].id : '',
                amount: '',
                date: getLocalISOString(),
                notes: ''
            });
        }
    }, [isOpen, drains]); // Keep original `drains` dependency

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.drainId && formData.amount && formData.date) {
            onAddLog({ ...formData, amount: parseFloat(formData.amount) });
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 dark:text-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100 border-b dark:border-gray-700 pb-2 mb-4">
                                    Log Drainage Output
                                </Dialog.Title>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label htmlFor="drainId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Drain:</label>
                                        <Select name="drainId" id="drainId" value={formData.drainId} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700" required>
                                            {/* --- THIS LINE IS UPDATED --- */}
                                            {activeDrains.sort((a,b) => a.name.localeCompare(b.name)).map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Output (cc):</label>
                                            <Input type="number" name="amount" id="amount" value={formData.amount} onChange={handleChange} min="0" step="1" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700" required />
                                        </div>
                                        <div>
                                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date & Time:</label>
                                            <Input type="datetime-local" name="date" id="date" value={formData.date} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700" required />
                                        </div>
                                    </div>
                                    <div>
                                         <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes (optional):</label>
                                         <Textarea name="notes" id="notes" value={formData.notes} onChange={handleChange} rows="3" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700" placeholder="e.g., color, consistency"></Textarea>
                                    </div>
                                    <div className="flex justify-end gap-4 pt-4">
                                        <Button type="button" onClick={onClose} className="bg-gray-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-gray-600 transition duration-300">Cancel</Button>
                                        <Button type="submit" className="bg-green-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-green-600 transition duration-300 shadow">Log Output</Button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default LogOutputModal;