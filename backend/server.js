/* ========================================
   AGRIMATE - Node.js Server (No Express)
   Plain Node.js HTTP server with routing
   ======================================== */

const http = require('http');
const url = require('url');
const { connectToDatabase, getDatabase } = require('./db/mongoConnection');
const cropController = require('./controllers/cropController');
const schemeController = require('./controllers/schemeController');
const userController = require('./controllers/userController');

const PORT = process.env.PORT || 3000;
const HOSTNAME = '0.0.0.0';

let db = null;

/**
 * Request router
 */
function router(req, res, pathname) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // API Routes
    try {
        // Crop routes
        if (pathname === '/api/crops' && req.method === 'GET') {
            return cropController.getAllCrops(db)(req, res);
        }
        if (pathname.startsWith('/api/crops/season') && req.method === 'GET') {
            return cropController.getCropsBySeason(db)(req, res);
        }
        if (pathname.startsWith('/api/prices') && req.method === 'GET') {
            return cropController.getCropPrices(db)(req, res);
        }
        if (pathname === '/api/prices' && req.method === 'POST') {
            return cropController.addCropPrice(db)(req, res);
        }
        if (pathname.startsWith('/api/crops/recommendations') && req.method === 'GET') {
            return cropController.getCropRecommendations(db)(req, res);
        }

        // Scheme routes
        if (pathname === '/api/schemes' && req.method === 'GET') {
            return schemeController.getAllSchemes(db)(req, res);
        }
        if (pathname.startsWith('/api/schemes/state') && req.method === 'GET') {
            return schemeController.getSchemesByState(db)(req, res);
        }
        if (pathname.startsWith('/api/schemes/category') && req.method === 'GET') {
            return schemeController.getSchemesByCategory(db)(req, res);
        }
        if (pathname === '/api/schemes/eligibility' && req.method === 'POST') {
            return schemeController.checkEligibility(db)(req, res);
        }
        if (pathname === '/api/schemes' && req.method === 'POST') {
            return schemeController.addScheme(db)(req, res);
        }
        if (pathname === '/api/schemes' && req.method === 'PUT') {
            return schemeController.updateScheme(db)(req, res);
        }

        // User routes
        if (pathname.startsWith('/api/users/profile') && req.method === 'GET') {
            return userController.getUserProfile(db)(req, res);
        }
        if (pathname === '/api/users' && req.method === 'POST') {
            return userController.createUser(db)(req, res);
        }
        if (pathname === '/api/users' && req.method === 'PUT') {
            return userController.updateUserProfile(db)(req, res);
        }
        if (pathname === '/api/users/bookmark' && req.method === 'POST') {
            return userController.bookmarkScheme(db)(req, res);
        }
        if (pathname === '/api/users/soil-test' && req.method === 'POST') {
            return userController.saveSoilTestResult(db)(req, res);
        }
        if (pathname.startsWith('/api/users/stats') && req.method === 'GET') {
            return userController.getUserStats(db)(req, res);
        }

        // Health check
        if (pathname === '/api/health' && req.method === 'GET') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                status: 'ok', 
                timestamp: new Date().toISOString(),
                database: db ? 'connected' : 'disconnected'
            }));
            return;
        }

        // 404 Not Found
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            success: false, 
            message: 'Route not found',
            path: pathname,
            method: req.method
        }));

    } catch (error) {
        console.error('Routing error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            success: false, 
            message: 'Internal server error',
            error: error.message
        }));
    }
}

/**
 * Create server
 */
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    console.log(`${new Date().toISOString()} - ${req.method} ${pathname}`);

    router(req, res, pathname);
});

/**
 * Start server
 */
async function startServer() {
    try {
        // Connect to MongoDB
        db = await connectToDatabase();

        if (!db) {
            console.warn('⚠ Running without MongoDB - using in-memory storage');
        }

        server.listen(PORT, HOSTNAME, () => {
            console.log(`
╔════════════════════════════════════════════╗
║    AGRIMATE - Smart Farming Support     ║
║            Server Started                 ║
╚════════════════════════════════════════════╝

✓ Server running at: http://${HOSTNAME}:${PORT}
✓ API Base URL: http://localhost:${PORT}/api
✓ Health Check: http://localhost:${PORT}/api/health

📦 Available Endpoints:
   GET    /api/crops
   GET    /api/prices?state=STATE&district=DISTRICT
   GET    /api/schemes
   GET    /api/schemes/state?state=STATE
   POST   /api/schemes/eligibility
   GET    /api/users/profile?id=USER_ID
   POST   /api/users
   PUT    /api/users

Press Ctrl+C to stop the server
            `);
        });

        // Handle graceful shutdown
        process.on('SIGTERM', async () => {
            console.log('\\nGraceful shutdown initiated...');
            server.close(() => {
                console.log('✓ Server closed');
                process.exit(0);
            });
        });

    } catch (error) {
        console.error('✗ Failed to start server:', error);
        process.exit(1);
    }
}

// Start the server
startServer();

// Handle uncaught errors
process.on('uncaughtException', (error) => {
    console.error('✗ Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('✗ Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

module.exports = server;
