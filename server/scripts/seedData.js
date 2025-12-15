import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import models
import StateConfig from '../models/StateConfig.js';
import Well from '../models/Well.js';

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get data file path from env or use default
    const dataFilePath = process.env.DATA_FILE_PATH || '../../data/seed-data.json';
    const absolutePath = path.resolve(__dirname, dataFilePath);

    console.log(`📂 Reading data from: ${absolutePath}`);

    // Check if file exists
    if (!fs.existsSync(absolutePath)) {
      console.error('❌ Data file not found:', absolutePath);
      console.log('\n📝 Please create a seed-data.json file with the following structure:');
      console.log(`
{
  "states": [
    {
      "stateCode": "IN-PB",
      "name": "Punjab",
      "mapCenter": { "lat": 31.1471, "lng": 75.3412 },
      "zoomLevel": 8,
      "geology": {
        "dominantSoil": "Alluvial",
        "description": "Indo-Gangetic plains with alluvial deposits"
      }
    }
  ],
  "wells": [
    {
      "wellId": "PB-SNG-001",
      "stateCode": "IN-PB",
      "district": "Sangrur",
      "block": "Sangrur",
      "coordinates": { "lat": 30.2458, "lng": 75.8421 },
      "soilProfile": ["Topsoil", "Fine Sand", "Clay"],
      "criticalDepth": 40,
      "readings": [
        { "date": "2023-06-01", "depth": 25 },
        { "date": "2023-11-01", "depth": 35 }
      ]
    }
  ]
}
      `);
      process.exit(1);
    }

    // Read and parse JSON file
    const rawData = fs.readFileSync(absolutePath, 'utf-8');
    const data = JSON.parse(rawData);

    // Validate data structure
    if (!data.states || !Array.isArray(data.states)) {
      console.error('❌ Invalid data: "states" array is required');
      process.exit(1);
    }

    if (!data.wells || !Array.isArray(data.wells)) {
      console.error('❌ Invalid data: "wells" array is required');
      process.exit(1);
    }

    console.log(`\n📊 Found ${data.states.length} states and ${data.wells.length} wells`);

    // Upsert States
    console.log('\n🔄 Upserting states...');
    for (const state of data.states) {
      await StateConfig.findOneAndUpdate(
        { stateCode: state.stateCode },
        state,
        { upsert: true, new: true }
      );
      console.log(`   ✓ ${state.name} (${state.stateCode})`);
    }

    // Upsert Wells
    console.log('\n🔄 Upserting wells...');
    let wellCount = 0;
    for (const well of data.wells) {
      // Convert date strings to Date objects
      if (well.readings) {
        well.readings = well.readings.map(r => ({
          date: new Date(r.date),
          depth: r.depth
        }));
      }

      await Well.findOneAndUpdate(
        { wellId: well.wellId },
        well,
        { upsert: true, new: true }
      );
      wellCount++;

      // Progress indicator
      if (wellCount % 10 === 0) {
        process.stdout.write(`   Processed ${wellCount}/${data.wells.length} wells\r`);
      }
    }
    console.log(`   ✓ Processed ${wellCount} wells                    `);

    // Summary
    const stateCount = await StateConfig.countDocuments();
    const totalWells = await Well.countDocuments();

    console.log('\n✅ Seeding completed successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   Total States in DB: ${stateCount}`);
    console.log(`   Total Wells in DB:  ${totalWells}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

seedData();
