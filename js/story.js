/* ============================================
   Carbon Cycle Explorer - Story Mode
   Chapter content and interactions
   ============================================ */

// Chapter definitions
const chapters = [
    {
        id: 1,
        title: "The Atmosphere",
        location: "High up in the sky",
        background: "scene-atmosphere",
        intro: "Hi! I'm Carby, a carbon atom. Right now, I'm floating in the air as part of a CO₂ molecule. CO₂ is carbon dioxide - that's me (carbon) joined with two oxygen atoms!",
        instruction: "Click on the clouds to find CO₂ molecules hiding in the air!",
        keyFact: "The air around us has CO₂ in it. We can't see it, but it's always there!",
        interactionType: "click-clouds",
        requiredClicks: 5
    },
    {
        id: 2,
        title: "Plants and Photosynthesis",
        location: "In a green forest",
        background: "scene-plants",
        intro: "A plant is pulling me in! Plants take CO₂ from the air and use sunlight to make food. This is called photosynthesis. Now I'm part of the plant!",
        instruction: "Drag the sun to shine light on the tree and watch me get absorbed!",
        keyFact: "Plants breathe in CO₂ and use it to grow. They store carbon inside them!",
        interactionType: "drag-sun",
        requiredClicks: 1
    },
    {
        id: 3,
        title: "Animals and Food",
        location: "On a farm",
        background: "scene-animals",
        intro: "A cow just ate the plant I was in! Now I'm inside the cow. When animals eat plants, the carbon moves into their bodies.",
        instruction: "Click each step of the food chain to see how carbon moves!",
        keyFact: "When animals eat, they take in carbon from their food!",
        interactionType: "food-chain",
        requiredClicks: 3
    },
    {
        id: 4,
        title: "Back to the Ground",
        location: "On the forest floor",
        background: "scene-decomposition",
        intro: "When plants and animals die, tiny living things called decomposers break them down. This releases carbon back into the soil and air.",
        instruction: "Watch the leaves decompose over time. Use the slider to speed up time!",
        keyFact: "Decomposers recycle carbon back into the soil and air!",
        interactionType: "decomposition",
        requiredClicks: 1
    },
    {
        id: 5,
        title: "Deep Underground",
        location: "Millions of years ago...",
        background: "scene-fossils",
        intro: "Sometimes, dead plants and animals get buried deep underground. Over millions of years, heat and pressure turn them into fossil fuels like coal and oil.",
        instruction: "Move the time slider to see how fossil fuels form over millions of years!",
        keyFact: "Fossil fuels are made of ancient carbon from plants and animals!",
        interactionType: "fossil-formation",
        requiredClicks: 1
    },
    {
        id: 6,
        title: "Energy and Power",
        location: "At a power plant",
        background: "scene-energy",
        intro: "When we burn fossil fuels to make electricity, the carbon is released back into the air as CO₂. But there are other ways to make energy that don't release carbon!",
        instruction: "Choose different energy sources to see how much CO₂ they release!",
        keyFact: "Burning fossil fuels releases carbon. Solar and wind power don't!",
        interactionType: "energy-choice",
        requiredClicks: 3
    }
];

// Current chapter state
let currentInteraction = {
    clickCount: 0,
    completed: false
};

// Load and display a chapter
function loadChapter(chapterIndex) {
    const chapter = chapters[chapterIndex];
    if (!chapter) return;
    
    // Reset interaction state
    currentInteraction = {
        clickCount: 0,
        completed: false
    };
    
    // Disable next button until interaction is complete
    window.enableNextButton(false);
    
    // Build chapter HTML
    const html = `
        <div class="chapter fade-in ${chapter.background}">
            <h2 class="chapter-title">Chapter ${chapter.id}: ${chapter.title}</h2>
            <p class="chapter-location">📍 ${chapter.location}</p>
            
            <div class="carby-intro">
                <div class="carby"></div>
            </div>
            
            <p class="chapter-intro">${chapter.intro}</p>
            
            <p class="chapter-instruction">${chapter.instruction}</p>
            
            <div class="chapter-scene" id="scene-container">
                ${buildSceneContent(chapter)}
            </div>
            
            <div class="key-fact" id="key-fact" style="opacity: 0; transform: translateY(20px); transition: all 0.5s;">
                ${chapter.keyFact}
            </div>
        </div>
    `;
    
    document.getElementById('story-content').innerHTML = html;
    
    // Initialize the interaction
    initializeInteraction(chapter);
}

