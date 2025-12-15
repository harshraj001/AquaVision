import { motion } from 'framer-motion';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const AboutPage = () => {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />

            <main className="flex-grow">
                {/* Header */}
                <section className="bg-white py-16 border-b border-slate-200">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl font-bold text-slate-800"
                        >
                            About AquaVision India
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="mt-4 text-lg text-slate-600"
                        >
                            Methodology and Data Sources
                        </motion.p>
                    </div>
                </section>

                {/* Content */}
                <section className="py-16">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Our Methodology */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
                            >
                                <div className="bg-primary-100 px-6 py-4">
                                    <h2 className="text-xl font-semibold text-primary-800">Our Methodology</h2>
                                </div>
                                <div className="p-6">
                                    {/* Diagram */}
                                    <div className="flex justify-center mb-6">
                                        <svg className="w-48 h-32" viewBox="0 0 200 100">
                                            {/* Flow diagram */}
                                            <rect x="70" y="10" width="60" height="25" rx="4" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
                                            <text x="100" y="27" textAnchor="middle" className="text-xs" fill="#0369a1">Raw Data</text>

                                            {/* Arrow */}
                                            <path d="M100 35 L100 45 L95 45 L100 55 L105 45 L100 45" fill="#64748b" />

                                            <rect x="60" y="55" width="80" height="25" rx="4" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" />
                                            <text x="100" y="72" textAnchor="middle" className="text-xs" fill="#1d4ed8">Interpolation</text>

                                            {/* Branches */}
                                            <path d="M60 80 L40 90 M140 80 L160 90" stroke="#64748b" strokeWidth="2" fill="none" />
                                            <circle cx="40" cy="95" r="8" fill="#22c55e" />
                                            <circle cx="160" cy="95" r="8" fill="#22c55e" />
                                        </svg>
                                    </div>

                                    <div className="space-y-4 text-slate-600">
                                        <div>
                                            <h3 className="font-semibold text-slate-800 mb-2">Data Interpolation</h3>
                                            <p className="text-sm">
                                                Transforming static CGWB Yearbook data points into daily simulations
                                                using Node.js algorithms. Our linear interpolation engine calculates
                                                precise groundwater depths for any date between recorded measurements.
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-slate-800 mb-2">Spatiotemporal Analysis</h3>
                                            <p className="text-sm">
                                                Mapping fluctuations across geological zones to identify patterns
                                                in groundwater depletion and recharge cycles. This enables predictive
                                                insights for water resource management.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Data Sources & Credits */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
                            >
                                <div className="bg-primary-100 px-6 py-4">
                                    <h2 className="text-xl font-semibold text-primary-800">Data Sources & Credits</h2>
                                </div>
                                <div className="p-6">
                                    {/* Logos */}
                                    <div className="flex justify-center items-center gap-8 mb-6 py-4">
                                        <div className="text-center">
                                            <div className="w-20 h-20 flex items-center justify-center mx-auto mb-2">
                                                <img
                                                    src="/cgwb-updated-logo.png"
                                                    alt="Central Ground Water Board Logo"
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                            <p className="text-xs font-medium text-slate-700">Central Ground Water</p>
                                            <p className="text-xs text-slate-500">Board (CGWB)</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="w-20 h-20 flex items-center justify-center mx-auto mb-2">
                                                <img
                                                    src="/mjs.svg"
                                                    alt="Ministry of Jal Shakti Logo"
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                            <p className="text-xs font-medium text-slate-700">Ministry of</p>
                                            <p className="text-xs text-slate-500">Jal Shakti</p>
                                        </div>
                                    </div>

                                    <div className="text-slate-600 text-sm">
                                        <p>
                                            We acknowledge the Central Ground Water Board (CGWB) and the
                                            Ministry of Jal Shakti as the primary data foundation for
                                            monitoring and managing India's groundwater resources.
                                        </p>
                                        <p className="mt-4">
                                            This platform uses publicly available data from CGWB's annual
                                            reports and the India Water Resources Information System (India-WRIS)
                                            to provide insights into groundwater dynamics across Indian states.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Technical Stack */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 p-6"
                        >
                            <h2 className="text-xl font-semibold text-slate-800 mb-4">Technology Stack</h2>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                {[
                                    { name: 'React', desc: 'Frontend Library' },
                                    { name: 'Vite', desc: 'Build Tool' },
                                    { name: 'Node.js', desc: 'Backend Runtime' },
                                    { name: 'Express.js', desc: 'API Server' },
                                    { name: 'MongoDB', desc: 'Database' },
                                    { name: 'Leaflet', desc: 'Map Visualization' },
                                    { name: 'Tailwind CSS', desc: 'Styling' },
                                    { name: 'Recharts', desc: 'Data Charts' },
                                    { name: 'Framer Motion', desc: 'Animations' },
                                    { name: 'Axios', desc: 'HTTP Client' },
                                ].map((tech, index) => (
                                    <div key={index} className="bg-slate-50 rounded-lg p-3 text-center">
                                        <p className="font-medium text-slate-800">{tech.name}</p>
                                        <p className="text-xs text-slate-500">{tech.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default AboutPage;
