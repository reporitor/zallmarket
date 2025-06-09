document.addEventListener('DOMContentLoaded', function() {
    // Thumbnail image click handler
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('zoom-image');
    
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            // Remove active class from all thumbnails
            thumbnails.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            this.classList.add('active');
            
            // Change main image
            const imgSrc = this.querySelector('img').src;
            mainImage.src = imgSrc;
        });
    });

    // Tab navigation
    const tabNavItems = document.querySelectorAll('.tab-nav li');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabNavItems.forEach(item => {
        item.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all nav items and panes
            tabNavItems.forEach(navItem => navItem.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked nav item and corresponding pane
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Quantity selector
    const minusBtn = document.querySelector('.qty-btn.minus');
    const plusBtn = document.querySelector('.qty-btn.plus');
    const qtyInput = document.getElementById('quantity');
    const priceElement = document.querySelector('.current-price');
    const totalAmountElement = document.getElementById('total-amount');
    
    let price = parseFloat(priceElement.textContent.replace('Rp ', '').replace('.', ''));
    let quantity = parseInt(qtyInput.value);
    
    function updateTotal() {
        const total = price * quantity;
        totalAmountElement.textContent = 'Rp ' + total.toLocaleString('id-ID');
    }
    
    minusBtn.addEventListener('click', function() {
        if (quantity > 1) {
            quantity--;
            qtyInput.value = quantity;
            updateTotal();
        }
    });
    
    plusBtn.addEventListener('click', function() {
        const max = parseInt(qtyInput.getAttribute('max'));
        if (quantity < max) {
            quantity++;
            qtyInput.value = quantity;
            updateTotal();
        } else {
            alert(`Maksimal pembelian ${max} item untuk produk ini.`);
        }
    });
    
    qtyInput.addEventListener('change', function() {
        const value = parseInt(this.value);
        const max = parseInt(this.getAttribute('max'));
        
        if (isNaN(value) || value < 1) {
            this.value = 1;
            quantity = 1;
        } else if (value > max) {
            this.value = max;
            quantity = max;
            alert(`Maksimal pembelian ${max} item untuk produk ini.`);
        } else {
            quantity = value;
        }
        
        updateTotal();
    });

    // Payment method change
    const paymentMethod = document.getElementById('payment-method');
    
    paymentMethod.addEventListener('change', function() {
        // Here you can add logic for different payment methods if needed
        console.log('Payment method selected:', this.value);
    });

    // Form submission
    const buyForm = document.getElementById('buy-form');
    
    buyForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (paymentMethod.value === '') {
            alert('Silakan pilih metode pembayaran');
            return;
        }
        
        // Here you would normally send the data to the server
        // For demo, we'll just show an alert
        alert(`Pembelian berhasil!\n\nProduk: Valorant Radiant Account\nJumlah: ${quantity}\nTotal: ${totalAmountElement.textContent}\nMetode Pembayaran: ${paymentMethod.options[paymentMethod.selectedIndex].text}`);
        
        // Reset form
        // buyForm.reset();
        // quantity = 1;
        // qtyInput.value = 1;
        // updateTotal();
    });

    // Add to cart button
    const addToCartBtn = document.querySelector('.btn-add-to-cart');
    
    addToCartBtn.addEventListener('click', function() {
        if (paymentMethod.value === '') {
            alert('Silakan pilih metode pembayaran');
            return;
        }
        
        // Here you would add the item to cart
        alert(`Produk telah ditambahkan ke keranjang!\n\nValorant Radiant Account\nJumlah: ${quantity}\nTotal: ${totalAmountElement.textContent}`);
        
        // Update cart count
        const cartCount = document.querySelector('.cart-count');
        let count = parseInt(cartCount.textContent) || 0;
        count += quantity;
        cartCount.textContent = count;
    });
});
