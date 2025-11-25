/* ========================================
   AGRIMATE - Voice Assistant System
   AI-powered voice guidance for farmers
   ======================================== */

class VoiceAssistant {
    constructor() {
        this.isListening = false;
        this.synth = window.speechSynthesis;
        this.recognition = null;
        this.voiceBtn = document.getElementById('voiceBtn');
        this.currentLang = 'en';
        this.init();
    }

    init() {
        try {
            // Initialize speech recognition (try both variants)
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                this.recognition = new SpeechRecognition();
                this.setupRecognition();
            }

            // Setup voice button
            this.voiceBtn.addEventListener('click', () => this.toggleListening());

            // Update language when changed
            document.addEventListener('languageChanged', (e) => {
                this.currentLang = e.detail.lang;
            });

            console.log('✓ Voice Assistant initialized successfully');
        } catch (error) {
            console.error('✗ Voice Assistant error:', error);
        }
    }

    setupRecognition() {
        if (!this.recognition) return;

        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = this.currentLang === 'en' ? 'en-IN' : 'ta-IN';

        this.recognition.onstart = () => {
            this.isListening = true;
            this.voiceBtn.classList.add('listening');
        };

        this.recognition.onend = () => {
            this.isListening = false;
            this.voiceBtn.classList.remove('listening');
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.isListening = false;
            this.voiceBtn.classList.remove('listening');
        };

        this.recognition.onresult = (event) => {
            try {
                let transcript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        transcript += event.results[i][0].transcript;
                    }
                }

                if (transcript) {
                    this.handleVoiceCommand(transcript.toLowerCase());
                }
            } catch (error) {
                console.error('Error processing voice result:', error);
            }
        };
    }

    toggleListening() {
        try {
            if (!this.recognition) {
                this.speak('Speech recognition not available in your browser');
                return;
            }

            if (this.isListening) {
                this.recognition.stop();
            } else {
                this.recognition.lang = this.currentLang === 'en' ? 'en-IN' : 'ta-IN';
                this.recognition.start();
                this.speak(this.currentLang === 'en' ? 'Listening...' : 'கேட்டுக்கொண்டிருக்கிறேன்...');
            }
        } catch (error) {
            console.error('Error toggling listening:', error);
        }
    }

    handleVoiceCommand(command) {
        try {
            const responses = {
                en: {
                    'prices': { action: 'prices', text: 'Opening crop prices section' },
                    'weather': { action: 'weather', text: 'Getting your weather update' },
                    'schemes': { action: 'schemes', text: 'Showing government schemes' },
                    'organic': { action: 'organic', text: 'Organic farming guidance' },
                    'soil': { action: 'soil', text: 'Soil testing and fertilizer recommendations' },
                    'pest': { action: 'pest', text: 'Pest and disease alert information' },
                    'marketplace': { action: 'marketplace', text: 'Opening farmer marketplace' },
                    'loan': { action: 'loan', text: 'Showing loan and insurance schemes' },
                    'calculator': { action: 'calculator', text: 'Opening profitability calculator' },
                    'helpline': { action: 'helpline', text: 'Emergency services and helpline' },
                    'help': { action: 'help', text: 'I can help you with crop prices, weather, schemes, organic farming, soil testing, pest alerts, marketplace, loans, calculator, and emergency services' },
                    'hello': { action: 'hello', text: 'Hello! I am Agrimate Voice Assistant. How can I help you today?' }
                },
                ta: {
                    'விலை': { action: 'prices', text: 'பயிர் விலைகள் பகுதি திறக்கப்படுகிறது' },
                    'வானிலை': { action: 'weather', text: 'உங்கள் வானிலை தகவலைப் பெறுகிறேன்' },
                    'திட்டங்கள்': { action: 'schemes', text: 'அரசு திட்டங்களைக் காட்டுகிறேன்' },
                    'கீட': { action: 'pest', text: 'கீட மற்றும் நோய் எச்சரிக்கை' },
                    'உதவி': { action: 'help', text: 'நான் விலைகள், வானிலை, திட்டங்கள் மற்றும் பல விஷயங்களில் உதவ முடியும்' }
                }
            };

            const langResponses = responses[this.currentLang] || responses['en'];

            // Find matching command
            let foundCommand = null;
            for (const key in langResponses) {
                if (command.includes(key)) {
                    foundCommand = langResponses[key];
                    break;
                }
            }

            if (foundCommand) {
                this.speak(foundCommand.text);

                // Execute action after speaking
                if (foundCommand.action !== 'help' && foundCommand.action !== 'hello') {
                    setTimeout(() => {
                        const section = document.getElementById(foundCommand.action);
                        if (section) {
                            section.scrollIntoView({ behavior: 'smooth' });
                        }
                    }, 2000);
                }
            } else {
                this.speak(this.currentLang === 'en' ? 
                    'Sorry, I did not understand. Try asking about prices, weather, schemes, or help' : 
                    'மன்னிக்கவும், நான் புரிந்துகொள்ளவில்லை');
            }
        } catch (error) {
            console.error('Error handling voice command:', error);
        }
    }

    speak(text) {
        try {
            // Cancel any ongoing speech
            this.synth.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = this.currentLang === 'en' ? 'en-IN' : 'ta-IN';
            utterance.rate = 0.9;
            utterance.pitch = 1;
            utterance.volume = 1;

            this.synth.speak(utterance);
        } catch (error) {
            console.error('Error speaking:', error);
        }
    }

    announceFeature(featureName, description) {
        try {
            const text = `${featureName}: ${description}`;
            this.speak(text);
        } catch (error) {
            console.error('Error announcing feature:', error);
        }
    }

    stop() {
        try {
            this.synth.cancel();
            if (this.recognition) {
                this.recognition.stop();
            }
        } catch (error) {
            console.error('Error stopping voice assistant:', error);
        }
    }
}

// Initialize voice assistant
const voiceAssistant = new VoiceAssistant();
