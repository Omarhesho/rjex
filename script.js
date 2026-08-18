/*
  RJEX - Menu + Cart + Checkout
  IMPORTANT:
  1) Put your real order email in ORDER_EMAIL below.
  2) FormSubmit will send the order without a custom backend.
  3) On first real submission, FormSubmit may ask you to confirm/activate the email.
*/

const ORDER_EMAIL = "rjex134@gmail.com";

const products = [
  {id:1, category:'drinks', name:'موخيتو ليمون ونعناع', description:'ليمون منعش مع النعناع الطازج ولمسة غازية خفيفة، طعم منعش ومثالي لأي وقت.', price:35, image:'asset/mojito-lemon-mint.jpeg'},
  {id:2, category:'drinks', name:'موخيتو توت', description:'مزيج منعش من التوت والليمون والنعناع، بطعم فاكهي لذيذ ولمسة منعشة.', price:40, image:'asset/mohito-berry.jpeg'},
  {id:3, category:'drinks', name:'موخيتو فراولة', description:'فراولة حلوة ومنعشة مع الليمون والنعناع، تركيبة خفيفة بطعم فاكهي مميز.', price:40, image:'asset/mojito-strawberry.jpeg'},
  {id:4, category:'drinks', name:'فخفخيتو', description:'مزيج مثلج من آيس كريم التوت، كولا بطعم التوت، النعناع والثلج، لطعم فاكهي بارد ومنعش.', price:45, image:'asset/fakfakhito.jpeg'},
  {id:5, category:'noodles', name:'اندومي خضار حار', description:'اندومي بنكهة الخضار الحارة، بطعم غني وتتبيلة حارة لعشاق النكهة القوية.', price:20, image:'asset/indomie-vegetable-spicy.jpeg'},
  {id:6, category:'noodles', name:'اندومي خضار', description:'اندومي بنكهة الخضار بطعم متوازن وتتبيلة لذيذة، من غير حرارة.', price:20, image:'asset/indomie-vegetable.jpeg'},
  {id:7, category:'noodles', name:'اندومي فراخ', description:'اندومي بنكهة الفراخ، بتتبيلة شهية وطعم غني ومميز.', price:20, image:'asset/indomie-chicken.jpeg'},
  {id:8, category:'noodles', name:'اندومي لحمة', description:'اندومي بنكهة اللحمة، بتتبيلة لذيذة وطعم غني يناسب محبي النكهات القوية.', price:20, image:'asset/indomie-meat.jpeg'},
  {id:9, category:'popcorn', name:'فشار بالملح', description:'فشار خفيف ومقرمش بنكهة الملح الكلاسيكية، سناك بسيط ولذيذ في أي وقت.', price:10, image:'asset/popcorn-salt.jpeg'},
  {id:10, category:'popcorn', name:'فشار بالكراميل', description:'فشار مقرمش مغطى بطبقة كراميل حلوة، بطعم غني ومميز لعشاق النكهة الحلوة.', price:15, image:'asset/popcorn-caramel.jpeg'}
];

let cart = [];
let locationData = null;

const $ = (selector) => document.querySelector(selector);
const money = (n) => `${n} جنيه`;

function renderProducts() {
  ['drinks','noodles','popcorn'].forEach(cat => {
    const container = document.getElementById(cat);
    container.innerHTML = products
      .filter(p => p.category === cat)
      .map(p => `
        <article class="card">
          <img class="product-img" src="${p.image}" alt="${p.name}" loading="lazy">
          <div class="card-body">
            <h3>${p.name}</h3>
            <p>${p.description}</p>
            <div class="card-bottom">
              <span class="price">${money(p.price)}</span>
              <button class="add-btn" type="button" onclick="addToCart(${p.id})">+ إضافة للسلة</button>
            </div>
          </div>
        </article>
      `).join('');
  });
}

function addToCart(id) {
  const item = cart.find(x => x.id === id);
  item ? item.qty++ : cart.push({id, qty:1});
  renderCart();
  openCart();
}

function changeQty(id, delta) {
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(x => x.id !== id);
  renderCart();
}

function getCartTotal() {
  return cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.id);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);
}

