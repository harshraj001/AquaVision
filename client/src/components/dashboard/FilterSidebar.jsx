import { useState } from 'react';
import { exportAPI } from '../../services/api';

const FilterSidebar = ({
    states = [],
    selectedState = '',
    onStateChange,
    districts = [],
    selectedDistrict = '',
    onDistrictChange,
    dateRange = { min: '', max: '' },
    showStateSelector = false,
    stateCode = ''
}) => {
    const [showExportModal, setShowExportModal] = useState(false);
    const [exportForm, setExportForm] = useState({
        district: '',
        name: '',
        email: ''
    });
    const [exportStatus, setExportStatus] = useState({ loading: false, message: '', success: false });

    const handleExportSubmit = async (e) => {
        e.preventDefault();

        const currentState = stateCode || selectedState;
        if (!currentState) {
            setExportStatus({ loading: false, message: 'Please select a state first', success: false });
            return;
        }

        setExportStatus({ loading: true, message: '', success: false });

        try {
            const response = await exportAPI.requestExport({
                stateCode: currentState,
                district: exportForm.district || null,
                name: exportForm.name,
                email: exportForm.email
            });

            setExportStatus({
                loading: false,
                message: response.data.message || 'Export email sent! Check your inbox.',
                success: true
            });

            // Reset form after success
            setTimeout(() => {
                setShowExportModal(false);
                setExportForm({ district: '', name: '', email: '' });
                setExportStatus({ loading: false, message: '', success: false });
            }, 3000);

        } catch (error) {
            setExportStatus({
                loading: false,
                message: error.response?.data?.message || 'Failed to send export. Please try again.',
                success: false
            });
        }
    };

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 h-full flex flex-col">
                <h2 className="text-sm font-bold text-slate-800 mb-4">Filters & Controls</h2>

                {/* State Selector - Only shown in Pan-India view */}
                {showStateSelector && (
                    <div className="mb-4">
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Select State</label>
                        <div className="relative">
                            <select
                                value={selectedState}
                                onChange={(e) => onStateChange(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 p-2.5 appearance-none cursor-pointer"
                            >
                                <option value="">All States</option>
                                {states.map((state) => (
                                    <option key={state.stateCode} value={state.stateCode}>
                                        {state.name}
                                    </option>
                                ))}
                            </select>
                            <svg className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                )}

                {/* District Selector */}
                <div className="mb-4">
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Select District</label>
                    <div className="relative">
                        <select
                            value={selectedDistrict}
                            onChange={(e) => onDistrictChange(e.target.value)}
                            disabled={showStateSelector && !selectedState}
                            className={`w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 p-2.5 appearance-none cursor-pointer ${showStateSelector && !selectedState ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            <option value="">{showStateSelector && !selectedState ? 'Select state first' : 'All Districts'}</option>
                            {districts.map((district) => (
                                <option key={district} value={district}>
                                    {district}
                                </option>
                            ))}
                        </select>
                        <svg className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                {/* Simulation Period */}
                <div className="mb-4 bg-blue-50 rounded-lg p-3 border border-blue-100">
                    <label className="block text-xs font-bold text-blue-800 uppercase mb-1">Simulation Period</label>
                    <div className="flex items-center gap-2 text-blue-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm font-semibold">
                            {dateRange.min && dateRange.max
                                ? `${new Date(dateRange.min).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })} - ${new Date(dateRange.max).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}`
                                : 'Loading...'}
                        </span>
                    </div>
                </div>

                {/* Legend */}
                <div className="mb-4">
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Depth Legend (mbgl)</label>
                    <div className="space-y-1.5 text-xs">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm"></div>
                            <span className="text-slate-600">Safe (&lt;10m)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-sm"></div>
                            <span className="text-slate-600">Moderate (10-20m)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-orange-500 shadow-sm"></div>
                            <span className="text-slate-600">High (20-40m)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-600 shadow-sm"></div>
                            <span className="text-slate-600">Critical (&gt;40m)</span>
                        </div>
                    </div>
                </div>

                {/* Export Button */}
                <div className="mt-auto pt-4 border-t border-slate-200">
                    <button
                        onClick={() => setShowExportModal(true)}
                        disabled={!stateCode && !selectedState}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition ${(stateCode || selectedState)
                            ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-md'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Export Data
                    </button>
                    {!stateCode && !selectedState && (
                        <p className="text-xs text-slate-400 text-center mt-2">Select a state to export</p>
                    )}
                </div>
            </div>

            {/* Export Modal */}
            {showExportModal && (
                <div className="fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                        <div className="flex justify-between items-center p-4 border-b border-slate-200">
                            <h3 className="text-lg font-bold text-slate-800">Export Groundwater Data</h3>
                            <button
                                onClick={() => setShowExportModal(false)}
                                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
                            >
                                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleExportSubmit} className="p-4 space-y-4">
                            {/* District Selection */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Select District</label>
                                <select
                                    value={exportForm.district}
                                    onChange={(e) => setExportForm({ ...exportForm, district: e.target.value })}
                                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                >
                                    <option value="">All Districts</option>
                                    {districts.map((district) => (
                                        <option key={district} value={district}>
                                            {district}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Your Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={exportForm.name}
                                    onChange={(e) => setExportForm({ ...exportForm, name: e.target.value })}
                                    placeholder="Enter your name"
                                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address *</label>
                                <input
                                    type="email"
                                    required
                                    value={exportForm.email}
                                    onChange={(e) => setExportForm({ ...exportForm, email: e.target.value })}
                                    placeholder="your.email@example.com"
                                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>

                            {/* Status Message */}
                            {exportStatus.message && (
                                <div className={`p-3 rounded-lg text-sm ${exportStatus.success
                                    ? 'bg-green-50 text-green-700 border border-green-200'
                                    : 'bg-red-50 text-red-700 border border-red-200'
                                    }`}>
                                    {exportStatus.message}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={exportStatus.loading}
                                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {exportStatus.loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        Send Download Link to Email
                                    </>
                                )}
                            </button>

                            <p className="text-xs text-slate-500 text-center">
                                You'll receive an email with a download link valid for 24 hours.
                            </p>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default FilterSidebar;
