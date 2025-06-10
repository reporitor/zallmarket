<?php
require_once __DIR__ . '/../includes/auth.php';

$accounts = loadJSON('data-akun.json');
$history = loadJSON('riwayat-akun.json');

// Proses aksi admin
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    $id = $_POST['id'] ?? '';
    
    foreach ($accounts as $key => $account) {
        if ($account['id'] === $id) {
            switch ($_POST['action']) {
                case 'approve':
                    // Kirim ke WhatsApp
                    $message = "Detail Akun Game:\n" .
                               "Game: {$account['game_type']}\n" .
                               "Username: {$account['username']}\n" .
                               "Level: {$account['level']}\n" .
                               "Harga: Rp " . number_format($account['price'], 0, ',', '.') . "\n" .
                               "Deskripsi: {$account['description']}\n" .
                               "Hubungi: {$account['whatsapp']}";
                    
                    $waResult = sendWhatsApp($account['whatsapp'], $message);
                    
                    if ($waResult['status']) {
                        // Pindahkan ke riwayat
                        $account['status'] = 'Aman';
                        $account['processed_at'] = date('Y-m-d H:i:s');
                        $history[] = $account;
                        saveJSON('riwayat-akun.json', $history);
                        
                        // Hapus dari daftar pending
                        unset($accounts[$key]);
                        saveJSON('data-akun.json', array_values($accounts));
                        
                        $_SESSION['success'] = 'Akun berhasil dikirim ke WhatsApp';
                    } else {
                        $_SESSION['error'] = 'Gagal mengirim ke WhatsApp';
                    }
                    break;
                    
                case 'reject':
                    $account['status'] = 'Ditolak';
                    $account['admin_notes'] = $_POST['notes'] ?? '';
                    $account['processed_at'] = date('Y-m-d H:i:s');
                    $history[] = $account;
                    saveJSON('riwayat-akun.json', $history);
                    
                    unset($accounts[$key]);
                    saveJSON('data-akun.json', array_values($accounts));
                    $_SESSION['success'] = 'Akun telah ditolak';
                    break;
                    
                case 'update':
                    $account['game_type'] = $_POST['game_type'] ?? $account['game_type'];
                    $account['username'] = $_POST['username'] ?? $account['username'];
                    $account['level'] = $_POST['level'] ?? $account['level'];
                    $account['price'] = $_POST['price'] ?? $account['price'];
                    $account['status'] = $_POST['status'] ?? $account['status'];
                    $account['admin_notes'] = $_POST['admin_notes'] ?? $account['admin_notes'];
                    
                    $accounts[$key] = $account;
                    saveJSON('data-akun.json', $accounts);
                    $_SESSION['success'] = 'Data akun berhasil diperbarui';
                    break;
            }
            
            header('Location: dashboard.php');
            exit;
        }
    }
    
    $_SESSION['error'] = 'Akun tidak ditemukan';
    header('Location: dashboard.php');
    exit;
}

// Filter data
$filteredAccounts = $accounts;
if (isset($_GET['search'])) {
    $search = strtolower($_GET['search']);
    $filteredAccounts = array_filter($filteredAccounts, function($account) use ($search) {
        return strpos(strtolower($account['username']), $search) !== false ||
               strpos(strtolower($account['game_type']), $search) !== false;
    });
}

if (isset($_GET['status']) && in_array($_GET['status'], ['Sedang Dicek', 'Aman', 'Ditolak'])) {
    $filteredAccounts = array_filter($filteredAccounts, function($account) {
        return $account['status'] === $_GET['status'];
    });
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Admin</title>
    <!-- Tambahkan CSS dan JS yang diperlukan -->
</head>
<body>
    <h1>Dashboard Admin</h1>
    
    <!-- Form Pencarian -->
    <form method="GET" class="search-form">
        <input type="text" name="search" placeholder="Cari username atau game...">
        <select name="status">
            <option value="">Semua Status</option>
            <option value="Sedang Dicek">Sedang Dicek</option>
            <option value="Aman">Aman</option>
            <option value="Ditolak">Ditolak</option>
        </select>
        <button type="submit">Cari</button>
    </form>
    
    <!-- Tabel Data Akun -->
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Game</th>
                <th>Username</th>
                <th>Level</th>
                <th>Harga</th>
                <th>Status</th>
                <th>Tanggal Submit</th>
                <th>Aksi</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($filteredAccounts as $account): ?>
            <tr>
                <td><?= substr($account['id'], 0, 8) ?></td>
                <td><?= htmlspecialchars($account['game_type']) ?></td>
                <td><?= htmlspecialchars($account['username']) ?></td>
                <td><?= $account['level'] ?></td>
                <td>Rp <?= number_format($account['price'], 0, ',', '.') ?></td>
                <td><?= $account['status'] ?></td>
                <td><?= date('d M Y H:i', strtotime($account['submitted_at'])) ?></td>
                <td>
                    <button class="view-btn" data-id="<?= $account['id'] ?>">Lihat</button>
                    <form method="POST" style="display:inline;">
                        <input type="hidden" name="id" value="<?= $account['id'] ?>">
                        <button type="submit" name="action" value="approve">✅ Approve</button>
                        <button type="button" class="reject-btn" data-id="<?= $account['id'] ?>">❌ Tolak</button>
                    </form>
                </td>
            </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
    
    <!-- Modal untuk melihat detail akun -->
    <div id="accountModal" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <div id="modalBody"></div>
        </div>
    </div>
    
    <!-- Modal untuk menolak akun -->
    <div id="rejectModal" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <h3>Tolak Akun</h3>
            <form method="POST" id="rejectForm">
                <input type="hidden" name="id" id="rejectId">
                <input type="hidden" name="action" value="reject">
                <textarea name="notes" placeholder="Alasan penolakan..." required></textarea>
                <button type="submit">Submit</button>
            </form>
        </div>
    </div>
    
    <script>
        // JavaScript untuk modal dan interaksi
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', async function() {
                const id = this.getAttribute('data-id');
                const response = await fetch(`get_account.php?id=${id}`);
                const data = await response.json();
                
                // Format dan tampilkan data di modal
                let html = `<h2>${data.game_type} - ${data.username}</h2>`;
                html += `<p>Level: ${data.level}</p>`;
                html += `<p>Items: ${data.items}</p>`;
                html += `<p>Bind Status: ${data.bind_status}</p>`;
                html += `<p>Harga: Rp ${data.price.toLocaleString('id-ID')}</p>`;
                html += `<p>Deskripsi: ${data.description}</p>`;
                html += `<p>WhatsApp: ${data.whatsapp}</p>`;
                html += `<p>Status: ${data.status}</p>`;
                html += `<p>Admin Notes: ${data.admin_notes || '-'}</p>`;
                
                // Tampilkan gambar
                html += '<div class="images">';
                data.images.forEach(img => {
                    html += `<img src="../assets/uploads/${img}" alt="Account Image" style="max-width:200px;">`;
                });
                html += '</div>';
                
                document.getElementById('modalBody').innerHTML = html;
                document.getElementById('accountModal').style.display = 'block';
            });
        });
        
        document.querySelectorAll('.reject-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.getElementById('rejectId').value = this.getAttribute('data-id');
                document.getElementById('rejectModal').style.display = 'block';
            });
        });
        
        document.querySelectorAll('.modal .close').forEach(close => {
            close.addEventListener('click', function() {
                this.closest('.modal').style.display = 'none';
            });
        });
    </script>
</body>
</html>
