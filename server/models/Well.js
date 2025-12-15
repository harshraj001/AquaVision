import mongoose from 'mongoose';

const readingSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    depth: {
        type: Number,
        required: true
    }
}, { _id: false });

const wellSchema = new mongoose.Schema({
    wellId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    stateCode: {
        type: String,
        required: true,
        index: true
    },
    district: {
        type: String,
        required: true,
        index: true
    },
    block: {
        type: String
    },
    coordinates: {
        lat: {
            type: Number,
            required: true
        },
        lng: {
            type: Number,
            required: true
        }
    },
    soilProfile: {
        type: [String],
        default: ['Topsoil', 'Sand', 'Clay']
    },
    criticalDepth: {
        type: Number,
        default: 40
    },
    readings: [readingSchema]
}, {
    timestamps: true
});

// Index for efficient querying
wellSchema.index({ stateCode: 1, district: 1 });

const Well = mongoose.model('Well', wellSchema);

export default Well;
