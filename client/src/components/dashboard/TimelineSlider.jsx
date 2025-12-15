import { useState, useEffect } from 'react';

const TimelineSlider = ({
    minDate,
    maxDate,
    currentDate,
    onDateChange,
    isPlaying,
    onPlayPause
}) => {
    const [sliderValue, setSliderValue] = useState(0);

    // Convert dates to timestamps for slider
    const minTimestamp = new Date(minDate).getTime();
    const maxTimestamp = new Date(maxDate).getTime();
    const totalDays = Math.floor((maxTimestamp - minTimestamp) / (1000 * 60 * 60 * 24));

    // Update slider when currentDate changes
    useEffect(() => {
        if (currentDate) {
            const currentTimestamp = new Date(currentDate).getTime();
            const daysDiff = Math.floor((currentTimestamp - minTimestamp) / (1000 * 60 * 60 * 24));
            setSliderValue(daysDiff);
        }
    }, [currentDate, minTimestamp]);

    // Handle slider change
    const handleSliderChange = (e) => {
        const days = parseInt(e.target.value);
        setSliderValue(days);

        const newDate = new Date(minTimestamp + days * 24 * 60 * 60 * 1000);
        const dateString = newDate.toISOString().split('T')[0];
        onDateChange(dateString);
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return '--';
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: '2-digit'
        });
    };

    // Get season info
    const getSeasonInfo = () => {
        if (!currentDate) return { name: 'Loading', color: 'text-slate-500' };
        const month = new Date(currentDate).getMonth();
        if (month >= 5 && month <= 9) {
            return { name: 'Kharif', color: 'text-green-600' };
        } else if (month >= 10 || month <= 2) {
            return { name: 'Rabi', color: 'text-amber-600' };
        }
        return { name: 'Pre-Monsoon', color: 'text-blue-600' };
    };

    const season = getSeasonInfo();

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 px-4 py-2 h-full flex items-center gap-4">
            {/* Play/Pause Button */}
            <button
                onClick={onPlayPause}
                className="w-9 h-9 bg-primary-600 hover:bg-primary-700 rounded-full flex items-center justify-center transition-colors shadow-md shrink-0"
            >
                {isPlaying ? (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                ) : (
                    <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                )}
            </button>

            {/* Slider Container */}
            <div className="flex-1 flex flex-col justify-center">
                {/* Month labels row */}
                <div className="flex justify-between text-[10px] font-semibold text-slate-400 uppercase mb-1">
                    <span>Jun '23</span>
                    <span>Aug '23</span>
                    <span>Nov '23</span>
                    <span>Jan '24</span>
                </div>

                {/* Slider */}
                <input
                    type="range"
                    min={0}
                    max={totalDays || 100}
                    value={sliderValue}
                    onChange={handleSliderChange}
                    className="timeline-slider w-full"
                />
            </div>

            {/* Current Date & Season */}
            <div className="text-right shrink-0 w-24">
                <div className="text-xs font-bold text-slate-400 uppercase">Date</div>
                <div className="text-sm font-bold text-primary-600">{formatDate(currentDate)}</div>
                <div className={`text-[10px] font-medium ${season.color}`}>{season.name}</div>
            </div>
        </div>
    );
};

export default TimelineSlider;
