import { Link, useLocation, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { statesAPI } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Dark Mode"
        >
            {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            )}
        </button>
    );
};

const Navbar = () => {
    const location = useLocation();
    const { stateCode } = useParams();
    const [states, setStates] = useState([]);
    const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const fetchStates = async () => {
            try {
                const response = await statesAPI.getAll();
                setStates(response.data);
            } catch (error) {
                console.error('Failed to fetch states:', error);
            }
        };
        fetchStates();
    }, []);

    const isActive = (path) => location.pathname === path;
    const isDashboard = location.pathname.startsWith('/dashboard');

    // Get current state name from code
    const currentStateName = stateCode
        ? states.find(s => s.stateCode === stateCode)?.name || stateCode
        : null;

    return (
        <nav className="bg-white dark:bg-slate-900 shadow-sm border-b border-slate-200 dark:border-slate-800 sticky top-0 z-[9999] transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-slate-800 dark:text-white">AquaVision India</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link
                            to="/"
                            className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-primary-600' : 'text-slate-600 hover:text-primary-600'
                                }`}
                        >
                            Home
                        </Link>

                        {/* State Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsStateDropdownOpen(!isStateDropdownOpen)}
                                onBlur={() => setTimeout(() => setIsStateDropdownOpen(false), 150)}
                                className={`flex items-center text-sm font-medium transition-colors ${isDashboard ? 'text-primary-600' : 'text-slate-600 hover:text-primary-600'
                                    }`}
                            >
                                {currentStateName || 'Select State'}
                                <svg className={`ml-1 w-4 h-4 transition-transform ${isStateDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            <AnimatePresence>
                                {isStateDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-[10000]"
                                    >
                                        <Link
                                            to="/dashboard"
                                            className="block px-4 py-2 text-sm text-blue-600 dark:text-blue-400 font-medium hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors border-b border-slate-100 dark:border-slate-700"
                                            onClick={() => setIsStateDropdownOpen(false)}
                                        >
                                            Pan-India View
                                        </Link>
                                        {states.map((state) => (
                                            <Link
                                                key={state.stateCode}
                                                to={`/dashboard/${state.stateCode}`}
                                                className={`block px-4 py-2 text-sm transition-colors ${stateCode === state.stateCode
                                                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium'
                                                    : 'text-slate-600 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-slate-700 hover:text-primary-600 dark:hover:text-primary-400'
                                                    }`}
                                                onClick={() => setIsStateDropdownOpen(false)}
                                            >
                                                {state.name}
                                            </Link>
                                        ))}
                                        <div className="px-4 py-2 text-sm text-slate-400 dark:text-slate-500 italic border-t border-slate-100 dark:border-slate-700">
                                            More states coming soon...
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <Link
                            to="/about"
                            className={`text-sm font-medium transition-colors ${isActive('/about') ? 'text-primary-600' : 'text-slate-600 hover:text-primary-600'
                                }`}
                        >
                            About Project
                        </Link>
                        <Link
                            to="/team"
                            className={`text-sm font-medium transition-colors ${isActive('/team') ? 'text-primary-600' : 'text-slate-600 hover:text-primary-600'
                                }`}
                        >
                            Team
                        </Link>
                        <Link
                            to="/resources"
                            className={`text-sm font-medium transition-colors ${isActive('/resources') ? 'text-primary-600 dark:text-primary-400' : 'text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400'
                                }`}
                        >
                            Resources
                        </Link>

                        {/* Theme Toggle */}
                        <ThemeToggle />
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-slate-200"
                    >
                        <div className="px-4 py-3 space-y-2">
                            <Link to="/" className="block py-2 text-slate-600">Home</Link>
                            <Link to="/about" className="block py-2 text-slate-600">About Project</Link>
                            <Link to="/team" className="block py-2 text-slate-600">Team</Link>
                            <Link to="/resources" className="block py-2 text-slate-600">Resources</Link>
                            <hr className="my-2" />
                            <p className="text-sm font-medium text-slate-500">Select State:</p>
                            <Link
                                to="/dashboard"
                                className="block py-2 pl-4 text-blue-600 font-medium"
                            >
                                Pan-India View
                            </Link>
                            {states.map((state) => (
                                <Link
                                    key={state.stateCode}
                                    to={`/dashboard/${state.stateCode}`}
                                    className={`block py-2 pl-4 ${stateCode === state.stateCode ? 'text-primary-600 font-medium' : 'text-slate-600'}`}
                                >
                                    {state.name}
                                </Link>
                            ))}
                            <div className="block py-2 pl-4 text-slate-400 italic">
                                More states coming soon...
                            </div>
                            <hr className="my-2" />
                            <div className="flex items-center justify-between px-4 py-2">
                                <span className="text-slate-600 dark:text-slate-400">Theme</span>
                                <ThemeToggle />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
