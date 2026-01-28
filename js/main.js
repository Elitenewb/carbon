/* ============================================
   Carbon Cycle Explorer - Main Application
   ============================================ */

// App State
const AppState = {
    currentScreen: 'title',
    currentChapter: 0,
    totalChapters: 6,
    storyCompleted: false,
    soundEnabled: true,
    
    // Load saved progress from localStorage
    load() {
        try {
            const saved = localStorage.getItem('carbonCycleProgress');
            if (saved) {
                const data = JSON.parse(saved);
                this.currentChapter = data.currentChapter || 0;
                this.storyCompleted = data.storyCompleted || false;
                this.soundEnabled = data.soundEnabled !== undefined ? data.soundEnabled : true;
            }
        } catch (e) {
            console.log('No saved progress found');
        }
    },
    
    // Save progress to localStorage
    save() {
        try {
            const data = {
                currentChapter: this.currentChapter,
                storyCompleted: this.storyCompleted,
                soundEnabled: this.soundEnabled
            };
            localStorage.setItem('carbonCycleProgress', JSON.stringify(data));
        } catch (e) {
            console.log('Could not save progress');
        }
    },
    
    // Reset progress
    reset() {
        this.currentChapter = 0;
        this.storyCompleted = false;
        this.save();
    }
};

// DOM Elements
const elements = {
    // Screens
    titleScreen: document.getElementById('title-screen'),
    storyScreen: document.getElementById('story-screen'),
    sandboxScreen: document.getElementById('sandbox-screen'),
    
    // Buttons
    startStoryBtn: document.getElementById('start-story-btn'),
    sandboxBtn: document.getElementById('sandbox-btn'),
    backBtn: document.getElementById('back-btn'),
    nextBtn: document.getElementById('next-btn'),
    soundToggle: document.getElementById('sound-toggle'),
    
    // Content areas
    storyContent: document.getElementById('story-content'),
    sandboxContent: document.getElementById('sandbox-content'),
    
    // Progress
    progressFill: document.getElementById('progress-fill'),
    progressText: document.getElementById('progress-text'),
    sandboxHint: document.getElementById('sandbox-hint'),
    
    // Footer
    footer: document.getElementById('footer')
};

// Navigation Functions
function showScreen(screenName) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show requested screen
    const screen = document.getElementById(`${screenName}-screen`);
    if (screen) {
        screen.classList.add('active');
        AppState.currentScreen = screenName;
    }
    
    // Update footer visibility and buttons based on screen
    updateNavigation();
}

function updateNavigation() {
    const { currentScreen, currentChapter, totalChapters, storyCompleted } = AppState;
    
    if (currentScreen === 'title') {
        // Hide footer on title screen
        elements.footer.style.display = 'none';
        
        // Update sandbox button state
        if (storyCompleted) {
            elements.sandboxBtn.disabled = false;
            elements.sandboxBtn.textContent = '🎮 Sandbox Mode';
            elements.sandboxHint.textContent = 'You unlocked Sandbox Mode!';
            elements.sandboxHint.style.color = '#4CAF50';
        }
    } else if (currentScreen === 'story') {
        // Show footer in story mode
        elements.footer.style.display = 'flex';
        
        // Update back button
        elements.backBtn.disabled = currentChapter === 0;
        
        // Update next button based on chapter completion
        // This will be controlled by the story.js based on interaction completion
        
        // Update progress
        updateProgress();
    } else if (currentScreen === 'sandbox') {
        // Show footer with home button only
        elements.footer.style.display = 'flex';
        elements.backBtn.disabled = false;
        elements.backBtn.textContent = '← Home';
        elements.nextBtn.style.display = 'none';
        elements.progressText.textContent = 'Sandbox Mode';
        elements.progressFill.style.width = '100%';
    }
}

function updateProgress() {
    const { currentChapter, totalChapters } = AppState;
    const percentage = ((currentChapter) / totalChapters) * 100;
    
    elements.progressFill.style.width = `${percentage}%`;
    elements.progressText.textContent = `Chapter ${currentChapter + 1} of ${totalChapters}`;
}

// Enable/disable next button (called from story.js when interaction is complete)
function enableNextButton(enabled = true) {
    elements.nextBtn.disabled = !enabled;
}

// Complete the story
function completeStory() {
    AppState.storyCompleted = true;
    AppState.save();
    
    // Show completion message
    elements.storyContent.innerHTML = `
        <div class="completion-message fade-in">
            <div class="trophy">🏆</div>
            <h2>Amazing Journey Complete!</h2>
            <p>You followed Carby through the entire carbon cycle!</p>
            <p>Now you understand how carbon moves through our world.</p>
            <div class="key-fact" style="margin-top: 24px;">
                Carbon never disappears. It just moves from place to place!
            </div>
            <button class="primary-button" style="margin-top: 32px;" onclick="goToTitle()">
                Return to Home
            </button>
        </div>
    `;
    
    elements.nextBtn.style.display = 'none';
    elements.backBtn.textContent = '← Home';
}

// Navigation event handlers
function goToTitle() {
    showScreen('title');
    elements.backBtn.textContent = '← Back';
    elements.nextBtn.style.display = 'block';
}

function startStory() {
    showScreen('story');
    loadChapter(AppState.currentChapter);
}

function goToSandbox() {
    showScreen('sandbox');
    initSandbox();
}

function goBack() {
    if (AppState.currentScreen === 'story') {
        if (AppState.currentChapter > 0) {
            AppState.currentChapter--;
            AppState.save();
            loadChapter(AppState.currentChapter);
        } else {
            goToTitle();
        }
    } else if (AppState.currentScreen === 'sandbox') {
        goToTitle();
    }
}

function goNext() {
    if (AppState.currentScreen === 'story') {
        if (AppState.currentChapter < AppState.totalChapters - 1) {
            AppState.currentChapter++;
            AppState.save();
            loadChapter(AppState.currentChapter);
        } else {
            // Story complete!
            completeStory();
        }
    }
}

// Sound toggle
function toggleSound() {
    AppState.soundEnabled = !AppState.soundEnabled;
    elements.soundToggle.textContent = AppState.soundEnabled ? '🔊' : '🔇';
    AppState.save();
    
    // Update audio system
    if (typeof AudioManager !== 'undefined') {
        AudioManager.setEnabled(AppState.soundEnabled);
    }
}

// Initialize the app
function init() {
    // Load saved progress
    AppState.load();
    
    // Set initial sound state
    elements.soundToggle.textContent = AppState.soundEnabled ? '🔊' : '🔇';
    
    // Set up event listeners
    elements.startStoryBtn.addEventListener('click', startStory);
    elements.sandboxBtn.addEventListener('click', goToSandbox);
    elements.backBtn.addEventListener('click', goBack);
    elements.nextBtn.addEventListener('click', goNext);
    elements.soundToggle.addEventListener('click', toggleSound);
    
    // Show title screen
    showScreen('title');
    
    // Initialize particle system
    if (typeof ParticleSystem !== 'undefined') {
        ParticleSystem.init();
    }
    
    // Initialize audio
    if (typeof AudioManager !== 'undefined') {
        AudioManager.init();
        AudioManager.setEnabled(AppState.soundEnabled);
    }
    
    console.log('Carbon Cycle Explorer initialized!');
}

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', init);

// Make functions globally available
window.enableNextButton = enableNextButton;
window.goToTitle = goToTitle;
window.AppState = AppState;
