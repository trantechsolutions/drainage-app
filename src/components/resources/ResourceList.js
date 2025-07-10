import { Button } from '@headlessui/react';

const getYoutubeEmbedUrl = (url) => {
    let videoId = '';
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname === 'youtu.be') {
            videoId = urlObj.pathname.slice(1);
        } else if (urlObj.hostname.includes('youtube.com')) {
            videoId = urlObj.searchParams.get('v');
        }
    } catch (error) {
        return null;
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
};

const ResourceList = ({ resources, onDeleteResource }) => {
    if (resources.length === 0) {
        return <p className="text-center py-4 text-gray-500 dark:text-gray-400">No resources added yet.</p>;
    }

    return (
        <div className="space-y-6">
            {resources.map(resource => {
                const embedUrl = resource.type === 'video' ? getYoutubeEmbedUrl(resource.url) : null;
                return (
                    <div key={resource.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex justify-between items-start">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{resource.title}</h3>
                            <Button onClick={() => onDeleteResource(resource.id)} className="text-red-500 hover:text-red-700 font-semibold">Delete</Button>
                        </div>
                        <div className="mt-4">
                            {resource.type === 'video' && embedUrl && (
                                <div className="aspect-w-16 aspect-h-9">
                                    <iframe
                                        src={embedUrl}
                                        title={resource.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="w-full h-full"
                                    ></iframe>
                                </div>
                            )}
                            {resource.type === 'video' && !embedUrl && (
                                <p className="text-red-500">Invalid YouTube URL.</p>
                            )}
                            {resource.type === 'pdf' && (
                                <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                    View PDF
                                </a>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ResourceList;