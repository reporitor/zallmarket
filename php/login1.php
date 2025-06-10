<?php
session_start();

// Data admin (dalam produksi, gunakan database)
$validUsername = 'zallsulbar';
$validPassword = 'zallsulbar04'; // Dalam produksi, gunakan password hash

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    
    if ($username === $validUsername && $password === $validPassword) {
        // Login sukses
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_username'] = $username;
        
        // Redirect ke dashboard admin
        header('Location: ../admin/dashboard.php');
        exit();
    } else {
        // Login gagal
        $_SESSION['login_error'] = 'Username atau password salah';
        header('Location: ../admin/login.html');
        exit();
    }
} else {
    // Jika bukan POST, redirect ke halaman login
    header('Location: ../admin/login.html');
    exit();
}
?>
