import { motion } from 'framer-motion';

const StatusCard = ({
    district,
    currentDate,
    avgDepth,
    status,
    criticalCount,
    totalWells,
    geology
}) => {
    const getStatusBadge = () => {
        switch (status) {
            case 'critical':
                return (
                    <span className="badge badge-critical">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></span>
                        Critical Zone
                    </span>
                );
            case 'warning':
                return (
                    <span className="badge badge-warning">
                        Warning
                    </span>
                );
            default:
                return (
                    <span className="badge badge-safe">
                        Safe
                    </span>
                );
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-4"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div>
                    <h3 className={`text-lg font-semibold ${status === 'critical' ? 'text-red-600' :
                            status === 'warning' ? 'text-amber-600' : 'text-slate-800'
                        }`}>
                        {district || 'All Districts'}
                    </h3>
                    {status === 'critical' && (
                        <span className="text-xs text-red-500">(Critical Zone)</span>
                    )}
                </div>
                {getStatusBadge()}
            </div>

            {/* Status Summary */}
            <div className="bg-slate-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-slate-700 mb-1">
                    <span className="font-medium">Status ({formatDate(currentDate)}):</span>
                </p>
                <p className="text-sm text-slate-600">
                    {status === 'critical'
                        ? 'Active depletion due to high water extraction. Monitor closely.'
                        : status === 'warning'
                            ? 'Elevated groundwater depths. Conservation recommended.'
                            : 'Groundwater levels within safe limits.'}
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-primary-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-primary-700">
                        {avgDepth !== null ? `${avgDepth.toFixed(1)}m` : 'N/A'}
                    </p>
                    <p className="text-xs text-primary-600">Avg. Depth</p>
                </div>
                <div className={`${criticalCount > 0 ? 'bg-red-50' : 'bg-green-50'} rounded-lg p-3 text-center`}>
                    <p className={`text-2xl font-bold ${criticalCount > 0 ? 'text-red-700' : 'text-green-700'}`}>
                        {criticalCount}/{totalWells}
                    </p>
                    <p className={`text-xs ${criticalCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        Critical Wells
                    </p>
                </div>
            </div>

            {/* Geology Info */}
            {geology && (
                <div className="mt-4 pt-3 border-t border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">Geology</p>
                    <p className="text-sm font-medium text-slate-700">{geology.dominantSoil}</p>
                    <p className="text-xs text-slate-500 mt-1">{geology.description}</p>
                </div>
            )}
        </motion.div>
    );
};

export default StatusCard;
