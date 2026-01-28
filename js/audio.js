/* ============================================
   Carbon Cycle Explorer - Audio Manager
   Simple Web Audio API sound effects
   ============================================ */

const AudioManager = {
    audioContext: null,
    enabled: true,
    initialized: false,
    
    init() {
        // Audio context will be created on first user interaction
        // (browsers require user gesture to start audio)
        this.initialized = true;
    },
    
    // Ensure audio context is created (call after user interaction)
    ensureContext() {
        if (!this.audioContext) {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                console.log('Web Audio not supported');
                return false;
            }
        }
        return true;
    },
    
    setEnabled(enabled) {
        this.enabled = enabled;
    },
    
    // Play a simple tone
    playTone(frequency = 440, duration = 0.2, type = 'sine', volume = 0.3) {
        if (!this.enabled || !this.ensureContext()) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.type = type;
        oscillator.frequency.value = frequency;
        
        gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    },
    
    // Sound effects
    click() {
        this.playTone(800, 0.1, 'sine', 0.2);
    },
    
    success() {
        this.playTone(523, 0.15, 'sine', 0.3);
        setTimeout(() => this.playTone(659, 0.15, 'sine', 0.3), 100);
        setTimeout(() => this.playTone(784, 0.2, 'sine', 0.3), 200);
    },
    
    complete() {
        this.playTone(392, 0.2, 'sine', 0.3);
        setTimeout(() => this.playTone(523, 0.2, 'sine', 0.3), 150);
        setTimeout(() => this.playTone(659, 0.2, 'sine', 0.3), 300);
        setTimeout(() => this.playTone(784, 0.4, 'sine', 0.3), 450);
    },
    
    pop() {
        this.playTone(600, 0.08, 'sine', 0.2);
    },
    
    whoosh() {
        if (!this.enabled || !this.ensureContext()) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.3);
    },
    
    absorb() {
        this.playTone(300, 0.15, 'sine', 0.25);
        setTimeout(() => this.playTone(400, 0.15, 'sine', 0.2), 100);
    },
    
    release() {
        this.playTone(400, 0.15, 'sine', 0.25);
        setTimeout(() => this.playTone(300, 0.15, 'sine', 0.2), 100);
    }
};

// Make globally available
window.AudioManager = AudioManager;
