import { useState, useEffect } from 'react';
import Modal from './Modal';

const EditLogModal = ({ isOpen, onClose, drains, log, onEditLog }) => {
    const [formData, setFormData] = useState({ drainId: '', amount: '', date: '', notes: '' });

    useEffect(() => {
        if (log) {
            setFormData({
                id: log.id,
                drainId: log.drainId,
                amount: log.amount,
                date: log.date,
                notes: log.notes || ''
            });
        }
    }, [log]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.drainId && formData.amount && formData.date) {
            onEditLog({ ...formData, amount: parseFloat(formData.amount) });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Log Entry">
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                    <label htmlFor="edit-drainId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Drain:</label>
                    <select name="drainId" id="edit-drainId" value={formData.drainId} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700" required>
                        {[...drains].sort((a,b) => a.name.localeCompare(b.name)).map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="edit-amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Output (cc):</label>
                        <input type="number" name="amount" id="edit-amount" value={formData.amount} onChange={handleChange} min="0" step="1" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700" required />
                    </div>
                    <div>
                        <label htmlFor="edit-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date & Time:</label>
                        <input type="datetime-local" name="date" id="edit-date" value={formData.date} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700" required />
                    </div>
                </div>
                <div>
                     <label htmlFor="edit-notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes (optional):</label>
                     <textarea name="notes" id="edit-notes" value={formData.notes} onChange={handleChange} rows="3" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700" placeholder="e.g., color, consistency"></textarea>
                </div>
                <div className="flex justify-end gap-4 pt-4">
                    <button type="button" onClick={onClose} className="bg-gray-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-gray-600 transition duration-300">Cancel</button>
                    <button type="submit" className="bg-green-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-green-600 transition duration-300 shadow">Save Changes</button>
                </div>
            </form>
        </Modal>
    );
};

export default EditLogModal;