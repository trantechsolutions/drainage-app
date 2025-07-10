import { useState, useEffect } from 'react';
import { Button, Input } from '@headlessui/react';

const ManageNotifications = ({ drains, rules, onAddNotificationRule, onDeleteNotificationRule }) => { // Corrected prop names
    const [hours, setHours] = useState('8');
    const [drainId, setDrainId] = useState('all');
    const [permission, setPermission] = useState(Notification.permission);

    useEffect(() => {
        const interval = setInterval(() => setPermission(Notification.permission), 1000);
        return () => clearInterval(interval);
    }, []);

    const handleRequestPermission = () => {
        Notification.requestPermission().then(setPermission);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const parsedHours = parseInt(hours, 10);
        if (!isNaN(parsedHours) && parsedHours > 0) {
            // Call the correctly named prop
            onAddNotificationRule({ hours: parsedHours, drainId });
        }
    };
    
    return (
        <section className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-lg shadow-md no-print">
            <h2 className="text-2xl font-semibold mb-4 border-b dark:border-gray-700 pb-2">Manage Reminders</h2>
            
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 mb-6">
                <h3 className="font-semibold">Browser Notifications</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Enable system notifications to get reminders even when the app is in the background.</p>
                {permission === 'granted' && <p className="text-sm font-bold text-green-500">Notifications are enabled.</p>}
                {permission === 'denied' && <p className="text-sm font-bold text-red-500">Notifications are disabled. You must change this in your browser settings.</p>}
                {permission === 'default' && (
                    <Button onClick={handleRequestPermission} className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600">
                        Enable Notifications
                    </Button>
                )}
            </div>
            
            <h3 className="text-xl font-semibold mb-2">Reminder Rules</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end mb-6">
                <div className="sm:col-span-1">
                    <label className="block text-sm font-medium">Drain</label>
                    <select 
                        value={drainId} 
                        onChange={e => setDrainId(e.target.value)} 
                        className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">Any Drain</option>
                        {drains.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                </div>
                <div className="sm:col-span-1">
                    <label className="block text-sm font-medium">Notify After (Hours)</label>
                    <Input type="number" value={hours} onChange={e => setHours(e.target.value)} min="1" className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" required />
                </div>
                <Button type="submit" className="sm:col-span-1 bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-600">Add Rule</Button>
            </form>

            <div className="space-y-2">
                {rules.map(rule => {
                    const drainName = rule.drainId === 'all' ? 'Any Drain' : (drains.find(d => d.id === rule.drainId)?.name || 'Unknown Drain');
                    return (
                        <li key={rule.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <span>Remind if no new log for <span className="font-semibold">{drainName}</span> in <span className="font-semibold">{rule.hours} hours</span></span>
                            {/* Call the correctly named prop */}
                            <Button onClick={() => onDeleteNotificationRule(rule.id)} className="text-red-500 hover:text-red-700 font-semibold">Delete</Button>
                        </li>
                    );
                })}
            </div>
        </section>
    );
};

export default ManageNotifications;