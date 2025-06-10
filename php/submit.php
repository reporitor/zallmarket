<?php
require_once __DIR__ . '/../includes/config.php';
require_once __DIR__ . '/../includes/functions.php';

header('Content-Type: application/json');

$response = ['success' => false, 'message' => ''];

try {
    // Validasi method
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Method not allowed', 405);
    }

    // Validasi data
    $requiredFields = ['game_type', 'username', 'level', 'items', 'bind_status', 'price', 'description', 'whatsapp', 'agree'];
    foreach ($requiredFields as $field) {
        if (empty($_POST[$field])) {
            throw new Exception("Field $field is required", 400);
        }
    }

    // Validasi gambar
    if (count($_FILES['images']['name']) < 2) {
        throw new Exception('Minimum 2 images required', 400);
    }

    // Proses upload gambar
    $uploadedImages = [];
    foreach ($_FILES['images']['tmp_name'] as $key => $tmpName) {
        if ($_FILES['images']['error'][$key] !== UPLOAD_ERR_OK) {
            throw new Exception('Error uploading image', 500);
        }

        // Validasi tipe file
        $fileType = strtolower(pathinfo($_FILES['images']['name'][$key], PATHINFO_EXTENSION));
        if (!in_array($fileType, ['jpg', 'jpeg', 'png'])) {
            throw new Exception('Invalid image format (only JPG, JPEG, PNG allowed)', 400);
        }

        // Generate nama unik
        $newFilename = uniqid('img_') . '.' . $fileType;
        $destination = UPLOAD_DIR . $newFilename;

        if (!move_uploaded_file($tmpName, $destination)) {
            throw new Exception('Failed to save image', 500);
        }

        // Kompres gambar (opsional)
        compressImage($destination, $destination, 75);

        $uploadedImages[] = $newFilename;
    }

    // Siapkan data untuk disimpan
    $accountData = [
        'id' => uniqid(),
        'game_type' => htmlspecialchars($_POST['game_type']),
        'username' => htmlspecialchars($_POST['username']),
        'level' => (int)$_POST['level'],
        'items' => htmlspecialchars($_POST['items']),
        'bind_status' => htmlspecialchars($_POST['bind_status']),
        'price' => (float)$_POST['price'],
        'description' => htmlspecialchars($_POST['description']),
        'whatsapp' => htmlspecialchars($_POST['whatsapp']),
        'images' => $uploadedImages,
        'status' => 'Sedang Dicek',
        'admin_notes' => '',
        'submitted_at' => date('Y-m-d H:i:s'),
        'processed_at' => null
    ];

    // Simpan ke JSON
    $accounts = loadJSON('data-akun.json');
    $accounts[] = $accountData;
    saveJSON('data-akun.json', $accounts);

    $response = [
        'success' => true,
        'message' => 'Berhasil dikirim, tunggu admin memproses.',
        'redirect' => BASE_URL . 'jual-akun.html?success=1'
    ];
} catch (Exception $e) {
    $response = [
        'success' => false,
        'message' => $e->getMessage(),
        'code' => $e->getCode()
    ];
}

echo json_encode($response);
?>
