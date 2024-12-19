<?php
session_start();

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['highScore'])) {
    $_SESSION['high_score'] = $data['highScore'];
}
?>