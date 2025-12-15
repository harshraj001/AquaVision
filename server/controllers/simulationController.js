import Well from '../models/Well.js';
import StateConfig from '../models/StateConfig.js';

/**
 * Linear Interpolation Algorithm
 * Calculates the depth for a specific date based on surrounding readings
 */
const interpolateDepth = (readings, targetDate) => {
    if (!readings || readings.length === 0) return null;

    const target = new Date(targetDate).getTime();
    const sorted = [...readings].sort((a, b) => new Date(a.date) - new Date(b.date));

    // Find surrounding readings
    let before = null;
    let after = null;

    for (let i = 0; i < sorted.length; i++) {
        const readingTime = new Date(sorted[i].date).getTime();

        if (readingTime <= target) {
            before = sorted[i];
        }
        if (readingTime >= target && !after) {
            after = sorted[i];
        }
    }

    // Edge cases
    if (!before && !after) return null;
    if (!before) return after.depth;
    if (!after) return before.depth;

    const beforeTime = new Date(before.date).getTime();
    const afterTime = new Date(after.date).getTime();

    // Exact match
    if (beforeTime === afterTime) return before.depth;
    if (beforeTime === target) return before.depth;
    if (afterTime === target) return after.depth;

    // Linear interpolation formula
    const ratio = (target - beforeTime) / (afterTime - beforeTime);
    const interpolatedDepth = before.depth + ratio * (after.depth - before.depth);

    return Math.round(interpolatedDepth * 100) / 100; // Round to 2 decimal places
};

/**
 * Get depth color based on value
 */
const getDepthColor = (depth, criticalDepth = 40) => {
    if (depth === null) return 'gray';
    if (depth < 10) return 'blue';        // Safe
    if (depth < 20) return 'yellow';      // Moderate
    if (depth < criticalDepth) return 'amber';  // High
    return 'red';                          // Critical
};

/**
 * Get status based on depth
 */
const getStatus = (depth, criticalDepth = 40) => {
    if (depth === null) return 'unknown';
    if (depth >= criticalDepth) return 'critical';
    if (depth >= 30) return 'warning';
    return 'safe';
};

// @desc    Get simulation data for all wells in a state
// @route   GET /api/simulation/:stateCode
// @access  Public
export const getStateSimulation = async (req, res) => {
    try {
        const { stateCode } = req.params;
        const { date, district } = req.query;

        if (!date) {
            return res.status(400).json({ message: 'Date parameter is required (YYYY-MM-DD)' });
        }

        // Get state config
        const stateConfig = await StateConfig.findOne({ stateCode });
        if (!stateConfig) {
            return res.status(404).json({ message: 'State not found' });
        }

        // Build query
        const query = { stateCode };
        if (district) {
            query.district = district;
        }

        // Get wells
        const wells = await Well.find(query);

        // Calculate interpolated depths for each well
        const simulationData = wells.map(well => {
            const interpolatedDepth = interpolateDepth(well.readings, date);

            return {
                wellId: well.wellId,
                district: well.district,
                block: well.block,
                coordinates: well.coordinates,
                soilProfile: well.soilProfile,
                criticalDepth: well.criticalDepth,
                depth: interpolatedDepth,
                color: getDepthColor(interpolatedDepth, well.criticalDepth),
                status: getStatus(interpolatedDepth, well.criticalDepth)
            };
        });

        // Calculate district statistics
        const districts = [...new Set(wells.map(w => w.district))];
        const districtStats = districts.map(districtName => {
            const districtWells = simulationData.filter(w => w.district === districtName);
            const depths = districtWells.map(w => w.depth).filter(d => d !== null);
            const avgDepth = depths.length > 0
                ? Math.round((depths.reduce((a, b) => a + b, 0) / depths.length) * 100) / 100
                : null;
            const criticalCount = districtWells.filter(w => w.status === 'critical').length;

            return {
                district: districtName,
                wellCount: districtWells.length,
                avgDepth,
                criticalCount,
                status: criticalCount > 0 ? 'critical' : avgDepth > 30 ? 'warning' : 'safe'
            };
        });

        res.json({
            stateCode,
            stateName: stateConfig.name,
            mapCenter: stateConfig.mapCenter,
            zoomLevel: stateConfig.zoomLevel,
            geology: stateConfig.geology,
            date,
            wells: simulationData,
            districtStats,
            summary: {
                totalWells: wells.length,
                criticalWells: simulationData.filter(w => w.status === 'critical').length,
                safeWells: simulationData.filter(w => w.status === 'safe').length
            }
        });
    } catch (error) {
        console.error('Simulation error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get simulation data for a single well
// @route   GET /api/simulation/:stateCode/:wellId
// @access  Public
export const getWellSimulation = async (req, res) => {
    try {
        const { stateCode, wellId } = req.params;
        const { date, startDate, endDate } = req.query;

        const well = await Well.findOne({ stateCode, wellId });
        if (!well) {
            return res.status(404).json({ message: 'Well not found' });
        }

        // If date range requested, return time series
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const timeSeries = [];

            // Generate daily data points
            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                const dateStr = d.toISOString().split('T')[0];
                const depth = interpolateDepth(well.readings, dateStr);
                timeSeries.push({
                    date: dateStr,
                    depth,
                    color: getDepthColor(depth, well.criticalDepth),
                    status: getStatus(depth, well.criticalDepth)
                });
            }

            return res.json({
                wellId: well.wellId,
                district: well.district,
                block: well.block,
                coordinates: well.coordinates,
                soilProfile: well.soilProfile,
                criticalDepth: well.criticalDepth,
                timeSeries
            });
        }

        // Single date
        if (!date) {
            return res.status(400).json({ message: 'Date parameter is required' });
        }

        const interpolatedDepth = interpolateDepth(well.readings, date);

        res.json({
            wellId: well.wellId,
            district: well.district,
            block: well.block,
            coordinates: well.coordinates,
            soilProfile: well.soilProfile,
            criticalDepth: well.criticalDepth,
            date,
            depth: interpolatedDepth,
            color: getDepthColor(interpolatedDepth, well.criticalDepth),
            status: getStatus(interpolatedDepth, well.criticalDepth),
            readings: well.readings
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get date range for a state (min/max dates from readings)
// @route   GET /api/simulation/:stateCode/daterange
// @access  Public
export const getDateRange = async (req, res) => {
    try {
        const { stateCode } = req.params;

        const wells = await Well.find({ stateCode });
        if (wells.length === 0) {
            return res.status(404).json({ message: 'No wells found for this state' });
        }

        let minDate = null;
        let maxDate = null;

        wells.forEach(well => {
            well.readings.forEach(reading => {
                const date = new Date(reading.date);
                if (!minDate || date < minDate) minDate = date;
                if (!maxDate || date > maxDate) maxDate = date;
            });
        });

        res.json({
            stateCode,
            minDate: minDate ? minDate.toISOString().split('T')[0] : null,
            maxDate: maxDate ? maxDate.toISOString().split('T')[0] : null
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
