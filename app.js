const demoProducts = [
  { id: 1, name: 'تيشيرت Dream Big', cat: 'رجالي', price: 299, old: 349, dark: true },
  { id: 2, name: 'تيشيرت Samurai', cat: 'تصاميم', price: 279, old: 0, dark: false },
  { id: 3, name: 'تيشيرت Adventure', cat: 'كاجوال', price: 319, old: 0, dark: true },
  { id: 4, name: 'تيشيرت Good Vibes', cat: 'رجالي', price: 299, old: 349, dark: true },
  { id: 5, name: 'تيشيرت Anime', cat: 'تصاميم', price: 289, old: 0, dark: false },
  { id: 6, name: 'تيشيرت Butterfly', cat: 'نسائي', price: 279, old: 0, dark: false },
  { id: 7, name: 'تيشيرت Kids', cat: 'أطفال', price: 229, old: 0, dark: false },
  { id: 8, name: 'هودي Street', cat: 'هوديز', price: 449, old: 499, dark: true }
];

const STORAGE_KEY = 'braven_products';

function getProducts() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (Array.isArray(saved) && saved.length) return saved;
  } catch (e) {}

  localStorage.setItem(STORAGE_KEY, JSON.stringify(demoProducts));
  return demoProducts;
}

let cart = JSON.parse(localStorage.getItem('braven_cart') || '[]');
const grid = document.getElementById('productGrid');

function render(list = getProducts()) {
  if (!grid) return;

  const safeList = Array.isArray(list) ? list : getProducts();
  grid.innerHTML = safeList.map(p => `
    <article class="card">
      <div class="pic ${p.dark ? 'dark' : ''}">${(p.name || 'TEE').split(' ').slice(-1)[0] || 'TEE'}</div>
      <div class="info">
        <b>${p.name}</b>
        <span class="cat">${p.cat}</span>
        <div class="price-wrap">
          <strong>${p.price} ج.م</strong>
          ${p.old ? `<span>${p.old} ج.م</span>` : ''}
        </div>
        <button class="add-cart" data-id="${p.id}">أضف إلى السلة</button>
      </div>
    </article>
  `).join('');
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
      const list = filter === 'خصومات' ? all.filter(p => p.old) : all.filter(p => p.cat === filter);
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
  bindAddButtons();
}

if (document.querySelectorAll('.categories button').length) {
  handleCategoryFilter();
}

render();
updateCount();
bindAddButtons();

const productGrid = document.getElementById('productGrid');
if (productGrid) {
  const observer = new MutationObserver(() => bindAddButtons());
  observer.observe(productGrid, { childList: true, subtree: true });
}

window.bravenSync = syncProductsFromAdmin;
