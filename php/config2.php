<?php
// Konfigurasi dasar
define('BASE_URL', 'http://localhost/gamehub/');
define('JSON_DIR', __DIR__ . '/../data/');
define('UPLOAD_DIR', __DIR__ . '/../uploads/');

// Konfigurasi WhatsApp API
define('WHATSAPP_API_KEY', 'your_api_key_here');
define('WHATSAPP_API_URL', 'https://api.fonnte.com/send');

// Mulai session
session_start();

// Fungsi untuk redirect
function redirect($url) {
    header("Location: " . BASE_URL . $url);
    exit;
}

// Fungsi untuk cek login admin
function checkAdminLogin() {
    if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
        redirect('admin/login-admin.php');
    }
}
?>
