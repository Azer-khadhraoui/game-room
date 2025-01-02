const canvas = document.getElementById('breakoutCanvas');
const context = canvas.getContext('2d');

const paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

const ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;

const brickRowCount = 5;
const brickColumnCount = 9;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        let status = 1;
        // Ajouter des briques spéciales
        if (Math.random() < 0.1) {
            status = 2; // Brique spéciale pour raquette plus grande
        } else if (Math.random() < 0.1) {
            status = 3; // Brique spéciale pour balle plus rapide
        } else if (Math.random() < 0.1) {
            status = 4; // Brique spéciale pour vie supplémentaire
        } else if (Math.random() < 0.1) {
            status = 5; // Brique colorée qui augmente le score de 5
        } else if (Math.random() < 0.1) {
            status = 6; // Brique colorée qui augmente le score de 3
        }
        bricks[c][r] = { x: 0, y: 0, status: status };
    }
}

let rightPressed = false;
let leftPressed = false;
let lives = 5;
let score = 0;

// Charger le fichier audio pour la plainte
const complaintSound = new Audio('complaint.mp3');

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function keyDownHandler(e) {
    if (e.key == 'Right' || e.key == 'ArrowRight') {
        rightPressed = true;
    } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == 'Right' || e.key == 'ArrowRight') {
        rightPressed = false;
    } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
        leftPressed = false;
    }
}

function drawBall() {
    context.beginPath();
    context.arc(x, y, ballRadius, 0, Math.PI * 2);
    context.fillStyle = '#0095DD';
    context.fill();
    context.closePath();
}

function drawPaddle() {
    context.beginPath();
    context.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    context.fillStyle = '#0095DD';
    context.fill();
    context.closePath();
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status > 0) {
                let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                context.beginPath();
                context.rect(brickX, brickY, brickWidth, brickHeight);
                if (bricks[c][r].status == 1) {
                    context.fillStyle = '#0095DD';
                } else if (bricks[c][r].status == 2) {
                    context.fillStyle = '#FF0000'; // Brique spéciale pour raquette plus grande
                } else if (bricks[c][r].status == 3) {
                    context.fillStyle = '#00FF00'; // Brique spéciale pour balle plus rapide
                } else if (bricks[c][r].status == 4) {
                    context.fillStyle = '#FFFF00'; // Brique spéciale pour vie supplémentaire
                } else if (bricks[c][r].status == 5) {
                    context.fillStyle = '#FF00FF'; // Brique colorée qui augmente le score de 5
                } else if (bricks[c][r].status == 6) {
                    context.fillStyle = '#00FFFF'; // Brique colorée qui augmente le score de 3
                }
                context.fill();
                context.closePath();
            }
        }
    }
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.status > 0) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    if (b.status == 2) {
                        paddleWidth += 20; // Raquette plus grande
                        complaintSound.play(); // Jouer le son de plainte
                    } else if (b.status == 3) {
                        dx *= 1.5; // Balle plus rapide
                        dy *= 1.5;
                    } else if (b.status == 4) {
                        lives++; // Vie supplémentaire
                    } else if (b.status == 5) {
                        score += 5; // Augmenter le score de 5
                    } else if (b.status == 6) {
                        score += 3; // Augmenter le score de 3
                    } else {
                        score++;
                    }
                    b.status = 0; // Effacer la brique
                    if (score == brickRowCount * brickColumnCount) {
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function drawScore() {
    context.font = "16px Arial";
    context.fillStyle = "#0095DD";
    context.fillText("Score: " + score, 8, 20);
}

function drawLives() {
    context.font = "16px Arial";
    context.fillStyle = "#0095DD";
    context.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            lives--;
            if (!lives) {
                alert("GAME OVER");
                document.location.reload();
            } else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}

draw();