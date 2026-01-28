/* ============================================
   Carbon Cycle Explorer - Particle System
   Simple canvas-based particle effects
   ============================================ */

const ParticleSystem = {
    canvas: null,
    ctx: null,
    particles: [],
    animationId: null,
    enabled: true,
    
    init() {
        this.canvas = document.getElementById('particle-canvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        
        // Handle window resize
        window.addEventListener('resize', () => this.resize());
        
        // Start animation loop
        this.animate();
    },
    
    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },
    
    // Create a carbon particle at a specific position
    createParticle(x, y, options = {}) {
        const particle = {
            x,
            y,
            vx: options.vx || (Math.random() - 0.5) * 2,
            vy: options.vy || (Math.random() - 0.5) * 2,
            size: options.size || 6,
            color: options.color || '#333333',
            life: options.life || 100,
            maxLife: options.life || 100,
            gravity: options.gravity || 0,
            fade: options.fade !== undefined ? options.fade : true
        };
        
        this.particles.push(particle);
        return particle;
    },
    
    // Create multiple particles in a burst
    burst(x, y, count = 10, options = {}) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = options.speed || 3;
            this.createParticle(x, y, {
                ...options,
                vx: Math.cos(angle) * speed * (0.5 + Math.random() * 0.5),
                vy: Math.sin(angle) * speed * (0.5 + Math.random() * 0.5)
            });
        }
    },
    
    // Create a stream of particles from one point to another
    stream(fromX, fromY, toX, toY, options = {}) {
        const dx = toX - fromX;
        const dy = toY - fromY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const speed = options.speed || 5;
        const duration = distance / speed;
        
        const particle = this.createParticle(fromX, fromY, {
            ...options,
            vx: (dx / distance) * speed,
            vy: (dy / distance) * speed,
            life: duration,
            fade: false
        });
        
        return particle;
    },
    
    // Create floating particles (like CO2 in atmosphere)
    floatUp(x, y, count = 5) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                this.createParticle(x + (Math.random() - 0.5) * 40, y, {
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: -1 - Math.random() * 2,
                    size: 4 + Math.random() * 4,
                    life: 150,
                    color: '#555555'
                });
            }, i * 100);
        }
    },
    
    // Update and draw all particles
    animate() {
        if (!this.ctx || !this.enabled) {
            this.animationId = requestAnimationFrame(() => this.animate());
            return;
        }
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw each particle
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            
            // Update position
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.life--;
            
            // Remove dead particles
            if (p.life <= 0) {
                this.particles.splice(i, 1);
                continue;
            }
            
            // Calculate opacity
            const opacity = p.fade ? p.life / p.maxLife : 1;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = this.hexToRgba(p.color, opacity);
            this.ctx.fill();
            
            // Add "C" label for larger particles
            if (p.size >= 6) {
                this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
                this.ctx.font = `bold ${Math.floor(p.size)}px Arial`;
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText('C', p.x, p.y);
            }
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    },
    
    // Helper to convert hex color to rgba
    hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    },
    
    // Clear all particles
    clear() {
        this.particles = [];
    },
    
    // Enable/disable the particle system
    setEnabled(enabled) {
        this.enabled = enabled;
        if (!enabled) {
            this.clear();
        }
    }
};

// Make globally available
window.ParticleSystem = ParticleSystem;
