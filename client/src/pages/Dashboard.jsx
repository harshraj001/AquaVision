import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { statesAPI, simulationAPI } from '../services/api';
import { useDebounce } from '../hooks/useDebounce';
import Navbar from '../components/common/Navbar';
import MapView from '../components/dashboard/MapView';
import TimelineSlider from '../components/dashboard/TimelineSlider';
import FilterSidebar from '../components/dashboard/FilterSidebar';
import AnalyticsPanel from '../components/dashboard/AnalyticsPanel';

const Dashboard = () => {
    const { stateCode } = useParams();
    const navigate = useNavigate();

    // State
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [states, setStates] = useState([]);
    const [selectedState, setSelectedState] = useState(stateCode || '');
    const [stateConfig, setStateConfig] = useState(null);
    const [wells, setWells] = useState([]);
    const [selectedWell, setSelectedWell] = useState(null);
    const [dateRange, setDateRange] = useState({ min: '', max: '' });
    const [currentDate, setCurrentDate] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [timeSeriesData, setTimeSeriesData] = useState([]);
    const [districtStats, setDistrictStats] = useState([]);

    const playIntervalRef = useRef(null);
    const debouncedDate = useDebounce(currentDate, 300);

    // Sync selectedState with URL stateCode when navigating via Navbar
    useEffect(() => {
        setSelectedState(stateCode || '');
        setSelectedWell(null);
        setSelectedDistrict('');
        setStateConfig(null);
        if (stateCode) {
            setLoading(true);
        }
    }, [stateCode]);

    // Fetch all states on mount
    useEffect(() => {
        const fetchStates = async () => {
            try {
                const response = await statesAPI.getAll();
                setStates(response.data);
                // Loading will be handled by fetchSimulationData for Pan-India
            } catch (err) {
                console.error('Failed to fetch states:', err);
                setLoading(false);
                setError('Failed to load application data.');
            }
        };
        fetchStates();
    }, [stateCode]);

    // Fetch state config when selectedState changes
    useEffect(() => {
        const fetchInitialData = async () => {
            if (!selectedState) return;

            try {
                setLoading(true);
                setError(null);

                const configResponse = await statesAPI.getOne(selectedState);
                setStateConfig(configResponse.data);

                const dateRangeResponse = await simulationAPI.getDateRange(selectedState);
                setDateRange({
                    min: dateRangeResponse.data.minDate,
                    max: dateRangeResponse.data.maxDate
                });
                setCurrentDate(dateRangeResponse.data.minDate);
                setSelectedDistrict(''); // Reset district when state changes

            } catch (err) {
                console.error('Failed to fetch initial data:', err);
                setError('Failed to load state data. Please try again.');
                setLoading(false);
            }
            // Do not set loading false here, wait for simulation data
        };

        fetchInitialData();
    }, [selectedState]);

    // Fetch simulation data when date changes
    useEffect(() => {
        const fetchSimulationData = async () => {
            // For Pan-India view (no selectedState), fetch from all states
            if (!stateCode && !selectedState && states.length > 0) {
                try {
                    const allWells = [];
                    const defaultDate = new Date().toISOString().split('T')[0];

                    // Fetch sample wells from each state
                    for (const state of states) {
                        try {
                            const response = await simulationAPI.getStateData(state.stateCode, debouncedDate || defaultDate);
                            // Take first 50 wells from each state for performance
                            const stateWells = (response.data.wells || []).slice(0, 50);
                            allWells.push(...stateWells);
                        } catch (err) {
                            console.error(`Failed to fetch data for ${state.stateCode}:`, err);
                        }
                    }
                    setWells(allWells);
                    setDistrictStats([]);
                } catch (err) {
                    console.error('Failed to fetch pan-India data:', err);
                } finally {
                    setLoading(false);
                }
                return;
            }

            if (!debouncedDate || !selectedState) return;

            try {
                const response = await simulationAPI.getStateData(selectedState, debouncedDate, selectedDistrict || undefined);
                setWells(response.data.wells);
                setDistrictStats(response.data.districtStats);
            } catch (err) {
                console.error('Failed to fetch simulation data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSimulationData();
    }, [debouncedDate, selectedState, selectedDistrict, stateCode, states]);

    // Fetch time series for district/state average (always load on state/district change)
    useEffect(() => {
        const fetchDistrictTimeSeries = async () => {
            if (!dateRange.min || !dateRange.max || !selectedState) return;

            try {
                // Generate time series with multiple date points for smooth hydrograph
                const startDate = new Date(dateRange.min);
                const endDate = new Date(dateRange.max);
                const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
                const numPoints = Math.min(8, Math.max(4, Math.ceil(totalDays / 30))); // 4-8 points

                const dates = [];
                for (let i = 0; i < numPoints; i++) {
                    const date = new Date(startDate.getTime() + (i / (numPoints - 1)) * (endDate - startDate));
                    dates.push(date.toISOString().split('T')[0]);
                }

                const timeSeries = [];
                for (const date of dates) {
                    const res = await simulationAPI.getStateData(selectedState, date, selectedDistrict || undefined);
                    const avgDepth = res.data.wells.length > 0
                        ? res.data.wells.reduce((sum, w) => sum + (w.depth || 0), 0) / res.data.wells.length
                        : null;
                    timeSeries.push({ date, depth: avgDepth });
                }
                setTimeSeriesData(timeSeries);
            } catch (err) {
                console.error('Failed to fetch time series:', err);
            }
        };

        fetchDistrictTimeSeries();
    }, [selectedState, dateRange, selectedDistrict]);

    // Fetch individual well time series when a well is selected
    useEffect(() => {
        const fetchWellTimeSeries = async () => {
            if (!selectedWell || !dateRange.min || !dateRange.max) return;

            try {
                const response = await simulationAPI.getWellData(
                    selectedState,
                    selectedWell.wellId,
                    { startDate: dateRange.min, endDate: dateRange.max }
                );
                setTimeSeriesData(response.data.timeSeries || []);
            } catch (err) {
                console.error('Failed to fetch well time series:', err);
            }
        };

        fetchWellTimeSeries();
    }, [selectedWell, selectedState, dateRange]);

    const handleDateChange = useCallback((newDate) => {
        setCurrentDate(newDate);
    }, []);

    const handlePlayPause = useCallback(() => {
        if (isPlaying) {
            setIsPlaying(false);
            if (playIntervalRef.current) {
                clearInterval(playIntervalRef.current);
                playIntervalRef.current = null;
            }
        } else {
            setIsPlaying(true);
            playIntervalRef.current = setInterval(() => {
                setCurrentDate((prevDate) => {
                    const current = new Date(prevDate);
                    const max = new Date(dateRange.max);

                    if (current >= max) {
                        setIsPlaying(false);
                        clearInterval(playIntervalRef.current);
                        return dateRange.min;
                    }

                    current.setDate(current.getDate() + 7);
                    return current.toISOString().split('T')[0];
                });
            }, 500);
        }
    }, [isPlaying, dateRange]);

    useEffect(() => {
        return () => {
            if (playIntervalRef.current) {
                clearInterval(playIntervalRef.current);
            }
        };
    }, []);

    const handleWellClick = useCallback((well) => {
        setSelectedWell(well);
    }, []);

    const handleDistrictChange = useCallback((newDistrict) => {
        setSelectedDistrict(newDistrict);
        setSelectedWell(null); // Clear selected well when district changes
    }, []);

    const handleStateChange = useCallback((newStateCode) => {
        setSelectedState(newStateCode);
        setSelectedWell(null);
        // Update URL without full navigation
        if (newStateCode) {
            navigate(`/dashboard/${newStateCode}`, { replace: true });
        }
    }, [navigate]);

    // Calculate state average
    const stateAverage = wells.length > 0
        ? (wells.reduce((sum, w) => sum + (w.depth || 0), 0) / wells.length).toFixed(1)
        : '--';

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-primary-600 dark:border-primary-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 dark:text-slate-300">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
                <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                <button onClick={() => navigate('/')} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
                    Return Home
                </button>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
            {/* Navbar - consistent with other pages */}
            <Navbar />

            {/* Context Bar - shows current state/view */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-1.5 flex items-center justify-between shrink-0 transition-colors duration-200">
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Dashboard</span>
                    <span className="text-slate-300 dark:text-slate-600">/</span>
                    {stateCode ? (
                        <span className="font-semibold text-slate-700 dark:text-slate-200">{stateConfig?.name || 'Loading...'}</span>
                    ) : (
                        <span className="font-semibold text-blue-600 dark:text-blue-400">Pan-India View</span>
                    )}
                    {selectedDistrict && (
                        <>
                            <span className="text-slate-300 dark:text-slate-600">/</span>
                            <span className="font-medium text-slate-600 dark:text-slate-300">{selectedDistrict}</span>
                        </>
                    )}
                </div>
                <div className="text-xs text-slate-400 dark:text-slate-500">
                    {wells.length} wells | Avg: {stateAverage}m
                </div>
            </div>

            {/* Main Dashboard */}
            <main className="flex-1 flex p-2 gap-2 overflow-hidden">
                {/* Left Sidebar */}
                <aside className="w-56 shrink-0">
                    <FilterSidebar
                        states={states}
                        selectedState={selectedState}
                        onStateChange={handleStateChange}
                        districts={stateConfig?.districts || []}
                        selectedDistrict={selectedDistrict}
                        onDistrictChange={handleDistrictChange}
                        dateRange={dateRange}
                        showStateSelector={!stateCode}
                        stateCode={stateCode}
                    />
                </aside>

                {/* Center: Map & Timeline */}
                <section className="flex-1 flex flex-col gap-2 min-w-0">
                    {/* Map Container */}
                    <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative p-1 min-h-0 transition-colors duration-200">
                        <MapView
                            wells={wells}
                            center={stateConfig?.mapCenter || { lat: 22.5, lng: 78.9 }}
                            zoom={stateConfig?.zoomLevel || 5}
                            onWellClick={handleWellClick}
                            selectedWellId={selectedWell?.wellId}
                            focusDistrict={selectedDistrict}
                        />

                        {/* State Average Overlay */}
                        <div className="absolute top-3 right-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur px-4 py-2 rounded-lg shadow-md border border-slate-100 dark:border-slate-700 z-[1000] text-right">
                            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">
                                {selectedDistrict || stateConfig?.name || 'State'} Avg
                            </h3>
                            <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{stateAverage} m</p>
                        </div>
                    </div>

                    {/* Timeline Controller */}
                    <div className="h-16 shrink-0">
                        <TimelineSlider
                            minDate={dateRange.min}
                            maxDate={dateRange.max}
                            currentDate={currentDate}
                            onDateChange={handleDateChange}
                            isPlaying={isPlaying}
                            onPlayPause={handlePlayPause}
                        />
                    </div>
                </section>

                {/* Right Sidebar */}
                <aside className="w-72 shrink-0">
                    <AnalyticsPanel
                        selectedWell={selectedWell}
                        districtStats={districtStats}
                        currentDate={currentDate}
                        geology={stateConfig?.geology}
                        stateCode={selectedState}
                        timeSeriesData={timeSeriesData}
                        selectedDistrict={selectedDistrict}
                    />
                </aside>
            </main>

            {/* Footer */}
            <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-1 px-4 text-xs text-slate-400 dark:text-slate-500 flex justify-between shrink-0 transition-colors duration-200">
                <span>© 2024 AquaVision India. Developed for Academic Project.</span>
                <span>Data Source: CGWB Yearbook 2023-24</span>
            </footer>
        </div>
    );
};

export default Dashboard;
