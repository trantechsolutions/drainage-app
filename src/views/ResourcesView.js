import AddResourceForm from '../components/resources/AddResourceForm';
import ResourceList from '../components/resources/ResourceList';

const ResourcesView = ({ resources, onAddResource, onDeleteResource }) => {
    return (
        <div className="page space-y-8">
            <section className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-lg shadow-md no-print">
                <h2 className="text-2xl font-semibold mb-4 border-b dark:border-gray-700 pb-2">Add New Resource</h2>
                <AddResourceForm onAddResource={onAddResource} />
            </section>

            <section className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-lg shadow-md no-print">
                <h2 className="text-2xl font-semibold mb-4 border-b dark:border-gray-700 pb-2">Your Resources</h2>
                <ResourceList resources={resources} onDeleteResource={onDeleteResource} />
            </section>
        </div>
    );
};

export default ResourcesView;