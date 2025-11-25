/* ========================================
   AGRIMATE - Crop Controller
   API endpoints for crop management
   ======================================== */

/**
 * Get all crops
 */
function getAllCrops(db) {
    return async (req, res) => {
        try {
            const crops = await db.collection('crops').find({}).toArray();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, data: crops }));
        } catch (error) {
            handleError(res, error, 'Error fetching crops');
        }
    };
}

/**
 * Get crops by season
 */
function getCropsBySeason(db) {
    return async (req, res) => {
        try {
            const season = req.url.split('=')[1];
            const crops = await db.collection('crops').find({ season: season }).toArray();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, data: crops }));
        } catch (error) {
            handleError(res, error, 'Error fetching crops by season');
        }
    };
}

/**
 * Get crop prices by state and district
 */
function getCropPrices(db) {
    return async (req, res) => {
        try {
            const url = new URL(req.url, 'http://localhost');
            const state = url.searchParams.get('state');
            const district = url.searchParams.get('district');

            let query = {};
            if (state) query.state = state;
            if (district) query.district = district;

            const prices = await db.collection('prices').find(query).toArray();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, data: prices }));
        } catch (error) {
            handleError(res, error, 'Error fetching prices');
        }
    };
}

/**
 * Add new crop price
 */
function addCropPrice(db) {
    return async (req, res) => {
        try {
            let data = '';
            req.on('data', chunk => { data += chunk; });
            req.on('end', async () => {
                const priceData = JSON.parse(data);
                priceData.date = new Date();
                
                const result = await db.collection('prices').insertOne(priceData);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, data: result }));
            });
        } catch (error) {
            handleError(res, error, 'Error adding crop price');
        }
    };
}

/**
 * Get crop recommendations based on soil and region
 */
function getCropRecommendations(db) {
    return async (req, res) => {
        try {
            const url = new URL(req.url, 'http://localhost');
            const pH = url.searchParams.get('pH');
            const rainfall = url.searchParams.get('rainfall');

            // Simple recommendation logic
            const recommendations = [];

            // pH-based recommendations
            if (pH >= 6 && pH <= 7) {
                recommendations.push('Rice', 'Wheat', 'Maize');
            } else if (pH > 7) {
                recommendations.push('Sugarcane', 'Cotton');
            } else {
                recommendations.push('Tea', 'Coffee');
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, data: recommendations }));
        } catch (error) {
            handleError(res, error, 'Error getting recommendations');
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
    getAllCrops,
    getCropsBySeason,
    getCropPrices,
    addCropPrice,
    getCropRecommendations
};
