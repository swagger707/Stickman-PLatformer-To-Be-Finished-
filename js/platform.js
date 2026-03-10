// Platform class: handles position, size, and drawing
class Platform {
    constructor(x, y, width, height, type = 'normal') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
        this.offset = 0; // for moving platforms
    }

    update() {
        if (this.type === 'moving') {
            this.offset += 0.04;
            this.x += Math.sin(this.offset) * 2;
        }
    }

    draw(ctx) {
        ctx.save();
        // Platform base
        ctx.fillStyle = '#4e5d3a';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        // Moss top
        ctx.fillStyle = '#7ec850';
        ctx.fillRect(this.x, this.y, this.width, 8);
        // Moss drips
        for (let i = 0; i < this.width; i += 24) {
            ctx.beginPath();
            ctx.moveTo(this.x + i + 8, this.y + 8);
            ctx.lineTo(this.x + i + 12, this.y + 18);
            ctx.lineTo(this.x + i + 16, this.y + 8);
            ctx.closePath();
            ctx.fillStyle = '#7ec850';
            ctx.fill();
        }
        // Shading
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = '#000';
        ctx.fillRect(this.x, this.y + this.height - 8, this.width, 8);
        ctx.globalAlpha = 1;
        ctx.restore();
    }
}
