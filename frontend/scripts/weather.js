/* ========================================
   AGRIMATE - Weather Management System
   Real-time weather updates and forecasting
   ======================================== */

class WeatherManager {
    constructor() {
        this.apiKey = 'YOUR_WEATHERAPI_KEY'; // Free weather API
        this.baseUrl = 'https://api.weatherapi.com/v1';
        this.weatherBtn = document.getElementById('getWeatherBtn');
        this.weatherCard = document.getElementById('weatherCard');
        this.forecastContainer = document.getElementById('forecastContainer');
        this.weatherStateSelect = document.getElementById('weatherStateSelect');
        this.weatherDistrictSelect = document.getElementById('weatherDistrictSelect');
        this.lastLocation = localStorage.getItem('agrimate-location') || null;
        this.init();
    }

    init() {
        try {
            this.weatherBtn.addEventListener('click', () => this.getWeather());

            // If state/district selectors exist, populate districts when state changes
            if (this.weatherStateSelect && this.weatherDistrictSelect) {
                this.weatherStateSelect.addEventListener('change', (e) => this.updateDistricts(e.target.value));
                this.weatherDistrictSelect.addEventListener('change', () => this.getWeather());
            }
            
            // Load cached weather on startup
            this.loadCachedWeather();
            
            console.log('✓ Weather Manager initialized');
        } catch (error) {
            console.error('✗ Weather Manager error:', error);
        }
    }

