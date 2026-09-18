const demoProducts = [
  { id: 1, name: 'تيشيرت Dream Big', category: 'رجالي', price: 299, oldPrice: 349, dark: true, image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80' },
  { id: 2, name: 'تيشيرت Samurai', category: 'تصاميم', price: 279, oldPrice: 0, dark: false, image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80' },
  { id: 3, name: 'تيشيرت Adventure', category: 'كاجوال', price: 319, oldPrice: 0, dark: true, image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80' },
  { id: 4, name: 'تيشيرت Good Vibes', category: 'رجالي', price: 299, oldPrice: 349, dark: true, image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80' },
  { id: 5, name: 'تيشيرت Anime', category: 'تصاميم', price: 289, oldPrice: 0, dark: false, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80' },
  { id: 6, name: 'تيشيرت Butterfly', category: 'نسائي', price: 279, oldPrice: 0, dark: false, image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80' },
  { id: 7, name: 'تيشيرت Kids', category: 'أطفال', price: 229, oldPrice: 0, dark: false, image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=900&q=80' },
  { id: 8, name: 'هودي Street', category: 'هوديز', price: 449, oldPrice: 499, dark: true, image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80' }
];

const STORAGE_KEY = 'braven_products';

function normalizeProduct(product) {
  return {
    ...product,
    category: product.category || product.cat || 'أخرى',
    oldPrice: product.oldPrice ?? product.old ?? 0,
    image: product.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80'
  };
}

function getProducts() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (Array.isArray(saved) && saved.length) return saved.map(normalizeProduct);
  } catch (e) {}

  localStorage.setItem(STORAGE_KEY, JSON.stringify(demoProducts));
  return demoProducts.map(normalizeProduct);
}

let cart = JSON.parse(localStorage.getItem('braven_cart') || '[]');
const grid = document.getElementById('productGrid');

function render(list = getProducts()) {
  if (!grid) return;

  const safeList = Array.isArray(list) ? list.map(normalizeProduct) : getProducts();
  grid.innerHTML = safeList.map(p => {
    const initials = (p.name || 'TEE').split(' ').slice(-1)[0] || 'TEE';
    return `
      <article class="card">
        <div class="pic ${p.dark ? 'dark' : ''}">
          ${p.image ? `<img src="${p.image}" alt="${p.name}" />` : `<span>${initials}</span>`}
        </div>
        <div class="info">
          <b>${p.name}</b>
          <span class="cat">${p.category}</span>
          <div class="price-wrap">
            <strong>${p.price} ج.م</strong>
            ${p.oldPrice ? `<span>${p.oldPrice} ج.م</span>` : ''}
          </div>
          <button class="add-cart" data-id="${p.id}">أضف إلى السلة</button>
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
  cart.push(Number(id));
  localStorage.setItem('braven_cart', JSON.stringify(cart));
  updateCount();
  alert('تمت إضافة المنتج إلى السلة');
}

function handleCategoryFilter() {
  const buttons = document.querySelectorAll('.categories button');
  if (!buttons.length) return;

  buttons.forEach(button => {
    button.onclick = () => {
      const filter = button.dataset.filter;
      const all = getProducts();
      const list = filter === 'خصومات' ? all.filter(p => p.oldPrice) : all.filter(p => p.category === filter);
      render(filter === 'كل' ? all : list);
    };
  });
}

function bindAddButtons() {
  document.querySelectorAll('.add-cart').forEach(button => {
    button.addEventListener('click', () => addToCart(button.dataset.id));
  });
}

function syncProductsFromAdmin() {
  const all = getProducts();
  render(all);
}

if (document.querySelectorAll('.categories button').length) {
  handleCategoryFilter();
}

render();
updateCount();

const productGrid = document.getElementById('productGrid');
if (productGrid) {
  const observer = new MutationObserver(() => bindAddButtons());
  observer.observe(productGrid, { childList: true, subtree: true });
}

window.bravenSync = syncProductsFromAdmin;
