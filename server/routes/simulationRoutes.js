import express from 'express';
import {
    getStateSimulation,
    getWellSimulation,
    getDateRange
} from '../controllers/simulationController.js';

const router = express.Router();

// Get date range for a state
router.get('/:stateCode/daterange', getDateRange);

// Get simulation for all wells in a state
router.get('/:stateCode', getStateSimulation);

// Get simulation for a single well
router.get('/:stateCode/:wellId', getWellSimulation);

export default router;
