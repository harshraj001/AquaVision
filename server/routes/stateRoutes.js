import express from 'express';
import { getAllStates, getStateConfig, getStateWells } from '../controllers/stateController.js';

const router = express.Router();

// Get all states
router.get('/', getAllStates);

// Get single state config with districts
router.get('/:stateCode', getStateConfig);

// Get wells for a state
router.get('/:stateCode/wells', getStateWells);

export default router;
