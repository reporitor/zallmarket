document.addEventListener('DOMContentLoaded', function() {
    // Variabel global untuk menyimpan data akun
    let akunData = [];
    let currentPage = 1;
    const itemsPerPage = 10;
    let currentAkunId = null;

    // Fungsi untuk memuat data akun dari JSON
    async function loadAkunData() {
        try {
            const response = await fetch('../data/data-akun.json');
            if (!response.ok) throw new Error('Gagal memuat data');
            
            akunData = await response.json();
            renderTable();
            updatePagination();
        } catch (error) {
            console.error('Error:', error);
            alert('Gagal memuat data akun');
        }
    }

    // Fungsi untuk merender tabel
    function renderTable() {
        const tbody = document.querySelector('#akunTable tbody');
        tbody.innerHTML = '';

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, akunData.length);
        const paginatedData = akunData.slice(startIndex, endIndex);

        paginatedData.forEach(akun => {
            const row = document.createElement('tr');
            row.className = 'border-b hover:bg-gray-50';
            row.innerHTML = `
                <td class="py-3 px-4">${akun.id}</td>
                <td class="py-3 px-4">${akun.game}</td>
                <td class="py-3 px-4">${akun.username}</td>
                <td class="py-3 px-4">${akun.level}</td>
                <td class="py-3 px-4">Rp ${akun.harga.toLocaleString()}</td>
                <td class="py-3 px-4">
                    <span class="px-2 py-1 rounded-full text-xs 
                        ${akun.status === 'Aman' ? 'bg-green-100 text-green-800' : 
                          akun.status === 'Ditolak' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}">
                        ${akun.status}
                    </span>
                </td>
                <td class="py-3 px-4">
                    <button class="view-btn px-3 py-1 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200" 
                        data-id="${akun.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });

        // Update info pagination
        document.getElementById('showing').textContent = `${startIndex + 1}-${endIndex}`;
        document.getElementById('total').textContent = akunData.length;

        // Tambahkan event listener untuk tombol view
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const akunId = this.getAttribute('data-id');
                showDetailModal(akunId);
            });
        });
    }

    // Fungsi untuk menampilkan modal detail
    function showDetailModal(akunId) {
        currentAkunId = akunId;
        const akun = akunData.find(a => a.id === akunId);
        if (!akun) return;

        const modalContent = document.getElementById('modalContent');
        modalContent.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 class="font-semibold mb-2">Informasi Akun</h4>
                    <div class="space-y-2">
                        <p><span class="font-medium">Game:</span> ${akun.game}</p>
                        <p><span class="font-medium">Username:</span> ${akun.username}</p>
                        <p><span class="font-medium">Level:</span> ${akun.level}</p>
                        <p><span class="font-medium">Skin/Diamond:</span> ${akun.items}</p>
                        <p><span class="font-medium">Bind:</span> ${akun.bind}</p>
                        <p><span class="font-medium">Harga:</span> Rp ${akun.harga.toLocaleString()}</p>
                        <p><span class="font-medium">WhatsApp:</span> ${akun.whatsapp}</p>
                        <p><span class="font-medium">Tanggal:</span> ${akun.waktu_pengiriman}</p>
                    </div>
                    
                    <h4 class="font-semibold mt-4 mb-2">Deskripsi</h4>
                    <p class="text-gray-700">${akun.deskripsi}</p>
                    
                    <h4 class="font-semibold mt-4 mb-2">Catatan Admin</h4>
                    <textarea id="adminNotes" class="w-full border rounded-md p-2" rows="3">${akun.catatan_admin || ''}</textarea>
                </div>
                <div>
                    <h4 class="font-semibold mb-2">Gambar Akun</h4>
                    <div class="space-y-4">
                        <div>
                            <p class="text-sm font-medium mb-1">Profil Akun</p>
                            <img src="../uploads/${akun.gambar_profil}" alt="Profil Akun" class="w-full rounded-md border">
                        </div>
                        <div>
                            <p class="text-sm font-medium mb-1">Gambar Lain</p>
                            <img src="../uploads/${akun.gambar_lain}" alt="Gambar Lain" class="w-full rounded-md border">
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Tampilkan modal
        document.getElementById('detailModal').classList.remove('hidden');
    }

    // Fungsi untuk update pagination
    function updatePagination() {
        const totalPages = Math.ceil(akunData.length / itemsPerPage);
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    }

    // Event listeners
    document.getElementById('prevBtn').addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
            updatePagination();
        }
    });

    document.getElementById('nextBtn').addEventListener('click', function() {
        const totalPages = Math.ceil(akunData.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderTable();
            updatePagination();
        }
    });

    document.getElementById('closeModal').addEventListener('click', function() {
        document.getElementById('detailModal').classList.add('hidden');
    });

    document.getElementById('tolakBtn').addEventListener('click', function() {
        if (!currentAkunId) return;
        
        const notes = document.getElementById('adminNotes').value;
        updateAkunStatus(currentAkunId, 'Ditolak', notes);
    });

    document.getElementById('whatsappBtn').addEventListener('click', function() {
        if (!currentAkunId) return;
        
        const notes = document.getElementById('adminNotes').value;
        updateAkunStatus(currentAkunId, 'Aman', notes);
        
        // Kirim ke WhatsApp (simulasi)
        const akun = akunData.find(a => a.id === currentAkunId);
        alert(`Data akun ${akun.username} akan dikirim ke WhatsApp`);
        
        // Pindahkan ke riwayat (simulasi)
        moveToRiwayat(currentAkunId);
    });

    // Fungsi untuk update status akun
    function updateAkunStatus(akunId, status, notes) {
        const index = akunData.findIndex(a => a.id === akunId);
        if (index === -1) return;

        akunData[index].status = status;
        akunData[index].catatan_admin = notes;

        // Simpan perubahan ke JSON (simulasi)
        // Dalam implementasi nyata, gunakan fetch ke endpoint PHP
        console.log(`Status akun ${akunId} diupdate menjadi ${status}`);
        
        // Tutup modal dan refresh tabel
        document.getElementById('detailModal').classList.add('hidden');
        renderTable();
    }

    // Fungsi untuk pindahkan ke riwayat
    function moveToRiwayat(akunId) {
        const index = akunData.findIndex(a => a.id === akunId);
        if (index === -1) return;

        const movedAkun = akunData.splice(index, 1)[0];
        
        // Simpan perubahan ke JSON (simulasi)
        // Dalam implementasi nyata, gunakan fetch ke endpoint PHP
        console.log(`Akun ${akunId} dipindahkan ke riwayat`);
        
        renderTable();
        updatePagination();
    }

    // Muat data saat halaman dimuat
    loadAkunData();
});
