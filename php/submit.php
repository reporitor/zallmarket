<?php
header('Content-Type: application/json');

// Konfigurasi
$upload_dir = 'uploads/';
$max_file_size = 2 * 1024 * 1024; // 2MB
$allowed_types = ['image/jpeg', 'image/png', 'image/jpg'];
$json_file = 'data/data-akun.json';

// Fungsi untuk membuat response JSON
function json_response($success, $message, $data = []) {
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ]);
    exit;
}

// Validasi request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(false, 'Metode request tidak valid');
}

// Validasi data
$required_fields = ['game', 'username', 'level', 'items', 'bind', 'harga', 'deskripsi', 'whatsapp', 'persetujuan'];
foreach ($required_fields as $field) {
    if (empty($_POST[$field])) {
        json_response(false, "Field $field harus diisi");
    }
}

// Validasi file upload
if (empty($_FILES['gambar_profil']) || empty($_FILES['gambar_lain'])) {
    json_response(false, 'Harap upload kedua gambar');
}

// Proses upload gambar
$uploaded_files = [];
foreach (['gambar_profil', 'gambar_lain'] as $file_key) {
    $file = $_FILES[$file_key];
    
    // Validasi file
    if ($file['error'] !== UPLOAD_ERR_OK) {
        json_response(false, 'Terjadi kesalahan saat mengupload gambar');
    }
    
    if ($file['size'] > $max_file_size) {
        json_response(false, 'Ukuran gambar terlalu besar (maks 2MB)');
    }
    
    if (!in_array($file['type'], $allowed_types)) {
        json_response(false, 'Format gambar tidak didukung (hanya JPG/PNG)');
    }
    
    // Generate nama file unik
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid() . '.' . $ext;
    $destination = $upload_dir . $filename;
    
    if (!move_uploaded_file($file['tmp_name'], $destination)) {
        json_response(false, 'Gagal menyimpan gambar');
    }
    
    $uploaded_files[$file_key] = $filename;
}

// Siapkan data untuk disimpan
$akun_data = [
    'id' => uniqid(),
    'game' => htmlspecialchars($_POST['game']),
    'username' => htmlspecialchars($_POST['username']),
    'level' => (int)$_POST['level'],
    'items' => htmlspecialchars($_POST['items']),
    'bind' => htmlspecialchars($_POST['bind']),
    'harga' => (int)$_POST['harga'],
    'deskripsi' => htmlspecialchars($_POST['deskripsi']),
    'whatsapp' => htmlspecialchars($_POST['whatsapp']),
    'gambar_profil' => $uploaded_files['gambar_profil'],
    'gambar_lain' => $uploaded_files['gambar_lain'],
    'waktu_pengiriman' => date('Y-m-d H:i:s'),
    'status' => 'Sedang Dicek',
    'catatan_admin' => ''
];

// Baca file JSON yang ada
$existing_data = [];
if (file_exists($json_file)) {
    $existing_data = json_decode(file_get_contents($json_file), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        $existing_data = [];
    }
}

// Tambahkan data baru
$existing_data[] = $akun_data;

// Simpan ke file JSON
if (file_put_contents($json_file, json_encode($existing_data, JSON_PRETTY_PRINT)) {
    json_response(true, 'Data akun berhasil dikirim', ['redirect' => 'berhasil.html']);
} else {
    json_response(false, 'Gagal menyimpan data');
}
?>
