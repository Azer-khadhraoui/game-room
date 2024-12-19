const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("highScore");
const loseMessage = document.getElementById("loseMessage");
const finalScore = document.getElementById("finalScore");

const box = 20;
const canvasSize = 400;
const canvasBoxes = canvasSize / box;

let snake;
let food;
let score;
let highScore = parseInt(highScoreElement.innerText.split(": ")[1]);
let direction;
let game;

function startNewGame() {
    snake = [];
    snake[0] = { x: 9 * box, y: 10 * box };

    food = {
        x: Math.floor(Math.random() * canvasBoxes) * box,
        y: Math.floor(Math.random() * canvasBoxes) * box
    };

    score = 0;
    direction = null;

    if (game) {
        clearInterval(game);
    }
    game = setInterval(draw, 100);
    scoreElement.innerHTML = "Score: " + score;
    loseMessage.style.display = "none";
}

document.addEventListener("keydown", setDirection);

function setDirection(event) {
    if (event.keyCode === 37 && direction !== "RIGHT") {
        direction = "LEFT";
    } else if (event.keyCode === 38 && direction !== "DOWN") {
        direction = "UP";
    } else if (event.keyCode === 39 && direction !== "LEFT") {
        direction = "RIGHT";
    } else if (event.keyCode === 40 && direction !== "UP") {
        direction = "DOWN";
    }
}

function collision(newHead, snake) {
    for (let i = 0; i < snake.length; i++) {
        if (newHead.x === snake[i].x && newHead.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

function draw() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "green" : "white";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);

        ctx.strokeStyle = "red";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === "LEFT") snakeX -= box;
    if (direction === "UP") snakeY -= box;
    if (direction === "RIGHT") snakeX += box;
    if (direction === "DOWN") snakeY += box;

    if (snakeX === food.x && snakeY === food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * canvasBoxes) * box,
            y: Math.floor(Math.random() * canvasBoxes) * box
        };
    } else {
        snake.pop();
    }

    let newHead = {
        x: snakeX,
        y: snakeY
    };

    if (snakeX < 0 || snakeY < 0 || snakeX >= canvasSize || snakeY >= canvasSize || collision(newHead, snake)) {
        clearInterval(game);
        finalScore.innerHTML = score;
        loseMessage.style.display = "block";
        if (score > highScore) {
            highScore = score;
            highScoreElement.innerHTML = "High Score: " + highScore;
            // Save high score to session
            fetch('update_high_score.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ highScore: highScore })
            });
        }
        return;
    }

    snake.unshift(newHead);

    scoreElement.innerHTML = "Score: " + score;
}


window.onload = startNewGame;