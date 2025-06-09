// Nomor WhatsApp tujuan
const whatsappNumber = "6281234567890"; // Ganti dengan nomor WA mu tanpa tanda + atau 0 depan

document.querySelectorAll(".buy-btn").forEach(button => {
  button.addEventListener("click", e => {
    const card = e.target.closest(".game-card");
    const name = card.dataset.name;
    const stock = card.dataset.stock;
    const price = card.dataset.price;
    const image = card.dataset.image;

    // Cek stok dulu, kalau 0 disable beli
    if (parseInt(stock) <= 0) {
      alert("Maaf, stok game ini sudah habis.");
      return;
    }

    // Format pesan WA
    const message = 
      `Halo! Saya ingin membeli:\n` +
      `Game: ${name}\n` +
      `Harga: ${price}\n` +
      `Stok tersedia: ${stock}\n` +
      `Gambar: ${image}\n\n` +
      `Mohon info selanjutnya. Terima kasih!`;

    // Encode pesan supaya URL aman
    const encodedMessage = encodeURIComponent(message);

    // URL WhatsApp
    const waUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Buka WA di tab baru
    window.open(waUrl, "_blank");
  });
});
