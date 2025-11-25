/* ========================================
   AGRIMATE - Scheme Controller
   API endpoints for government schemes
   ======================================== */

/**
 * Get all schemes
 */
function getAllSchemes(db) {
    return async (req, res) => {
        try {
            const schemes = await db.collection('schemes').find({}).toArray();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, data: schemes }));
        } catch (error) {
            handleError(res, error, 'Error fetching schemes');
        }
    };
}

/**
 * Get schemes by state
 */
function getSchemesByState(db) {
    return async (req, res) => {
        try {
            const url = new URL(req.url, 'http://localhost');
            const state = url.searchParams.get('state');

            let query = {};
            if (state) {
                query.state = { $in: [state, 'All India'] };
            }

            const schemes = await db.collection('schemes').find(query).toArray();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, data: schemes }));
        } catch (error) {
            handleError(res, error, 'Error fetching schemes by state');
        }
    };
}

/**
 * Get schemes by category
 */
function getSchemesByCategory(db) {
    return async (req, res) => {
        try {
            const url = new URL(req.url, 'http://localhost');
            const category = url.searchParams.get('category');

            const schemes = await db.collection('schemes').find({ category: category }).toArray();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, data: schemes }));
        } catch (error) {
            handleError(res, error, 'Error fetching schemes by category');
        }
    };
}

/**
 * Get scheme eligibility based on farmer details
 */
function checkEligibility(db) {
    return async (req, res) => {
        try {
            let data = '';
            req.on('data', chunk => { data += chunk; });
            req.on('end', async () => {
                const farmerData = JSON.parse(data);
                const { state, landHolding, income } = farmerData;

                // Find eligible schemes
                const schemes = await db.collection('schemes').find({
                    state: { $in: [state, 'All India'] },
                    minLandHolding: { $lte: landHolding },
                    maxLandHolding: { $gte: landHolding }
                }).toArray();

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: true, 
                    data: schemes,
                    eligibleCount: schemes.length
                }));
            });
        } catch (error) {
            handleError(res, error, 'Error checking eligibility');
        }
    };
}

/**
 * Add new scheme (admin only)
 */
function addScheme(db) {
    return async (req, res) => {
        try {
            let data = '';
            req.on('data', chunk => { data += chunk; });
            req.on('end', async () => {
                const schemeData = JSON.parse(data);
                schemeData.createdAt = new Date();
                schemeData.updatedAt = new Date();

                const result = await db.collection('schemes').insertOne(schemeData);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, data: result }));
            });
        } catch (error) {
            handleError(res, error, 'Error adding scheme');
        }
    };
}

/**
 * Update scheme (admin only)
 */
function updateScheme(db) {
    return async (req, res) => {
        try {
            let data = '';
            req.on('data', chunk => { data += chunk; });
            req.on('end', async () => {
                const schemeData = JSON.parse(data);
                const { _id } = schemeData;
                schemeData.updatedAt = new Date();
                
                delete schemeData._id;

                const result = await db.collection('schemes').updateOne(
                    { _id: new (require('mongodb')).ObjectId(_id) },
                    { $set: schemeData }
                );

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, data: result }));
            });
        } catch (error) {
            handleError(res, error, 'Error updating scheme');
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
    getAllSchemes,
    getSchemesByState,
    getSchemesByCategory,
    checkEligibility,
    addScheme,
    updateScheme
};
