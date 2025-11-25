/* ========================================
   AGRIMATE - Crop Schema Model
   MongoDB crop data structure
   ======================================== */

const cropSchema = {
    _id: 'ObjectId',
    name: 'String', // Crop name (Rice, Wheat, etc.)
    season: 'String', // Kharif, Rabi, Summer
    regions: ['String'], // Regions where grown
    states: ['String'], // States where grown
    waterRequirement: 'String', // Water needed
    temperature: 'String', // Optimal temperature
    humidity: 'String', // Optimal humidity
    soilType: 'String', // Type of soil needed
    yield: 'String', // Expected yield per hectare
    sowingMonth: ['String'], // Best months to sow
    harvestMonth: ['String'], // Harvest months
    pests: ['String'], // Common pests
    diseases: ['String'], // Common diseases
    fertilizer: 'Object', // NPK requirements
    price: 'Number', // Current market price
    createdAt: 'Date',
    updatedAt: 'Date'
};

const schemeSchema = {
    _id: 'ObjectId',
    name: 'String', // Scheme name
    description: 'String', // Full description
    benefits: 'String', // Benefits offered
    eligibility: 'String', // Eligibility criteria
    state: ['String'], // States where applicable
    category: 'String', // Category (Insurance, Subsidy, etc.)
    link: 'String', // Official link
    contactPhone: 'String',
    contactEmail: 'String',
    minLandHolding: 'Number', // Minimum land required (in acres)
    maxLandHolding: 'Number', // Maximum land allowed (in acres)
    applicationDeadline: 'Date',
    createdAt: 'Date',
    updatedAt: 'Date'
};

const userSchema = {
    _id: 'ObjectId',
    name: 'String',
    email: 'String', // Unique email
    phone: 'String',
    state: 'String',
    district: 'String',
    landHolding: 'Number', // In acres
    cropsCultivated: ['String'],
    password: 'String', // Hashed
    language: 'String', // en or ta
    bookmarkedSchemes: ['ObjectId'],
    marketplaceProducts: ['ObjectId'],
    soilTestResults: ['Object'],
    createdAt: 'Date',
    updatedAt: 'Date'
};

const priceSchema = {
    _id: 'ObjectId',
    crop: 'String',
    state: 'String',
    district: 'String',
    market: 'String',
    price: 'Number',
    unit: 'String', // 50kg, 100pcs, etc.
    date: 'Date',
    trend: 'String', // up, down, stable
    changePercent: 'Number',
    minPrice: 'Number',
    maxPrice: 'Number',
    avgPrice: 'Number'
};

const marketplaceProductSchema = {
    _id: 'ObjectId',
    userId: 'ObjectId',
    productType: 'String', // crop, seeds, equipment
    productName: 'String',
    description: 'String',
    quantity: 'Number',
    unit: 'String',
    price: 'Number',
    pricePerUnit: 'Number',
    image: 'String', // Image URL
    location: 'String',
    district: 'String',
    state: 'String',
    contact: 'String',
    phone: 'String',
    listedDate: 'Date',
    status: 'String' // active, sold, expired
};

// Export schemas for reference
module.exports = {
    cropSchema,
    schemeSchema,
    userSchema,
    priceSchema,
    marketplaceProductSchema
};
