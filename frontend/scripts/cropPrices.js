/* ========================================
   AGRIMATE - Crop Prices Management
   Dynamic pricing from database
   ======================================== */

class CropPricesManager {
    constructor() {
        this.pricesGrid = document.getElementById('pricesGrid');
        this.stateSelect = document.getElementById('stateSelect');
        this.districtSelect = document.getElementById('districtSelect');
        this.apiUrl = 'http://localhost:3000/api';
        this.prices = [];
        this.init();
    }

    init() {
        try {
            this.stateSelect.addEventListener('change', (e) => this.onStateChange(e));
            this.loadPrices();
            console.log('✓ Crop Prices Manager initialized');
        } catch (error) {
            console.error('✗ Crop Prices Manager error:', error);
        }
    }

    onStateChange(event) {
        try {
            const state = event.target.value;
            this.updateDistricts(state);
            this.loadPrices();
        } catch (error) {
            console.error('Error on state change:', error);
        }
    }

    updateDistricts(state) {
        try {
            const districts = {
                'tamil-nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruppur', 'Erode', 'Salem'],
                'karnataka': ['Bangalore', 'Mysore', 'Belgaum', 'Hubli', 'Mangalore'],
                'maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Aurangabad', 'Nashik'],
                'punjab': ['Amritsar', 'Ludhiana', 'Jalandhar', 'Patiala', 'Bathinda'],
                'rajasthan': ['Jaipur', 'Jodhpur', 'Ajmer', 'Bikaner', 'Kota']
            };

            const districtList = districts[state] || [];
            this.districtSelect.innerHTML = '<option value="">Select District</option>';

            districtList.forEach(district => {
                const option = document.createElement('option');
                // keep original casing for district value to match mock data keys
                option.value = district;
                option.textContent = district;
                this.districtSelect.appendChild(option);
            });

