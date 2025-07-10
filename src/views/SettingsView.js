import ManageDrains from '../components/settings/ManageDrains';
import ManageThresholds from '../components/settings/ManageThresholds';
import IndicatorLogic from '../components/settings/IndicatorLogic';
import DataManagement from '../components/settings/DataManagement';
import PrivacyInfo from '../components/settings/PrivacyInfo';
import ModelSettings from '../components/settings/ModelSettings';
import ManageNotifications from '../components/settings/ManageNotifications';

const SettingsView = ({
    appData,
    handleAddNotificationRule,
    handleDeleteNotificationRule,
    handleAIPredictionToggle,
    handleAddDrain,
    handleDeleteDrain,
    handleAddRule,
    handleDeleteRule,
    handleRuleReorder,
    draggedItem,
    dragOverItem,
    handleIndicatorModeChange,
    handleExport,
    handleImport,
    onOpenChangelog
}) => {
    return (
        <div className="page space-y-8">
            <ManageDrains 
                drains={appData.drains}
                onAddDrain={handleAddDrain}
                onDeleteDrain={handleDeleteDrain}
            />
            <ManageThresholds 
                rules={appData.settings.rules}
                onAddRule={handleAddRule}
                onDeleteRule={handleDeleteRule}
                onRuleReorder={handleRuleReorder}
                draggedItem={draggedItem}
                dragOverItem={dragOverItem}
            />
            <IndicatorLogic 
                indicatorMode={appData.settings.indicatorMode}
                onModeChange={handleIndicatorModeChange}
            />
            <ManageNotifications 
                drains={appData.drains}
                rules={appData.settings.notificationRules}
                onAddNotificationRule={handleAddNotificationRule}
                onDeleteNotificationRule={handleDeleteNotificationRule}
            />
            <ModelSettings 
                useAIPredictions={appData.settings.useAIPredictions}
                onToggle={handleAIPredictionToggle}
            />
            <DataManagement 
                onExport={handleExport}
                onImport={handleImport}
            />
            <PrivacyInfo onOpenChangelog={onOpenChangelog} />
        </div>
    );
};

export default SettingsView;