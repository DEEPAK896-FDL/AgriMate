/* ========================================
   AGRIMATE - Main Application Logic
   Core functionality and feature integration
   ======================================== */

class AgrimateApp {
    constructor() {
        this.apiUrl = 'http://localhost:3000/api';
        this.schemes = [];
        this.bookmarks = JSON.parse(localStorage.getItem('agrimate-bookmarks')) || [];
        this.init();
    }

    init() {
        try {
            this.setupEventListeners();
            this.loadSchemes();
            this.setupPestAlert();
            this.setupMarketplace();
            this.setupCalculator();
            this.setupHelpline();
            this.setupSoilTesting();
            this.loadOfflineData();
            console.log('✓ Agrimate App initialized successfully');
        } catch (error) {
            console.error('✗ Agrimate App initialization error:', error);
        }
    }

    setupEventListeners() {
        try {
            // Navigation toggle
            const navToggle = document.getElementById('navToggle');
            const navMenu = document.getElementById('navMenu');
            if (navToggle) {
                navToggle.addEventListener('click', () => {
                    navMenu.classList.toggle('active');
                });
            }

            // Smooth scroll for nav links
            document.querySelectorAll('a[href^="#"]').forEach(link => {
                link.addEventListener('click', (e) => {
                    const href = link.getAttribute('href');
                    if (href !== '#') {
                        navMenu.classList.remove('active');
                    }
                });
            });

            // Explore Features button
            const exploreBtn = document.getElementById('exploreBtn');
            if (exploreBtn) {
                exploreBtn.addEventListener('click', () => {
                    document.getElementById('prices').scrollIntoView({ behavior: 'smooth' });
                });
            }

            console.log('✓ Event listeners setup complete');
        } catch (error) {
            console.error('Error setting up event listeners:', error);
        }
    }

    loadSchemes() {
        try {
            // Fetch schemes from server
            this.fetchSchemesFromServer()
                .catch(() => this.getMockSchemes())
                .then(schemes => this.displaySchemes(schemes));
        } catch (error) {
            console.error('Error loading schemes:', error);
        }
    }

    fetchSchemesFromServer() {
        return fetch(`${this.apiUrl}/schemes`)
            .then(res => {
                if (!res.ok) throw new Error('Server error');
                return res.json();
            });
    }

    getMockSchemes() {
        const schemes = [
            {
                id: 1,
                name: 'PM FASAL Bima Yojana',
                description: 'Crop insurance scheme providing financial support to farmers in case of crop failure',
                benefits: '100% coverage of yield loss with subsidized premiums',
                eligibility: 'All farmers growing notified crops',
                link: '#'
            },
            {
                id: 2,
                name: 'Pradhan Mantri Krishi Sinchayee Yojana',
                description: 'Irrigation scheme to enhance water efficiency and productivity',
                benefits: '50-90% subsidy on irrigation equipment',
                eligibility: 'Landholding farmers',
                link: '#'
            },
            {
                id: 3,
                name: 'Soil Health Card Scheme',
                description: 'Free soil testing and customized fertilizer recommendations',
                benefits: 'Free soil testing at registered labs',
                eligibility: 'All farmers',
                link: '#'
            },
            {
                id: 4,
                name: 'Kisan Vikas Patra',
                description: 'Investment scheme for farmers with assured returns',
                benefits: '7.6% interest rate with tax benefits',
                eligibility: 'Indian farmers',
                link: '#'
            },
            {
                id: 5,
                name: 'Subsidy for Agricultural Tools',
                description: 'Government subsidy on modern farming equipment',
                benefits: '40-50% subsidy on tools and machines',
                eligibility: 'Small and marginal farmers',
                link: '#'
            },
            {
                id: 6,
                name: 'Drone Technology Subsidy',
                description: 'Subsidy on agricultural drones for crop monitoring',
                benefits: '50% subsidy on drone purchases',
                eligibility: 'Cooperative groups and farmers',
                link: '#'
            }
        ];

        return new Promise(resolve => {
            setTimeout(() => resolve(schemes), 300);
        });
    }

