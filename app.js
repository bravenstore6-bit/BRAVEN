const fallbackImage = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80';
const STORAGE_KEY = 'braven_products';
const CART_KEY = 'braven_cart';

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

function getCart() {
  try {
    const cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    if (!Array.isArray(cart)) return [];

    return cart
      .map(item => {
        if (typeof item === 'number') {
          return { id: Number(item), qty: 1 };
        }

        if (item && typeof item === 'object') {
          const id = Number(item.id);
          const qty = Number(item.qty || 1);
          return Number.isFinite(id) ? { id, qty: qty > 0 ? qty : 1 } : null;
        }

        return null;
      })
      .filter(Boolean);
  } catch (error) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function updateCount() {
  const count = document.getElementById('cartCount');
  if (!count) return;

  const total = getCart().reduce((sum, item) => sum + Number(item.qty || 0), 0);
  count.textContent = total;
}

const grid = document.getElementById('productGrid');

function render(list = getProducts()) {
  if (!grid) return;

  const products = Array.isArray(list) ? list.map(normalizeProduct) : getProducts();
  const cart = getCart();

  grid.innerHTML = products.map(product => {
    const available = product.stock > 0;
    const current = cart.find(item => Number(item.id) === Number(product.id));
    const currentQty = current ? Number(current.qty || 0) : 0;
    const disabled = !available || currentQty >= product.stock;

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
          <button class="add-cart" data-id="${product.id}" ${disabled ? 'disabled' : ''}>
            ${disabled ? (available ? 'وصلت للحد' : 'نفد المخزون') : 'أضف إلى السلة'}
          </button>
        </div>
      </article>
    `;
  }).join('');

  bindAddButtons();
}

function addToCart(id) {
  const products = getProducts();
  const product = products.find(item => Number(item.id) === Number(id));

  if (!product || product.stock <= 0) {
    alert('هذا المنتج غير متوفر حاليًا');
    render(products);
    return;
  }

  const cart = getCart();
  const current = cart.find(item => Number(item.id) === Number(id));
  const currentQty = current ? Number(current.qty || 0) : 0;

  if (currentQty >= product.stock) {
    alert('وصلت إلى الحد الأقصى للمخزون لهذا المنتج');
    return;
  }

  if (current) {
    current.qty = currentQty + 1;
  } else {
    cart.push({ id: Number(id), qty: 1 });
  }

  saveCart(cart);
  updateCount();
  render(products);
  alert('تمت إضافة المنتج إلى السلة');
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
  const buttons = document.querySelectorAll('.categories button');
  if (!buttons.length) return;

  buttons.forEach(button => {
    button.onclick = () => {
      const filter = button.dataset.filter;
      const all = getProducts();
      let filtered = all;

      if (filter === 'خصومات') {
        filtered = all.filter(product => Number(product.oldPrice) > 0);
      } else if (filter !== 'كل') {
        filtered = all.filter(product => product.category === filter);
      }

      setActiveCategory(button);
      render(filtered);
    };
  });
}

function syncProductsFromAdmin() {
  render(getProducts());
  updateCount();
}

if (typeof document !== 'undefined') {
  handleCategoryFilter();
  render();
  updateCount();
  window.bravenSync = syncProductsFromAdmin;
}