// Build scene content based on interaction type
function buildSceneContent(chapter) {
    switch (chapter.interactionType) {
        case 'click-clouds':
            return buildCloudScene();
        case 'drag-sun':
            return buildSunScene();
        case 'food-chain':
            return buildFoodChainScene();
        case 'decomposition':
            return buildDecompositionScene();
        case 'fossil-formation':
            return buildFossilScene();
        case 'energy-choice':
            return buildEnergyScene();
        default:
            return '<p>Interactive scene</p>';
    }
}

// Scene builders for each chapter
function buildCloudScene() {
    return `
        <div class="interactive-area" id="cloud-area" style="background: linear-gradient(180deg, #87CEEB 0%, #E0F4FF 100%); padding: 20px;">
            <div class="clouds-container" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; padding: 20px;">
                ${Array(8).fill(0).map((_, i) => `
                    <div class="cloud clickable" data-index="${i}" style="font-size: 60px; opacity: 0.9; position: relative;">
                        ☁️
                        <span class="hidden-co2" style="display: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 20px; font-weight: bold; color: #333;">CO₂</span>
                    </div>
                `).join('')}
            </div>
            <div class="click-counter" style="text-align: center; margin-top: 16px; font-size: 18px;">
                Found: <span id="click-count">0</span> / 5 CO₂ molecules
            </div>
        </div>
    `;
}

function buildSunScene() {
    return `
        <div class="interactive-area" id="sun-area" style="background: linear-gradient(180deg, #87CEEB 0%, #90EE90 100%); height: 300px; position: relative;">
            <div id="sun" class="draggable" style="position: absolute; top: 20px; left: 20px; font-size: 80px; cursor: grab; user-select: none;">
                ☀️
            </div>
            <div id="tree" style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); font-size: 100px;">
                🌳
            </div>
            <div id="co2-bubble" style="position: absolute; top: 80px; right: 100px; font-size: 24px; background: rgba(255,255,255,0.8); padding: 8px 16px; border-radius: 20px;">
                CO₂ ➡️
            </div>
            <div id="absorption-effect" style="display: none; position: absolute; bottom: 80px; left: 50%; transform: translateX(-50%); font-size: 40px;">
                ✨
            </div>
        </div>
    `;
}

function buildFoodChainScene() {
    return `
        <div class="interactive-area" id="food-chain-area" style="background: linear-gradient(180deg, #98FB98 0%, #8B4513 100%); padding: 40px;">
            <div style="display: flex; justify-content: center; align-items: center; gap: 30px; flex-wrap: wrap;">
                <div class="food-chain-step clickable" data-step="1" style="text-align: center; opacity: 1;">
                    <div style="font-size: 60px;">🌱</div>
                    <p style="color: white; text-shadow: 1px 1px 2px black;">Plant has carbon</p>
                </div>
                <div style="font-size: 40px; color: white;">➡️</div>
                <div class="food-chain-step clickable" data-step="2" style="text-align: center; opacity: 0.4;">
                    <div style="font-size: 60px;">🐄</div>
                    <p style="color: white; text-shadow: 1px 1px 2px black;">Cow eats plant</p>
                </div>
                <div style="font-size: 40px; color: white;">➡️</div>
                <div class="food-chain-step clickable" data-step="3" style="text-align: center; opacity: 0.4;">
                    <div style="font-size: 60px;">💨</div>
                    <p style="color: white; text-shadow: 1px 1px 2px black;">Cow breathes out CO₂</p>
                </div>
            </div>
            <div class="step-counter" style="text-align: center; margin-top: 20px; color: white; font-size: 18px;">
                Step: <span id="step-count">1</span> / 3
            </div>
        </div>
    `;
}

