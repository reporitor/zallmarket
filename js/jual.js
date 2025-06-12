document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('sell-form');
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('images');
    const previewContainer = document.getElementById('preview-container');
    
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
            
            const response = await fetch('api/submit.php', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                showAlert('success', 'Akun berhasil diajukan! Admin akan memverifikasi dalam 1x24 jam.');
                form.reset();
                previewContainer.innerHTML = '';
            } else {
                showAlert('error', result.message || 'Terjadi kesalahan saat mengirim data');
            }
        } catch (error) {
            console.error('Error:', error);
            showAlert('error', 'Terjadi kesalahan jaringan');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Penawaran';
        }
    });
    
    // Helper functions
    function updatePreview() {
        previewContainer.innerHTML = '';
        const files = fileInput.files;
        
        if (files.length < 2) {
            return;
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
            if (!field.value || (field.id === 'images' && field.files.length < 2)) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });
        
        if (!isValid) {
            showAlert('error', 'Harap lengkapi semua field yang wajib diisi');
        }
        
        return isValid;
    }
    
    function showAlert(type, message) {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle"></i>
            ${message}
        `;
        
        const existingAlert = form.querySelector('.alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        form.prepend(alert);
        
        setTimeout(() => {
            alert.remove();
        }, 5000);
    }
});
