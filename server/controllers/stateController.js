import StateConfig from '../models/StateConfig.js';
import Well from '../models/Well.js';

// @desc    Get all states
// @route   GET /api/states
// @access  Public
export const getAllStates = async (req, res) => {
    try {
        const states = await StateConfig.find().select('stateCode name mapCenter zoomLevel');
        res.json(states);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single state config with districts
// @route   GET /api/states/:stateCode
// @access  Public
export const getStateConfig = async (req, res) => {
    try {
        const { stateCode } = req.params;

        const stateConfig = await StateConfig.findOne({ stateCode });
        if (!stateConfig) {
            return res.status(404).json({ message: 'State not found' });
        }

        // Get unique districts for this state
        const districts = await Well.distinct('district', { stateCode });

        // Get unique blocks grouped by district
        const blocks = await Well.aggregate([
            { $match: { stateCode } },
            { $group: { _id: '$district', blocks: { $addToSet: '$block' } } }
        ]);

        const districtBlocks = {};
        blocks.forEach(item => {
            districtBlocks[item._id] = item.blocks.filter(b => b); // Filter out null/undefined
        });

        res.json({
            ...stateConfig.toObject(),
            districts,
            districtBlocks
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all wells for a state (basic info only)
// @route   GET /api/states/:stateCode/wells
// @access  Public
export const getStateWells = async (req, res) => {
    try {
        const { stateCode } = req.params;
        const { district } = req.query;

        const query = { stateCode };
        if (district) {
            query.district = district;
        }

        const wells = await Well.find(query).select('wellId district block coordinates criticalDepth soilProfile');
        res.json(wells);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
