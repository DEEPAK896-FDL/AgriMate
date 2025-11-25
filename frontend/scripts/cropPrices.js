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
            if (this.stateSelect && this.districtSelect && this.pricesGrid) {
                this.stateSelect.addEventListener('change', (e) => this.onStateChange(e));
                this.districtSelect.addEventListener('change', () => this.loadPrices());
                // Load initial prices
                setTimeout(() => this.loadPrices(), 100);
                console.log('✓ Crop Prices Manager initialized');
            } else {
                console.warn('⚠ Crop Prices: Missing DOM elements', {
                    stateSelect: !!this.stateSelect,
                    districtSelect: !!this.districtSelect,
                    pricesGrid: !!this.pricesGrid
                });
            }
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
                option.value = district;
                option.textContent = district;
                this.districtSelect.appendChild(option);
            });
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
            })
            .then(json => {
                // Normalize response: backend returns { success: true, data: [...] }
                if (Array.isArray(json)) return json;
                if (json && Array.isArray(json.data)) return json.data;
                return [];
            });
    }

    getMockPrices(state, district) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(this.getMockPricesSync(state, district));
            }, 500);
        });
    }

    getMockPricesSync(state, district) {
        const mockData = {
            'tamil-nadu': {
                'Chennai': [
                    { id: 1, crop: 'Rice', price: 2500, unit: '50kg', market: 'Koyambedu Market', trend: '↑', change: '+5%' },
                    { id: 2, crop: 'Coconut', price: 1800, unit: '100pcs', market: 'Koyambedu Market', trend: '↓', change: '-2%' },
                    { id: 3, crop: 'Sugarcane', price: 3200, unit: '100kg', market: 'Chennai Market', trend: '↑', change: '+3%' },
                    { id: 4, crop: 'Onion', price: 2000, unit: '50kg', market: 'Koyambedu Market', trend: '↑', change: '+4%' }
                ],
                'Coimbatore': [
                    { id: 5, crop: 'Rice', price: 2400, unit: '50kg', market: 'Coimbatore Market', trend: '↑', change: '+3%' },
                    { id: 6, crop: 'Cotton', price: 5800, unit: '100kg', market: 'Coimbatore Market', trend: '↑', change: '+6%' }
                ],
                'Madurai': [
                    { id: 7, crop: 'Rice', price: 2300, unit: '50kg', market: 'Madurai Market', trend: '→', change: '0%' }
                ],
                'Tiruppur': [
                    { id: 8, crop: 'Rice', price: 2450, unit: '50kg', market: 'Tiruppur Market', trend: '↑', change: '+4%' }
                ],
                'Erode': [
                    { id: 9, crop: 'Rice', price: 2380, unit: '50kg', market: 'Erode Market', trend: '↓', change: '-2%' }
                ],
                'Salem': [
                    { id: 10, crop: 'Rice', price: 2420, unit: '50kg', market: 'Salem Market', trend: '↑', change: '+2%' }
                ]
            },
            'karnataka': {
                'Bangalore': [
                    { id: 11, crop: 'Rice', price: 2600, unit: '50kg', market: 'Bangalore Market', trend: '↑', change: '+4%' },
                    { id: 12, crop: 'Coffee', price: 8500, unit: '50kg', market: 'Bangalore Market', trend: '↑', change: '+4%' }
                ],
                'Mysore': [
                    { id: 13, crop: 'Rice', price: 2550, unit: '50kg', market: 'Mysore Market', trend: '↑', change: '+2%' }
                ],
                'Belgaum': [
                    { id: 14, crop: 'Jowar', price: 2200, unit: '50kg', market: 'Belgaum Market', trend: '→', change: '0%' }
                ],
                'Hubli': [
                    { id: 15, crop: 'Groundnut', price: 5300, unit: '50kg', market: 'Hubli Market', trend: '↑', change: '+2%' }
                ],
                'Mangalore': [
                    { id: 16, crop: 'Coconut', price: 1900, unit: '100pcs', market: 'Mangalore Market', trend: '↑', change: '+3%' }
                ]
            },
            'maharashtra': {
                'Mumbai': [
                    { id: 17, crop: 'Rice', price: 2700, unit: '50kg', market: 'Mumbai Market', trend: '↑', change: '+6%' }
                ],
                'Pune': [
                    { id: 18, crop: 'Rice', price: 2650, unit: '50kg', market: 'Pune Market', trend: '↑', change: '+3%' }
                ],
                'Nagpur': [
                    { id: 19, crop: 'Orange', price: 3500, unit: '50kg', market: 'Nagpur Market', trend: '↑', change: '+4%' }
                ],
                'Aurangabad': [
                    { id: 20, crop: 'Sugarcane', price: 3300, unit: '100kg', market: 'Aurangabad Market', trend: '↑', change: '+3%' }
                ],
                'Nashik': [
                    { id: 21, crop: 'Grape', price: 4500, unit: '50kg', market: 'Nashik Market', trend: '↑', change: '+4%' }
                ]
            },
            'punjab': {
                'Amritsar': [
                    { id: 22, crop: 'Rice', price: 2200, unit: '50kg', market: 'Amritsar Market', trend: '↓', change: '-1%' }
                ],
                'Ludhiana': [
                    { id: 23, crop: 'Wheat', price: 2100, unit: '50kg', market: 'Ludhiana Market', trend: '→', change: '0%' }
                ],
                'Jalandhar': [
                    { id: 24, crop: 'Rice', price: 2300, unit: '50kg', market: 'Jalandhar Market', trend: '↑', change: '+2%' }
                ],
                'Patiala': [
                    { id: 25, crop: 'Wheat', price: 2150, unit: '50kg', market: 'Patiala Market', trend: '↑', change: '+1%' }
                ],
                'Bathinda': [
                    { id: 26, crop: 'Cotton', price: 5650, unit: '100kg', market: 'Bathinda Market', trend: '↑', change: '+4%' }
                ]
            },
            'rajasthan': {
                'Jaipur': [
                    { id: 27, crop: 'Rice', price: 2350, unit: '50kg', market: 'Jaipur Market', trend: '→', change: '+1%' }
                ],
                'Jodhpur': [
                    { id: 28, crop: 'Groundnut', price: 5200, unit: '50kg', market: 'Jodhpur Market', trend: '↑', change: '+5%' }
                ],
                'Ajmer': [
                    { id: 29, crop: 'Mustard', price: 4300, unit: '50kg', market: 'Ajmer Market', trend: '↑', change: '+4%' }
                ],
                'Bikaner': [
                    { id: 30, crop: 'Cumin', price: 9300, unit: '50kg', market: 'Bikaner Market', trend: '↓', change: '-1%' }
                ],
                'Kota': [
                    { id: 31, crop: 'Cotton', price: 5800, unit: '100kg', market: 'Kota Market', trend: '↑', change: '+3%' }
                ]
            }
        };

        const stateData = mockData[state] || {};
        let prices = [];
        if (district) {
            prices = stateData[district] || stateData[Object.keys(stateData).find(k => k.toLowerCase() === district.toLowerCase())];
        }

        // Fallback: if no specific district prices, show state-wide sample or default Chennai
        if (!prices || prices.length === 0) {
            prices = Object.values(stateData).flat() || mockData['tamil-nadu']['Chennai'];
        }

        return prices || [];
    }

    displayPrices(prices) {
        try {
            // Normalize incoming data to an array
            const list = Array.isArray(prices) ? prices : (prices && prices.data ? prices.data : []);

            if (!list || list.length === 0) {
                this.pricesGrid.innerHTML = '<p>No prices available for this location</p>';
                return;
            }

            const pricesHTML = list.map(price => {
                const p = price || {};
                const priceVal = Number(p.price) || 0;
                const cropName = p.crop || 'Unknown';
                const unit = p.unit || '';
                const market = p.market || '';
                const trend = p.trend || '→';
                const change = p.change || '';

                return `
                <div class="price-card">
                    <h3>${cropName}</h3>
                    <div class="price-row">
                        <span class="price-label">Price:</span>
                        <span class="price-value">₹${priceVal.toLocaleString()}</span>
                    </div>
                    <div class="price-row">
                        <span class="price-label">Unit:</span>
                        <span>${unit}</span>
                    </div>
                    <div class="price-row">
                        <span class="price-label">Market:</span>
                        <span>${market}</span>
                    </div>
                    <div class="price-row">
                        <span class="price-label">Trend:</span>
                        <span style="color: ${trend === '↑' ? 'green' : trend === '↓' ? 'red' : 'gray'}">
                            ${trend} ${change}
                        </span>
                    </div>
                </div>
            `;
            }).join('');

            this.pricesGrid.innerHTML = pricesHTML;

            // Cache prices
            this.cachePrices(list);

            // Show toast notification
            this.showToast(`${list.length} prices updated for ${this.districtSelect ? (this.districtSelect.value || 'selected area') : 'selected area'}`);

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
