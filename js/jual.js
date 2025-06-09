document.addEventListener('DOMContentLoaded', function() {
    // Image upload preview
    const fileInput = document.getElementById('screenshot');
    const previewContainer = document.querySelector('.preview-container');
    
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            previewContainer.innerHTML = '';
            
            if (this.files) {
                const files = Array.from(this.files);
                
                // Limit to 3 files
                const selectedFiles = files.slice(0, 3);
                
                selectedFiles.forEach(file => {
                    if (!file.type.match('image.*')) {
                        return;
                    }
                    
                    const reader = new FileReader();
                    
                    reader.onload = function(e) {
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        previewContainer.appendChild(img);
                    }
                    
                    reader.readAsDataURL(file);
                });
            }
        });
    }

    // FAQ accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // Form submission
    const jualForm = document.querySelector('.jual-form');
    
    if (jualForm) {
        jualForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            const jenisAkun = document.getElementById('jenis-akun').value;
            const namaAkun = document.getElementById('nama-akun').value;
            const hargaAkun = document.getElementById('harga-akun').value;
            const setujuSyarat = document.getElementById('setuju-syarat').checked;
            
            if (!jenisAkun || !namaAkun || !hargaAkun || !setujuSyarat) {
                alert('Harap lengkapi semua field yang wajib diisi!');
                return;
            }
            
            // Submit form (simulated)
            alert('Formulir penjualan berhasil dikirim! Tim kami akan memverifikasi dalam 1x24 jam.');
            this.reset();
            previewContainer.innerHTML = '';
        });
    }
});