function buildDecompositionScene() {
    return `
        <div class="interactive-area" id="decomposition-area" style="background: linear-gradient(180deg, #8B7355 0%, #5D4E37 100%); padding: 20px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <div id="leaves" style="font-size: 60px; transition: all 0.5s;">
                    🍂🍂🍂🍂🍂
                </div>
                <div id="decompose-stage" style="color: white; margin-top: 10px; font-size: 18px;">
                    Fresh leaves on the ground
                </div>
            </div>
            <div style="text-align: center; margin: 20px 0;">
                <label style="color: white; font-size: 18px;">Time: </label>
                <input type="range" id="time-slider" min="0" max="100" value="0" style="width: 200px; cursor: pointer;">
                <span id="time-label" style="color: white; margin-left: 10px;">0 months</span>
            </div>
            <div id="carbon-release" style="text-align: center; color: white; font-size: 24px; opacity: 0; transition: opacity 0.5s;">
                CO₂ ⬆️ Carbon returns to the air!
            </div>
        </div>
    `;
}

function buildFossilScene() {
    return `
        <div class="interactive-area" id="fossil-area" style="background: linear-gradient(180deg, #4A4A4A 0%, #2C2C2C 100%); padding: 20px;">
            <div style="text-align: center;">
                <div id="fossil-visual" style="font-size: 60px; transition: all 0.5s;">
                    🦕🌿🌿🦴
                </div>
                <div id="fossil-stage" style="color: white; margin-top: 10px; font-size: 18px;">
                    Ancient plants and animals
                </div>
            </div>
            <div style="text-align: center; margin: 20px 0;">
                <label style="color: white; font-size: 18px;">Time: </label>
                <input type="range" id="fossil-slider" min="0" max="100" value="0" style="width: 200px; cursor: pointer;">
                <span id="fossil-time" style="color: white; margin-left: 10px;">0 million years</span>
            </div>
            <div id="pressure-indicator" style="text-align: center; color: #FFD700; font-size: 18px; margin-top: 10px;">
                ⬇️ Heat and pressure building... ⬇️
            </div>
        </div>
    `;
}

function buildEnergyScene() {
    return `
        <div class="interactive-area" id="energy-area" style="background: linear-gradient(180deg, #E0E0E0 0%, #BDBDBD 100%); padding: 20px;">
            <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">
                <div class="energy-option clickable" data-energy="coal" style="text-align: center; padding: 20px; background: white; border-radius: 12px; cursor: pointer; transition: all 0.3s;">
                    <div style="font-size: 50px;">🏭</div>
                    <p style="font-weight: bold;">Coal</p>
                    <p style="font-size: 14px; color: #666;">Fossil fuel</p>
                </div>
                <div class="energy-option clickable" data-energy="solar" style="text-align: center; padding: 20px; background: white; border-radius: 12px; cursor: pointer; transition: all 0.3s;">
                    <div style="font-size: 50px;">☀️</div>
                    <p style="font-weight: bold;">Solar</p>
                    <p style="font-size: 14px; color: #666;">Renewable</p>
                </div>
                <div class="energy-option clickable" data-energy="wind" style="text-align: center; padding: 20px; background: white; border-radius: 12px; cursor: pointer; transition: all 0.3s;">
                    <div style="font-size: 50px;">💨</div>
                    <p style="font-weight: bold;">Wind</p>
                    <p style="font-size: 14px; color: #666;">Renewable</p>
                </div>
            </div>
            <div id="energy-result" style="text-align: center; margin-top: 20px; padding: 16px; background: white; border-radius: 8px; display: none;">
                <p id="energy-message" style="font-size: 18px;"></p>
            </div>
            <div style="text-align: center; margin-top: 16px;">
                Explored: <span id="energy-count">0</span> / 3 energy sources
            </div>
        </div>
    `;
}

// Initialize interactions for each chapter type
function initializeInteraction(chapter) {
    switch (chapter.interactionType) {
        case 'click-clouds':
            initCloudInteraction(chapter);
            break;
        case 'drag-sun':
            initSunInteraction(chapter);
            break;
        case 'food-chain':
            initFoodChainInteraction(chapter);
            break;
        case 'decomposition':
            initDecompositionInteraction(chapter);
            break;
        case 'fossil-formation':
            initFossilInteraction(chapter);
            break;
        case 'energy-choice':
            initEnergyInteraction(chapter);
            break;
    }
}

