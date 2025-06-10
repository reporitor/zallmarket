<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jual Akun Game | Game Marketplace</title>
    <link rel="stylesheet" href="assets/css/jual.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <div class="container">
        <header class="form-header">
            <h1><i class="fas fa-gamepad"></i> Jual Akun Game</h1>
            <p>Isi formulir berikut untuk menjual akun game Anda</p>
        </header>

        <?php if (isset($_GET['success'])): ?>
        <div class="alert success">
            <i class="fas fa-check-circle"></i> Berhasil dikirim! Admin akan memverifikasi akun Anda.
        </div>
        <?php endif; ?>

        <form id="sellForm" class="account-form" enctype="multipart/form-data" action="api/submit.php" method="POST">
            <section class="form-section">
                <h2><i class="fas fa-info-circle"></i> Informasi Akun</h2>
                
                <div class="form-group">
                    <label for="game_type">Jenis Game*</label>
                    <select id="game_type" name="game_type" required>
                        <option value="">Pilih Game</option>
                        <?php foreach ($games as $game): ?>
                        <option value="<?= htmlspecialchars($game) ?>"><?= htmlspecialchars($game) ?></option>
                        <?php endforeach; ?>
                    </select>
                    <span class="error-msg" id="game_type_error"></span>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="username">Username*</label>
                        <input type="text" id="username" name="username" placeholder="Nama karakter" required>
                        <span class="error-msg" id="username_error"></span>
                    </div>

                    <div class="form-group">
                        <label for="level">Level*</label>
                        <input type="number" id="level" name="level" min="1" placeholder="Level akun" required>
                        <span class="error-msg" id="level_error"></span>
                    </div>
                </div>

                <div class="form-group">
                    <label for="items">Jumlah Skin/Diamond*</label>
                    <input type="text" id="items" name="items" placeholder="Contoh: 50 Skin, 1000 Diamond" required>
                    <span class="error-msg" id="items_error"></span>
                </div>

                <div class="form-group">
                    <label for="bind_status">Status Bind*</label>
                    <select id="bind_status" name="bind_status" required>
                        <option value="">Pilih Bind</option>
                        <option value="Gmail">Gmail</option>
                        <option value="Facebook">Facebook</option>
                        <option value="VK">VK</option>
                        <option value="Apple ID">Apple ID</option>
                    </select>
                    <span class="error-msg" id="bind_status_error"></span>
                </div>
            </section>

            <section class="form-section">
                <h2><i class="fas fa-tag"></i> Harga & Deskripsi</h2>
                
                <div class="form-group">
                    <label for="price">Harga Jual (Rp)*</label>
                    <div class="price-input">
                        <span>Rp</span>
                        <input type="number" id="price" name="price" min="1000" placeholder="100000" required>
                    </div>
                    <span class="error-msg" id="price_error"></span>
                </div>

                <div class="form-group">
                    <label for="description">Deskripsi Akun*</label>
                    <textarea id="description" name="description" rows="4" 
                              placeholder="Deskripsikan akun Anda (hero favorit, win rate, item spesial, dll)" required></textarea>
                    <span class="error-msg" id="description_error"></span>
                </div>
            </section>

            <section class="form-section">
                <h2><i class="fas fa-user"></i> Kontak Penjual</h2>
                
                <div class="form-group">
                    <label for="whatsapp">Nomor WhatsApp*</label>
                    <div class="phone-input">
                        <span>+62</span>
                        <input type="text" id="whatsapp" name="whatsapp" placeholder="81234567890" required>
                    </div>
                    <span class="error-msg" id="whatsapp_error"></span>
                </div>
            </section>

            <section class="form-section">
                <h2><i class="fas fa-images"></i> Upload Gambar</h2>
                
                <div class="form-group">
                    <label>Gambar Akun (Minimal 2)*</label>
                    <div class="upload-area" id="uploadArea">
                        <div class="upload-icon">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <p>Seret & lepas gambar atau klik untuk memilih</p>
                        </div>
                        <input type="file" id="images" name="images[]" multiple accept="image/*" required>
                    </div>
                    <div class="preview-container" id="previewContainer"></div>
                    <span class="error-msg" id="images_error"></span>
                </div>
            </section>

            <section class="form-section agreement">
                <div class="form-group checkbox-group">
                    <input type="checkbox" id="agree" name="agree" required>
                    <label for="agree">Saya menjamin akun ini milik pribadi dan tidak melanggar Terms of Service</label>
                    <span class="error-msg" id="agree_error"></span>
                </div>
            </section>

            <div class="form-actions">
                <button type="submit" class="submit-btn">
                    <i class="fas fa-paper-plane"></i> Kirim Penawaran
                </button>
            </div>
        </form>
    </div>

    <script src="assets/js/jual-akun.js"></script>
</body>
</html>
