/**
 * Load data akun dari server
 */
async function loadAkunData(page = 1, filters = {}) {
    try {
        const query = new URLSearchParams({
            page,
            ...filters
        });
        
        const response = await fetch(`../php/api.php?action=get_akun&${query}`);
        const data = await response.json();
        
        if (data.status === 'success') {
            renderAkunCards(data.data);
            updatePagination(data.total_pages, page);
        } else {
            showError(data.message);
        }
    } catch (error) {
        showError('Gagal memuat data akun');
    }
}

function renderAkunCards(akunList) {
    const container = document.querySelector('.akun-grid');
    container.innerHTML = '';
    
    akunList.forEach(akun => {
        const card = document.createElement('div');
        card.className = 'akun-card';
        card.dataset.id = akun.id;
        card.dataset.game = akun.game;
        
        card.innerHTML = `
            <img src="${akun.image}" alt="${akun.game}" class="akun-img">
            <div class="akun-info">
                <span class="akun-game game-${akun.game}">${akun.game_name}</span>
                <h3 class="akun-title">${akun.title}</h3>
                <div class="akun-details">
                    <div class="akun-detail">
                        <i class="fas fa-trophy"></i>
                        <span>Rank: ${akun.rank}</span>
                    </div>
                    <div class="akun-detail">
                        <i class="fas fa-chess-queen"></i>
                        <span>Vault: ${akun.vault}</span>
                    </div>
                </div>
                <div class="akun-price">Rp ${akun.price.toLocaleString('id-ID')}</div>
                <div class="akun-actions">
                    <button onclick="handlePurchase('${akun.id}')" class="btn btn-primary">Beli Sekarang</button>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
}
