const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

// --- 1. CONFIGURATION & LEVEL DATA ---
const levelWidth = 3000;
const winPoint = 2800;
const keys = {};
let scrollOffset = 0;
let gameActive = true;

// --- 2. PLATFORM CLASS ---
class Platform {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw(ctx, offset) {
        // Dark stone base
        ctx.fillStyle = '#4a4e4d';
        ctx.fillRect(this.x - offset, this.y, this.width, this.height);
        
        // Mossy top layer
        ctx.fillStyle = '#2d5a27';
        ctx.fillRect(this.x - offset, this.y, this.width, 10);
    }
}

const platforms = [
    new Platform(0, 520, 600, 80),     // Start
    new Platform(750, 420, 250, 30),    // First jump
    new Platform(1150, 520, 600, 80),   // Middle
    new Platform(1900, 380, 200, 30),   // High platform
    new Platform(2300, 520, 1000, 80)   // Goal area
];

// --- 3. PLAYER CLASS ---
class Player {
    constructor() {
        this.pos = { x: 100, y: 100 };
        this.vel = { x: 0, y: 0 };
        this.width = 30;
        this.height = 50;
        this.gravity = 0.8;
        this.speed = 5;
        this.jumpStrength = -16;
        this.grounded = false;
    }

    draw(ctx) {
        // Legs (Dark Blue)
        ctx.fillStyle = '#191970';
        ctx.fillRect(this.pos.x, this.pos.y + 25, 10, 25); 
        ctx.fillRect(this.pos.x + 20, this.pos.y + 25, 10, 25);

        // Torso (Green T-Shirt)
        ctx.fillStyle = '#2ecc71';
        ctx.fillRect(this.pos.x, this.pos.y + 15, 30, 20);

        // Head (Round White)
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.pos.x + 15, this.pos.y + 5, 15, 0, Math.PI * 2);
        ctx.fill();

        // Red Bandana
        ctx.fillStyle = 'red';
        ctx.fillRect(this.pos.x, this.pos.y - 2, 30, 6); 
        
        // Red Slash on cheek
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.pos.x + 18, this.pos.y + 5);
        ctx.lineTo(this.pos.x + 23, this.pos.y + 10);
        ctx.stroke();
    }

    update() {
        // Horizontal Movement
        if (keys.ArrowRight || keys.d) this.vel.x = this.speed;
        else if (keys.ArrowLeft || keys.a) this.vel.x = -this.speed;
        else this.vel.x = 0;

        this.pos.x += this.vel.x;

        // Gravity
        this.vel.y += this.gravity;
        this.pos.y += this.vel.y;

        // Collision Logic
        this.grounded = false;
        platforms.forEach(platform => {
            // Adjust platform boundary relative to camera for collision
            const pX = platform.x - scrollOffset;
            if (
                this.pos.x < pX + platform.width &&
                this.pos.x + this.width > pX &&
                this.pos.y + this.height > platform.y &&
                this.pos.y + this.height < platform.y + platform.height &&
                this.vel.y >= 0
            ) {
                this.vel.y = 0;
                this.pos.y = platform.y - this.height;
                this.grounded = true;
            }
        });

        // Jump
        if (this.grounded && (keys.ArrowUp || keys.w || keys.Space)) {
            this.vel.y = this.jumpStrength;
        }
    }
}

const player = new Player();

// --- 4. INPUT HANDLING ---
window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => keys[e.key] = false);

// --- 5. MAIN GAME LOOP ---
function animate() {
    if (!gameActive) return;
    requestAnimationFrame(animate);

    // Clear Screen (Temple Sky)
    ctx.fillStyle = '#1e272e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Camera/Scrolling Logic
    // If player moves past the 400px mark, scroll the world instead
    if (player.pos.x > 400 && scrollOffset < winPoint - 400) {
        scrollOffset += player.vel.x;
        player.pos.x = 400; 
    } else if (player.pos.x < 100 && scrollOffset > 0) {
        scrollOffset += player.vel.x;
        player.pos.x = 100;
    }

    // Draw Platforms
    platforms.forEach(p => p.draw(ctx, scrollOffset));

    // Update & Draw Player
    player.update();
    player.draw(ctx);

    // Win/Loss Condition
    if (scrollOffset + player.pos.x > winPoint) {
        ctx.fillStyle = 'white';
        ctx.font = 'bold 50px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('YOU WIN!', canvas.width / 2, canvas.height / 2);
        gameActive = false;
    }

    if (player.pos.y > canvas.height) {
        // Reset player if they fall in a gap
        player.pos = { x: 100, y: 100 };
        player.vel = { x: 0, y: 0 };
        scrollOffset = 0;
    }
}

animate();