// Interaction implementations
function initCloudInteraction(chapter) {
    const clouds = document.querySelectorAll('.cloud');
    const revealedClouds = new Set();
    
    clouds.forEach(cloud => {
        cloud.addEventListener('click', () => {
            const index = cloud.dataset.index;
            if (revealedClouds.has(index)) return;
            
            revealedClouds.add(index);
            const co2 = cloud.querySelector('.hidden-co2');
            co2.style.display = 'block';
            cloud.style.opacity = '1';
            
            // Play sound
            if (window.AudioManager) AudioManager.pop();
            
            // Create particle effect
            const rect = cloud.getBoundingClientRect();
            if (window.ParticleSystem) {
                ParticleSystem.burst(rect.left + rect.width/2, rect.top + rect.height/2, 5, {
                    color: '#333333',
                    size: 4,
                    life: 50
                });
            }
            
            currentInteraction.clickCount++;
            document.getElementById('click-count').textContent = currentInteraction.clickCount;
            
            if (currentInteraction.clickCount >= chapter.requiredClicks) {
                completeInteraction();
            }
        });
    });
}

function initSunInteraction(chapter) {
    const sun = document.getElementById('sun');
    const tree = document.getElementById('tree');
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;
    
    sun.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        initialLeft = sun.offsetLeft;
        initialTop = sun.offsetTop;
        sun.style.cursor = 'grabbing';
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        
        sun.style.left = (initialLeft + dx) + 'px';
        sun.style.top = (initialTop + dy) + 'px';
    });
    
    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        sun.style.cursor = 'grab';
        
        // Check if sun is near tree
        const sunRect = sun.getBoundingClientRect();
        const treeRect = tree.getBoundingClientRect();
        
        const distance = Math.sqrt(
            Math.pow(sunRect.left - treeRect.left, 2) + 
            Math.pow(sunRect.top - treeRect.top, 2)
        );
        
        if (distance < 200 && !currentInteraction.completed) {
            // Trigger absorption
            document.getElementById('absorption-effect').style.display = 'block';
            document.getElementById('co2-bubble').innerHTML = '✓ Absorbed!';
            document.getElementById('co2-bubble').style.background = '#90EE90';
            
            if (window.AudioManager) AudioManager.absorb();
            
            if (window.ParticleSystem) {
                ParticleSystem.stream(
                    sunRect.left + 40,
                    sunRect.top + 40,
                    treeRect.left + 50,
                    treeRect.top + 50,
                    { color: '#FFD700', size: 8 }
                );
            }
            
            completeInteraction();
        }
    });
}

function initFoodChainInteraction(chapter) {
    const steps = document.querySelectorAll('.food-chain-step');
    let currentStep = 1;
    
    steps.forEach(step => {
        step.addEventListener('click', () => {
            const stepNum = parseInt(step.dataset.step);
            
            if (stepNum === currentStep) {
                step.style.opacity = '1';
                step.style.transform = 'scale(1.1)';
                
                if (window.AudioManager) AudioManager.click();
                
                currentStep++;
                document.getElementById('step-count').textContent = Math.min(currentStep, 3);
                
                // Highlight next step
                const nextStep = document.querySelector(`[data-step="${currentStep}"]`);
                if (nextStep) {
                    nextStep.style.opacity = '0.7';
                }
                
                if (currentStep > 3) {
                    completeInteraction();
                }
            }
        });
    });
}

