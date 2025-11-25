/* ========================================
   AGRIMATE - Schemes Model
   Government schemes and subsidies management
   ======================================== */

// Schemes schema reference - see crops.js for full structure
// This file can be used for scheme-specific utilities

const schemeCategories = {
    INSURANCE: 'Insurance',
    SUBSIDY: 'Subsidy',
    LOAN: 'Loan',
    EQUIPMENT: 'Equipment',
    CREDIT: 'Credit',
    TRAINING: 'Training'
};

const sampleSchemes = [
    {
        name: 'PM FASAL Bima Yojana',
        description: 'Crop insurance scheme providing financial support to farmers in case of crop failure due to natural calamities',
        benefits: '100% coverage of yield loss with subsidized premiums',
        eligibility: 'All farmers growing notified crops',
        state: ['All India'],
        category: schemeCategories.INSURANCE,
        link: 'https://pmfby.gov.in',
        minLandHolding: 0.1,
        maxLandHolding: 1000
    },
    {
        name: 'Soil Health Card Scheme',
        description: 'Free soil testing and customized fertilizer recommendations for farmers',
        benefits: 'Free soil testing at registered labs with recommendations',
        eligibility: 'All farmers',
        state: ['All India'],
        category: schemeCategories.TRAINING,
        link: 'https://soilhealth.dac.gov.in',
        minLandHolding: 0,
        maxLandHolding: 1000
    },
    {
        name: 'Pradhan Mantri Krishi Sinchayee Yojana',
        description: 'Irrigation scheme to enhance water use efficiency and crop productivity',
        benefits: '50-90% subsidy on irrigation equipment',
        eligibility: 'Landholding farmers',
        state: ['All India'],
        category: schemeCategories.SUBSIDY,
        link: 'https://pmksy.gov.in',
        minLandHolding: 0.5,
        maxLandHolding: 1000
    },
    {
        name: 'Kisan Vikas Patra',
        description: 'Investment scheme for farmers with assured returns and tax benefits',
        benefits: '7.6% interest rate with tax benefits under Section 80C',
        eligibility: 'Indian farmers and residents',
        state: ['All India'],
        category: schemeCategories.CREDIT,
        link: 'https://www.indiapost.gov.in',
        minLandHolding: 0,
        maxLandHolding: 1000
    },
    {
        name: 'Subsidy for Agricultural Tools',
        description: 'Government subsidy on modern farming equipment and tools',
        benefits: '40-50% subsidy on tools and machinery',
        eligibility: 'Small and marginal farmers',
        state: ['Tamil Nadu', 'Karnataka', 'Maharashtra'],
        category: schemeCategories.EQUIPMENT,
        link: '#',
        minLandHolding: 0.1,
        maxLandHolding: 2
    },
    {
        name: 'Drone Technology Subsidy',
        description: 'Subsidy on agricultural drones for crop monitoring and spraying',
        benefits: '50% subsidy on drone purchases',
        eligibility: 'Cooperative groups and farmers groups',
        state: ['All India'],
        category: schemeCategories.SUBSIDY,
        link: '#',
        minLandHolding: 2,
        maxLandHolding: 1000
    },
    {
        name: 'Organic Farming Subsidy',
        description: 'Support for farmers transitioning to organic farming practices',
        benefits: '₹20,000-50,000 subsidy over 3 years',
        eligibility: 'Farmers willing to practice organic farming',
        state: ['All India'],
        category: schemeCategories.SUBSIDY,
        link: 'https://nmsa.dac.gov.in',
        minLandHolding: 0.5,
        maxLandHolding: 50
    },
    {
        name: 'Kisan Credit Card',
        description: 'Flexible credit facility for agricultural needs',
        benefits: 'Easy access to credit for farm operations',
        eligibility: 'Farmers with agricultural land',
        state: ['All India'],
        category: schemeCategories.LOAN,
        link: 'https://www.rbi.org.in',
        minLandHolding: 0,
        maxLandHolding: 1000
    }
];

module.exports = {
    schemeCategories,
    sampleSchemes
};
