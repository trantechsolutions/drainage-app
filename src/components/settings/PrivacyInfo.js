const PrivacyInfo = () => {
    return (
        <section className="p-6 no-print rounded-lg shadow-md bg-white dark:bg-gray-800">
            <h2 className="pb-2 mb-4 text-2xl font-semibold border-b dark:border-gray-700 dark:text-white">
                Privacy and Data Storage
            </h2>
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-medium dark:text-white">Your Data Stays on Your Device</h3>
                    <p className="mt-1 text-gray-600 dark:text-gray-300">
                        This website is designed to respect your privacy. All data generated during your session is stored locally on your device's browser. No information is saved to our servers or any other external location. This means your data is for your use only, right on the computer or mobile device you are using to access this site.
                    </p>
                </div>
                <div>
                    <h3 className="text-lg font-medium dark:text-white">Data Removal</h3>
                    <p className="mt-1 text-gray-600 dark:text-gray-300">
                        You have full control over your data. To completely wipe all information stored by this website, simply clear your browser's cache for this site. Once the cache is cleared, all associated data will be permanently removed from your device.
                    </p>
                </div>
                <div>
                    <h3 className="text-lg font-medium dark:text-white">Open-Source Software</h3>
                    <p className="mt-1 text-gray-600 dark:text-gray-300">
                        This application is open-source software licensed under the MIT License. You are free to view the source code, make modifications, and distribute it. You can find the project repository
                        <a 
                            href="https://github.com/trantechsolutions/drainage-app"
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline ml-1"
                        >
                            here
                        </a>.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default PrivacyInfo;