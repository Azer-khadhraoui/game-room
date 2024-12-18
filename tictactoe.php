<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['new_game'])) {
        session_destroy();
        session_start();
        $_SESSION['board'] = array_fill(0, 9, '');
        $_SESSION['turn'] = 'X'; // Initialize turn
        header("Location: " . $_SERVER['PHP_SELF']);
        exit;
    }

    if (isset($_POST['index'])) {
        $index = $_POST['index'];
        if ($_SESSION['board'][$index] === '') {
            $_SESSION['board'][$index] = $_SESSION['turn'];
            $_SESSION['turn'] = $_SESSION['turn'] === 'X' ? 'O' : 'X';
        }
    }
}

if (!isset($_SESSION['board'])) {
    $_SESSION['board'] = array_fill(0, 9, '');
    $_SESSION['turn'] = 'X'; // Initialize turn
}

function check_winner($board) {
    $winning_combinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    foreach ($winning_combinations as $combination) {
        if ($board[$combination[0]] !== '' &&
            $board[$combination[0]] === $board[$combination[1]] &&
            $board[$combination[1]] === $board[$combination[2]]) {
            return $combination;
        }
    }

    return null;
}

$winner_combination = check_winner($_SESSION['board']);
$winner = $winner_combination ? $_SESSION['board'][$winner_combination[0]] : null;
$draw = !$winner && !in_array('', $_SESSION['board']);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tic Tac Toe</title>
    <link rel="stylesheet" href="styles.css">
    <style>
        .home-button {
            position: absolute;
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
    </style>
</head>
<body>
    <a href="index.html" class="home-button">Return to home page</a>
    <div class="container">
        <h1>Tic-Tac-Toe</h1>
        <?php if ($winner === null && !$draw): ?>
            <h2>C'est le tour de : <?php echo $_SESSION['turn']; ?></h2>
        <?php elseif ($winner !== null): ?>
            <h2>Le gagnant est : <?php echo $winner; ?></h2>
        <?php elseif ($draw): ?>
            <h2>Match nul!</h2>
        <?php endif; ?>
        <table>
            <?php for ($i = 0; $i < 3; $i++): ?>
                <tr>
                    <?php for ($j = 0; $j < 3; $j++): ?>
                        <td class="<?php echo in_array($i * 3 + $j, (array)$winner_combination) ? 'winner' : ''; ?>">
                            <?php
                            $index = $i * 3 + $j;
                            if ($_SESSION['board'][$index] === '' && $winner === null && !$draw): ?>
                                <form method="post">
                                    <input type="hidden" name="index" value="<?php echo $index; ?>">
                                    <button type="submit"></button>
                                </form>
                            <?php else: ?>
                                <?php echo $_SESSION['board'][$index]; ?>
                            <?php endif; ?>
                        </td>
                    <?php endfor; ?>
                </tr>
            <?php endfor; ?>
        </table>

        <div class="footer">
            <form method="post" style="display: inline-block;">
                <button type="submit" name="new_game" class="new-game-button">Play New Game</button>
            </form>
        </div>
    </div>
    <p class="developer">Developed by Azer Khadhraoui</p>
</body>
</html>