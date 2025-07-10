// src/components/ChangelogModal.js

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { appVersion, changelog } from '../helpers/changelogData';

const ChangelogModal = ({ isOpen, onClose }) => {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100"
                                >
                                    Changelog - Version {appVersion}
                                </Dialog.Title>
                                <div className="mt-4 max-h-96 overflow-y-auto pr-2">
                                    <div className="space-y-6">
                                        {changelog.map((entry) => (
                                            <div key={entry.version}>
                                                <h4 className="font-semibold text-md text-gray-800 dark:text-gray-200">
                                                    v{entry.version} <span className="text-sm font-normal text-gray-500 dark:text-gray-400">- {entry.date}</span>
                                                </h4>
                                                <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
                                                    {entry.changes.map((change, index) => (
                                                        <li key={index}>{change}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 dark:bg-blue-900 px-4 py-2 text-sm font-medium text-blue-900 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                        onClick={onClose}
                                    >
                                        Got it, thanks!
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default ChangelogModal;