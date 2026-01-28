/* ============================================
   Carbon Cycle Explorer - Sandbox Mode
   Interactive world building and carbon flow
   ============================================ */

// Sandbox state
const SandboxState = {
    elements: [],
    co2Level: 400, // ppm baseline
    timeSpeed: 1,
    running: false,
    animationId: null
};

// Element definitions
const sandboxElements = {
    tree: { emoji: '🌳', name: 'Tree', zone: 'ground', carbonEffect: -2 },
    factory: { emoji: '🏭', name: 'Factory', zone: 'ground', carbonEffect: 5 },
    car: { emoji: '🚗', name: 'Car', zone: 'ground', carbonEffect: 1 },
    cow: { emoji: '🐄', name: 'Cow', zone: 'ground', carbonEffect: 0.5 },
    solar: { emoji: '☀️', name: 'Solar Panel', zone: 'ground', carbonEffect: 0 },
    wind: { emoji: '💨', name: 'Wind Turbine', zone: 'ground', carbonEffect: 0 },
    fish: { emoji: '🐟', name: 'Fish', zone: 'ground', carbonEffect: 0 },
    house: { emoji: '🏠', name: 'House', zone: 'ground', carbonEffect: 0.5 }
};

// Initialize sandbox
function initSandbox() {
    SandboxState.elements = [];
    SandboxState.co2Level = 400;
    SandboxState.timeSpeed = 1;
    SandboxState.running = true;
    
    buildSandboxUI();
    startSandboxLoop();
}

// Build the sandbox UI
function buildSandboxUI() {
    const content = document.getElementById('sandbox-content');
    
    content.innerHTML = `
        <div class="sandbox-header" style="text-align: center; margin-bottom: 16px;">
            <h2 style="color: #4CAF50; margin-bottom: 8px;">🌍 Your Carbon World</h2>
            <p style="color: #666;">Drag items from the palette into the world. Watch how they affect CO₂!</p>
        </div>
        
        <div class="sandbox-world" id="sandbox-world">
            <div class="sandbox-zone zone-sky" id="zone-sky">
                <div class="zone-label" style="position: absolute; top: 10px; left: 10px; color: white; font-size: 14px; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">
                    ☁️ Atmosphere
                </div>
                <div id="co2-visual" style="position: absolute; top: 10px; right: 10px; background: rgba(255,255,255,0.8); padding: 8px 16px; border-radius: 8px; font-size: 14px;">
                    CO₂: <span id="co2-display">400</span> ppm
                </div>
            </div>
            <div class="sandbox-zone zone-ground" id="zone-ground">
                <div class="zone-label" style="position: absolute; top: 10px; left: 10px; color: white; font-size: 14px; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">
                    🌿 Surface
                </div>
            </div>
            <div class="sandbox-zone zone-underground" id="zone-underground">
                <div class="zone-label" style="position: absolute; top: 10px; left: 10px; color: white; font-size: 14px; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">
                    🪨 Underground (Fossil Fuels)
                </div>
            </div>
            <canvas id="carbon-flow-canvas" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;"></canvas>
        </div>
        
        <div class="sandbox-controls">
            <div class="sandbox-palette" id="element-palette">
                ${Object.entries(sandboxElements).map(([key, el]) => `
                    <div class="palette-item" draggable="true" data-element="${key}" title="${el.name} (CO₂: ${el.carbonEffect > 0 ? '+' : ''}${el.carbonEffect})">
                        ${el.emoji}
                    </div>
                `).join('')}
            </div>
            
            <div class="co2-display">
                <span>🌡️ Atmosphere CO₂:</span>
                <span id="co2-level" style="font-weight: bold; color: #333;">400 ppm</span>
                <span id="co2-status" style="font-size: 24px;">😊</span>
            </div>
            
            <div class="speed-control">
                <label>⏱️ Speed:</label>
                <select id="speed-select">
                    <option value="0.5">Slow</option>
                    <option value="1" selected>Normal</option>
                    <option value="2">Fast</option>
                </select>
            </div>
            
            <button id="reset-sandbox" class="secondary-button" style="padding: 8px 16px; min-width: auto;">
                🔄 Reset
            </button>
        </div>
        
        <div class="sandbox-info" style="background: rgba(255,255,255,0.9); padding: 12px; border-radius: 8px; margin-top: 12px; font-size: 14px;">
            <strong>How it works:</strong> 
            🌳 Trees absorb CO₂ (-2) | 
            🏭 Factories release CO₂ (+5) | 
            🚗 Cars release CO₂ (+1) | 
            ☀️💨 Clean energy (0)
        </div>
    `;
    
    // Set up event listeners
    setupSandboxListeners();
}

