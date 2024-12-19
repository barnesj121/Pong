// Canvas setup
const canvas = document.getElementById('pongCanvas');
const context = canvas.getContext('2d');

// Sound effect setup
let soundEnabled = true;
let audioInitialized = false;

// Load sound effects
const leftPaddleHitSound = new Audio('sounds/left-paddle-hit.wav');  
const rightPaddleHitSound = new Audio('sounds/right-paddle-hit.wav'); 
const scoreSound = new Audio('sounds/score.wav');  

// Game variables
const paddleWidth = 10;
const paddleHeight = 100;
const ballRadius = 10;

const leftPaddle = {
    x: 0,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0
};

const rightPaddle = {
    x: canvas.width - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: ballRadius,
    dx: 4,
    dy: 4
};

let leftScore = 0;
let rightScore = 0;

// Draw paddles
function drawPaddle(paddle) {
    context.fillStyle = 'white';
    context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// Draw the ball
function drawBall() {
    context.fillStyle = 'white';
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    context.fill();
    context.closePath();
}

// Draw score
function drawScore() {
    context.font = '32px Arial';
    context.fillStyle = 'white';
    context.fillText(leftScore, canvas.width / 4, 50);
    context.fillText(rightScore, 3 * canvas.width / 4, 50);
}

// Draw game title
function drawTitle() {
    context.font = '48px Arial';
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.fillText('Pong Game', canvas.width / 2, 50);
}

// Move paddles
function movePaddle(paddle) {
    paddle.y += paddle.dy;
    // Prevent paddles from moving out of bounds
    if (paddle.y < 0) paddle.y = 0;
    if (paddle.y + paddle.height > canvas.height) paddle.y = canvas.height - paddle.height;
}

// Move ball
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with top/bottom walls
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy *= -1;  // Reverse vertical direction
    }

    // Ball collision with paddles
    if (ball.x - ball.radius < leftPaddle.x + leftPaddle.width && 
        ball.y > leftPaddle.y && 
        ball.y < leftPaddle.y + leftPaddle.height) {
        ball.dx *= -1;  // Reverse horizontal direction
        playLeftPaddleSound();  // Play left paddle hit sound
    }
    
    if (ball.x + ball.radius > rightPaddle.x && 
        ball.y > rightPaddle.y && 
        ball.y < rightPaddle.y + rightPaddle.height) {
        ball.dx *= -1;  // Reverse direction
        playRightPaddleSound();  // Play right paddle hit sound
    }

    // Score update
    if (ball.x - ball.radius < 0) {
        rightScore++;
        playScoreSound();  // Play scoring sound
        resetBall();
    }
    
    if (ball.x + ball.radius > canvas.width) {
        leftScore++;
        playScoreSound();  // Play scoring sound
        resetBall();
    }
}

// Reset ball after scoring
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx *= -1;  // Switch direction
}

// Play left paddle hit sound
function playLeftPaddleSound() {
    if (soundEnabled) {
        leftPaddleHitSound.currentTime = 0;
        leftPaddleHitSound.play().catch(error => console.error("Error playing left paddle sound:", error));
    }
}

// Play right paddle hit sound
function playRightPaddleSound() {
    if (soundEnabled) {
        rightPaddleHitSound.currentTime = 0;
        rightPaddleHitSound.play().catch(error => console.error("Error playing right paddle sound:", error));
    }
}

// Play scoring sound
function playScoreSound() {
    if (soundEnabled) {
        scoreSound.currentTime = 0;
        scoreSound.play().catch(error => console.error("Error playing score sound:", error));
    }
}

// Handle player input
document.addEventListener('keydown', (e) => {
    // Control for left paddle
    if (e.key === 'w') leftPaddle.dy = -5; // Move up
    if (e.key === 's') leftPaddle.dy = 5;  // Move down

    // Control for right paddle
    if (e.key === 'ArrowUp') rightPaddle.dy = -5;  // Move up
    if (e.key === 'ArrowDown') rightPaddle.dy = 5;  // Move down
});

document.addEventListener('keyup', (e) => {
    // Stop moving left paddle
    if (e.key === 'w' || e.key === 's') leftPaddle.dy = 0; 

    // Stop moving right paddle
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') rightPaddle.dy = 0; 
});

// Toggle sound on or off
document.getElementById('toggle-sound').addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    document.getElementById('sound-status').innerText = soundEnabled ? 'Sound: On' : 'Sound: Off';

    // Preload sounds only on first interaction
    if (!audioInitialized) {
        leftPaddleHitSound.load();
        rightPaddleHitSound.load();
        scoreSound.load();
        audioInitialized = true; // Set this flag to prevent reloading
    }
});

// Test sound button
document.getElementById('test-sound').addEventListener('click', () => {
    if (soundEnabled) {
        leftPaddleHitSound.play().catch(error => console.error("Error playing test sound:", error));
    }
});

// Game loop
function gameLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height);  // Clear canvas for each frame

    drawTitle();  // Draw game title
    movePaddle(leftPaddle);
    movePaddle(rightPaddle);
    moveBall();

    drawPaddle(leftPaddle);
    drawPaddle(rightPaddle);
    drawBall();
    drawScore();

    requestAnimationFrame(gameLoop);  // Keep the game running
}

// Start the game loop
gameLoop();



