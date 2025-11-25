/* ========================================
   AGRIMATE - MongoDB Connection Module
   Database initialization and configuration
   ======================================== */

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

// MongoDB Connection Configuration
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/AgriMate';
const DB_NAME = process.env.DB_NAME || 'AgriMate';

let client;
let db;

/**
 * Connect to MongoDB
 */
async function connectToDatabase() {
    try {
        client = new MongoClient(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000
        });

        await client.connect();
        db = client.db(DB_NAME);

        console.log('✓ Connected to MongoDB at:', MONGO_URL);
        
        // Initialize collections and indexes
        await initializeCollections();
        
        return db;
    } catch (error) {
        console.error('✗ MongoDB Connection Error:', error.message);
        console.log('⚠ Continuing with fallback in-memory database...');
        return null;
    }
}

/**
 * Initialize database collections and sample data
 */
async function initializeCollections() {
    try {
        const collections = ['crops', 'schemes', 'users', 'prices', 'marketplace'];

        for (const collName of collections) {
            const exists = await db.listCollections({ name: collName }).toArray();
            if (exists.length === 0) {
                await db.createCollection(collName);
                console.log(`✓ Created collection: ${collName}`);
            }
        }

        // Create indexes
        await db.collection('crops').createIndex({ 'name': 1 });
        await db.collection('schemes').createIndex({ 'state': 1 });
        await db.collection('users').createIndex({ 'email': 1 }, { unique: true });

        // Insert sample data if empty
        await insertSampleData();

    } catch (error) {
        console.error('Error initializing collections:', error);
    }
}

/**
 * Insert sample data
 */
async function insertSampleData() {
    try {
        // Sample crops data
        const cropsCollection = db.collection('crops');
        const cropsCount = await cropsCollection.countDocuments();

        if (cropsCount === 0) {
            const cropsData = [
                {
                    name: 'Rice',
                    season: 'Kharif',
                    regions: ['Tamil Nadu', 'Karnataka', 'Punjab'],
                    waterRequirement: '1200-1500mm',
                    temperature: '21-37°C',
                    yield: '50-60 quintals/hectare'
                },
                {
                    name: 'Wheat',
                    season: 'Rabi',
                    regions: ['Punjab', 'Rajasthan', 'Uttar Pradesh'],
                    waterRequirement: '400-500mm',
                    temperature: '15-20°C',
                    yield: '40-50 quintals/hectare'
                },
                {
                    name: 'Cotton',
                    season: 'Kharif',
                    regions: ['Maharashtra', 'Gujarat', 'Telangana'],
                    waterRequirement: '400-600mm',
                    temperature: '21-30°C',
                    yield: '15-20 quintals/hectare'
                }
            ];

            await cropsCollection.insertMany(cropsData);
            console.log('✓ Inserted sample crops data');
        }

        // Sample schemes data
        const schemesCollection = db.collection('schemes');
        const schemesCount = await schemesCollection.countDocuments();

        if (schemesCount === 0) {
            const schemesData = [
                {
                    name: 'PM FASAL Bima Yojana',
                    description: 'Crop insurance scheme',
                    benefits: 'Financial support for crop failure',
                    eligibility: 'All farmers',
                    state: 'All India',
                    link: 'https://pmfby.gov.in'
                },
                {
                    name: 'Soil Health Card Scheme',
                    description: 'Free soil testing',
                    benefits: 'Fertilizer recommendations',
                    eligibility: 'All farmers',
                    state: 'All India',
                    link: 'https://soilhealth.dac.gov.in'
                }
            ];

            await schemesCollection.insertMany(schemesData);
            console.log('✓ Inserted sample schemes data');
        }

    } catch (error) {
        console.error('Error inserting sample data:', error);
    }
}

/**
 * Get database connection
 */
function getDatabase() {
    if (!db) {
        throw new Error('Database connection not established');
    }
    return db;
}

/**
 * Close database connection
 */
async function closeDatabase() {
    try {
        if (client) {
            await client.close();
            console.log('✓ Database connection closed');
        }
    } catch (error) {
        console.error('Error closing database connection:', error);
    }
}

module.exports = {
    connectToDatabase,
    getDatabase,
    closeDatabase
};
