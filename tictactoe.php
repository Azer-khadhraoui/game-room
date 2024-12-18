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
    <style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            font-family: Arial, sans-serif;
        }
        .container {
            text-align: center;
        }
        table {
            margin: 0 auto;
            border-collapse: collapse;
        }
        td {
            width: 60px;
            height: 60px;
            text-align: center;
            font-size: 24px;
            border: 1px solid #000;
        }
        button {
            width: 100%;
            height: 100%;
            font-size: 24px;
        }
        .winner {
            background-color: #90EE90;
        }
    </style>
</head>
<body>
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

        <form method="post">
            <button type="submit" name="new_game">Play New Game</button>
        </form>
    </div>
</body>
</html>