    displaySchemes(schemes) {
        try {
            this.schemes = schemes;
            const schemesGrid = document.getElementById('schemesGrid');
            
            const schemesHTML = schemes.map(scheme => `
                <div class="scheme-card">
                    <div class="scheme-header">
                        <h3 class="scheme-title">${scheme.name}</h3>
                        <button class="bookmark-btn ${this.bookmarks.includes(scheme.id) ? 'bookmarked' : ''}" 
                                onclick="agrimateApp.toggleBookmark(${scheme.id})" title="Bookmark">
                            <i class="fas fa-bookmark"></i>
                        </button>
                    </div>
                    <p class="scheme-desc">${scheme.description}</p>
                    <div class="scheme-benefits">
                        <strong>Benefits:</strong> ${scheme.benefits}
                    </div>
                    <div class="scheme-benefits">
                        <strong>Eligibility:</strong> ${scheme.eligibility}
                    </div>
                </div>
            `).join('');

            schemesGrid.innerHTML = schemesHTML;
            this.updateBookmarkCount();
        } catch (error) {
            console.error('Error displaying schemes:', error);
        }
    }

    toggleBookmark(schemeId) {
        try {
            const index = this.bookmarks.indexOf(schemeId);
            if (index > -1) {
                this.bookmarks.splice(index, 1);
            } else {
                this.bookmarks.push(schemeId);
            }

            localStorage.setItem('agrimate-bookmarks', JSON.stringify(this.bookmarks));
            this.updateBookmarkDisplay();
            this.updateBookmarkCount();

            const message = index > -1 ? 'Removed from bookmarks' : 'Added to bookmarks';
            this.showToast(message, 'success');
        } catch (error) {
            console.error('Error toggling bookmark:', error);
        }
    }

    updateBookmarkDisplay() {
        try {
            document.querySelectorAll('.bookmark-btn').forEach(btn => {
                const schemeCard = btn.closest('.scheme-card');
                const schemeId = parseInt(btn.getAttribute('onclick').match(/\d+/)[0]);
                if (this.bookmarks.includes(schemeId)) {
                    btn.classList.add('bookmarked');
                } else {
                    btn.classList.remove('bookmarked');
                }
            });

            // Update bookmarked grid
            this.displayBookmarkedSchemes();
        } catch (error) {
            console.error('Error updating bookmark display:', error);
        }
    }

    displayBookmarkedSchemes() {
        try {
            const bookmarkedGrid = document.getElementById('bookmarkedGrid');
            const bookmarkedSchemes = this.schemes.filter(s => this.bookmarks.includes(s.id));

            if (bookmarkedSchemes.length === 0) {
                bookmarkedGrid.innerHTML = '<p style="text-align: center; padding: 40px; grid-column: 1/-1;">No bookmarked schemes yet</p>';
                return;
            }

            const schemesHTML = bookmarkedSchemes.map(scheme => `
                <div class="scheme-card">
                    <div class="scheme-header">
                        <h3 class="scheme-title">${scheme.name}</h3>
                        <button class="bookmark-btn bookmarked" 
                                onclick="agrimateApp.toggleBookmark(${scheme.id})" title="Bookmark">
                            <i class="fas fa-bookmark"></i>
                        </button>
                    </div>
                    <p class="scheme-desc">${scheme.description}</p>
                    <div class="scheme-benefits">
                        <strong>Benefits:</strong> ${scheme.benefits}
                    </div>
                </div>
            `).join('');

            bookmarkedGrid.innerHTML = schemesHTML;
        } catch (error) {
            console.error('Error displaying bookmarked schemes:', error);
        }
    }

    updateBookmarkCount() {
        try {
            const count = document.getElementById('bookmarkCount');
            if (count) {
                count.textContent = this.bookmarks.length;
            }
        } catch (error) {
            console.error('Error updating bookmark count:', error);
        }
    }

