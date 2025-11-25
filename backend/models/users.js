/* ========================================
   AGRIMATE - Users Model
   User account and profile management
   ======================================== */

const sampleUsers = [
    {
        name: 'Rajesh Kumar',
        email: 'rajesh@example.com',
        phone: '9876543210',
        state: 'Tamil Nadu',
        district: 'Coimbatore',
        landHolding: 2.5,
        cropsCultivated: ['Rice', 'Cotton', 'Groundnut'],
        language: 'en',
        bookmarkedSchemes: [],
        soilTestResults: [],
        createdAt: new Date()
    },
    {
        name: 'Lakshmi Devi',
        email: 'lakshmi@example.com',
        phone: '8765432109',
        state: 'Karnataka',
        district: 'Bengaluru',
        landHolding: 1.5,
        cropsCultivated: ['Coffee', 'Pepper'],
        language: 'ta',
        bookmarkedSchemes: [],
        soilTestResults: [],
        createdAt: new Date()
    }
];

const userRoles = {
    FARMER: 'farmer',
    ADMIN: 'admin',
    AGGREGATOR: 'aggregator'
};

const userPreferences = {
    LANGUAGE: 'language', // en, ta, hi
    NOTIFICATIONS: 'notifications', // true/false
    UNITS: 'units', // metric, imperial
    THEME: 'theme' // light, dark
};

module.exports = {
    sampleUsers,
    userRoles,
    userPreferences
};
