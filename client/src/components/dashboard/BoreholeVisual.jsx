const BoreholeVisual = ({
    soilProfile = ['Topsoil', 'Sand', 'Clay'],
    currentDepth = 20,
    criticalDepth = 40,
    maxDepth = 60
}) => {
    // Water level is measured from the top, so we show how deep the water is
    const waterTopPercent = Math.min(100, Math.max(0, (currentDepth / maxDepth) * 100));

    const getSoilColor = (layer) => {
        const colors = {
            'topsoil': '#8B7355',
            'sand': '#D4A76A',
            'fine sand': '#E8C87A',
            'clay': '#6B7280',
            'silt': '#9CA3AF',
            'gravel': '#4B5563',
            'coarse sand': '#C4A35A',
            'sandy loam': '#A68B5B',
            'loam': '#8B6914',
            'boulders': '#374151',
            'rock': '#1F2937',
        };
        return colors[layer.toLowerCase()] || '#9CA3AF';
    };

    const getStatusInfo = () => {
        if (currentDepth >= 40) return { text: 'Critical', color: 'bg-red-500', textColor: 'text-red-600' };
        if (currentDepth >= 20) return { text: 'High', color: 'bg-orange-500', textColor: 'text-orange-600' };
        if (currentDepth >= 10) return { text: 'Moderate', color: 'bg-yellow-500', textColor: 'text-yellow-600' };
        return { text: 'Safe', color: 'bg-blue-500', textColor: 'text-blue-600' };
    };

    const status = getStatusInfo();

    return (
        <div className="bg-white rounded-lg border border-slate-200 p-3">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-bold text-slate-800">Borehole Log</h3>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${status.color} text-white`}>
                    {status.text}
                </span>
            </div>

            <div className="flex gap-2 h-32">
                {/* Strata Column */}
                <div className="w-12 flex flex-col rounded overflow-hidden border border-slate-300 text-[8px] text-center font-semibold text-white shadow-inner">
                    {soilProfile.slice(0, 3).map((layer, index) => (
                        <div
                            key={index}
                            className="flex-1 flex items-center justify-center border-b border-white/20 last:border-b-0"
                            style={{
                                backgroundColor: getSoilColor(layer),
                                textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                            }}
                        >
                            {layer.length > 6 ? layer.substring(0, 5) + '..' : layer}
                        </div>
                    ))}
                </div>

                {/* Borehole Column */}
                <div className="flex-1 bg-gradient-to-b from-amber-100 to-amber-200 rounded border border-slate-300 relative overflow-hidden shadow-inner">
                    {/* Dry zone (above water) */}
                    <div
                        className="absolute top-0 left-0 right-0 bg-gradient-to-b from-amber-50 to-amber-100"
                        style={{ height: `${waterTopPercent}%` }}
                    />

                    {/* Water level */}
                    <div
                        className="absolute left-0 right-0 bottom-0 bg-gradient-to-b from-blue-400 to-blue-600 transition-all duration-500"
                        style={{ height: `${100 - waterTopPercent}%` }}
                    >
                        {/* Water surface animation */}
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300 animate-pulse opacity-80"></div>
                    </div>

                    {/* Casing pipe */}
                    <div className="absolute left-1/2 top-0 w-1.5 bg-gray-500 -translate-x-1/2 shadow-sm"
                        style={{ height: `${waterTopPercent + 5}%` }}
                    />

                    {/* Depth indicator line */}
                    <div
                        className="absolute left-0 right-0 h-0.5 bg-slate-600"
                        style={{ top: `${waterTopPercent}%` }}
                    >
                        <div className="absolute -right-1 -top-2 text-[10px] font-bold text-slate-700 bg-white/80 px-1 rounded">
                            {currentDepth?.toFixed(1)}m
                        </div>
                    </div>

                    {/* Critical threshold marker */}
                    <div
                        className="absolute left-0 right-0 border-t-2 border-dashed border-red-500"
                        style={{ top: `${(criticalDepth / maxDepth) * 100}%` }}
                    >
                        <div className="absolute -left-1 -top-2 text-[8px] font-bold text-red-500">
                            ⚠
                        </div>
                    </div>
                </div>

                {/* Depth Scale */}
                <div className="w-8 flex flex-col justify-between text-[9px] text-slate-500 font-medium">
                    <span>0m</span>
                    <span className="text-red-500">{criticalDepth}m</span>
                    <span>{maxDepth}m</span>
                </div>
            </div>

            {/* Info row */}
            <div className="mt-2 flex justify-between text-[10px] text-slate-500">
                <span>Water Table: <strong className={status.textColor}>{currentDepth?.toFixed(1)}m</strong></span>
                <span>Critical: <strong className="text-red-500">{criticalDepth}m</strong></span>
            </div>
        </div>
    );
};

export default BoreholeVisual;