    setupPestAlert() {
        try {
            const pestData = [
                { id: 1, name: 'Armyworm', icon: '🐛', description: 'Larva feeds on leaves, causing severe damage' },
                { id: 2, name: 'Leaf Folder', icon: '🦗', description: 'Larvae fold leaves and feed inside' },
                { id: 3, name: 'Brown Planthopper', icon: '🐝', description: 'Sucks plant sap, transmits virus diseases' },
                { id: 4, name: 'Blast Disease', icon: '🍂', description: 'Fungal disease affecting rice crops' },
                { id: 5, name: 'Sheath Blight', icon: '🦠', description: 'Fungal infection of rice plants' },
                { id: 6, name: 'Bacterial Wilt', icon: '☠️', description: 'Soil-borne disease affecting crops' }
            ];

            const pestGrid = document.getElementById('pestGrid');
            const pestHTML = pestData.map(pest => `
                <div class="pest-card">
                    <div class="pest-icon">${pest.icon}</div>
                    <h4>${pest.name}</h4>
                    <p class="pest-desc">${pest.description}</p>
                </div>
            `).join('');

            pestGrid.innerHTML = pestHTML;

            // Setup image upload
            const uploadArea = document.getElementById('uploadArea');
            const diseaseImage = document.getElementById('diseaseImage');

            uploadArea.addEventListener('click', () => diseaseImage.click());

            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = 'var(--primary-color)';
            });