function renderCart() {
  const items = $('#cartItems');
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  $('#cartCount').textContent = count;
  $('#checkoutBtn').disabled = cart.length === 0;

  if (!cart.length) {
    items.innerHTML = '<div class="empty">السلة فاضية حاليًا</div>';
    $('#cartTotal').textContent = '0';
    return;
  }

  items.innerHTML = cart.map(item => {
    const p = products.find(product => product.id === item.id);
    return `
      <div class="cart-row">
        <div>
          <h4>${p.name}</h4>
          <small>${money(p.price)} × ${item.qty}</small>
        </div>
        <div class="qty">
          <button type="button" onclick="changeQty(${p.id},-1)">−</button>
          <strong>${item.qty}</strong>
          <button type="button" onclick="changeQty(${p.id},1)">+</button>
        </div>
      </div>
    `;
  }).join('');

  $('#cartTotal').textContent = getCartTotal();
}

function openCart() {
  $('#cart').classList.add('open');
  $('#overlay').classList.add('open');
  $('#cart').setAttribute('aria-hidden', 'false');
}

function closeCart() {
  $('#cart').classList.remove('open');
  $('#overlay').classList.remove('open');
  $('#cart').setAttribute('aria-hidden', 'true');
}

function openCheckout() {
  if (!cart.length) return;
  renderCheckoutPreview();
  $('#checkoutBackdrop').classList.add('open');
  $('#checkoutBackdrop').setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  $('#formError').textContent = '';
  $('#successState').hidden = true;
  $('#checkoutForm').hidden = false;
}

