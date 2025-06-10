document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('sellForm');
    const uploadArea = document.getElementById('uploadArea');
    const previewContainer = document.getElementById('previewContainer');
    const fileInput = document.getElementById('images');

    // Handle drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        fileInput.files = e.dataTransfer.files;
        updatePreview();
    });

    // Handle file selection
    fileInput.addEventListener('change', updatePreview);

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) return;
        
        // Submit form
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        
        try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
            
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                window.location.href = result.redirect || 'jual-akun.php?success=1';
            } else {
                showError(result.message || 'Terjadi kesalahan saat mengirim data');
            }
        } catch (error) {
            console.error('Error:', error);
            showError('Terjadi kesalahan jaringan');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Kirim Penawaran';
        }
    });

    // Helper functions
    function updatePreview() {
        previewContainer.innerHTML = '';
        const files = fileInput.files;
        
        if (files.length < 2) {
            document.getElementById('images_error').textContent = 'Minimal 2 gambar diperlukan';
        } else {
            document.getElementById('images_error').textContent = '';
        }
        
        Array.from(files).forEach(file => {
            if (!file.type.startsWith('image/')) return;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                const previewItem = document.createElement('div');
                previewItem.className = 'preview-item';
                
                const img = document.createElement('img');
                img.src = e.target.result;
                
                const removeBtn = document.createElement('span');
                removeBtn.className = 'remove-btn';
                removeBtn.innerHTML = '&times;';
                removeBtn.addEventListener('click', () => removeImage(file.name));
                
                previewItem.appendChild(img);
                previewItem.appendChild(removeBtn);
                previewContainer.appendChild(previewItem);
            };
            reader.readAsDataURL(file);
        });
    }

    function removeImage(filename) {
        const dt = new DataTransfer();
        const files = fileInput.files;
        
        Array.from(files).forEach(file => {
            if (file.name !== filename) dt.items.add(file);
        });
        
        fileInput.files = dt.files;
        updatePreview();
    }

    function validateForm() {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            const errorElement = document.getElementById(`${field.id}_error`);
            
            if (!field.value) {
                errorElement.textContent = 'Field ini wajib diisi';
                isValid = false;
            } else if (field.id === 'images' && field.files.length < 2) {
                errorElement.textContent = 'Minimal 2 gambar diperlukan';
                isValid = false;
            } else {
                errorElement.textContent = '';
            }
        });
        
        return isValid;
    }

    function showError(message) {
        const alert = document.createElement('div');
        alert.className = 'alert error';
        alert.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        const statusMessage = document.querySelector('.form-header');
        statusMessage.insertAdjacentElement('afterend', alert);
        
        setTimeout(() => alert.remove(), 5000);
    }
});
