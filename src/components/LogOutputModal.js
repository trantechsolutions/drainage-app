import { useState, useEffect } from 'react';
import Modal from './Modal';
import { getLocalISOString } from '../helpers/utils';

const LogOutputModal = ({ isOpen, onClose, drains, onAddLog }) => {
    const [formData, setFormData] = useState({ drainId: '', amount: '', date: '', notes: '' });

    useEffect(() => {
        if (isOpen) {
            setFormData({
                drainId: drains.length > 0 ? drains[0].id : '',
                amount: '',
                date: getLocalISOString(),
                notes: ''
            });
        }
    }, [isOpen, drains]);

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
        <Modal isOpen={isOpen} onClose={onClose} title="Log Drainage Output">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="drainId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Drain:</label>
                    <select name="drainId" id="drainId" value={formData.drainId} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700" required>
                        {[...drains].sort((a,b) => a.name.localeCompare(b.name)).map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Output (cc):</label>
                        <input type="number" name="amount" id="amount" value={formData.amount} onChange={handleChange} min="0" step="1" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700" required />
                    </div>
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date & Time:</label>
                        <input type="datetime-local" name="date" id="date" value={formData.date} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700" required />
                    </div>
                </div>
                <div>
                     <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes (optional):</label>
                     <textarea name="notes" id="notes" value={formData.notes} onChange={handleChange} rows="3" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700" placeholder="e.g., color, consistency"></textarea>
                </div>
                <div className="flex justify-end gap-4 pt-4">
                    <button type="button" onClick={onClose} className="bg-gray-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-gray-600 transition duration-300">Cancel</button>
                    <button type="submit" className="bg-green-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-green-600 transition duration-300 shadow">Log Output</button>
                </div>
            </form>
        </Modal>
    );
};

export default LogOutputModal;