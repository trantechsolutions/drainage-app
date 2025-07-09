import ManageDrains from '../components/settings/ManageDrains';
import ManageThresholds from '../components/settings/ManageThresholds';
import IndicatorLogic from '../components/settings/IndicatorLogic';
import DataManagement from '../components/settings/DataManagement';
import PrivacyInfo from '../components/settings/PrivacyInfo';
import ModelSettings from '../components/settings/ModelSettings';

const SettingsView = ({
    appData,
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
    handleImport
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
            <ModelSettings 
                useAIPredictions={appData.settings.useAIPredictions}
                onToggle={handleAIPredictionToggle}
            />
            <DataManagement 
                onExport={handleExport}
                onImport={handleImport}
            />
            <PrivacyInfo />
        </div>
    );
};

export default SettingsView;