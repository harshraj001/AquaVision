import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import models
import StateConfig from '../models/StateConfig.js';
import Well from '../models/Well.js';

// District coordinates (approximate centers for Punjab districts)
const districtCoordinates = {
    'AMRITSAR': { lat: 31.6340, lng: 74.8723 },
    'BARNALA': { lat: 30.3819, lng: 75.5479 },
    'BATHINDA': { lat: 30.2110, lng: 74.9455 },
    'FARIDKOT': { lat: 30.6768, lng: 74.7583 },
    'FATEHGARH SAHIB': { lat: 30.6454, lng: 76.3919 },
    'FAZILKA': { lat: 30.4036, lng: 74.0278 },
    'FIROZPUR': { lat: 30.9214, lng: 74.6135 },
    'GURDASPUR': { lat: 32.0408, lng: 75.4022 },
    'HOSHIARPUR': { lat: 31.5143, lng: 75.9115 },
    'JALANDHAR': { lat: 31.3260, lng: 75.5762 },
    'KAPURTHALA': { lat: 31.3808, lng: 75.3818 },
    'LUDHIANA': { lat: 30.9010, lng: 75.8573 },
    'MANSA': { lat: 29.9985, lng: 75.3948 },
    'MOGA': { lat: 30.8164, lng: 75.1722 },
    'MUKTSAR': { lat: 30.4723, lng: 74.5160 },
    'PATHANKOT': { lat: 32.2643, lng: 75.6421 },
    'PATIALA': { lat: 30.3398, lng: 76.3869 },
    'RUPNAGAR': { lat: 30.9660, lng: 76.5260 },
    'SANGRUR': { lat: 30.2458, lng: 75.8421 },
    'SAS NAGAR': { lat: 30.7046, lng: 76.7179 },
    'SBS NAGAR': { lat: 31.1248, lng: 76.1190 },
    'TARAN TARAN': { lat: 31.4509, lng: 74.9316 }
};

// Generate random offset for well coordinates (to spread markers within district)
const getWellCoordinates = (district, index) => {
    const base = districtCoordinates[district] || { lat: 30.9, lng: 75.8 };
    // Add small random offset (up to 0.15 degrees ~15km)
    const offset = {
        lat: (Math.random() - 0.5) * 0.3,
        lng: (Math.random() - 0.5) * 0.3
    };
    return {
        lat: base.lat + offset.lat,
        lng: base.lng + offset.lng
    };
};

// Default soil profiles based on Punjab geology
const getSoilProfile = (district) => {
    const profiles = {
        'GURDASPUR': ['Topsoil', 'Sandy Loam', 'Gravel', 'Clay'],
        'PATHANKOT': ['Topsoil', 'Boulders', 'Gravel', 'Sand'],
        'HOSHIARPUR': ['Topsoil', 'Sandy Loam', 'Fine Sand', 'Clay'],
        'RUPNAGAR': ['Topsoil', 'Gravel', 'Coarse Sand', 'Clay'],
        'SAS NAGAR': ['Topsoil', 'Sandy Loam', 'Fine Sand', 'Clay'],
        'SANGRUR': ['Topsoil', 'Fine Sand', 'Silt', 'Clay'],
        'BARNALA': ['Topsoil', 'Fine Sand', 'Clay'],
        'BATHINDA': ['Topsoil', 'Fine Sand', 'Coarse Sand', 'Clay'],
        'MANSA': ['Topsoil', 'Fine Sand', 'Sandy Clay'],
        'FAZILKA': ['Topsoil', 'Sand', 'Silt'],
        'default': ['Topsoil', 'Fine Sand', 'Silt', 'Clay']
    };
    return profiles[district] || profiles['default'];
};

