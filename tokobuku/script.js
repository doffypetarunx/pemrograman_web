const books = [
  { name: "Masjid Idaman", author: "Aji Banyu", price: 50000, image: "images/a.jpg" },
  { name: "Bangunan Bersejarah", author: "Andika Abdillah", price: 70000, image: "images/b.jpg" },
  { name: "Kota Lama", author: "Fatih Sultan Albani", price: 40000, image: "images/c.jpg" },
  { name: "Hitam Putih", author: "Angel Maharani", price: 50000, image: "images/d.jpg" },
  { name: "Kehidupan Malam", author: "Ahmad Labib Riski", price: 100000, image: "images/e.jpg" },
  { name: "Cuaca Mendukung", author: "Nadia Patricia", price: 150000, image: "images/f.jpg" },
  { name: "Monumen Bersejarah", author: "Imam Ahmad", price: 700000, image: "images/g.jpg" },
  { name: "Makhluk Dunia Lain", author: "Syafii Nur Adha", price: 1000000, image: "images/h.jpg" },
  { name: "Tempat Mereka", author: "Muhammad Ryan", price: 50000, image: "images/i.jpg" },
  { name: "Kota Sejuta Bunga", author: "Maulida Hanifah", price: 80000, image: "images/j.jpg" },
  { name: "Hari Tenang", author: "Sahwa", price: 200000, image: "images/k.jpg" },
  { name: "Kehidupan Di Atas", author: "Zidan", price: 300000, image: "images/l.jpg" },
  { name: "Apa Itu Simetris", author: "Ahmad Ihsan", price: 900000, image: "images/m.jpg" },
  { name: "Perjalanan Jauh", author: "Digta", price: 500000, image: "images/n.jpg" }
];

let cart = JSON.parse(localStorage.getItem('cart')) || {};

// Fungsi gabungan untuk filter, sort, dan search
function applyFilters() {
  const query = document.getElementById('search-bar').value.toLowerCase();
  const priceFilter = document.getElementById('filter-price').value;
  const sortOption = document.getElementById('sort-books').value;

  let result = books.filter(book =>
    book.name.toLowerCase().includes(query)
  );

  if (priceFilter !== 'all') {
    result = result.filter(book => book.price <= parseInt(priceFilter));
  }

  switch (sortOption) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'name-asc':
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name-desc':
      result.sort((a, b) => b.name.localeCompare(a.name));
      break;
  }

  renderBooks(result);
}

// Render buku
function renderBooks(filteredBooks = books) {
  const container = document.getElementById('books-container');
  container.innerHTML = '';

  filteredBooks.forEach(book => {
    const bookDiv = document.createElement('div');
    bookDiv.className = 'book';
    bookDiv.innerHTML = `
      <img src="${book.image}" alt="${book.name}" class="book-image">
      <h3>${book.name}</h3>
      <p>Penulis: ${book.author}</p>
      <p>Harga: Rp ${book.price.toLocaleString('id-ID')}</p>
      <button onclick="addToCart('${book.name}', ${book.price})">Tambah ke Keranjang</button>
    `;
    container.appendChild(bookDiv);
  });
}

// Tambah ke keranjang
function addToCart(bookName, price) {
  if (cart[bookName]) {
    cart[bookName].qty += 1;
  } else {
    cart[bookName] = { price: price, qty: 1 };
  }
  updateCart();
  showAlert(`${bookName} berhasil ditambahkan ke keranjang!`);
}

// Update tampilan keranjang
function updateCart() {
  const cartItems = document.getElementById('cart-items');
  cartItems.innerHTML = '';

  let total = 0;
  for (const [name, { price, qty }] of Object.entries(cart)) {
    const listItem = document.createElement('li');
    listItem.textContent = `${name} (x${qty}) - Rp ${(price * qty).toLocaleString('id-ID')}`;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Hapus';
    deleteBtn.className = 'delete-btn';
    deleteBtn.onclick = () => removeFromCart(name);

    listItem.appendChild(deleteBtn);
    cartItems.appendChild(listItem);

    total += price * qty;
  }

  document.getElementById('cart-total').textContent = `Total: Rp ${total.toLocaleString('id-ID')}`;
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Hapus item dari keranjang
function removeFromCart(bookName) {
  if (cart[bookName]) {
    delete cart[bookName];
    updateCart();
  }
}

// Tampilkan notifikasi alert
function showAlert(message) {
  const alert = document.createElement('div');
  alert.className = 'alert';
  alert.textContent = message;

  document.body.appendChild(alert);

  setTimeout(() => {
    alert.remove();
  }, 3000);
}

const themeToggleBtn = document.getElementById('toggle-theme');

// Toggle tema
themeToggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  themeToggleBtn.textContent = isDark ? '☀️' : '🌙';
});

// Inisialisasi tema dari localStorages
window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggleBtn.textContent = '☀️';
  }
});

// Event listener
document.getElementById('search-bar').addEventListener('keyup', applyFilters);
document.getElementById('filter-price').addEventListener('change', applyFilters);
document.getElementById('sort-books').addEventListener('change', applyFilters);

// Inisialisasi
renderBooks();
updateCart();
