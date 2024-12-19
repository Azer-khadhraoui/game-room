<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['new_game'])) {
        $_SESSION['score'] = 0;
        header("Location: " . $_SERVER['PHP_SELF']);
        exit;
    }
}

if (!isset($_SESSION['score'])) {
    $_SESSION['score'] = 0;
}

if (!isset($_SESSION['high_score'])) {
    $_SESSION['high_score'] = 0;
}

$score = $_SESSION['score'];
$high_score = $_SESSION['high_score'];
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Snake Game</title>
    <link rel="stylesheet" href="styles.css">
    <style>
        .snake-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            position: relative;
        }
        #gameCanvas {
            border: 1px solid #000;
            background-color: #f0f0f0;
        }
        .home-button {
            position: fixed;
            top: 20px;
            left: 20px;
            padding: 10px 20px;
            font-size: 18px;
            border: none;
            background-color: #007BFF;
            color: #fff;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        .home-button:hover {
            background-color: #0056b3;
        }
        .score, .high-score {
            position: absolute;
            top: 20px;
            font-size: 24px;
            color: #007BFF;
        }
        .score {
            right: 20px;
        }
        .high-score {
            left: 20px;
        }
        .new-game-button {
            margin-top: 20px;
            padding: 10px 20px;
            font-size: 18px;
            border: none;
            background-color: #007BFF;
            color: #fff;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        .new-game-button:hover {
            background-color: #0056b3;
        }
        .lose-message {
            font-size: 24px;
            color: red;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <a href="index.html" class="home-button">Return to home page</a>
    <div class="snake-container">
        <canvas id="gameCanvas" width="400" height="400"></canvas>
        <div class="score" id="score">Score: <?php echo $score; ?></div>
        <div class="high-score" id="highScore">High Score: <?php echo $high_score; ?></div>
        <form method="post">
            <button type="submit" name="new_game" class="new-game-button">Play New Game</button>
        </form>
        <div class="lose-message" id="loseMessage" style="display: none;">You lose. Your score is: <span id="finalScore"></span></div>
    </div>
    <script src="snake.js"></script>
</body>
</html>