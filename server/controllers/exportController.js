import Well from '../models/Well.js';
import StateConfig from '../models/StateConfig.js';
import { sendExportEmail } from '../services/emailService.js';
import crypto from 'crypto';

// Store pending exports (in production, use Redis or database)
const pendingExports = new Map();

// Request data export
export const requestExport = async (req, res) => {
    try {
        const { stateCode, district, name, email } = req.body;

        if (!stateCode || !name || !email) {
            return res.status(400).json({ message: 'State, name, and email are required' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Get state config for name
        const stateConfig = await StateConfig.findOne({ stateCode });
        if (!stateConfig) {
            return res.status(404).json({ message: 'State not found' });
        }

        // Generate unique export token
        const exportToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

        // Store export request
        pendingExports.set(exportToken, {
            stateCode,
            district: district || null,
            name,
            email,
            stateName: stateConfig.name,
            expiresAt,
            createdAt: Date.now()
        });

        // Generate download link
        const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
        const downloadLink = `${baseUrl}/api/export/download/${exportToken}`;

        // Send email
        await sendExportEmail({
            to: email,
            name,
            downloadLink,
            stateName: stateConfig.name,
            districtName: district || null
        });

        res.json({
            message: 'Export request received. Check your email for the download link.',
            success: true
        });

    } catch (error) {
        console.error('Export request error:', error);
        res.status(500).json({ message: 'Failed to process export request. Please try again.' });
    }
};

// Download exported data
export const downloadExport = async (req, res) => {
    try {
        const { token } = req.params;

        // Get export request
        const exportRequest = pendingExports.get(token);
        if (!exportRequest) {
            return res.status(404).json({ message: 'Export not found or link expired' });
        }

        // Check if expired
        if (Date.now() > exportRequest.expiresAt) {
            pendingExports.delete(token);
            return res.status(410).json({ message: 'Export link has expired. Please request a new export.' });
        }

        // Build query
        const query = { stateCode: exportRequest.stateCode };
        if (exportRequest.district) {
            query.district = exportRequest.district;
        }

        // Fetch wells data
        const wells = await Well.find(query).lean();

        if (wells.length === 0) {
            return res.status(404).json({ message: 'No data found for the specified criteria' });
        }

        // Generate CSV
        const csvRows = [];

        // Header row
        csvRows.push([
            'Well ID',
            'State',
            'District',
            'Block',
            'Latitude',
            'Longitude',
            'Critical Depth (m)',
            'Soil Profile',
            'Reading Dates',
            'Depth Readings (m)'
        ].join(','));

        // Data rows
        for (const well of wells) {
            const readings = well.readings || [];
            const dates = readings.map(r => new Date(r.date).toISOString().split('T')[0]).join('; ');
            const depths = readings.map(r => r.depth).join('; ');
            const soilProfile = (well.soilProfile || []).join(' > ');

            csvRows.push([
                well.wellId,
                exportRequest.stateCode,
                well.district,
                well.block || '',
                well.coordinates?.lat || '',
                well.coordinates?.lng || '',
                well.criticalDepth || 40,
                `"${soilProfile}"`,
                `"${dates}"`,
                `"${depths}"`
            ].join(','));
        }

        const csvContent = csvRows.join('\n');

        // Set response headers for CSV download
        const filename = exportRequest.district
            ? `aquavision_${exportRequest.stateCode}_${exportRequest.district.replace(/\s+/g, '_')}.csv`
            : `aquavision_${exportRequest.stateCode}_all_districts.csv`;

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(csvContent);

    } catch (error) {
        console.error('Export download error:', error);
        res.status(500).json({ message: 'Failed to generate export' });
    }
};

// Get export status
export const getExportStatus = async (req, res) => {
    const { token } = req.params;
    const exportRequest = pendingExports.get(token);

    if (!exportRequest) {
        return res.json({ valid: false, message: 'Export not found' });
    }

    if (Date.now() > exportRequest.expiresAt) {
        return res.json({ valid: false, message: 'Export expired' });
    }

    res.json({ valid: true, expiresAt: exportRequest.expiresAt });
};