function closeCheckout() {
  $('#checkoutBackdrop').classList.remove('open');
  $('#checkoutBackdrop').setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

function renderCheckoutPreview() {
  $('#checkoutTotal').textContent = getCartTotal();
  $('#checkoutItems').innerHTML = cart.map(item => {
    const p = products.find(product => product.id === item.id);
    return `
      <div class="preview-item">
        <span>${p.name} × ${item.qty}</span>
        <span>${money(p.price * item.qty)}</span>
      </div>
    `;
  }).join('');
}

function setError(message) {
  $('#formError').textContent = message;
}

function normalizePhone(phone) {
  return phone.replace(/[^\d+]/g, '');
}

function isValidPhone(phone) {
  const normalized = normalizePhone(phone);
  return /^(?:\+20|20|0)?1[0125]\d{8}$/.test(normalized);
}

function requestLocation() {
  const status = $('#locationStatus');
  const button = $('#locationBtn');

  if (!navigator.geolocation) {
    status.textContent = 'المتصفح لا يدعم تحديد الموقع.';
    return;
  }

  button.disabled = true;
  button.textContent = 'جاري تحديد الموقع...';
  status.textContent = 'اسمح للموقع بالوصول إلى موقعك من نافذة المتصفح.';

  navigator.geolocation.getCurrentPosition(
    (position) => {
      locationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: Math.round(position.coords.accuracy || 0)
      };

      status.textContent =
        `تم تحديد موقعك ✓ — الدقة التقريبية ${locationData.accuracy} متر`;
      button.disabled = false;
      button.textContent = '✓ تم تحديد الموقع';
      button.classList.add('done');
    },
    (error) => {
      locationData = null;
      button.disabled = false;
      button.textContent = '📍 تحديد موقعي';
      button.classList.remove('done');

      if (error.code === 1) {
        status.textContent = 'تم رفض إذن الموقع. اسمح بالموقع ثم حاول مرة أخرى.';
      } else {
        status.textContent = 'تعذر تحديد الموقع. حاول مرة أخرى.';
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 12000,
      maximumAge: 0
    }
  );
}

function buildOrderText(customer) {
  const lines = [
    'طلب جديد من RJEX',
    '--------------------',
    `الاسم: ${customer.name}`,
    `الهاتف: ${customer.phone}`,
    `العنوان: ${customer.address}`,
    '',
    'الطلب:',
    ...cart.map(item => {
      const p = products.find(product => product.id === item.id);
      return `- ${p.name} × ${item.qty} = ${p.price * item.qty} جنيه`;
    }),
    '',
    `الإجمالي: ${getCartTotal()} جنيه`,
    '',
    'الموقع:',
    `Latitude: ${locationData.latitude}`,
    `Longitude: ${locationData.longitude}`,
    `الدقة التقريبية: ${locationData.accuracy} متر`,
    `رابط الخريطة: https://www.google.com/maps?q=${locationData.latitude},${locationData.longitude}`
  ];

  return lines.join('\n');
}

async function submitOrder(event) {
  event.preventDefault();
  setError('');

  const name = $('#customerName').value.trim();
  const phone = $('#customerPhone').value.trim();
  const address = $('#customerAddress').value.trim();

  if (!name) {
    setError('اكتب اسمك أولًا.');
    $('#customerName').focus();
    return;
  }

  if (!isValidPhone(phone)) {
    setError('اكتب رقم هاتف مصري صحيح.');
    $('#customerPhone').focus();
    return;
  }

  if (address.length < 5) {
    setError('اكتب عنوان التوصيل بالتفصيل.');
    $('#customerAddress').focus();
    return;
  }

  if (!locationData) {
    setError('حدد موقعك أولًا من زر "تحديد موقعي".');
    return;
  }

  if (ORDER_EMAIL.includes('PUT_YOUR_EMAIL_HERE')) {
    setError('لسه محتاج تحط إيميل RJEX في أول ملف script.js.');
    return;
  }

  const button = $('#confirmOrderBtn');
  button.disabled = true;
  button.classList.add('loading');
  button.textContent = 'جاري إرسال الطلب...';

  const customer = {name, phone, address};

  const formData = new FormData();
  formData.append('_subject', `طلب جديد من RJEX - ${name}`);
  formData.append('_template', 'table');
  formData.append('_captcha', 'false');
  formData.append('اسم العميل', name);
  formData.append('رقم الهاتف', phone);
  formData.append('العنوان', address);
  formData.append('تفاصيل الطلب', buildOrderText(customer));
  formData.append('الإجمالي', `${getCartTotal()} جنيه`);
  formData.append('Latitude', String(locationData.latitude));
  formData.append('Longitude', String(locationData.longitude));
  formData.append('رابط الموقع', `https://www.google.com/maps?q=${locationData.latitude},${locationData.longitude}`);

  try {
    const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(ORDER_EMAIL)}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      },
      body: formData
    });

    const result = await response.json().catch(() => ({}));

    // FormSubmit may return success as either boolean true or string "true".
    if (!response.ok || !(result.success === true || result.success === 'true')) {
      throw new Error(result.message || 'Email service rejected the request.');
    }

    $('#checkoutForm').hidden = true;
    $('#successState').hidden = false;
    cart = [];
    locationData = null;
    renderCart();
    $('#checkoutForm').reset();
    $('#locationStatus').textContent = 'لم يتم تحديد الموقع بعد.';
    $('#locationBtn').textContent = '📍 تحديد موقعي';
    $('#locationBtn').classList.remove('done');
  } catch (error) {
    console.error('RJEX order error:', error);
    setError('حصلت مشكلة أثناء إرسال الطلب. تأكد إن الموقع مفتوح من رابط استضافة (وليس ملف HTML مباشرة) وإن الإيميل تم تفعيله، ثم جرّب تاني.');
  } finally {
    button.disabled = false;
    button.classList.remove('loading');
    button.textContent = 'تأكيد وإرسال الطلب';
  }
}

$('#openCart').addEventListener('click', openCart);
$('#closeCart').addEventListener('click', closeCart);
$('#overlay').addEventListener('click', closeCart);
$('#checkoutBtn').addEventListener('click', () => {
  closeCart();
  openCheckout();
});
$('#closeCheckout').addEventListener('click', closeCheckout);
$('#locationBtn').addEventListener('click', requestLocation);
$('#checkoutForm').addEventListener('submit', submitOrder);
$('#successClose').addEventListener('click', closeCheckout);

$('#checkoutBackdrop').addEventListener('click', (event) => {
  if (event.target === $('#checkoutBackdrop')) closeCheckout();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeCart();
    closeCheckout();
  }
});

renderProducts();
renderCart();
