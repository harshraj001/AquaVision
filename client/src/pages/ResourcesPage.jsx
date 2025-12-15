import { motion } from 'framer-motion';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const ResourcesPage = () => {
    const externalLinks = [
        { name: 'Central Ground Water Board Portal', url: 'http://cgwb.gov.in' },
        { name: 'India Water Resources Information System (India-WRIS)', url: 'https://indiawris.gov.in' },
        { name: 'National Hydrology Project', url: 'https://nhp.mowr.gov.in' },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />

            <main className="flex-grow">
                {/* Header */}
                <section className="bg-white py-12 border-b border-slate-200">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl font-bold text-slate-800"
                        >
                            Resources
                        </motion.h1>
                    </div>
                </section>

                {/* Content */}
                <section className="py-16">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* External Links */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">External Links & Related Work</h2>
                            <div className="space-y-4">
                                {externalLinks.map((link, index) => (
                                    <a
                                        key={index}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-center gap-4 hover:border-primary-300 hover:shadow-md transition-all group"
                                    >
                                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                                            <svg className="w-5 h-5 text-slate-500 group-hover:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </div>
                                        <span className="text-slate-700 font-medium group-hover:text-primary-600 transition-colors">
                                            {link.name}
                                        </span>
                                    </a>
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

export default ResourcesPage;
