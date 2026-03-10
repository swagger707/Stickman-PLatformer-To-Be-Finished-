// Main game loop and core logic
let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');

const CAMERA_OFFSET_X = 200;
let cameraX = 0;

let player;
let platforms = [];
let levelEndX = 0;
let keys = {};
let gameWon = false;
let gameOver = false;
let currentLevel = 0;
let totalLevels = 0;

function init() {
    // Level and player setup
    loadAllLevels();
    loadLevel(currentLevel);
    player = new Player(60, 300);
    keys = {};
    // Only use these listeners:
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    requestAnimationFrame(gameLoop);
}

function handleKeyDown(e) {
    const key = e.key.toLowerCase();
    keys[key] = true;
    if (gameWon && key === 'n') {
        currentLevel++;
        if (currentLevel >= totalLevels) currentLevel = 0;
        loadLevel(currentLevel);
        player = new Player(60, 300);
        gameWon = false;
        gameOver = false;
    }
    if (gameOver && key === 'r') {
        loadLevel(currentLevel);
        player = new Player(60, 300);
        gameWon = false;
        gameOver = false;
    }
}

function handleKeyUp(e) {
    keys[e.key.toLowerCase()] = false;
}

function gameLoop() {
    update();
    draw();
    if (!gameWon && !gameOver) requestAnimationFrame(gameLoop);
}

function update() {
    player.update(keys, platforms);
    // Camera follows player
    cameraX = Math.max(0, player.x - CAMERA_OFFSET_X);
    // Win condition
    if (player.x > levelEndX && !gameOver) {
        gameWon = true;
    }
    // Game over if player falls
    if (player.y > canvas.height) {
        gameOver = true;
    }
}

function draw() {
    ctx.save();
    ctx.translate(-cameraX, 0);
    drawBackground(ctx, cameraX, currentLevel);
    platforms.forEach(p => p.draw(ctx));
    player.draw(ctx);
    ctx.restore();
    // Win message
    if (gameWon) {
        ctx.save();
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = '#222';
        ctx.fillRect(0, canvas.height/2-60, canvas.width, 120);
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#fff';
        ctx.font = '36px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('You Win! Press N for next level', canvas.width/2, canvas.height/2+18);
        ctx.restore();
    }
    if (gameOver) {
        ctx.save();
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = '#222';
        ctx.fillRect(0, canvas.height/2-60, canvas.width, 120);
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#fff';
        ctx.font = '36px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over! Press R to restart', canvas.width/2, canvas.height/2+18);
        ctx.restore();
    }
}

window.onload = init;
