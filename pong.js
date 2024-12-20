const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

const paddleWidth = 10;
const paddleHeight = 100;
const ballRadius = 10;

let playerY = (canvas.height - paddleHeight) / 2;
let computerY = (canvas.height - paddleHeight) / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 4;
let ballSpeedY = 4;
let playerScore = 0;
let computerScore = 0;
const winningScore = 5;

function drawPaddle(x, y) {
    ctx.fillStyle = "#007BFF";
    ctx.fillRect(x, y, paddleWidth, paddleHeight);
}

function drawBall(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#FF0000";
    ctx.fill();
    ctx.closePath();
}

function drawNet() {
    ctx.fillStyle = "#000";
    ctx.fillRect(canvas.width / 2 - 1, 0, 2, canvas.height);
}

function drawScore() {
    ctx.fillStyle = "#000";
    ctx.font = "20px Arial";
    ctx.fillText("Player: " + playerScore, 100, 50);
    ctx.fillText("Computer: " + computerScore, canvas.width - 200, 50);
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawNet();
    drawPaddle(0, playerY);
    drawPaddle(canvas.width - paddleWidth, computerY);
    drawBall(ballX, ballY);
    drawScore();

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballY + ballRadius > canvas.height || ballY - ballRadius < 0) {
        ballSpeedY = -ballSpeedY;
    }

    if (ballX + ballRadius > canvas.width) {
        if (ballY > computerY && ballY < computerY + paddleHeight) {
            ballSpeedX = -ballSpeedX;
            
            ballSpeedY += (Math.random() - 0.5) * 2;
        } else {
            playerScore++;
            if (playerScore >= winningScore) {
                alert("You win!");
                playerScore = 0;
                computerScore = 0;
            }
            resetBall();
        }
    }

    if (ballX - ballRadius < 0) {
        if (ballY > playerY && ballY < playerY + paddleHeight) {
            ballSpeedX = -ballSpeedX;
            
            ballSpeedY += (Math.random() - 0.5) * 2;
        } else {
            computerScore++;
            if (computerScore >= winningScore) {
                alert("Computer wins!");
                playerScore = 0;
                computerScore = 0;
            }
            resetBall();
        }
    }

    // Adjust computer paddle movement to be less perfect
    if (computerY + paddleHeight / 2 < ballY - 35) {
        computerY += 3; 
    } else if (computerY + paddleHeight / 2 > ballY + 35) {
        computerY -= 3; 
    }
}

function movePaddle(event) {
    const rect = canvas.getBoundingClientRect();
    const root = document.documentElement;
    const mouseY = event.clientY - rect.top - root.scrollTop;
    playerY = mouseY - paddleHeight / 2;
}

canvas.addEventListener("mousemove", movePaddle);

setInterval(draw, 10);