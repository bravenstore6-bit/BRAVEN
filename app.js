const PRODUCTS_KEY = 'braven_products';
const CART_KEY = 'braven_cart';
const fallbackImage = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80';

const supabaseClient = window.supabase.createClient(
  window.BRAVEN_SUPABASE_URL,
  window.BRAVEN_SUPABASE_KEY
);

function normalizeProduct(product) {
  const stock = Number(product?.stock ?? 0);
  return {
    ...product,
    id: Number(product.id),
    category: product?.category || 'أخرى',
    oldPrice: Number(product?.oldPrice ?? product?.old_price ?? 0),
    price: Number(product?.price ?? 0),
    stock: Number.isFinite(stock) ? Math.max(0, Math.floor(stock)) : 0,
    image: product?.image || fallbackImage
  };
}

async function getProducts() {
  const { data, error } = await supabaseClient
    .from('products')
    .select('id,name,category,price,old_price:old_price,stock,image')
    .order('id', { ascending: true });

  if (error) {
    console.error('Supabase products error:', error);
    return [];
  }
  return (data || []).map(normalizeProduct);
}

async function getCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    if (!Array.isArray(saved)) return [];
    return saved.map(item => {
      if (typeof item === 'number') return { id: Number(item), qty: 1 };
      if (item && typeof item === 'object') {
        const id = Number(item.id);
        const qty = Number(item.qty || 1);
        return Number.isFinite(id) ? { id, qty: qty > 0 ? qty : 1 } : null;
      }
      return null;
    }).filter(Boolean);
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

async function updateCount() {
  const count = document.getElementById('cartCount');
  if (!count) return;
  const cart = await getCart();
  count.textContent = cart.reduce((sum, item) => sum + Number(item.qty || 0), 0);
}

const grid = document.getElementById('productGrid');

async function render(list = null) {
  if (!grid) return;
  const products = Array.isArray(list) ? list.map(normalizeProduct) : await getProducts();
  const cart = await getCart();

  if (!products.length) {
    grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;padding:30px">لا توجد منتجات متاحة حاليًا.</p>';
    return;
  }

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

async function addToCart(id) {
  const products = await getProducts();
  const product = products.find(item => Number(item.id) === Number(id));

  if (!product || product.stock <= 0) {
    alert('هذا المنتج غير متوفر حاليًا');
    await render(products);
    return;
  }

  const cart = await getCart();
  const current = cart.find(item => Number(item.id) === Number(id));
  const currentQty = current ? Number(current.qty || 0) : 0;

  if (currentQty >= product.stock) {
    alert('وصلت إلى الحد الأقصى للمخزون لهذا المنتج');
    return;
  }

  if (current) current.qty = currentQty + 1;
  else cart.push({ id: Number(id), qty: 1 });

  saveCart(cart);
  await updateCount();
  await render(products);
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
    button.onclick = async () => {
      const filter = button.dataset.filter;
      const all = await getProducts();
      let filtered = all;

      if (filter === 'خصومات') filtered = all.filter(product => Number(product.oldPrice) > 0);
      else if (filter !== 'كل') filtered = all.filter(product => product.category === filter);

      setActiveCategory(button);
      await render(filtered);
    };
  });
}

async function initBravenStore() {
  handleCategoryFilter();
  await render();
  await updateCount();
}

if (typeof document !== 'undefined') {
  initBravenStore();
  window.bravenSupabase = supabaseClient;
}
