import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { statesAPI } from '../services/api';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const LandingPage = () => {
    const navigate = useNavigate();
    const [states, setStates] = useState([]);
    const [selectedState, setSelectedState] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStates = async () => {
            try {
                const response = await statesAPI.getAll();
                setStates(response.data);
            } catch (error) {
                console.error('Failed to fetch states:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStates();
    }, []);

    const handleExplore = () => {
        if (selectedState) {
            navigate(`/dashboard/${selectedState}`);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 transition-colors duration-200"></div>
                    <div className="absolute inset-0 opacity-30 dark:opacity-10">
                        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#cbd5e1" strokeWidth="1" />
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#grid)" />
                        </svg>
                    </div>

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            {/* Left Content */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 dark:text-white leading-tight">
                                    MONITORING<br />
                                    <span className="text-primary-600 dark:text-primary-400">INDIA'S AQUIFERS.</span>
                                </h1>
                                <p className="mt-6 text-lg text-slate-600 dark:text-slate-300 max-w-lg">
                                    Visualize groundwater depth levels across Indian states with
                                    interactive maps, time-based simulation, and district-wise analytics
                                    using CGWB data.
                                </p>

                                {/* State Selector */}
                                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                                    <div className="relative flex-grow max-w-xs">
                                        <select
                                            value={selectedState}
                                            onChange={(e) => setSelectedState(e.target.value)}
                                            className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none cursor-pointer transition-colors"
                                        >
                                            <option value="">Select a State to Explore...</option>
                                            {states.map((state) => (
                                                <option key={state.stateCode} value={state.stateCode}>
                                                    {state.name}
                                                </option>
                                            ))}
                                            <option disabled>More states coming soon...</option>
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleExplore}
                                        disabled={!selectedState}
                                        className="btn btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Explore Data
                                    </button>
                                </div>

                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="mt-4 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                                >
                                    View Pan-India Map →
                                </button>
                            </motion.div>

                            {/* Right - India Map Visualization */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="relative"
                            >
                                <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-4 border border-slate-200 dark:border-slate-700">
                                    {/* India Map Image */}
                                    <img
                                        src="/india-map.png"
                                        alt="Geographical map of India with Water depth levels"
                                        className="w-full h-auto rounded-lg"
                                    />

                                    {/* Legend - matching CGWB depth scale */}
                                    <div className="absolute bottom-6 right-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur rounded-lg p-3 shadow-lg border border-slate-200 dark:border-slate-700">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-2 h-2 rounded-full bg-purple-700"></div>
                                            <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">Gauge Stations</span>
                                        </div>
                                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">Depth to Water Level (m)</p>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-3 rounded-sm" style={{ backgroundColor: '#2166ac' }}></div>
                                                <span className="text-xs text-slate-600 dark:text-slate-400">0 - 2</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-3 rounded-sm" style={{ backgroundColor: '#67a9cf' }}></div>
                                                <span className="text-xs text-slate-600 dark:text-slate-400">2 - 5</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-3 rounded-sm" style={{ backgroundColor: '#d1e5f0' }}></div>
                                                <span className="text-xs text-slate-600 dark:text-slate-400">5 - 10</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-3 rounded-sm" style={{ backgroundColor: '#fddbc7' }}></div>
                                                <span className="text-xs text-slate-600 dark:text-slate-400">10 - 20</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-3 rounded-sm" style={{ backgroundColor: '#ef8a62' }}></div>
                                                <span className="text-xs text-slate-600 dark:text-slate-400">20 - 40</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-3 rounded-sm" style={{ backgroundColor: '#b2182b' }}></div>
                                                <span className="text-xs text-slate-600 dark:text-slate-400">&gt;40</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 bg-white dark:bg-slate-900 transition-colors duration-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Platform Features</h2>
                            <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                                Advanced tools for comprehensive groundwater analysis and monitoring
                            </p>
                        </motion.div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: (
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                        </svg>
                                    ),
                                    title: 'Interactive Maps',
                                    description: 'Explore groundwater levels with dynamic, color-coded markers across all districts.'
                                },
                                {
                                    icon: (
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    ),
                                    title: 'Time Simulation',
                                    description: 'Travel through time to see how groundwater levels fluctuate across seasons.'
                                },
                                {
                                    icon: (
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    ),
                                    title: 'Analytics Dashboard',
                                    description: 'Detailed hydrographs and borehole visualizations for in-depth analysis.'
                                },
                            ].map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="card text-center bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                                >
                                    <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mx-auto mb-4 text-primary-600 dark:text-primary-400">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">{feature.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm">{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default LandingPage;
