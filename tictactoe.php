<!DOCTYPE html>
<html>
<head>
    <title>Tic-Tac-Toe</title>
    <style>
        table { border-collapse: collapse; }
        td { width: 60px; height: 60px; text-align: center; font-size: 24px; }
    </style>
</head>
<body>
    <h1>Tic-Tac-Toe</h1>
    <?php
    session_start();

    if (!isset($_SESSION['board'])) {
        $_SESSION['board'] = array_fill(0, 9, '');
        $_SESSION['turn'] = 'X';
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $index = $_POST['index'];
        if ($_SESSION['board'][$index] === '') {
            $_SESSION['board'][$index] = $_SESSION['turn'];
            $_SESSION['turn'] = $_SESSION['turn'] === 'X' ? 'O' : 'X';
        }
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
                return $board[$combination[0]];
            }
        }

        return null;
    }

    $winner = check_winner($_SESSION['board']);
    ?>

    <table border="1">
        <?php for ($i = 0; $i < 3; $i++): ?>
            <tr>
                <?php for ($j = 0; $j < 3; $j++): ?>
                    <td>
                        <?php
                        $index = $i * 3 + $j;
                        if ($_SESSION['board'][$index] === '' && $winner === null): ?>
                            <form method="post">
                                <input type="hidden" name="index" value="<?php echo $index; ?>">
                                <button type="submit" style="width: 100%; height: 100%;"></button>
                            </form>
                        <?php else: ?>
                            <?php echo $_SESSION['board'][$index]; ?>
                        <?php endif; ?>
                    </td>
                <?php endfor; ?>
            </tr>
        <?php endfor; ?>
    </table>

    <?php if ($winner !== null): ?>
        <h2>Le gagnant est : <?php echo $winner; ?></h2>
        <?php session_destroy(); ?>
    <?php endif; ?>
</body>
</html>