/**
 * Fungsi utama untuk menginisialisasi seluruh fitur website
 */
document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi filter akun game
    initFilterButtons();
    
    // Inisialisasi mobile menu
    initMobileMenu();
    
    // Inisialisasi form validasi
    initForms();
    
    // Animasi scroll halus
    initSmoothScroll();
});

/**
 * Fungsi untuk filter akun berdasarkan game (Free Fire/Mobile Legends)
 */
function initFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const akunCards = document.querySelectorAll('.akun-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.dataset.filter;
            
            // Filter akun cards
            akunCards.forEach(card => {
                if (filter === 'all' || card.dataset.game === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/**
 * Fungsi untuk toggle mobile menu
 */
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
}

/**
 * Fungsi untuk validasi form
 */
function initForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            let isValid = true;
            
            // Validasi input required
            const inputs = form.querySelectorAll('[required]');
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            });
            
            // Validasi email khusus
            const emailInput = form.querySelector('input[type="email"]');
            if (emailInput && !isValidEmail(emailInput.value)) {
                isValid = false;
                emailInput.classList.add('error');
            }
            
            if (!isValid) {
                e.preventDefault();
                alert('Harap isi semua field yang diperlukan dengan benar!');
            }
        });
    });
}

/**
 * Fungsi helper untuk validasi email
 */
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Fungsi untuk smooth scroll
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Fungsi untuk menangani pembelian akun
 */
function handlePurchase(akunId) {
    // Simpan data pembelian di localStorage
    const selectedAkun = document.querySelector(`.akun-card[data-id="${akunId}"]`);
    const game = selectedAkun.dataset.game;
    const title = selectedAkun.querySelector('.akun-title').textContent;
    const price = selectedAkun.querySelector('.akun-price').textContent;
    
    const purchaseData = {
        id: akunId,
        game: game,
        title: title,
        price: price,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('lastPurchase', JSON.stringify(purchaseData));
    
    // Redirect ke halaman pembelian
    window.location.href = `php/beli-akun.php?id=${akunId}`;
}

// Ekspos fungsi ke global scope untuk akses dari HTML
window.handlePurchase = handlePurchase;
