<?php
// Pengaturan dasar
define('BASE_URL', 'http://localhost/project-root/');
define('UPLOAD_DIR', __DIR__ . '/../assets/uploads/');
define('DATA_DIR', __DIR__ . '/../data/');

// Konfigurasi WhatsApp API
define('WHATSAPP_API_KEY', 'your-api-key');
define('WHATSAPP_ENDPOINT', 'https://fonnte.com/api/send');

// Mulai session
session_start();

// Koneksi ke database (jika menggunakan database)
// $db = new PDO('mysql:host=localhost;dbname=game_accounts', 'username', 'password');

// Fungsi untuk load data JSON
function loadJSON($file) {
    $path = DATA_DIR . $file;
    if (!file_exists($path)) {
        file_put_contents($path, '[]');
        return [];
    }
    return json_decode(file_get_contents($path), true);
}

// Fungsi untuk save data JSON
function saveJSON($file, $data) {
    file_put_contents(DATA_DIR . $file, json_encode($data, JSON_PRETTY_PRINT));
}
?>
