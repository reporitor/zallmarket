<?php
session_start();

// Cek apakah admin sudah login
if (!isset($_SESSION['admin_logged_in']) {
    header('Location: login.html');
    exit();
}

// Koneksi ke database (contoh)
require_once '../php/config.php';
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Ambil statistik
$totalAkun = $conn->query("SELECT COUNT(*) FROM akun")->fetch_row()[0];
$totalTransaksi = $conn->query("SELECT COUNT(*) FROM transaksi")->fetch_row()[0];
$pendapatan = $conn->query("SELECT SUM(harga) FROM transaksi")->fetch_row()[0];
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard | GameHub</title>
    <link rel="stylesheet" href="../css/admin.css">
</head>
<body>
    <div class="admin-container">
        <aside class="sidebar">
            <h2>GameHub Admin</h2>
            <nav>
                <a href="dashboard.php" class="active">Dashboard</a>
                <a href="kelola-akun.php">Kelola Akun</a>
                <a href="transaksi.php">Transaksi</a>
                <a href="../php/logout.php">Logout</a>
            </nav>
        </aside>
        
        <main class="content">
            <h1>Dashboard</h1>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <h3>Total Akun</h3>
                    <p><?= $totalAkun ?></p>
                </div>
                
                <div class="stat-card">
                    <h3>Total Transaksi</h3>
                    <p><?= $totalTransaksi ?></p>
                </div>
                
                <div class="stat-card">
                    <h3>Total Pendapatan</h3>
                    <p>Rp <?= number_format($pendapatan, 0, ',', '.') ?></p>
                </div>
            </div>
            
            <section class="recent-activity">
                <h2>Aktivitas Terkini</h2>
                <!-- Tabel aktivitas -->
            </section>
        </main>
    </div>

    <script src="../js/admin.js"></script>
</body>
</html>
