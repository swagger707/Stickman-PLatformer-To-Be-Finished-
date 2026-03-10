// Player class: handles movement, gravity, collision, and drawing
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.width = 32;
        this.height = 54;
        this.onGround = false;
        this.animFrame = 0;
        this.animCounter = 0;
        this.facing = 1;
        this.coyoteTime = 0;
        this.maxCoyote = 8; // frames of coyote time
        this.jumpBuffer = 0;
        this.maxJumpBuffer = 8;
    }

    update(keys, platforms) {
        // Horizontal movement
        let speed = 4.2;
        if (keys['arrowleft'] || keys['a']) {
            this.vx = -speed;
            this.facing = -1;
        } else if (keys['arrowright'] || keys['d']) {
            this.vx = speed;
            this.facing = 1;
        } else {
            this.vx = 0;
        }

        // Jump buffering
        if (keys['arrowup'] || keys['w'] || keys[' ']) {
            this.jumpBuffer = this.maxJumpBuffer;
        } else if (this.jumpBuffer > 0) {
            this.jumpBuffer--;
        }

        // Gravity
        let gravity = 0.55;
        let maxVy = 11;
        this.vy += gravity;
        if (this.vy > maxVy) this.vy = maxVy;

        // Move and collide
        this.x += this.vx;
        this.y += this.vy;
        let wasOnGround = this.onGround;
        this.onGround = false;
        for (let p of platforms) {
            if (this.x + this.width > p.x && this.x < p.x + p.width &&
                this.y + this.height > p.y && this.y + this.height - this.vy <= p.y) {
                // Landed on platform
                this.y = p.y - this.height;
                this.vy = 0;
                this.onGround = true;
                this.coyoteTime = this.maxCoyote;
            }
        }
        if (!this.onGround && this.coyoteTime > 0) {
            this.coyoteTime--;
        }

        // Smoother jump: allow jump if on ground or within coyote time
        if (this.jumpBuffer > 0 && (this.onGround || this.coyoteTime > 0)) {
            this.vy = -11.5;
            this.onGround = false;
            this.coyoteTime = 0;
            this.jumpBuffer = 0;
        }

        // Animation
        if (Math.abs(this.vx) > 0.1 && this.onGround) {
            this.animCounter++;
            if (this.animCounter % 6 === 0) {
                this.animFrame = (this.animFrame + 1) % 4;
            }
        } else {
            this.animFrame = 0;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(this.facing, 1);
        // Shadow
        ctx.save();
        ctx.globalAlpha = 0.18;
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.ellipse(16, 54, 16, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        // Animated legs
        ctx.fillStyle = '#1a2a5a';
        let legY = 38;
        let legAnim = this.animFrame;
        if (!this.onGround) legAnim = 2;
        // Left leg
        ctx.save();
        ctx.translate(7, legY);
        ctx.rotate((legAnim === 1 ? 0.2 : legAnim === 3 ? -0.2 : 0));
        ctx.fillRect(0, 0, 7, 16);
        ctx.restore();
        // Right leg
        ctx.save();
        ctx.translate(18, legY);
        ctx.rotate((legAnim === 3 ? 0.2 : legAnim === 1 ? -0.2 : 0));
        ctx.fillRect(0, 0, 7, 16);
        ctx.restore();
        // Body (shaded)
        let grad = ctx.createLinearGradient(7, 18, 25, 40);
        grad.addColorStop(0, '#2ecc40');
        grad.addColorStop(1, '#197d2c');
        ctx.fillStyle = grad;
        ctx.fillRect(7, 18, 18, 22);
        // Arms (animated, shaded)
        ctx.save();
        ctx.strokeStyle = '#1a2a5a';
        ctx.lineWidth = 5;
        ctx.shadowColor = '#1a2a5a';
        ctx.shadowBlur = 2;
        ctx.beginPath();
        ctx.moveTo(7, 22);
        ctx.lineTo(legAnim === 1 ? 0 : 2, 38);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(25, 22);
        ctx.lineTo(legAnim === 3 ? 34 : 30, 38);
        ctx.stroke();
        ctx.restore();
        // Head (shaded)
        let headGrad = ctx.createRadialGradient(16, 12, 6, 16, 12, 12);
        headGrad.addColorStop(0, '#fff');
        headGrad.addColorStop(1, '#e0e0e0');
        ctx.beginPath();
        ctx.arc(16, 12, 12, 0, Math.PI * 2);
        ctx.fillStyle = headGrad;
        ctx.fill();
        // Bandana (with flow)
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(4, 8); ctx.lineTo(28, 8); ctx.lineTo(28, 16); ctx.lineTo(4, 16); ctx.closePath();
        ctx.fillStyle = '#e74c3c';
        ctx.shadowColor = '#e74c3c';
        ctx.shadowBlur = 4;
        ctx.fill();
        // Bandana tails (wavy)
        ctx.beginPath();
        ctx.moveTo(28, 12);
        ctx.bezierCurveTo(36, 6 + Math.sin(Date.now()/120)*4, 30, 16, 34, 18);
        ctx.lineTo(30, 16);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        // Cheek slash
        ctx.strokeStyle = '#e74c3c';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(22, 18); ctx.lineTo(28, 22);
        ctx.stroke();
        // Face (eyes, mouth)
        ctx.fillStyle = '#222';
        ctx.beginPath();
        ctx.arc(12, 12, 2, 0, Math.PI * 2);
        ctx.arc(20, 12, 2, 0, Math.PI * 2);
        ctx.fill();
        // Mouth
        ctx.strokeStyle = '#444';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(16, 17, 4, 0.15, Math.PI-0.15);
        ctx.stroke();
        ctx.restore();
    }
}
