<?php
// Mulai session
session_start();

// Cek apakah request adalah POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validasi input
    $errors = [];
    $requiredFields = ['game', 'rank', 'vault', 'harga', 'email', 'whatsapp'];
    
    foreach ($requiredFields as $field) {
        if (empty($_POST[$field])) {
            $errors[$field] = 'Field ini wajib diisi';
        }
    }
    
    // Validasi email
    if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'Email tidak valid';
    }
    
    // Validasi nomor WhatsApp
    if (!preg_match('/^[0-9]{10,15}$/', $_POST['whatsapp'])) {
        $errors['whatsapp'] = 'Nomor WhatsApp tidak valid';
    }
    
    // Jika ada error, kembalikan ke form
    if (!empty($errors)) {
        $_SESSION['form_errors'] = $errors;
        $_SESSION['form_data'] = $_POST;
        header('Location: ../pages/jual-akun.html?error=validation');
        exit();
    }
    
    // Proses data (simpan ke database atau file)
    $akunData = [
        'game' => $_POST['game'],
        'rank' => $_POST['rank'],
        'vault' => $_POST['vault'],
        'skin' => $_POST['skin'] ?? '0',
        'harga' => $_POST['harga'],
        'deskripsi' => $_POST['deskripsi'] ?? '',
        'kontak' => [
            'email' => $_POST['email'],
            'whatsapp' => $_POST['whatsapp']
        ],
        'tanggal' => date('Y-m-d H:i:s')
    ];
    
    // Simpan ke file JSON (sementara sebelum pakai database)
    $dataFile = '../data/akun-dijual.json';
    $existingData = [];
    
    if (file_exists($dataFile)) {
        $existingData = json_decode(file_get_contents($dataFile), true);
    }
    
    $existingData[] = $akunData;
    file_put_contents($dataFile, json_encode($existingData, JSON_PRETTY_PRINT));
    
    // Kirim email notifikasi (simulasi)
    $to = $_POST['email'];
    $subject = 'Penawaran Akun Game Anda Diterima';
    $message = "Terima kasih telah menawarkan akun game Anda di GameHub.\n\n";
    $message .= "Detail akun:\n";
    $message .= "Game: " . $_POST['game'] . "\n";
    $message .= "Rank: " . $_POST['rank'] . "\n";
    $message .= "Harga: Rp " . number_format($_POST['harga'], 0, ',', '.') . "\n\n";
    $message .= "Kami akan menghubungi Anda via WhatsApp untuk proses selanjutnya.";
    
    // Dalam produksi, gunakan fungsi mail() atau library seperti PHPMailer
    // mail($to, $subject, $message);
    
    // Simpan dalam session untuk ditampilkan di halaman sukses
    $_SESSION['akun_data'] = $akunData;
    
    // Redirect ke halaman sukses
    header('Location: ../pages/sukses-jual.html');
    exit();
} else {
    // Jika bukan POST, redirect ke halaman jual akun
    header('Location: ../pages/jual-akun.html');
    exit();
}
?>
