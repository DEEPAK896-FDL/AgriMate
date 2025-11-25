/* ========================================
   AGRIMATE - Language Support System
   Handles English & Tamil language switching
   ======================================== */

class LanguageManager {
    constructor() {
        this.currentLang = localStorage.getItem('agrimate-lang') || 'en';
        // Fallback translations map for elements missing data-<lang> attributes
        this.translationsMap = {
            "Home": { hi: "होम", te: "హోమ్", kn: "ಹೋಮ್" },
            "Prices": { hi: "कीमतें", te: "ధరలు", kn: "ಬೆಲೆಗಳು" },
            "Weather": { hi: "मौसम", te: "వాతావరణం", kn: "ಹವಾಮಾನ" },
            "Schemes": { hi: "योजनाएं", te: "యోజనల", kn: "ಯೋಜನೆಗಳು" },
            "Organic": { hi: "जैविक", te: "సేంద్రీయ", kn: "ಸಸ್ಯತ್ವ" },
            "Soil Testing": { hi: "मृदा परीक्षण", te: "మట్టి పరీక్ష", kn: "ಮಣ್ಣು ಪರೀಕ್ಷೆ" },
            "Pest Alert": { hi: "कीट चेतावनी", te: "పురుగు అలారం", kn: "ಹುಳು ಎಚ್ಚರಿಕೆ" },
            "Marketplace": { hi: "बाजार", te: "మార్కెట్", kn: "ಮಾರ್ಕೆಟ್" },
            "Loan": { hi: "ऋण", te: "రుణం", kn: "ಸಾಲ" },
            "Calculator": { hi: "कैलकुलेटर", te: "గణాంక యంత్రం", kn: "ಕ್ಯಾಲ್ಕುಲೇಟರ್" },
            "Helpline": { hi: "हेल्पलाइन", te: "హెల్ప్‌లైన్", kn: "హెల್ಪ్‌ಲೈನ್" },
            "Select State": { hi: "राज्य चुनें", te: "రాష్ట్రం ఎంచుకోండి", kn: "ರಾಜ್ಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ" },
            "Select District": { hi: "जिला चुनें", te: "జిల్లా ఎంచుకోండి", kn: "ಜಿಲ್ಲೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ" },
            "Crop Prices": { hi: "फसल की कीमतें", te: "పంట ధరలు", kn: "ಬೆಳೆ ಬೆಲೆಗಳು" },
            "Get Weather": { hi: "मौसम प्राप्त करें", te: "వాతావరణం పొందండి", kn: "ಹವಾಮಾನ ಪಡೆಯಿರಿ" },
            "Loading...": { hi: "लोड हो रहा है...", te: "లోడ్ చేయబడుతోంది...", kn: "ಲೋಡ್ ಆಗುತ್ತಿದೆ..." },
            "Explore Features": { hi: "विशेषताएँ एक्सप्लोर करें", te: "ఫీచర్లను అన్వేషించండి", kn: "ವೈಶಿಷ್ಟ್ಯಗಳನ್ನು ಅನ್ವೇಷಿಸಿ" },
            "Welcome to Agrimate": { hi: "Agrimate में आपका स्वागत है", te: "Agrimate కు స్వాగతం", kn: "Agrimate ಗೆ ಸ್ವಾಗತ" },
            "Your Smart Farming Support System": { hi: "आपकी स्मार्ट फार्मिंग सहायता प्रणाली", te: "మీ స్మార్ట్ వ్యవసాయ మద్దతు వ్యవస్థ", kn: "ನಿಮ್ಮ ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ಬೆಂಬಲ ವ್ಯವಸ್ಥೆ" }
        };
        this.init();
    }

    init() {
        this.setupLanguageButtons();
        this.applyLanguage(this.currentLang);
    }

    setupLanguageButtons() {
        const langBtns = document.querySelectorAll('.lang-btn');
        langBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.dataset.lang;
                this.setLanguage(lang);
            });
        });
    }

    setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('agrimate-lang', lang);
        this.applyLanguage(lang);
        
        // Update active button
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.lang === lang) {
                btn.classList.add('active');
            }
        });

        // Show toast notification per language
        const messages = {
            en: 'Language changed to English',
            ta: 'மொழி தமிழுக்கு மாற்றப்பட்டது',
            hi: 'भाषा हिंदी में बदली गई',
            te: 'భాషను తెలుగు కి మార్చారు',
            kn: 'ಭಾಷೆಯನ್ನು ಕನ್ನಡಕ್ಕೆ ಬದಲಿಸಲಾಗಿದೆ'
        };

        this.showToast(messages[lang] || 'Language changed', 'success');
    }

    applyLanguage(lang) {
        // Determine attribute names
        const attrMap = {
            en: 'en',
            ta: 'ta',
            hi: 'hi',
            te: 'te',
            kn: 'kn'
        };

        const key = attrMap[lang] || 'en';

        // Apply text translations for elements that have any language data-attributes
        document.querySelectorAll('[data-en], [data-ta], [data-hi], [data-te], [data-kn]').forEach(element => {
            const textAttr = `data-${key}`;
            const placeholderAttr = `data-${key}-placeholder`;
            const enText = element.getAttribute('data-en') || element.textContent.trim() || '';
            let text = element.getAttribute(textAttr) || '';

            // If specific language attribute missing, try fallback translations map
            if (!text && enText && this.translationsMap[enText] && this.translationsMap[enText][key]) {
                text = this.translationsMap[enText][key];
            }

            // If still missing, fallback to English attribute
            if (!text) text = enText || '';

            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
                const enPh = element.getAttribute('data-en-placeholder') || '';
                let ph = element.getAttribute(placeholderAttr) || '';
                if (!ph && enPh && this.translationsMap[enPh] && this.translationsMap[enPh][key]) {
                    ph = this.translationsMap[enPh][key];
                }
                if (ph) element.placeholder = ph;
                else if (text) element.placeholder = text;
            } else {
                if (text) element.textContent = text;
            }
        });

        // Apply placeholder translations separately for any remaining elements
        document.querySelectorAll('[data-en-placeholder], [data-ta-placeholder], [data-hi-placeholder], [data-te-placeholder], [data-kn-placeholder]').forEach(element => {
            const ph = element.getAttribute(`data-${key}-placeholder`) || element.getAttribute('data-en-placeholder') || '';
            if (ph) element.placeholder = ph;
        });

        // Store in local storage and cache
        this.cacheTranslations();
    }

    cacheTranslations() {
        const languages = ['en', 'ta', 'hi', 'te', 'kn'];
        const translations = {};

        languages.forEach(l => translations[l] = {});

        // Cache translations for each language attribute present
        document.querySelectorAll('[data-en], [data-ta], [data-hi], [data-te], [data-kn]').forEach(element => {
            const id = element.id || element.className || element.tagName;
            languages.forEach(l => {
                const attr = `data-${l}`;
                if (element.hasAttribute(attr)) {
                    translations[l][id] = element.getAttribute(attr);
                }
            });
        });

        localStorage.setItem('agrimate-translations', JSON.stringify(translations));
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideDown 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }

    getCurrentLanguage() {
        return this.currentLang;
    }

    translate(key, lang = null) {
        const language = lang || this.currentLang;
        const translations = JSON.parse(localStorage.getItem('agrimate-translations') || '{}');
        return translations[language]?.[key] || key;
    }
}

// Initialize language manager
const languageManager = new LanguageManager();
