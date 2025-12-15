import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-800 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold">AquaVision India</span>
                        </div>
                        <p className="text-slate-400 text-sm max-w-md">
                            Visualize groundwater depth levels across Indian states with
                            interactive maps, time-based simulation, and district-wise analytics
                            using CGWB data.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-slate-400 hover:text-white text-sm transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-slate-400 hover:text-white text-sm transition-colors">
                                    About Project
                                </Link>
                            </li>
                            <li>
                                <Link to="/team" className="text-slate-400 hover:text-white text-sm transition-colors">
                                    Team
                                </Link>
                            </li>
                            <li>
                                <Link to="/resources" className="text-slate-400 hover:text-white text-sm transition-colors">
                                    Resources
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Data Sources */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Data Sources</h3>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="http://cgwb.gov.in"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-slate-400 hover:text-white text-sm transition-colors"
                                >
                                    Central Ground Water Board
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://indiawris.gov.in"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-slate-400 hover:text-white text-sm transition-colors"
                                >
                                    India-WRIS
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://jalshakti-dowr.gov.in"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-slate-400 hover:text-white text-sm transition-colors"
                                >
                                    Ministry of Jal Shakti
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-slate-400 text-sm">
                        © {currentYear} AquaVision India. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
