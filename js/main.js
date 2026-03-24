document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('current-score');
    const highScoreElement = document.getElementById('high-score');
    const finalScoreElement = document.getElementById('final-score');
    const startOverlay = document.getElementById('start-overlay');
    const gameOverOverlay = document.getElementById('game-over-overlay');
    const startBtn = document.getElementById('start-btn');
    const restartBtn = document.getElementById('restart-btn');

    // 游戏配置
    const gridSize = 20;
    const canvasSize = 400;
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    let snake = [{ x: 10, y: 10 }];
    let food = { x: 5, y: 5 };
    let direction = 'RIGHT';
    let nextDirection = 'RIGHT';
    let score = 0;
    let highScore = localStorage.getItem('snake-high-score') || 0;
    let gameLoop;
    let gameSpeed = 100; // 毫秒

    highScoreElement.textContent = highScore;

    // 初始化按钮
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);

    // 监听按键
    window.addEventListener('keydown', handleKeyDown);

    function handleKeyDown(e) {
        const key = e.key;
        if ((key === 'ArrowUp' || key === 'w' || key === 'W') && direction !== 'DOWN') nextDirection = 'UP';
        else if ((key === 'ArrowDown' || key === 's' || key === 'S') && direction !== 'UP') nextDirection = 'DOWN';
        else if ((key === 'ArrowLeft' || key === 'a' || key === 'A') && direction !== 'RIGHT') nextDirection = 'LEFT';
        else if ((key === 'ArrowRight' || key === 'd' || key === 'D') && direction !== 'LEFT') nextDirection = 'RIGHT';
    }

    function startGame() {
        snake = [{ x: 10, y: 10 }];
        direction = 'RIGHT';
        nextDirection = 'RIGHT';
        score = 0;
        scoreElement.textContent = score;
        startOverlay.classList.add('hidden');
        gameOverOverlay.classList.add('hidden');
        generateFood();
        if (gameLoop) clearInterval(gameLoop);
        gameLoop = setInterval(update, gameSpeed);
    }

    function generateFood() {
        food = {
            x: Math.floor(Math.random() * (canvasSize / gridSize)),
            y: Math.floor(Math.random() * (canvasSize / gridSize))
        };
        // 确保食物不生成在蛇身上
        if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
            generateFood();
        }
    }

    function update() {
        direction = nextDirection;
        const head = { ...snake[0] };

        if (direction === 'UP') head.y--;
        else if (direction === 'DOWN') head.y++;
        else if (direction === 'LEFT') head.x--;
        else if (direction === 'RIGHT') head.x++;

        // 碰撞检测 - 墙壁
        if (head.x < 0 || head.x >= canvasSize / gridSize || head.y < 0 || head.y >= canvasSize / gridSize) {
            gameOver();
            return;
        }

        // 碰撞检测 - 自身
        if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            gameOver();
            return;
        }

        snake.unshift(head);

        // 吃到食物
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            scoreElement.textContent = score;
            if (score > highScore) {
                highScore = score;
                highScoreElement.textContent = highScore;
                localStorage.setItem('snake-high-score', highScore);
            }
            generateFood();
        } else {
            snake.pop();
        }

        draw();
    }

    function draw() {
        // 清屏
        ctx.fillStyle = '#16213e';
        ctx.fillRect(0, 0, canvasSize, canvasSize);

        // 画网格 (可选辅助效果)
        ctx.strokeStyle = '#1a1a2e';
        ctx.lineWidth = 1;
        for (let i = 0; i < canvasSize; i += gridSize) {
            ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvasSize); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvasSize, i); ctx.stroke();
        }

        // 画食物
        ctx.fillStyle = '#ff2e63';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ff2e63';
        ctx.beginPath();
        ctx.arc(food.x * gridSize + gridSize / 2, food.y * gridSize + gridSize / 2, gridSize / 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // 画蛇
        snake.forEach((segment, index) => {
            ctx.fillStyle = index === 0 ? '#00b361' : '#00ff88';
            ctx.shadowBlur = index === 0 ? 15 : 0;
            ctx.shadowColor = '#00ff88';
            ctx.fillRect(segment.x * gridSize + 1, segment.y * gridSize + 1, gridSize - 2, gridSize - 2);
        });
        ctx.shadowBlur = 0;
    }

    function gameOver() {
        clearInterval(gameLoop);
        finalScoreElement.textContent = score;
        gameOverOverlay.classList.remove('hidden');
    }
});
