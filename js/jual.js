document.addEventListener('DOMContentLoaded', function() {
    // Toggle password visibility
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.querySelector('#loginPassword');
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });
    }

    // Image upload preview
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('accountImages');
    const imagePreview = document.getElementById('imagePreview');
    
    if (uploadArea && imageInput && imagePreview) {
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--primary)';
            uploadArea.style.backgroundColor = 'rgba(108, 92, 231, 0.1)';
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = 'var(--light-gray)';
            uploadArea.style.backgroundColor = '';
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--light-gray)';
            uploadArea.style.backgroundColor = '';
            
            if (e.dataTransfer.files.length) {
                imageInput.files = e.dataTransfer.files;
                previewImages();
            }
        });

        imageInput.addEventListener('change', previewImages);

        function previewImages() {
            imagePreview.innerHTML = '';
            
            if (imageInput.files.length > 0) {
                Array.from(imageInput.files).forEach(file => {
                    if (file.type.match('image.*')) {
                        const reader = new FileReader();
                        
                        reader.onload = function(e) {
                            const previewItem = document.createElement('div');
                            previewItem.className = 'image-preview-item';
                            
                            const img = document.createElement('img');
                            img.src = e.target.result;
                            
                            const removeBtn = document.createElement('span');
                            removeBtn.className = 'remove-image';
                            removeBtn.innerHTML = '&times;';
                            removeBtn.addEventListener('click', function() {
                                previewItem.remove();
                                updateFileList();
                            });
                            
                            previewItem.appendChild(img);
                            previewItem.appendChild(removeBtn);
                            imagePreview.appendChild(previewItem);
                        }
                        
                        reader.readAsDataURL(file);
                    }
                });
            }
        }

        function updateFileList() {
            const dataTransfer = new DataTransfer();
            const previewItems = document.querySelectorAll('.image-preview-item');
            
            previewItems.forEach(item => {
                const imgSrc = item.querySelector('img').src;
                Array.from(imageInput.files).forEach(file => {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        if (e.target.result === imgSrc) {
                            dataTransfer.items.add(file);
                        }
                    };
                    reader.readAsDataURL(file);
                });
            });
            
            imageInput.files = dataTransfer.files;
        }
    }

    // Form submission
    const accountForm = document.getElementById('accountForm');
    const successModal = document.getElementById('successModal');
    const closeModal = document.querySelector('.close-modal');
    
    if (accountForm && successModal && closeModal) {
        accountForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // In a real app, you would send the data to your server here
            // For demo purposes, we'll just show the success modal
            successModal.style.display = 'flex';
            
            // Reset form after submission (optional)
            // accountForm.reset();
            // imagePreview.innerHTML = '';
        });

        closeModal.addEventListener('click', function() {
            successModal.style.display = 'none';
        });

        window.addEventListener('click', function(e) {
            if (e.target === successModal) {
                successModal.style.display = 'none';
            }
        });
    }
});
