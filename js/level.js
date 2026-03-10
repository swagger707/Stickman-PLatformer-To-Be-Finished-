let levels = [];
function loadAllLevels() {
    levels = [
        // Level 1: now with more gaps and vertical movement
        [
            new Platform(0, 440, 200, 60),
            new Platform(300, 400, 100, 20),
            new Platform(500, 340, 100, 20),
            new Platform(700, 280, 100, 20),
            new Platform(900, 220, 100, 20),
            new Platform(1100, 160, 100, 20),
            new Platform(1300, 440, 200, 60),
            new Platform(1550, 380, 100, 20, 'moving'),
            new Platform(1750, 320, 100, 20),
            new Platform(1950, 440, 200, 60),
        ],
        // Level 2: more moving/floating, less ground
        [
            new Platform(0, 440, 120, 60),
            new Platform(200, 400, 100, 20, 'moving'),
            new Platform(400, 340, 100, 20),
            new Platform(600, 280, 100, 20, 'moving'),
            new Platform(800, 220, 100, 20),
            new Platform(1000, 160, 100, 20, 'moving'),
            new Platform(1200, 440, 120, 60),
            new Platform(1400, 380, 100, 20, 'moving'),
            new Platform(1600, 320, 100, 20),
            new Platform(1800, 440, 120, 60),
        ],
        // Level 3: very hard, long jumps, many moving
        [
            new Platform(0, 440, 100, 60),
            new Platform(250, 400, 80, 20, 'moving'),
            new Platform(450, 340, 80, 20),
            new Platform(650, 280, 80, 20, 'moving'),
            new Platform(850, 220, 80, 20),
            new Platform(1050, 160, 80, 20, 'moving'),
            new Platform(1250, 100, 80, 20),
            new Platform(1450, 440, 100, 60),
            new Platform(1700, 380, 80, 20, 'moving'),
            new Platform(1900, 320, 80, 20),
            new Platform(2100, 440, 100, 60),
        ],
        // Level 4: new, extremely hard, lots of moving and vertical
        [
            new Platform(0, 440, 80, 60),
            new Platform(200, 400, 60, 20, 'moving'),
            new Platform(400, 340, 60, 20, 'moving'),
            new Platform(600, 280, 60, 20, 'moving'),
            new Platform(800, 220, 60, 20, 'moving'),
            new Platform(1000, 160, 60, 20, 'moving'),
            new Platform(1200, 100, 60, 20, 'moving'),
            new Platform(1400, 200, 60, 20, 'moving'),
            new Platform(1600, 300, 60, 20, 'moving'),
            new Platform(1800, 400, 60, 20, 'moving'),
            new Platform(2000, 440, 80, 60),
        ]
    ];
    totalLevels = levels.length;
}

function loadLevel(idx = 0) {
    platforms = levels[idx].map(p => Object.assign(Object.create(Object.getPrototypeOf(p)), p));
    levelEndX = Math.max(...platforms.map(p => p.x + p.width)) - 100;
}

function drawBackground(ctx, cameraX, levelIdx = 0) {
    // Mystical mossy temple: layered mist, lighting, color palette
    ctx.fillStyle = '#1b2320';
    ctx.fillRect(cameraX, 0, 3000, 500);
    // Mist layers
    for (let i = 0; i < 3; i++) {
        ctx.save();
        ctx.globalAlpha = 0.10 + i*0.07;
        ctx.fillStyle = ['#b2f7ef','#a7c7e7','#e0ffe0'][i];
        ctx.beginPath();
        ctx.ellipse(cameraX+600+i*400, 420-i*30, 600, 60, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
    }
    // Pillars
    for (let i = 0; i < 8; i++) {
        ctx.fillStyle = '#2e3d2f';
        ctx.fillRect(300 + i*400, 120, 36, 320);
        ctx.fillStyle = '#7ec850';
        ctx.fillRect(300 + i*400, 120, 36, 16);
    }
    // Decorative blocks (reduced)
    for (let i = 0; i < 10; i++) {
        ctx.fillStyle = '#3e4e3a';
        ctx.fillRect(80 + i*250, 420, 40, 20);
        ctx.fillStyle = '#7ec850';
        ctx.fillRect(80 + i*250, 420, 40, 6);
    }
    // Vines
    ctx.strokeStyle = '#5fa147';
    ctx.lineWidth = 4;
    for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        ctx.moveTo(200 + i*250, 0);
        ctx.bezierCurveTo(220 + i*250, 80, 180 + i*250, 160, 210 + i*250, 300);
        ctx.stroke();
    }
    // Cracks
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        let x = 100 + i*350;
        ctx.moveTo(x, 440);
        ctx.lineTo(x+10, 460);
        ctx.stroke();
    }
    // Light rays
    for (let i = 0; i < 4; i++) {
        ctx.save();
        ctx.globalAlpha = 0.08;
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.moveTo(cameraX+400+i*500, 0);
        ctx.lineTo(cameraX+500+i*500, 0);
        ctx.lineTo(cameraX+600+i*500, 500);
        ctx.lineTo(cameraX+300+i*500, 500);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}
