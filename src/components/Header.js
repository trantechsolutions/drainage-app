const Header = ({ onToggleTheme, isDark }) => (
    <header className="relative text-center mb-8 no-print">
        <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-500">Drain Tracker</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">A simple PWA to monitor drain output.</p>
        <div className="absolute top-0 right-0">
            <button onClick={onToggleTheme} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900">
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${!isDark ? 'block' : 'hidden'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M12 5a7 7 0 100 14 7 7 0 000-14z" /></svg>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isDark ? 'block' : 'hidden'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            </button>
        </div>
    </header>
);

export default Header;