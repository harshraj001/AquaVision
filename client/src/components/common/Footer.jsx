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
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                                <img src="/logo.png" alt="AquaVision Logo" className="w-full h-full object-contain" />
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