function initDecompositionInteraction(chapter) {
    const slider = document.getElementById('time-slider');
    const leaves = document.getElementById('leaves');
    const stage = document.getElementById('decompose-stage');
    const timeLabel = document.getElementById('time-label');
    const carbonRelease = document.getElementById('carbon-release');
    
    slider.addEventListener('input', () => {
        const value = parseInt(slider.value);
        timeLabel.textContent = `${value} months`;
        
        if (value < 25) {
            leaves.textContent = '🍂🍂🍂🍂🍂';
            stage.textContent = 'Fresh leaves on the ground';
            carbonRelease.style.opacity = '0';
        } else if (value < 50) {
            leaves.textContent = '🍂🍂🍂';
            leaves.style.opacity = '0.8';
            stage.textContent = 'Leaves are breaking down...';
            carbonRelease.style.opacity = '0.3';
        } else if (value < 75) {
            leaves.textContent = '🍂';
            leaves.style.opacity = '0.5';
            stage.textContent = 'Decomposers are at work!';
            carbonRelease.style.opacity = '0.6';
        } else {
            leaves.textContent = '🌱';
            leaves.style.opacity = '1';
            stage.textContent = 'Carbon returned to nature!';
            carbonRelease.style.opacity = '1';
            
            if (!currentInteraction.completed) {
                if (window.AudioManager) AudioManager.success();
                completeInteraction();
            }
        }
    });
}

function initFossilInteraction(chapter) {
    const slider = document.getElementById('fossil-slider');
    const visual = document.getElementById('fossil-visual');
    const stage = document.getElementById('fossil-stage');
    const timeLabel = document.getElementById('fossil-time');
    const pressure = document.getElementById('pressure-indicator');
    
    slider.addEventListener('input', () => {
        const value = parseInt(slider.value);
        timeLabel.textContent = `${value} million years`;
        
        if (value < 25) {
            visual.textContent = '🦕🌿🌿🦴';
            stage.textContent = 'Ancient plants and animals';
            pressure.textContent = '⬇️ Heat and pressure building... ⬇️';
        } else if (value < 50) {
            visual.textContent = '🪨🌿🪨';
            stage.textContent = 'Being buried under layers of rock...';
            pressure.textContent = '⬇️⬇️ More pressure! ⬇️⬇️';
        } else if (value < 75) {
            visual.textContent = '🪨⚫🪨';
            stage.textContent = 'Turning into fossil fuels...';
            pressure.textContent = '🔥 Heat transforms the carbon! 🔥';
        } else {
            visual.textContent = '🛢️⛽💎';
            stage.textContent = 'Fossil fuels formed! (Coal, Oil, Gas)';
            pressure.textContent = '✨ Carbon stored underground for millions of years! ✨';
            
            if (!currentInteraction.completed) {
                if (window.AudioManager) AudioManager.success();
                completeInteraction();
            }
        }
    });
}

function initEnergyInteraction(chapter) {
    const options = document.querySelectorAll('.energy-option');
    const exploredEnergies = new Set();
    
    const messages = {
        coal: { 
            text: '🏭 Coal releases lots of CO₂! The carbon that was stored for millions of years goes back into the air.',
            color: '#FFCDD2'
        },
        solar: { 
            text: '☀️ Solar power makes electricity from sunlight. No CO₂ is released!',
            color: '#C8E6C9'
        },
        wind: { 
            text: '💨 Wind turbines use moving air to make electricity. No CO₂ is released!',
            color: '#C8E6C9'
        }
    };
    
    options.forEach(option => {
        option.addEventListener('click', () => {
            const energy = option.dataset.energy;
            const result = document.getElementById('energy-result');
            const message = document.getElementById('energy-message');
            
            result.style.display = 'block';
            result.style.background = messages[energy].color;
            message.textContent = messages[energy].text;
            
            option.style.border = '3px solid #2196F3';
            
            if (window.AudioManager) AudioManager.click();
            
            if (!exploredEnergies.has(energy)) {
                exploredEnergies.add(energy);
                document.getElementById('energy-count').textContent = exploredEnergies.size;
                
                if (exploredEnergies.size >= 3) {
                    completeInteraction();
                }
            }
        });
    });
}

// Complete the current interaction
function completeInteraction() {
    if (currentInteraction.completed) return;
    
    currentInteraction.completed = true;
    
    // Show key fact with animation
    const keyFact = document.getElementById('key-fact');
    if (keyFact) {
        keyFact.style.opacity = '1';
        keyFact.style.transform = 'translateY(0)';
    }
    
    // Play completion sound
    if (window.AudioManager) AudioManager.complete();
    
    // Enable next button
    window.enableNextButton(true);
}

// Make loadChapter globally available
window.loadChapter = loadChapter;
