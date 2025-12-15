import mongoose from 'mongoose';

const stateConfigSchema = new mongoose.Schema({
    stateCode: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: true
    },
    mapCenter: {
        lat: {
            type: Number,
            required: true
        },
        lng: {
            type: Number,
            required: true
        }
    },
    zoomLevel: {
        type: Number,
        default: 8
    },
    geology: {
        dominantSoil: String,
        description: String
    }
}, {
    timestamps: true
});

const StateConfig = mongoose.model('StateConfig', stateConfigSchema);

export default StateConfig;
