<?php
header('Content-Type: application/json');

// Set response defaults
$response = [
    'success' => false,
    'message' => '',
    'errors' => []
];

try {
    // Check request method
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Method not allowed', 405);
    }

    // Validate required fields
    $requiredFields = [
        'game_type', 'username', 'level', 'items',
        'bind_status', 'price', 'description', 'whatsapp', 'agree'
    ];

    foreach ($requiredFields as $field) {
        if (empty($_POST[$field])) {
            $response['errors'][$field] = 'Field ini wajib diisi';
        }
    }

    // Validate images
    if (count($_FILES['images']['name']) < 2) {
        $response['errors']['images'] = 'Minimal 2 gambar diperlukan';
    }

    // If there are errors, return them
    if (!empty($response['errors'])) {
        $response['message'] = 'Terdapat kesalahan pada form';
        echo json_encode($response);
        exit;
    }

    // Process image uploads
    $uploadedImages = [];
    $uploadDir = __DIR__ . '/../../assets/uploads/';

    // Create upload directory if not exists
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    foreach ($_FILES['images']['tmp_name'] as $key => $tmpName) {
        // Validate image
        $fileInfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($fileInfo, $tmpName);
        finfo_close($fileInfo);

        $allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!in_array($mimeType, $allowedTypes)) {
            throw new Exception('Format gambar tidak valid (hanya JPG, PNG, WEBP)', 400);
        }

        // Check file size (max 2MB)
        if ($_FILES['images']['size'][$key] > 2097152) {
            throw new Exception('Ukuran gambar terlalu besar (maksimal 2MB)', 400);
        }

        // Generate unique filename
        $ext = pathinfo($_FILES['images']['name'][$key], PATHINFO_EXTENSION);
        $filename = 'img_' . uniqid() . '.' . $ext;
        $destination = $uploadDir . $filename;

        // Move uploaded file
        if (!move_uploaded_file($tmpName, $destination)) {
            throw new Exception('Gagal menyimpan gambar', 500);
        }

        // Compress image
        compressImage($destination, $destination, 75);

        $uploadedImages[] = $filename;
    }

    // Prepare account data
    $accountData = [
        'id' => uniqid(),
        'game_type' => htmlspecialchars($_POST['game_type']),
        'username' => htmlspecialchars($_POST['username']),
        'level' => (int)$_POST['level'],
        'items' => htmlspecialchars($_POST['items']),
        'bind_status' => htmlspecialchars($_POST['bind_status']),
        'price' => (float)$_POST['price'],
        'description' => htmlspecialchars($_POST['description']),
        'whatsapp' => '62' . ltrim($_POST['whatsapp'], '0'),
        'images' => $uploadedImages,
        'status' => 'Pending',
        'created_at' => date('Y-m-d H:i:s'),
        'updated_at' => null
    ];

    // Save to JSON file
    $dataFile = __DIR__ . '/../../data/accounts.json';
    $accounts = [];

    if (file_exists($dataFile)) {
        $accounts = json_decode(file_get_contents($dataFile), true);
    }

    $accounts[] = $accountData;
    file_put_contents($dataFile, json_encode($accounts, JSON_PRETTY_PRINT));

    // Success response
    $response = [
        'success' => true,
        'message' => 'Akun berhasil diajukan! Admin akan memverifikasi dalam 1x24 jam.'
    ];

} catch (Exception $e) {
    http_response_code($e->getCode() ?: 500);
    $response['message'] = $e->getMessage();
}

echo json_encode($response);

// Helper function to compress images
function compressImage($source, $destination, $quality) {
    $info = getimagesize($source);

    if ($info['mime'] == 'image/jpeg') {
        $image = imagecreatefromjpeg($source);
        imagejpeg($image, $destination, $quality);
    } elseif ($info['mime'] == 'image/png') {
        $image = imagecreatefrompng($source);
        imagepng($image, $destination, round(9 * $quality / 100));
    }

    if (isset($image)) {
        imagedestroy($image);
    }
}
?>