            uploadArea.addEventListener('dragleave', () => {
                uploadArea.style.borderColor = 'var(--border-color)';
            });

            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = 'var(--border-color)';
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    this.analyzeDisease(files[0]);
                }
            });

            diseaseImage.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this.analyzeDisease(e.target.files[0]);
                }
            });

            console.log('✓ Pest Alert setup complete');
        } catch (error) {
            console.error('Error setting up pest alert:', error);
        }
    }

    analyzeDisease(file) {
        try {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = document.getElementById('diseaseResult');
                const analysis = document.getElementById('diseaseAnalysis');

                // Simulate AI analysis
                const diseases = [
                    { name: 'Rice Blast', confidence: 85, treatment: 'Use fungicide spray and improve drainage' },
                    { name: 'Brown Leaf Spot', confidence: 92, treatment: 'Apply copper-based fungicide' },
                    { name: 'Healthy Plant', confidence: 95, treatment: 'Continue regular care' }
                ];

                const detected = diseases[Math.floor(Math.random() * diseases.length)];

                analysis.innerHTML = `
                    <div style="padding: 20px; background: var(--light-color); border-radius: 8px;">
                        <p><strong>Disease Detected:</strong> ${detected.name}</p>
                        <p><strong>Confidence:</strong> ${detected.confidence}%</p>
                        <p><strong>Recommended Treatment:</strong> ${detected.treatment}</p>
                    </div>
                `;

                result.style.display = 'block';
                this.showToast('Disease analysis complete', 'success');
            };

            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Error analyzing disease:', error);
            this.showToast('Error analyzing image', 'error');
        }
    }

    setupMarketplace() {
        try {
            const tabButtons = document.querySelectorAll('.market-tab-btn');
            const tabContents = document.querySelectorAll('.market-tab-content');

            tabButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const tabId = btn.dataset.tab;
                    
                    tabButtons.forEach(b => b.classList.remove('active'));
                    tabContents.forEach(tc => tc.classList.remove('active'));

                    btn.classList.add('active');
                    document.getElementById(tabId).classList.add('active');
                });
            });

            // Setup sell form
            const listProductBtn = document.getElementById('listProductBtn');
            listProductBtn.addEventListener('click', () => this.listProduct());

            // Load marketplace products
            this.loadMarketplaceProducts();

            console.log('✓ Marketplace setup complete');
        } catch (error) {
            console.error('Error setting up marketplace:', error);
        }
    }

    listProduct() {
        try {
            const productType = document.getElementById('productType').value;
            const productName = document.getElementById('productName').value;
            const quantity = document.getElementById('quantity').value;
            const pricePerUnit = document.getElementById('pricePerUnit').value;
            const productDesc = document.getElementById('productDesc').value;

            if (!productName || !quantity || !pricePerUnit) {
                this.showToast('Please fill all required fields', 'error');
                return;
            }

            // Save to server or local storage
            const product = {
                id: Date.now(),
                type: productType,
                name: productName,
                quantity,
                pricePerUnit,
                description: productDesc,
                totalPrice: quantity * pricePerUnit,
                listedDate: new Date().toLocaleDateString()
            };

            // Add to products list
            let products = JSON.parse(localStorage.getItem('agrimate-marketplace') || '[]');
            products.push(product);
            localStorage.setItem('agrimate-marketplace', JSON.stringify(products));

            // Reset form
            document.querySelector('.sell-form').reset();

            this.showToast('Product listed successfully!', 'success');
            this.loadMarketplaceProducts();
        } catch (error) {
            console.error('Error listing product:', error);
            this.showToast('Error listing product', 'error');
        }
    }

    loadMarketplaceProducts() {
        try {
            const products = JSON.parse(localStorage.getItem('agrimate-marketplace') || '[]');
            const marketplaceGrid = document.getElementById('marketplaceGrid');

            if (products.length === 0) {
                marketplaceGrid.innerHTML = '<p style="text-align: center; padding: 40px; grid-column: 1/-1;">No products listed yet</p>';
                return;
            }

            const productsHTML = products.map(product => `
                <div class="product-card">
                    <span class="product-type-badge">${product.type}</span>
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-qty">Quantity: ${product.quantity} units</div>
                    <div class="product-price">₹${product.pricePerUnit} per unit</div>
                    <div class="product-price">Total: ₹${(product.quantity * product.pricePerUnit).toLocaleString()}</div>
                    <p class="product-desc">${product.description}</p>
                    <p style="font-size: 12px; color: #999; margin-top: 10px;">Listed: ${product.listedDate}</p>
                    <button class="btn btn-secondary" style="width: 100%; margin-top: 10px;">Contact Farmer</button>
                </div>
            `).join('');

            marketplaceGrid.innerHTML = productsHTML;
        } catch (error) {
            console.error('Error loading marketplace products:', error);
        }
    }

    setupSoilTesting() {
        try {
            const analyzeSoilBtn = document.getElementById('analyzeSoilBtn');
            analyzeSoilBtn.addEventListener('click', () => this.analyzeSoil());

            console.log('✓ Soil Testing setup complete');
        } catch (error) {
            console.error('Error setting up soil testing:', error);
        }
    }

    analyzeSoil() {
        try {
            const pH = parseFloat(document.getElementById('soilPH').value);
            const nitrogen = parseFloat(document.getElementById('nitrogen').value);
            const phosphorus = parseFloat(document.getElementById('phosphorus').value);
            const potassium = parseFloat(document.getElementById('potassium').value);

            if (!pH || !nitrogen || !phosphorus || !potassium) {
                this.showToast('Please fill all soil parameters', 'error');
                return;
            }

            // Generate AI recommendations
            const recommendations = this.generateSoilRecommendations(pH, nitrogen, phosphorus, potassium);
            this.displaySoilResults(recommendations);

        } catch (error) {
            console.error('Error analyzing soil:', error);
            this.showToast('Error analyzing soil', 'error');
        }
    }

    generateSoilRecommendations(pH, nitrogen, phosphorus, potassium) {
        const recommendations = [];

        // pH recommendations
        if (pH < 6) {
            recommendations.push({
                title: 'Acidic Soil',
                details: 'Your soil is too acidic. Apply lime to neutralize the acidity.',
                action: 'Add 2-3 tons of lime per acre'
            });
        } else if (pH > 8) {
            recommendations.push({
                title: 'Alkaline Soil',
                details: 'Your soil is too alkaline. Apply sulfur to reduce pH.',
                action: 'Add 500-1000 kg sulfur per acre'
            });
        } else {
            recommendations.push({
                title: 'Balanced pH',
                details: 'Your soil pH is ideal for most crops.',
                action: 'Maintain current pH level'
            });
        }

        // Nitrogen recommendations
        if (nitrogen < 280) {
            recommendations.push({
                title: 'Low Nitrogen',
                details: 'Apply nitrogen-rich fertilizers or organic manure.',
                action: 'Add 100-150 kg N per acre'
            });
        }

        // Phosphorus recommendations
        if (phosphorus < 30) {
            recommendations.push({
                title: 'Low Phosphorus',
                details: 'Add phosphate fertilizers for better crop growth.',
                action: 'Add 50-75 kg P₂O₅ per acre'
            });
        }

        // Potassium recommendations
        if (potassium < 200) {
            recommendations.push({
                title: 'Low Potassium',
                details: 'Apply potassium-rich fertilizers.',
                action: 'Add 40-60 kg K₂O per acre'
            });
        }

        if (recommendations.length === 1 && nitrogen >= 280 && phosphorus >= 30 && potassium >= 200) {
            recommendations.push({
                title: 'Excellent Soil Health',
                details: 'Your soil has balanced nutrients. Continue maintaining good practices.',
                action: 'Regular organic matter addition recommended'
            });
        }

        return recommendations;
    }

    displaySoilResults(recommendations) {
        try {
            const resultDiv = document.getElementById('soilResult');
            const recommendationsDiv = document.getElementById('soilRecommendations');

            const html = recommendations.map(rec => `
                <div class="recommendation-item">
                    <h4>${rec.title}</h4>
                    <p>${rec.details}</p>
                    <p><strong>Action:</strong> ${rec.action}</p>
                </div>
            `).join('');

            recommendationsDiv.innerHTML = html;
            resultDiv.style.display = 'block';
            resultDiv.scrollIntoView({ behavior: 'smooth' });

            this.showToast('Soil analysis complete', 'success');
        } catch (error) {
            console.error('Error displaying soil results:', error);
        }
    }

    setupCalculator() {
        try {
            const calculateBtn = document.getElementById('calculateBtn');
            calculateBtn.addEventListener('click', () => this.calculateProfitability());

            console.log('✓ Calculator setup complete');
        } catch (error) {
            console.error('Error setting up calculator:', error);
        }
    }

    calculateProfitability() {
        try {
            const crop = document.getElementById('calcCrop').value;
            const area = parseFloat(document.getElementById('calcArea').value);
            const yield_ = parseFloat(document.getElementById('calcYield').value);
            const costs = parseFloat(document.getElementById('calcCosts').value);
            const price = parseFloat(document.getElementById('calcPrice').value);

            if (!crop || !area || !yield_ || !costs || !price) {
                this.showToast('Please fill all fields', 'error');
                return;
            }

            const revenue = yield_ * price;
            const profit = revenue - costs;
            const margin = (profit / revenue * 100).toFixed(2);

            // Display results
            const resultDiv = document.getElementById('calcResult');
            document.getElementById('resultRevenue').textContent = `₹${revenue.toLocaleString()}`;
            document.getElementById('resultCost').textContent = `₹${costs.toLocaleString()}`;
            document.getElementById('resultProfit').textContent = `₹${profit.toLocaleString()}`;
            document.getElementById('resultMargin').textContent = `${margin}%`;

            resultDiv.style.display = 'grid';
            resultDiv.scrollIntoView({ behavior: 'smooth' });

            this.showToast('Profitability calculated successfully', 'success');
        } catch (error) {
            console.error('Error calculating profitability:', error);
            this.showToast('Error calculating profitability', 'error');
        }
    }

    setupHelpline() {
        try {
            const findOfficeBtn = document.getElementById('findOfficeBtn');
            findOfficeBtn.addEventListener('click', () => this.findNearestOffice());

            // Setup seasonal planning
            const seasonTabBtns = document.querySelectorAll('.season-tab-btn');
            seasonTabBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const season = e.target.dataset.season;
                    this.loadSeasonalInfo(season);
                });
            });

            // Load default seasonal info
            this.loadSeasonalInfo('kharif');

            console.log('✓ Helpline setup complete');
        } catch (error) {
            console.error('Error setting up helpline:', error);
        }
    }

    findNearestOffice() {
        try {
            const officesList = document.getElementById('officesList');
            const offices = [
                { name: 'District Agriculture Office - Chennai', phone: '044-2537-1111', address: 'Anna Salai, Chennai' },
                { name: 'District Agriculture Office - Coimbatore', phone: '0422-2546-999', address: 'Race Course Road, Coimbatore' },
                { name: 'District Agriculture Office - Madurai', phone: '0452-2345-678', address: 'Gandhi Road, Madurai' }
            ];

            const officesHTML = offices.map(office => `
                <div style="background: var(--light-color); padding: 12px; border-radius: 6px; margin: 8px 0; font-size: 13px;">
                    <p><strong>${office.name}</strong></p>
                    <p>📍 ${office.address}</p>
                    <p>📞 ${office.phone}</p>
                </div>
            `).join('');

            officesList.innerHTML = officesHTML;
            this.showToast('Nearby offices found', 'success');
        } catch (error) {
            console.error('Error finding nearest office:', error);
        }
    }

    loadSeasonalInfo(season) {
        try {
            const seasonalData = {
                'kharif': [
                    { crop: 'Rice', sowing: 'May-June', harvesting: 'October-November' },
                    { crop: 'Maize', sowing: 'May-June', harvesting: 'September-October' },
                    { crop: 'Cotton', sowing: 'April-June', harvesting: 'December-January' },
                    { crop: 'Sugarcane', sowing: 'April-June', harvesting: 'December-May' }
                ],
                'rabi': [
                    { crop: 'Wheat', sowing: 'October-November', harvesting: 'March-April' },
                    { crop: 'Barley', sowing: 'October-November', harvesting: 'March-April' },
                    { crop: 'Chickpea', sowing: 'October-November', harvesting: 'February-March' },
                    { crop: 'Mustard', sowing: 'September-October', harvesting: 'February-March' }
                ],
                'summer': [
                    { crop: 'Groundnut', sowing: 'February-March', harvesting: 'May-June' },
                    { crop: 'Vegetables', sowing: 'February-March', harvesting: 'May-July' },
                    { crop: 'Pulses', sowing: 'February-March', harvesting: 'May-June' }
                ]
            };

            const crops = seasonalData[season] || [];
            const contentDiv = document.getElementById('season-content');

            const cropsHTML = crops.map(crop => `
                <div class="season-crop-item">
                    <h4>${crop.crop}</h4>
                    <p>🌱 Sowing: ${crop.sowing}</p>
                    <p>🌾 Harvesting: ${crop.harvesting}</p>
                </div>
            `).join('');

            const html = `
                <div class="season-info">
                    ${cropsHTML}
                </div>
            `;

            contentDiv.innerHTML = html;

            // Update active tab
            document.querySelectorAll('.season-tab-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.season === season) {
                    btn.classList.add('active');
                }
            });
        } catch (error) {
            console.error('Error loading seasonal info:', error);
        }
    }

    loadOfflineData() {
        try {
            // Setup service worker for offline support
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('sw.js').catch(err => {
                    console.log('Service Worker registration failed:', err);
                });
            }
        } catch (error) {
            console.error('Error loading offline data:', error);
        }
    }

    showToast(message, type = 'info') {
        try {
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            toast.textContent = message;
            document.body.appendChild(toast);

            setTimeout(() => {
                toast.style.animation = 'slideDown 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }, 2000);
        } catch (error) {
            console.error('Error showing toast:', error);
        }
    }

    // Check eligibility for loans
    checkEligibility() {
        try {
            const checkboxes = document.querySelectorAll('.eligibility-check');
            let checkedCount = 0;

            checkboxes.forEach(checkbox => {
                if (checkbox.checked) checkedCount++;
            });

            if (checkedCount >= 3) {
                this.showToast(`You meet ${checkedCount}/4 eligibility criteria`, 'success');
            } else {
                this.showToast('Please complete eligibility criteria', 'warning');
            }
        } catch (error) {
            console.error('Error checking eligibility:', error);
        }
    }
}

// Initialize Agrimate App when DOM is ready
let agrimateApp;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        agrimateApp = new AgrimateApp();
        setupTabFunctionality();
        console.log('✓ Main JavaScript loaded and initialized');
    });
} else {
    agrimateApp = new AgrimateApp();
    setupTabFunctionality();
    console.log('✓ Main JavaScript already loaded');
}

function setupTabFunctionality() {
    try {
        // Setup tab functionality
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.dataset.tab;
                
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));

                btn.classList.add('active');
                const tabContent = document.getElementById(tabId);
                if (tabContent) {
                    tabContent.classList.add('active');
                }
            });
        });

        // Set first tab as active
        document.querySelectorAll('.tab-btn').forEach((btn, idx) => {
            if (idx === 0) btn.classList.add('active');
        });

        document.querySelectorAll('.tab-content').forEach((tc, idx) => {
            if (idx === 0) tc.classList.add('active');
        });

        // Check eligibility button
        const checkEligibilityBtn = document.getElementById('checkEligibilityBtn');
        if (checkEligibilityBtn) {
            checkEligibilityBtn.addEventListener('click', () => {
                if (agrimateApp) {
                    agrimateApp.checkEligibility();
                }
            });
        }
    } catch (error) {
        console.error('Error setting up tab functionality:', error);
    }
}