// Set up drag and drop and other interactions
function setupSandboxListeners() {
    const palette = document.getElementById('element-palette');
    const world = document.getElementById('sandbox-world');
    const speedSelect = document.getElementById('speed-select');
    const resetBtn = document.getElementById('reset-sandbox');
    
    // Palette drag start
    palette.addEventListener('dragstart', (e) => {
        if (e.target.classList.contains('palette-item')) {
            e.dataTransfer.setData('element', e.target.dataset.element);
            e.target.style.opacity = '0.5';
        }
    });
    
    palette.addEventListener('dragend', (e) => {
        if (e.target.classList.contains('palette-item')) {
            e.target.style.opacity = '1';
        }
    });
    
    // World drop zone
    world.addEventListener('dragover', (e) => {
        e.preventDefault();
    });
    
    world.addEventListener('drop', (e) => {
        e.preventDefault();
        const elementType = e.dataTransfer.getData('element');
        if (elementType && sandboxElements[elementType]) {
            const rect = world.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            addElementToWorld(elementType, x, y);
        }
    });
    
    // Speed control
    speedSelect.addEventListener('change', (e) => {
        SandboxState.timeSpeed = parseFloat(e.target.value);
    });
    
    // Reset button
    resetBtn.addEventListener('click', () => {
        if (window.AudioManager) AudioManager.click();
        initSandbox();
    });
}

// Add an element to the world
function addElementToWorld(type, x, y) {
    const world = document.getElementById('sandbox-world');
    const element = sandboxElements[type];
    
    const el = document.createElement('div');
    el.className = 'sandbox-element';
    el.dataset.type = type;
    el.textContent = element.emoji;
    el.style.left = `${x - 20}px`;
    el.style.top = `${y - 20}px`;
    
    // Make draggable within world
    let isDragging = false;
    let startX, startY;
    
    el.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX - el.offsetLeft;
        startY = e.clientY - el.offsetTop;
        el.classList.add('dragging');
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        el.style.left = `${e.clientX - startX}px`;
        el.style.top = `${e.clientY - startY}px`;
    });
    
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            el.classList.remove('dragging');
        }
    });
    
    // Double-click to remove
    el.addEventListener('dblclick', () => {
        const index = SandboxState.elements.findIndex(item => item.el === el);
        if (index > -1) {
            SandboxState.elements.splice(index, 1);
        }
        el.remove();
        if (window.AudioManager) AudioManager.pop();
    });
    
    world.appendChild(el);
    
    // Track element
    SandboxState.elements.push({
        type,
        el,
        carbonEffect: element.carbonEffect
    });
    
    if (window.AudioManager) AudioManager.pop();
}

// Main sandbox update loop
function startSandboxLoop() {
    let lastTime = Date.now();
    
    function update() {
        if (!SandboxState.running) return;
        
        const now = Date.now();
        const delta = (now - lastTime) / 1000; // seconds
        lastTime = now;
        
        // Calculate total carbon effect
        let totalEffect = 0;
        SandboxState.elements.forEach(el => {
            totalEffect += el.carbonEffect;
        });
        
        // Update CO2 level
        SandboxState.co2Level += totalEffect * delta * SandboxState.timeSpeed * 0.1;
        SandboxState.co2Level = Math.max(200, Math.min(800, SandboxState.co2Level));
        
        // Update display
        updateCO2Display();
        
        SandboxState.animationId = requestAnimationFrame(update);
    }
    
    update();
}

// Update CO2 display
function updateCO2Display() {
    const level = Math.round(SandboxState.co2Level);
    const display = document.getElementById('co2-display');
    const levelEl = document.getElementById('co2-level');
    const status = document.getElementById('co2-status');
    
    if (display) display.textContent = level;
    if (levelEl) levelEl.textContent = `${level} ppm`;
    
    // Update status emoji and color
    if (status) {
        if (level < 350) {
            status.textContent = '🌟';
            if (levelEl) levelEl.style.color = '#4CAF50';
        } else if (level < 450) {
            status.textContent = '😊';
            if (levelEl) levelEl.style.color = '#8BC34A';
        } else if (level < 550) {
            status.textContent = '😐';
            if (levelEl) levelEl.style.color = '#FFC107';
        } else if (level < 650) {
            status.textContent = '😟';
            if (levelEl) levelEl.style.color = '#FF9800';
        } else {
            status.textContent = '😰';
            if (levelEl) levelEl.style.color = '#F44336';
        }
    }
    
    // Update sky color based on CO2
    const sky = document.getElementById('zone-sky');
    if (sky) {
        const hue = Math.max(180, 200 - (level - 400) * 0.2); // Blue shifts towards gray
        const saturation = Math.max(20, 60 - (level - 400) * 0.1);
        sky.style.background = `linear-gradient(180deg, hsl(${hue}, ${saturation}%, 70%) 0%, hsl(${hue}, ${saturation}%, 80%) 100%)`;
    }
}

// Clean up when leaving sandbox
function cleanupSandbox() {
    SandboxState.running = false;
    if (SandboxState.animationId) {
        cancelAnimationFrame(SandboxState.animationId);
    }
}

// Make functions globally available
window.initSandbox = initSandbox;
window.cleanupSandbox = cleanupSandbox;
