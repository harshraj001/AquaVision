import { motion } from 'framer-motion';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const TeamPage = () => {
    const teamMembers = [
        {
            name: 'Harsh Raj',
            university: 'Lovely Professional University',
        },
        {
            name: 'Rajathkumar R K',
            university: 'Lovely Professional University',
        },
        {
            name: 'Mridul',
            university: 'Lovely Professional University',
        },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />

            <main className="flex-grow">
                {/* Header */}
                <section className="bg-white py-6 border-b border-slate-200">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <span className="font-semibold">AquaVision India</span>
                            <span>→</span>
                            <span>Team & Contributors</span>
                        </div>
                    </div>
                </section>

                {/* Content */}
                <section className="py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-12"
                        >
                            <h1 className="text-4xl font-bold text-slate-800">Meet the Team</h1>
                            <p className="mt-4 text-slate-600">
                                A student-led initiative from Lovely Professional University
                            </p>
                        </motion.div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {teamMembers.map((member, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center"
                                >
                                    {/* Avatar */}
                                    <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                        </svg>
                                    </div>

                                    {/* Info */}
                                    <h3 className="text-lg font-semibold text-slate-800">{member.name}</h3>
                                    <p className="text-slate-500 text-sm mt-1">{member.university}</p>
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

export default TeamPage;
