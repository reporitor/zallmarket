<?php
// Mulai session
session_start();

// Set header JSON
header('Content-Type: application/json');

// Simpan data pembelian dalam session
if (isset($_GET['id'])) {
    $akunId = $_GET['id'];
    
    // Simpan data pembelian dalam session
    $_SESSION['purchase'] = [
        'akun_id' => $akunId,
        'timestamp' => date('Y-m-d H:i:s')
    ];
    
    // Redirect ke halaman pembayaran atau tampilkan data JSON
    if (isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Data akun berhasil diproses',
            'data' => [
                'akun_id' => $akunId,
                'redirect_url' => 'pages/pembayaran.html'
            ]
        ]);
    } else {
        header('Location: ../pages/pembayaran.html');
    }
} else {
    if (isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Parameter ID akun tidak ditemukan'
        ]);
    } else {
        header('Location: ../index.html?error=missing_id');
    }
    exit();
}
?>