const importPunjabCSV = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Read CSV file
        const csvPath = path.resolve(__dirname, '../../PB.csv');
        console.log(`📂 Reading CSV from: ${csvPath}`);

        if (!fs.existsSync(csvPath)) {
            console.error('❌ CSV file not found:', csvPath);
            process.exit(1);
        }

        const csvContent = fs.readFileSync(csvPath, 'utf-8');

        // Parse CSV
        const records = parse(csvContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true
        });

        console.log(`📊 Found ${records.length} well records`);

        // First, ensure Punjab state config exists
        const punjabConfig = {
            stateCode: 'IN-PB',
            name: 'Punjab',
            mapCenter: { lat: 31.1471, lng: 75.3412 },
            zoomLevel: 8,
            geology: {
                dominantSoil: 'Alluvial',
                description: 'Indo-Gangetic plains with fertile alluvial deposits. Major aquifer systems include the Quaternary alluvium with high groundwater potential.'
            }
        };

        await StateConfig.findOneAndUpdate(
            { stateCode: 'IN-PB' },
            punjabConfig,
            { upsert: true, new: true }
        );
        console.log('✓ Punjab state config updated');

        // Delete existing Punjab wells to avoid duplicates
        const deleteResult = await Well.deleteMany({ stateCode: 'IN-PB' });
        console.log(`🗑️  Removed ${deleteResult.deletedCount} existing Punjab wells`);

        // Process each well record
        const wells = [];
        const districts = new Set();

        for (let i = 0; i < records.length; i++) {
            const record = records[i];

            const district = record['District']?.trim().toUpperCase();
            const wellName = record['Well Name']?.trim();

            if (!district || !wellName) continue;

            districts.add(district);

            // Parse depth readings (handling empty values)
            const readings = [];

            const jun2023 = parseFloat(record['Jun, 2023 (m bgl)']);
            const aug2023 = parseFloat(record['Aug, 2023 (m bgl)']);
            const nov2023 = parseFloat(record['Nov, 2023 (m bgl)']);
            const jan2024 = parseFloat(record['Jan, 2024 (m bgl)']);

            if (!isNaN(jun2023)) readings.push({ date: new Date('2023-06-01'), depth: jun2023 });
            if (!isNaN(aug2023)) readings.push({ date: new Date('2023-08-01'), depth: aug2023 });
            if (!isNaN(nov2023)) readings.push({ date: new Date('2023-11-01'), depth: nov2023 });
            if (!isNaN(jan2024)) readings.push({ date: new Date('2024-01-01'), depth: jan2024 });

            // Skip wells with no readings
            if (readings.length === 0) {
                console.log(`   ⚠️ Skipping ${wellName} - no valid readings`);
                continue;
            }

            // Generate well ID
            const districtAbbr = district.substring(0, 3);
            const wellId = `PB-${districtAbbr}-${String(i + 1).padStart(3, '0')}`;

            // Calculate critical depth (use average * 1.5 or 40m, whichever is higher)
            const avgDepth = readings.reduce((sum, r) => sum + r.depth, 0) / readings.length;
            const criticalDepth = Math.max(40, Math.round(avgDepth * 1.5));

            wells.push({
                wellId,
                stateCode: 'IN-PB',
                district: district.split(' ').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' '),
                block: wellName,
                coordinates: getWellCoordinates(district, i),
                soilProfile: getSoilProfile(district),
                criticalDepth,
                readings
            });

            // Progress indicator
            if ((i + 1) % 100 === 0) {
                process.stdout.write(`   Processing ${i + 1}/${records.length} wells...\r`);
            }
        }

        console.log(`\n📦 Prepared ${wells.length} wells for insertion`);
        console.log(`📍 Districts found: ${[...districts].join(', ')}`);

        // Bulk insert wells
        if (wells.length > 0) {
            await Well.insertMany(wells);
            console.log(`✅ Inserted ${wells.length} wells into MongoDB`);
        }

        // Summary
        const stateCount = await StateConfig.countDocuments();
        const totalWells = await Well.countDocuments({ stateCode: 'IN-PB' });

        console.log('\n✅ Punjab data import completed!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`   Punjab Wells in DB: ${totalWells}`);
        console.log(`   Districts covered:  ${districts.size}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        process.exit(0);
    } catch (error) {
        console.error('❌ Import error:', error.message);
        process.exit(1);
    }
};

importPunjabCSV();
