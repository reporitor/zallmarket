<?php
require_once __DIR__ . '/config.php';

// Redirect jika belum login
if (basename($_SERVER['PHP_SELF']) !== 'login.php' && !isAdminLoggedIn()) {
    header('Location: login.php');
    exit;
}

// Proses login
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login'])) {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    
    if (adminLogin($username, $password)) {
        header('Location: dashboard.php');
        exit;
    } else {
        $error = 'Username atau password salah';
    }
}
?>
