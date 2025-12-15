import { useMemo } from 'react';
import Hydrograph from './Hydrograph';
import BoreholeVisual from './BoreholeVisual';

const AnalyticsPanel = ({
    selectedWell,
    districtStats,
    currentDate,
    geology,
    stateCode,
    timeSeriesData = [],
    selectedDistrict = ''
}) => {
    const currentStats = districtStats?.[0] || {
        district: 'All Districts',
        avgDepth: null,
        status: 'safe',
        criticalCount: 0,
        wellCount: 0
    };

    // Compute average hydrograph from time series (for district average view)
    const avgTimeSeriesData = useMemo(() => {
        if (timeSeriesData.length === 0) return [];
        return timeSeriesData;
    }, [timeSeriesData]);

    const displayDistrict = selectedWell?.district || selectedDistrict || currentStats.district;
    const displayDepth = selectedWell?.depth ?? currentStats.avgDepth ?? null;
    const displayStatus = selectedWell?.status || currentStats.status || 'safe';
    const displayCritical = selectedWell?.criticalDepth || 40;

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-3 h-full flex flex-col gap-2 overflow-hidden transition-colors duration-200">
            {/* District Status Card */}
            <div className="shrink-0">
                <div className="flex justify-between items-start mb-1">
                    <div>
                        <h2 className="font-bold text-slate-800 dark:text-white text-sm">
                            {displayDistrict}
                        </h2>
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {geology?.dominantSoil || 'Alluvial'}
                        </span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded ${displayStatus === 'critical'
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
                        : displayStatus === 'warning'
                            ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800'
                            : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800'
                        }`}>
                        {displayStatus === 'critical' ? 'CRITICAL' : displayStatus === 'warning' ? 'HIGH' : 'STABLE'}
                    </span>
                </div>

                <div className="mt-2">
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold">
                        {selectedWell ? 'Well Depth' : 'Avg Depth'}
                    </div>
                    <div className="text-xl font-bold text-slate-800 dark:text-white">
                        <span>{displayDepth?.toFixed(1) || '--'}</span>
                        <span className="text-xs font-normal text-slate-400 dark:text-slate-500 ml-1">mbgl</span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                        {selectedWell
                            ? `Well ${selectedWell.wellId} • ${selectedWell.block || selectedWell.district}`
                            : `${currentStats.wellCount || 0} wells monitored • ${currentStats.criticalCount || 0} critical`}
                    </p>
                </div>
            </div>

            {/* Hydrograph */}
            <div className="flex-1 min-h-[140px]">
                <Hydrograph
                    data={avgTimeSeriesData}
                    criticalDepth={displayCritical}
                    title={selectedWell ? 'Well Hydrograph' : 'District Avg Hydrograph'}
                    districtName={displayDistrict}
                />
            </div>

            {/* Borehole Log */}
            <div className="shrink-0">
                <BoreholeVisual
                    soilProfile={selectedWell?.soilProfile || geology?.soilProfile || ['Topsoil', 'Sand', 'Clay']}
                    currentDepth={displayDepth || 20}
                    criticalDepth={displayCritical}
                    maxDepth={60}
                />
            </div>
        </div>
    );
};

export default AnalyticsPanel;
