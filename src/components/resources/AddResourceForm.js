import { useState } from 'react';
import { Button, Input, Radio, RadioGroup, Label, Field } from '@headlessui/react'; // Import Field

const AddResourceForm = ({ onAddResource }) => {
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [type, setType] = useState('video');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (title && url) {
            onAddResource({ title, url, type });
            setTitle('');
            setUrl('');
            setType('video');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Field>
                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</Label>
                <Input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., How to Empty Drains"
                    className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    required
                />
            </Field>
            <Field>
                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">URL</Label>
                <Input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://..."
                    className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    required
                />
            </Field>
            <RadioGroup value={type} onChange={setType} className="flex gap-4 pt-2">
                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type:</Label>
                <Radio value="video" className="flex items-center gap-2 cursor-pointer">
                    <div className="w-4 h-4 border rounded-full border-gray-400 dark:border-gray-500 flex items-center justify-center">
                        {type === 'video' && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
                    </div>
                    <Label className="cursor-pointer">Video</Label>
                </Radio>
                <Radio value="pdf" className="flex items-center gap-2 cursor-pointer">
                     <div className="w-4 h-4 border rounded-full border-gray-400 dark:border-gray-500 flex items-center justify-center">
                        {type === 'pdf' && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
                    </div>
                    <Label className="cursor-pointer">PDF</Label>
                </Radio>
            </RadioGroup>
            <div className="pt-2">
                <Button type="submit" className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600">
                    Add Resource
                </Button>
            </div>
        </form>
    );
};

export default AddResourceForm;