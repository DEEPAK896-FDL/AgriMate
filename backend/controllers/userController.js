/* ========================================
   AGRIMATE - User Controller
   API endpoints for user management
   ======================================== */

/**
 * Get user profile
 */
function getUserProfile(db) {
    return async (req, res) => {
        try {
            const url = new URL(req.url, 'http://localhost');
            const userId = url.searchParams.get('id');

            if (!userId) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'User ID required' }));
                return;
            }

            const ObjectId = require('mongodb').ObjectId;
            const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

            if (!user) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'User not found' }));
                return;
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, data: user }));
        } catch (error) {
            handleError(res, error, 'Error fetching user profile');
        }
    };
}

/**
 * Create new user account
 */
function createUser(db) {
    return async (req, res) => {
        try {
            let data = '';
            req.on('data', chunk => { data += chunk; });
            req.on('end', async () => {
                try {
                    const userData = JSON.parse(data);
                    userData.createdAt = new Date();
                    userData.updatedAt = new Date();
                    userData.bookmarkedSchemes = [];
                    userData.soilTestResults = [];

                    // Check if user exists
                    const existing = await db.collection('users').findOne({ email: userData.email });
                    if (existing) {
                        res.writeHead(409, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: false, message: 'User already exists' }));
                        return;
                    }

                    const result = await db.collection('users').insertOne(userData);
                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, data: result }));
                } catch (error) {
                    handleError(res, error, 'Error in user creation');
                }
            });
        } catch (error) {
            handleError(res, error, 'Error creating user');
        }
    };
}

/**
 * Update user profile
 */
function updateUserProfile(db) {
    return async (req, res) => {
        try {
            let data = '';
            req.on('data', chunk => { data += chunk; });
            req.on('end', async () => {
                try {
                    const userData = JSON.parse(data);
                    const { _id } = userData;
                    userData.updatedAt = new Date();
                    
                    delete userData._id;

                    const ObjectId = require('mongodb').ObjectId;
                    const result = await db.collection('users').updateOne(
                        { _id: new ObjectId(_id) },
                        { $set: userData }
                    );

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, data: result }));
                } catch (error) {
                    handleError(res, error, 'Error updating profile');
                }
            });
        } catch (error) {
            handleError(res, error, 'Error in profile update');
        }
    };
}

/**
 * Bookmark a scheme
 */
function bookmarkScheme(db) {
    return async (req, res) => {
        try {
            let data = '';
            req.on('data', chunk => { data += chunk; });
            req.on('end', async () => {
                try {
                    const { userId, schemeId } = JSON.parse(data);
                    const ObjectId = require('mongodb').ObjectId;

                    const result = await db.collection('users').updateOne(
                        { _id: new ObjectId(userId) },
                        { $addToSet: { bookmarkedSchemes: new ObjectId(schemeId) } }
                    );

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, data: result }));
                } catch (error) {
                    handleError(res, error, 'Error bookmarking scheme');
                }
            });
        } catch (error) {
            handleError(res, error, 'Error in bookmark operation');
        }
    };
}

/**
 * Save soil test result
 */
function saveSoilTestResult(db) {
    return async (req, res) => {
        try {
            let data = '';
            req.on('data', chunk => { data += chunk; });
            req.on('end', async () => {
                try {
                    const { userId, soilData } = JSON.parse(data);
                    const ObjectId = require('mongodb').ObjectId;

                    soilData.testDate = new Date();

                    const result = await db.collection('users').updateOne(
                        { _id: new ObjectId(userId) },
                        { $push: { soilTestResults: soilData } }
                    );

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, data: result }));
                } catch (error) {
                    handleError(res, error, 'Error saving soil test');
                }
            });
        } catch (error) {
            handleError(res, error, 'Error in soil test operation');
        }
    };
}

/**
 * Get user statistics
 */
function getUserStats(db) {
    return async (req, res) => {
        try {
            const url = new URL(req.url, 'http://localhost');
            const userId = url.searchParams.get('id');

            if (!userId) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'User ID required' }));
                return;
            }

            const ObjectId = require('mongodb').ObjectId;
            const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

            if (!user) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'User not found' }));
                return;
            }

            const stats = {
                landHolding: user.landHolding,
                cropsCultivated: user.cropsCultivated.length,
                bookmarkedSchemes: user.bookmarkedSchemes.length,
                soilTestsDone: user.soilTestResults.length,
                memberSince: user.createdAt
            };

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, data: stats }));
        } catch (error) {
            handleError(res, error, 'Error fetching user stats');
        }
    };
}

/**
 * Error handler
 */
function handleError(res, error, message) {
    console.error(message, error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, message: message, error: error.message }));
}

module.exports = {
    getUserProfile,
    createUser,
    updateUserProfile,
    bookmarkScheme,
    saveSoilTestResult,
    getUserStats
};
