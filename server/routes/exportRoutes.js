import express from 'express';
import { requestExport, downloadExport, getExportStatus } from '../controllers/exportController.js';

const router = express.Router();

// POST /api/export/request - Request a data export (sends email)
router.post('/request', requestExport);

// GET /api/export/download/:token - Download the exported CSV
router.get('/download/:token', downloadExport);

// GET /api/export/status/:token - Check if export is still valid
router.get('/status/:token', getExportStatus);

export default router;
