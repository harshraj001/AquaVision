import { useMemo, useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ReferenceLine,
    ResponsiveContainer,
    Legend
} from 'recharts';

const Hydrograph = ({
    data = [],
    criticalDepth = 40,
    title = 'Hydrograph',
    districtName = ''
}) => {
    const [isFullscreen, setIsFullscreen] = useState(false);

    const chartData = useMemo(() => {
        return data.map(item => ({
            ...item,
            date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            depth: item.depth !== null ? item.depth : null
        }));
    }, [data]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const depth = payload[0].value;
            return (
                <div className="bg-white dark:bg-slate-800 p-2 rounded shadow-lg border border-slate-200 dark:border-slate-700 text-xs">
                    <p className="font-medium text-slate-800 dark:text-white">{label}</p>
                    <p className="text-slate-600 dark:text-slate-300">
                        Avg Depth: <span className="font-semibold text-primary-600 dark:text-primary-400">{depth?.toFixed(1)}m</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    const isDarkMode = document.documentElement.classList.contains('dark');
    const gridColor = isDarkMode ? '#334155' : '#e2e8f0';
    const axisColor = isDarkMode ? '#94a3b8' : '#64748b';
    const lineColor = isDarkMode ? '#475569' : '#cbd5e1';

    const ChartContent = ({ height = "100%" }) => (
        <ResponsiveContainer width="100%" height={height}>
            <LineChart
                data={chartData}
                margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis
                    dataKey="date"
                    tick={{ fontSize: isFullscreen ? 12 : 9, fill: axisColor }}
                    axisLine={{ stroke: lineColor }}
                    tickLine={{ stroke: lineColor }}
                />
                <YAxis
                    reversed
                    domain={[0, 'auto']}
                    tick={{ fontSize: isFullscreen ? 12 : 9, fill: axisColor }}
                    axisLine={{ stroke: lineColor }}
                    tickLine={{ stroke: lineColor }}
                    label={isFullscreen ? { value: 'Depth (m bgl)', angle: -90, position: 'insideLeft', fontSize: 12, fill: axisColor } : undefined}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine
                    y={criticalDepth}
                    stroke="#DC2626"
                    strokeDasharray="5 5"
                    label={isFullscreen ? { value: `Critical (${criticalDepth}m)`, fill: '#DC2626', fontSize: 11 } : undefined}
                />
                <Line
                    type="monotone"
                    dataKey="depth"
                    name="Avg Depth"
                    stroke="#0284c7"
                    strokeWidth={isFullscreen ? 3 : 2}
                    dot={{ fill: '#0284c7', strokeWidth: 0, r: isFullscreen ? 4 : 2 }}
                    activeDot={{ r: isFullscreen ? 6 : 4, fill: '#0284c7' }}
                    connectNulls
                />
            </LineChart>
        </ResponsiveContainer>
    );

    return (
        <>
            {/* Compact View */}
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-3 h-full flex flex-col transition-colors duration-200">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xs font-bold text-slate-800 dark:text-white">{title}</h3>
                    <button
                        onClick={() => setIsFullscreen(true)}
                        className="text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition"
                        title="View Fullscreen"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 min-h-0">
                    <ChartContent />
                </div>

                <div className="mt-1 text-center">
                    <span className="text-[10px] text-red-500 font-semibold">--- Critical ({criticalDepth}m)</span>
                </div>
            </div>

            {/* Fullscreen Modal */}
            {isFullscreen && (
                <div className="fixed inset-0 bg-black/50 z-[2000] flex items-center justify-center p-8">
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-5xl h-[80vh] flex flex-col transition-colors duration-200">
                        {/* Header */}
                        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-800">
                            <div>
                                <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                                    {districtName ? `${districtName} District` : 'State'} - Groundwater Hydrograph
                                </h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Average depth across monitoring wells (2023-24)</p>
                            </div>
                            <button
                                onClick={() => setIsFullscreen(false)}
                                className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition"
                            >
                                <svg className="w-5 h-5 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Chart */}
                        <div className="flex-1 p-6">
                            <ChartContent height="100%" />
                        </div>

                        {/* Legend */}
                        <div className="flex justify-center gap-6 p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-1 bg-primary-600 rounded"></div>
                                <span className="text-sm text-slate-600 dark:text-slate-300">Average Depth (m bgl)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-0.5 bg-red-500" style={{ borderTop: '2px dashed #DC2626' }}></div>
                                <span className="text-sm text-slate-600 dark:text-slate-300">Critical Threshold ({criticalDepth}m)</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Hydrograph;