    updateDistricts(state) {
        try {
            const districts = {
                'tamil-nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruppur', 'Erode', 'Salem'],
                'karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore'],
                'maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Aurangabad'],
                'punjab': ['Amritsar', 'Ludhiana', 'Jalandhar', 'Patiala'],
                'rajasthan': ['Jaipur', 'Jodhpur', 'Ajmer', 'Bikaner']
            };

            const list = districts[state] || [];
            if (!this.weatherDistrictSelect) return;
            this.weatherDistrictSelect.innerHTML = '<option value="">Select District</option>';
            list.forEach(d => {
                const opt = document.createElement('option');
                opt.value = d; // keep casing to match mock weather map
                opt.textContent = d;
                this.weatherDistrictSelect.appendChild(opt);
            });
        } catch (error) {
            console.error('Error updating weather districts:', error);
        }
    }

    getWeather() {
        try {
            // If user selected a state/district, prefer that over geolocation
            const state = this.weatherStateSelect ? this.weatherStateSelect.value : '';
            const district = this.weatherDistrictSelect ? this.weatherDistrictSelect.value : '';

            if (district) {
                // Fetch by city/district name
                this.fetchWeatherDataByCity(district);
                return;
            }

            if (navigator.geolocation) {
                this.weatherBtn.textContent = '⏳ Getting location...';
                this.weatherBtn.disabled = true;

                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        this.fetchWeatherData(latitude, longitude);
                    },
                    (error) => {
                        console.error('Geolocation error:', error);
                        // Use default location (Chennai, India) as fallback
                        this.fetchWeatherData(13.0827, 80.2707);
                    }
                );
            } else {
                // Fallback to default location
                this.fetchWeatherData(13.0827, 80.2707);
            }
        } catch (error) {
            console.error('Error getting weather:', error);
            this.showWeatherError();
        }
    }

    fetchWeatherData(lat, lon) {
        try {
            // Using mock weather data for demo (no API key needed)
            const mockWeather = this.getMockWeatherData(lat, lon);
            this.displayWeather(mockWeather);
            this.cacheWeather(mockWeather);
        } catch (error) {
            console.error('Error fetching weather:', error);
            this.showWeatherError();
        } finally {
            this.weatherBtn.textContent = '📍 Get Weather';
            this.weatherBtn.disabled = false;
        }
    }

    fetchWeatherDataByCity(cityName) {
        try {
            const mockWeather = this.getMockWeatherDataForCity(cityName);
            this.displayWeather(mockWeather);
            this.cacheWeather(mockWeather);
        } catch (error) {
            console.error('Error fetching weather by city:', error);
            this.showWeatherError();
        } finally {
            this.weatherBtn.textContent = '📍 Get Weather';
            this.weatherBtn.disabled = false;
        }
    }

    getMockWeatherData(lat, lon) {
        // Generate realistic weather data based on coordinates (fallback)
        const weatherData = {
            city: `Location (${lat.toFixed(2)}, ${lon.toFixed(2)})`,
            temperature: 25 + Math.random() * 10,
            humidity: 60 + Math.random() * 30,
            windSpeed: 8 + Math.random() * 20,
            condition: 'Fair',
            icon: '☀️',
            uvIndex: 7,
            pressure: 1013,
            visibility: 10,
            rainfall: 0,
            lastUpdated: new Date().toLocaleTimeString(),
            forecast: this.generateForecast()
        };

        return weatherData;
    }

    getMockWeatherDataForCity(cityName) {
        // Provide mock weather for common Indian cities used in app
        const cityMap = {
            'Chennai': { city: 'Chennai, Tamil Nadu', temperature: 28, humidity: 70, windSpeed: 12, condition: 'Partly Cloudy', icon: '⛅', uvIndex: 8, rainfall: 10 },
            'Coimbatore': { city: 'Coimbatore, Tamil Nadu', temperature: 26, humidity: 65, windSpeed: 8, condition: 'Sunny', icon: '☀️', uvIndex: 7, rainfall: 0 },
            'Madurai': { city: 'Madurai, Tamil Nadu', temperature: 30, humidity: 50, windSpeed: 6, condition: 'Sunny', icon: '☀️', uvIndex: 9, rainfall: 0 },
            'Bangalore': { city: 'Bengaluru, Karnataka', temperature: 24, humidity: 60, windSpeed: 10, condition: 'Cloudy', icon: '⛅', uvIndex: 6, rainfall: 2 },
            'Mysore': { city: 'Mysore, Karnataka', temperature: 25, humidity: 55, windSpeed: 8, condition: 'Fair', icon: '☀️', uvIndex: 6, rainfall: 1 },
            'Mumbai': { city: 'Mumbai, Maharashtra', temperature: 29, humidity: 75, windSpeed: 14, condition: 'Humid', icon: '☀️', uvIndex: 7, rainfall: 5 },
            'Pune': { city: 'Pune, Maharashtra', temperature: 27, humidity: 60, windSpeed: 9, condition: 'Sunny', icon: '☀️', uvIndex: 7, rainfall: 0 },
            'Amritsar': { city: 'Amritsar, Punjab', temperature: 22, humidity: 55, windSpeed: 6, condition: 'Cool', icon: '☀️', uvIndex: 5, rainfall: 0 },
            'Jaipur': { city: 'Jaipur, Rajasthan', temperature: 33, humidity: 30, windSpeed: 10, condition: 'Hot', icon: '☀️', uvIndex: 9, rainfall: 0 }
        };

        const base = cityMap[cityName] || { city: cityName, temperature: 26 + Math.random() * 6, humidity: 60 + Math.random() * 20, windSpeed: 8 + Math.random() * 10, condition: 'Fair', icon: '☀️', uvIndex: 6, rainfall: Math.random() * 10 };

        return {
            ...base,
            lastUpdated: new Date().toLocaleTimeString(),
            forecast: this.generateForecast()
        };
    }

    generateForecast() {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        const conditions = ['☀️ Sunny', '⛅ Cloudy', '🌧️ Rainy', '⛈️ Thunderstorm', '☀️ Sunny'];
        const forecast = [];

        for (let i = 0; i < 5; i++) {
            forecast.push({
                day: days[i],
                high: 28 + Math.random() * 8,
                low: 18 + Math.random() * 6,
                condition: conditions[Math.floor(Math.random() * conditions.length)],
                rainfall: Math.random() * 20
            });
        }

        return forecast;
    }

    displayWeather(data) {
        try {
            const weatherHTML = `
                <div class="weather-info">
                    <h3>${data.city}</h3>
                    <div class="weather-icon">${data.icon}</div>
                    <div class="weather-temp">${Math.round(data.temperature)}°C</div>
                    <div class="weather-desc">${data.condition}</div>
                    <div class="weather-details">
                        <div class="detail-item">
                            <span>💧 Humidity:</span>
                            <span>${Math.round(data.humidity)}%</span>
                        </div>
                        <div class="detail-item">
                            <span>💨 Wind:</span>
                            <span>${Math.round(data.windSpeed)} km/h</span>
                        </div>
                        <div class="detail-item">
                            <span>☔ Rainfall:</span>
                            <span>${Math.round(data.rainfall)}mm</span>
                        </div>
                        <div class="detail-item">
                            <span>🌡️ UV Index:</span>
                            <span>${data.uvIndex}</span>
                        </div>
                        <div class="detail-item">
                            <span>👁️ Visibility:</span>
                            <span>${data.visibility}km</span>
                        </div>
                        <div class="detail-item">
                            <span>🔽 Pressure:</span>
                            <span>${data.pressure} mb</span>
                        </div>
                    </div>
                    <small>Last updated: ${data.lastUpdated}</small>
                </div>
            `;

            this.weatherCard.innerHTML = weatherHTML;
            this.displayForecast(data.forecast);

            // Dispatch event for language system
            const event = new CustomEvent('weatherUpdated', { detail: { location: data.city } });
            document.dispatchEvent(event);

        } catch (error) {
            console.error('Error displaying weather:', error);
            this.showWeatherError();
        }
    }

    displayForecast(forecast) {
        try {
            const forecastHTML = forecast.map(day => `
                <div class="forecast-item">
                    <div class="forecast-day">${day.day}</div>
                    <div class="forecast-icon">${day.condition}</div>
                    <div class="forecast-temp">
                        <span>↑${Math.round(day.high)}°</span>
                        <span>↓${Math.round(day.low)}°</span>
                    </div>
                </div>
            `).join('');

            this.forecastContainer.innerHTML = forecastHTML;
        } catch (error) {
            console.error('Error displaying forecast:', error);
        }
    }

    loadCachedWeather() {
        try {
            const cached = localStorage.getItem('agrimate-weather-cache');
            if (cached) {
                const data = JSON.parse(cached);
                const timestamp = new Date(data.timestamp);
                const now = new Date();
                
                // Show cache if less than 1 hour old
                if ((now - timestamp) < 3600000) {
                    this.displayWeather(data);
                }
            }
        } catch (error) {
            console.error('Error loading cached weather:', error);
        }
    }

    cacheWeather(data) {
        try {
            data.timestamp = new Date();
            localStorage.setItem('agrimate-weather-cache', JSON.stringify(data));
        } catch (error) {
            console.error('Error caching weather:', error);
        }
    }

    showWeatherError() {
        try {
            this.weatherCard.innerHTML = `
                <div class="weather-error">
                    <p>⚠️ Unable to fetch weather data</p>
                    <p>Please check your internet connection and try again</p>
                </div>
            `;
        } catch (error) {
            console.error('Error showing error message:', error);
        }
    }
}

// Initialize weather manager
const weatherManager = new WeatherManager();

// Add CSS for weather details
const weatherStyles = `
    <style>
        .weather-details {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin: 20px 0;
            padding: 20px;
            background: var(--light-color);
            border-radius: 8px;
        }

        .detail-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid var(--border-color);
        }

        .detail-item:nth-child(odd):nth-last-child(-n+2),
        .detail-item:last-child {
            border-bottom: none;
        }

        .detail-item span:first-child {
            color: #666;
            font-weight: 600;
        }

        .detail-item span:last-child {
            color: var(--primary-color);
            font-weight: 700;
        }

        .weather-error {
            text-align: center;
            padding: 30px;
            color: var(--danger-color);
        }

        .weather-info small {
            display: block;
            text-align: center;
            color: #999;
            margin-top: 15px;
        }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', weatherStyles);
