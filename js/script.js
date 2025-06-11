document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formJualAkun');
    const errorMessage = document.getElementById('error-message');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validasi client-side
        const formData = new FormData(form);
        let isValid = true;
        
        // Cek semua field required
        for (const [key, value] of formData.entries()) {
            if (key !== 'catatan_admin' && !value) {
                showError(`Field ${key} harus diisi`);
                isValid = false;
                break;
            }
        }
        
        // Cek persetujuan
        if (!formData.get('persetujuan')) {
            showError('Anda harus menyetujui ketentuan');
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Kirim data ke server
        try {
            const response = await fetch('submit.php', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Redirect ke halaman sukses
                window.location.href = 'berhasil.html';
            } else {
                showError(result.message || 'Terjadi kesalahan saat mengirim data');
            }
        } catch (error) {
            console.error('Error:', error);
            showError('Terjadi kesalahan jaringan');
        }
    });
    
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
        
        // Sembunyikan pesan error setelah 5 detik
        setTimeout(() => {
            errorMessage.classList.add('hidden');
        }, 5000);
    }
});
