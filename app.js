const fallbackImage = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80';
const STORAGE_KEY = 'braven_products';

const demoProducts = [
  { id: 1, name: 'تيشيرت Dream Big', category: 'رجالي', price: 299, oldPrice: 349, stock: 10, dark: true, image: fallbackImage },
  { id: 2, name: 'تيشيرت Samurai', category: 'تصاميم', price: 279, oldPrice: 0, stock: 10, image: fallbackImage },
  { id: 3, name: 'تيشيرت Adventure', category: 'كاجوال', price: 319, oldPrice: 0, stock: 10, image: fallbackImage },
  { id: 4, name: 'تيشيرت Good Vibes', category: 'رجالي', price: 299, oldPrice: 349, stock: 10, image: fallbackImage },
  { id: 5, name: 'تيشيرت Anime', category: 'تصاميم', price: 289, oldPrice: 0, stock: 10, image: fallbackImage },
  { id: 6, name: 'تيشيرت Butterfly', category: 'نسائي', price: 279, oldPrice: 0, stock: 10, image: fallbackImage },
  { id: 7, name: 'تيشيرت Kids', category: 'أطفال', price: 229, oldPrice: 0, stock: 10, image: fallbackImage },
  { id: 8, name: 'هودي Street', category: 'هوديز', price: 449, oldPrice: 499, stock: 10, image: fallbackImage }
];

function normalizeProduct(product) {
  const rawStock = Number(product.stock);
  return {
    ...product,
    category: product.category || product.cat || 'أخرى',
    oldPrice: product.oldPrice ?? product.old ?? 0,
    stock: Number.isFinite(rawStock) ? Math.max(0, Math.floor(rawStock)) : 0,
    image: product.image || fallbackImage
  };
}

function getProducts() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (Array.isArray(saved) && saved.length) return saved.map(normalizeProduct);
  } catch (error) {}

  localStorage.setItem(STORAGE_KEY, JSON.stringify(demoProducts));
  return demoProducts.map(normalizeProduct);
}

function saveProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products.map(normalizeProduct)));
}

let cart = JSON.parse(localStorage.getItem('braven_cart') || '[]');
const grid = document.getElementById('productGrid');

function render(list = getProducts()) {
  if (!grid) return;

  const products = Array.isArray(list) ? list.map(normalizeProduct) : getProducts();
  grid.innerHTML = products.map(product => {
    const available = product.stock > 0;
    return `
      <article class="card">
        <div class="pic ${product.dark ? 'dark' : ''}">
          <img src="${product.image}" alt="${product.name}" onerror="this.src='${fallbackImage}'">
        </div>
        <div class="info">
          <b>${product.name}</b>
          <span class="cat">${product.category}</span>
          <div class="price-wrap">
            <strong>${product.price} ج.م</strong>
            ${product.oldPrice ? `<span>${product.oldPrice} ج.م</span>` : ''}
          </div>
          <small style="display:block;margin:8px 0;color:${available ? '#28764d' : '#b5483a'};font-weight:700">
            ${available ? `متوفر (${product.stock} قطعة)` : 'غير متوفر'}
          </small>
          <button class="add-cart" data-id="${product.id}" ${available ? '' : 'disabled'}>
            ${available ? 'أضف إلى السلة' : 'نفد المخزون'}
          </button>
        </div>
      </article>
    `;
  }).join('');

  bindAddButtons();
}

function updateCount() {
  const count = document.getElementById('cartCount');
  if (count) count.textContent = cart.length;
}

function addToCart(id) {
  const products = getProducts();
  const product = products.find(item => Number(item.id) === Number(id));

  if (!product || product.stock <= 0) {
    alert('هذا المنتج غير متوفر حاليًا');
    render(products);
    return;
  }

  product.stock -= 1;
  cart.push(Number(id));
  saveProducts(products);
  localStorage.setItem('braven_cart', JSON.stringify(cart));
  updateCount();
  render(products);
  alert('تمت إضافة المنتج إلى السلة وتم تحديث المخزون');
}

function bindAddButtons() {
  document.querySelectorAll('.add-cart').forEach(button => {
    button.onclick = () => addToCart(button.dataset.id);
  });
}

function setActiveCategory(button) {
  document.querySelectorAll('.categories button').forEach(item => {
    item.classList.toggle('active', item === button);
  });
}

function handleCategoryFilter() {
  document.querySelectorAll('.categories button').forEach(button => {
    button.onclick = () => {
      const filter = button.dataset.filter;
      const all = getProducts();
      let filtered = all;
      if (filter === 'خصومات') filtered = all.filter(product => product.oldPrice > 0);
      else if (filter !== 'كل') filtered = all.filter(product => product.category === filter);
      setActiveCategory(button);
      render(filtered);
    };
  });
}

function syncProductsFromAdmin() {
  render(getProducts());
  updateCount();
}

handleCategoryFilter();
render();
updateCount();
window.bravenSync = syncProductsFromAdmin;
