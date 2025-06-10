document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('account-form');
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('images');
    const previewContainer = document.getElementById('preview-container');
    const formMessage = document.getElementById('form-message');

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
        
        // Reset messages
        formMessage.innerHTML = '';
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
        });

        // Validate form
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');

        requiredFields.forEach(field => {
            if (!field.value || (field.id === 'images' && field.files.length < 2)) {
                const errorElement = document.getElementById(`${field.id}-error`);
                errorElement.textContent = field.id === 'images' ? 
                    'Minimal 2 gambar diperlukan' : 'Field ini wajib diisi';
                isValid = false;
            }
        });

        if (!isValid) {
            showMessage('Tolong lengkapi semua field yang wajib diisi', 'error');
            return;
        }

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
                showMessage(result.message, 'success');
                if (result.redirect) {
                    setTimeout(() => {
                        window.location.href = result.redirect;
                    }, 2000);
                }
            } else {
                showMessage(result.message, 'error');
                // Show field errors if any
                if (result.errors) {
                    Object.entries(result.errors).forEach(([field, message]) => {
                        const errorElement = document.getElementById(`${field}-error`);
                        if (errorElement) {
                            errorElement.textContent = message;
                        }
                    });
                }
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('Terjadi kesalahan saat mengirim data', 'error');
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
            document.getElementById('images-error').textContent = 'Minimal 2 gambar diperlukan';
        } else {
            document.getElementById('images-error').textContent = '';
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

    function showMessage(message, type) {
        formMessage.innerHTML = `
            <div class="message-${type}">
                <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle"></i>
                ${message}
            </div>
        `;
    }
});
