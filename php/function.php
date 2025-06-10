<?php
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

function isAdminLoggedIn() {
    return isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;
}

function adminLogin($username, $password) {
    // Ini contoh sederhana, sebaiknya gunakan database dan password hashing
    $validUsername = 'zallsulbar';
    $validPassword = 'zallsulbar04'; // Ganti dengan password yang aman
    
    if ($username === $validUsername && $password === $validPassword) {
        $_SESSION['admin_logged_in'] = true;
        return true;
    }
    return false;
}

function sendWhatsApp($phone, $message) {
    $data = [
        'target' => $phone,
        'message' => $message,
        'delay' => '2-5'
    ];
    
    $options = [
        'http' => [
            'method' => 'POST',
            'header' => "Authorization: " . WHATSAPP_API_KEY . "\r\n" .
                        "Content-Type: application/json\r\n",
            'content' => json_encode($data)
        ]
    ];
    
    $context = stream_context_create($options);
    $result = file_get_contents(WHATSAPP_ENDPOINT, false, $context);
    
    return json_decode($result, true);
}
?>
