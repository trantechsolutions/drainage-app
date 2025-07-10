import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createRoot } from 'react-dom/client'; // Corrected import for React 18
import { generateId } from '../helpers/utils';
import CondensedPrintableSummary from '../components/CondensedPrintableSummary'; // Add this import

export default function useAppData() {
    const [appData, setAppData] = useState({ drains: [], logs: [], settings: { rules: [] } });
    const [currentPage, setCurrentPage] = useState('dashboard-page');
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [logToEdit, setLogToEdit] = useState(null);
    const [message, setMessage] = useState('');
    const [isDark, setIsDark] = useState(false);
    const draggedItem = useRef(null);
    const dragOverItem = useRef(null);
    const [isChangelogOpen, setIsChangelogOpen] = useState(false);
    const notifiedRules = useRef(new Set());

    const loadData = useCallback(() => {
        const data = localStorage.getItem('drainTrackerData');
        if (data) {
            const parsedData = JSON.parse(data);

            // 1. Start with a complete default settings object.
            let settings = {
                rules: [],
                indicatorMode: 'total',
                notificationRules: [],
                useAIPredictions: false
            };

            // 2. If settings exist in the loaded data, merge them.
            // This brings in any saved settings and preserves them.
            if (parsedData.settings) {
                settings = { ...settings, ...parsedData.settings };
            }

            // 3. Perform the specific migration for the old 'threshold' property.
            // This checks the originally loaded data for the old format.
            if (parsedData.settings && parsedData.settings.threshold && !parsedData.settings.rules) {
                // Old format detected: create the 'rules' array.
                settings.rules = [{
                    id: generateId(),
                    amount: parsedData.settings.threshold,
                    hours: 24 // Sensible default
                }];
            }

            setAppData({
                drains: parsedData.drains || [],
                logs: parsedData.logs || [],
                resources: parsedData.resources || [],
                settings: settings
            });

        } else {
            // For brand new users, set the complete default state
            setAppData({
                drains: [],
                logs: [],
                resources: [],
                settings: {
                    rules: [],
                    indicatorMode: 'total',
                    notificationRules: [],
                    useAIPredictions: false
                }
            });
        }
    }, []);
    
    const saveData = useCallback((data) => {
        localStorage.setItem('drainTrackerData', JSON.stringify(data));
    }, []);

    useEffect(() => {
        const checkNotifications = () => {
            if (!appData.settings.notificationRules || appData.logs.length === 0) return;

            const now = new Date().getTime();
            
            appData.settings.notificationRules.forEach(rule => {
                if (notifiedRules.current.has(rule.id)) return; // Already notified this session

                // Find the most recent log that matches this rule's drainId
                const relevantLogs = (rule.drainId === 'all')
                    ? appData.logs
                    : appData.logs.filter(log => log.drainId === rule.drainId);

                if (relevantLogs.length === 0) return; // No logs for this drain, so nothing to check against.

                const lastLog = relevantLogs.reduce((latest, log) => 
                    new Date(log.date) > new Date(latest.date) ? log : latest
                );

                const lastLogTime = new Date(lastLog.date).getTime();
                const hoursSinceLastLog = (now - lastLogTime) / (1000 * 60 * 60);

                if (hoursSinceLastLog >= rule.hours) {
                    const drainName = (rule.drainId === 'all')
                        ? "A drain"
                        : appData.drains.find(d => d.id === rule.drainId)?.name || 'a drain';
                    
                    const message = `Reminder: ${drainName} has not been logged in over ${rule.hours} hours. It may be time for a drain empty.`;
                    
                    // Trigger Notification
                    setMessage(message); // In-app message
                    if (Notification.permission === 'granted') {
                        new Notification('Drain Tracker Reminder', { body: message });
                    }

                    notifiedRules.current.add(rule.id); // Mark as notified for this session
                }
            });
        };

        const intervalId = setInterval(checkNotifications, 5 * 60 * 1000); // Check every 5 minutes
        return () => clearInterval(intervalId);

    }, [appData.logs, appData.settings.notificationRules, appData.drains, setMessage]);


    useEffect(() => {
        loadData();
        const savedTheme = localStorage.getItem('theme');
        const initialIsDark = savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDark(initialIsDark);
    }, [loadData]);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    useEffect(() => {
        const isDark = localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
        document.documentElement.classList.toggle('dark', isDark);
        document.getElementById('sun-icon')?.classList.toggle('hidden', isDark);
        document.getElementById('moon-icon')?.classList.toggle('hidden', !isDark);
    }, []);

    const handleAddNotificationRule = (ruleData) => {
        const newRule = { ...ruleData, id: generateId() };
        const newRules = [...appData.settings.notificationRules, newRule];
        const newData = { ...appData, settings: { ...appData.settings, notificationRules: newRules } };
        setAppData(newData);
        saveData(newData);
        setMessage('Notification rule added.');
    };

    const handleDeleteNotificationRule = (id) => {
        const newRules = appData.settings.notificationRules.filter(rule => rule.id !== id);
        const newData = { ...appData, settings: { ...appData.settings, notificationRules: newRules } };
        setAppData(newData);
        saveData(newData);
        setMessage('Notification rule deleted.');
    };

    const handleAIPredictionToggle = (isEnabled) => {
        const newData = { ...appData, settings: { ...appData.settings, useAIPredictions: isEnabled } };
        setAppData(newData);
        saveData(newData);
    };

    const handleToggleTheme = () => {
        const newIsDark = !isDark;
        setIsDark(newIsDark);
        localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
    };

    const handleAddDrain = (e) => {
        e.preventDefault();
        const drainName = e.target.elements['drain-name-input'].value.trim();
        if (drainName) {
            const newDrain = { id: generateId(), name: drainName };
            const newData = { ...appData, drains: [...appData.drains, newDrain] };
            setAppData(newData);
            saveData(newData);
            setMessage(`Drain "${drainName}" added.`);
            e.target.reset();
        }
    };

    const handleDeleteDrain = (id, name) => {
        if (window.confirm(`Delete drain "${name}" and all its logs?`)) {
            const newDrains = appData.drains.filter(d => d.id !== id);
            const newLogs = appData.logs.filter(l => l.drainId !== id);
            const newData = { ...appData, drains: newDrains, logs: newLogs };
            setAppData(newData);
            saveData(newData);
            setMessage('Drain and logs deleted.');
        }
    };

    const handleAddLog = (logData) => {
        const newLog = { ...logData, id: generateId() };
        const newData = { ...appData, logs: [...appData.logs, newLog] };
        setAppData(newData);
        saveData(newData);
        setIsLogModalOpen(false);
        setMessage('Log added successfully.');
    };

    const handleEditLog = (updatedLog) => {
        const newLogs = appData.logs.map(log => log.id === updatedLog.id ? updatedLog : log);
        const newData = { ...appData, logs: newLogs };
        setAppData(newData);
        saveData(newData);
        setIsEditModalOpen(false);
        setLogToEdit(null);
        setMessage('Log updated successfully.');
    };

    const handleDeleteLog = (id) => {
        if (window.confirm('Delete this log entry?')) {
            const newLogs = appData.logs.filter(log => log.id !== id);
            const newData = { ...appData, logs: newLogs };
            setAppData(newData);
            saveData(newData);
            setMessage('Log entry deleted.');
        }
    };

    // Add this function inside your useAppData.js file
    const handleBulkDelete = (logIds) => {
        if (window.confirm(`Are you sure you want to delete ${logIds.length} selected logs?`)) {
            const newLogs = appData.logs.filter(log => !logIds.includes(log.id));
            const newData = { ...appData, logs: newLogs };
            setAppData(newData);
            saveData(newData);
            setMessage(`${logIds.length} logs deleted.`);
        }
    };

    const handleAddRule = (e) => {
        e.preventDefault();
        const amount = parseFloat(e.target.elements['rule-amount'].value);
        const hours = parseInt(e.target.elements['rule-hours'].value, 10);
        const interval = parseInt(e.target.elements['rule-interval'].value, 10);

        if (!isNaN(amount) && !isNaN(hours) && !isNaN(interval) && amount > 0 && hours > 0 && interval > 0) {
            if (hours % interval !== 0) {
                setMessage('Timeframe must be divisible by the interval.');
                return;
            }
            const newRule = { id: generateId(), amount, hours, interval };
            const newRules = [...appData.settings.rules, newRule];
            const newData = { ...appData, settings: { ...appData.settings, rules: newRules } };
            setAppData(newData);
            saveData(newData);
            setMessage('New threshold rule added.');
            e.target.reset();
        } else {
            setMessage('Please enter valid numbers for all fields.');
        }
    };

    const handleDeleteRule = (id) => {
        const newRules = appData.settings.rules.filter(rule => rule.id !== id);
        const newData = { ...appData, settings: { ...appData.settings, rules: newRules } };
        setAppData(newData);
        saveData(newData);
        setMessage('Threshold rule deleted.');
    };

    const handleRuleReorder = () => {
        const rules = [...appData.settings.rules];
        const draggedItemContent = rules.splice(draggedItem.current, 1)[0];
        rules.splice(dragOverItem.current, 0, draggedItemContent);
        draggedItem.current = null;
        dragOverItem.current = null;
        const newData = { ...appData, settings: { ...appData.settings, rules: rules } };
        setAppData(newData);
        saveData(newData);
    };

    const handleAddResource = (resourceData) => {
        const newResource = { ...resourceData, id: generateId() };
        const newData = { ...appData, resources: [...appData.resources, newResource] };
        setAppData(newData);
        saveData(newData);
        setMessage('Resource added successfully.');
    };

    const handleDeleteResource = (id) => {
        if (window.confirm('Are you sure you want to delete this resource?')) {
            const newResources = appData.resources.filter(r => r.id !== id);
            const newData = { ...appData, resources: newResources };
            setAppData(newData);
            saveData(newData);
            setMessage('Resource deleted.');
        }
    };

    const handleIndicatorModeChange = (mode) => {
        const newData = { ...appData, settings: { ...appData.settings, indicatorMode: mode } };
        setAppData(newData);
        saveData(newData);
    };

    const handleExport = () => {
        const dataStr = JSON.stringify(appData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `drain-tracker-data-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handlePrint = () => {
        // 1. Create a temporary container for the printable content
        const printContainer = document.createElement('div');
        printContainer.id = 'print-container';
        document.body.appendChild(printContainer);

        // 2. Create a root and render the component using the imported createRoot function
        const root = createRoot(printContainer); // Use the imported function
        root.render(
            <React.StrictMode>
                <CondensedPrintableSummary drains={appData.drains} logs={appData.logs} />
            </React.StrictMode>
        );

        // 3. Create a style element to hide the main app
        const style = document.createElement('style');
        style.innerHTML = `
            @media print {
                body > *:not(#print-container) {
                    display: none;
                }
                #print-container {
                    display: block;
                }
            }
        `;
        document.head.appendChild(style);

        // 4. Use a timeout to ensure content is rendered before printing
        setTimeout(() => {
            const wasDark = document.documentElement.classList.contains('dark');
            if (wasDark) {
                document.documentElement.classList.remove('dark');
            }

            window.print();

            // Clean up after printing
            if (wasDark) {
                document.documentElement.classList.add('dark');
            }
            
            document.head.removeChild(style);
            root.unmount();
            document.body.removeChild(printContainer);
        }, 100); // A 100ms delay is usually sufficient
    };

    const handleImport = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                if (importedData && Array.isArray(importedData.drains) && Array.isArray(importedData.logs)) {
                    if (window.confirm('Are you sure you want to import this data? This will overwrite all current data.')) {
                        const newData = {
                            drains: importedData.drains,
                            logs: importedData.logs,
                            settings: importedData.settings || { rules: [] }
                        };
                        setAppData(newData);
                        saveData(newData);
                        setMessage('Data imported successfully!');
                    }
                } else {
                    throw new Error('Invalid file format.');
                }
            } catch (error) {
                setMessage(`Error importing file: ${error.message}`);
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    };

    return {
        appData,
        handleAddNotificationRule,
        handleDeleteNotificationRule,
        handleAIPredictionToggle,
        handleAddDrain,
        handleDeleteDrain,
        handleAddLog,
        handleEditLog,
        handleDeleteLog,
        handleBulkDelete,
        handleAddRule,
        handleDeleteRule,
        handleRuleReorder,
        handleAddResource,
        handleDeleteResource,
        handleIndicatorModeChange,
        handleToggleTheme,
        handleExport,
        handlePrint,
        handleImport,
        currentPage,
        setCurrentPage,
        isLogModalOpen,
        setIsLogModalOpen,
        isEditModalOpen,
        setIsEditModalOpen,
        logToEdit,
        setLogToEdit,
        message,
        setMessage,
        isDark,
        setIsDark,
        draggedItem,
        dragOverItem,
        isChangelogOpen,
        setIsChangelogOpen,
        notifiedRules
    }
}