            this.districtSelect.addEventListener('change', () => this.loadPrices());
        } catch (error) {
            console.error('Error updating districts:', error);
        }
    }

    loadPrices() {
        try {
            const state = this.stateSelect.value;
            const district = this.districtSelect.value;

            // Show loading state
            this.pricesGrid.innerHTML = '<div class="loading"></div>'.repeat(4);

            // Try to fetch from server, fallback to mock data
            this.fetchPricesFromServer(state, district)
                .catch(() => this.getMockPrices(state, district))
                .then(prices => this.displayPrices(prices));

        } catch (error) {
            console.error('Error loading prices:', error);
            this.pricesGrid.innerHTML = '<p>Error loading prices. Please try again.</p>';
        }
    }

    fetchPricesFromServer(state, district) {
        return fetch(`${this.apiUrl}/prices?state=${state}&district=${district}`)
            .then(res => {
                if (!res.ok) throw new Error('Server error');
                return res.json();
            });
    }

    getMockPrices(state, district) {
        // Return mock data for offline support
        return new Promise(resolve => {
            setTimeout(() => {
                const mockData = {
                    'tamil-nadu': {
                        'Chennai': [
                            { id: 1, crop: 'Rice', price: 2500, unit: '50kg', market: 'Koyambedu Market', trend: '↑', change: '+5%' },
                            { id: 2, crop: 'Coconut', price: 1800, unit: '100pcs', market: 'Koyambedu Market', trend: '↓', change: '-2%' }
                        ],
                        'Coimbatore': [
                            { id: 3, crop: 'Rice', price: 2400, unit: '50kg', market: 'Coimbatore APMCs', trend: '↑', change: '+3%' },
                            { id: 4, crop: 'Cotton', price: 5800, unit: '100kg', market: 'Coimbatore APMCs', trend: '↑', change: '+6%' }
                        ],
                        'Madurai': [
                            { id: 5, crop: 'Rice', price: 2300, unit: '50kg', market: 'Madurai Market', trend: '→', change: '0%' }
                        ]
                    },
                    'karnataka': {
                        'Bangalore': [
                            { id: 6, crop: 'Rice', price: 2600, unit: '50kg', market: 'Bangalore Market', trend: '↑', change: '+4%' },
                            { id: 7, crop: 'Coffee', price: 8500, unit: '50kg', market: 'Bangalore Market', trend: '↑', change: '+4%' }
                        ],
                        'Mysore': [
                            { id: 8, crop: 'Rice', price: 2550, unit: '50kg', market: 'Mysore Market', trend: '↑', change: '+2%' }
                        ]
                    },
                    'maharashtra': {
                        'Mumbai': [
                            { id: 9, crop: 'Rice', price: 2700, unit: '50kg', market: 'Mumbai APMC', trend: '↑', change: '+6%' }
                        ],
                        'Pune': [
                            { id: 10, crop: 'Rice', price: 2650, unit: '50kg', market: 'Pune Market', trend: '↑', change: '+3%' }
                        ]
                    },
                    'punjab': {
                        'Amritsar': [
                            { id: 11, crop: 'Rice', price: 2200, unit: '50kg', market: 'Amritsar Mandi', trend: '↓', change: '-1%' }
                        ],
                        'Ludhiana': [
                            { id: 12, crop: 'Wheat', price: 2100, unit: '50kg', market: 'Ludhiana Mandi', trend: '→', change: '0%' }
                        ]
                    },
                    'rajasthan': {
                        'Jaipur': [
                            { id: 13, crop: 'Rice', price: 2350, unit: '50kg', market: 'Jaipur Market', trend: '→', change: '+1%' }
                        ],
                        'Jodhpur': [
                            { id: 14, crop: 'Groundnut', price: 5200, unit: '50kg', market: 'Jodhpur Market', trend: '↑', change: '+5%' }
                        ]
                    }
                };

                // Find matching prices case-insensitive for district
                const stateData = mockData[state] || {};
                let prices = [];
                if (district) {
                    // try exact, then case-insensitive match
                    prices = stateData[district] || stateData[Object.keys(stateData).find(k => k.toLowerCase() === district.toLowerCase())];
                }

                // Fallback: if no specific district prices, show state-wide sample or default Chennai
                if (!prices || prices.length === 0) {
                    prices = Object.values(stateData).flat() || mockData['tamil-nadu']['Chennai'];
                }

                resolve(prices || []);
            }, 500);
        });
    }

    displayPrices(prices) {
        try {
            if (prices.length === 0) {
                this.pricesGrid.innerHTML = '<p>No prices available for this location</p>';
                return;
            }

            const pricesHTML = prices.map(price => `
                <div class="price-card">
                    <h3>${price.crop}</h3>
                    <div class="price-row">
                        <span class="price-label">Price:</span>
                        <span class="price-value">₹${price.price.toLocaleString()}</span>
                    </div>
                    <div class="price-row">
                        <span class="price-label">Unit:</span>
                        <span>${price.unit}</span>
                    </div>
                    <div class="price-row">
                        <span class="price-label">Market:</span>
                        <span>${price.market}</span>
                    </div>
                    <div class="price-row">
                        <span class="price-label">Trend:</span>
                        <span style="color: ${price.trend === '↑' ? 'green' : price.trend === '↓' ? 'red' : 'gray'}">
                            ${price.trend} ${price.change}
                        </span>
                    </div>
                </div>
            `).join('');

            this.pricesGrid.innerHTML = pricesHTML;

            // Cache prices
            this.cachePrices(prices);

            // Show toast notification
            this.showToast(`${prices.length} prices updated for ${this.districtSelect.value || 'selected area'}`);

        } catch (error) {
            console.error('Error displaying prices:', error);
            this.pricesGrid.innerHTML = '<p>Error displaying prices</p>';
        }
    }

    cachePrices(prices) {
        try {
            const cache = {
                timestamp: new Date(),
                prices: prices,
                state: this.stateSelect.value,
                district: this.districtSelect.value
            };
            localStorage.setItem('agrimate-prices-cache', JSON.stringify(cache));
        } catch (error) {
            console.error('Error caching prices:', error);
        }
    }

    loadCachedPrices() {
        try {
            const cached = localStorage.getItem('agrimate-prices-cache');
            if (cached) {
                const data = JSON.parse(cached);
                const timestamp = new Date(data.timestamp);
                const now = new Date();
                
                // Show cache if less than 24 hours old
                if ((now - timestamp) < 86400000) {
                    return data.prices;
                }
            }
        } catch (error) {
            console.error('Error loading cached prices:', error);
        }
        return [];
    }

    showToast(message) {
        try {
            const toast = document.createElement('div');
            toast.className = 'toast success';
            toast.textContent = message;
            document.body.appendChild(toast);

            setTimeout(() => {
                toast.remove();
            }, 3000);
        } catch (error) {
            console.error('Error showing toast:', error);
        }
    }

    getPriceByRegion(region) {
        try {
            return this.prices.filter(p => p.region === region);
        } catch (error) {
            console.error('Error getting prices by region:', error);
            return [];
        }
    }
}

// Initialize crop prices manager
const cropPricesManager = new CropPricesManager();
