// cart-handler.js
(function(){
  // ===== CONFIG =====
  // For local testing use the local server
const SERVER_BASE = 'https://cakeopera-backend.onrender.com';
const CART_KEY = 'cakeopera_cart_v1';

  // Example courier products - change / extend as required
  const COURIER_PRODUCTS = [
    { id: 'Rich Plum cake (Round)', name: 'Rich Plum cake (Round)', price: 400, img: 'https://prime-c0.static.urbanpiper.com/cakeopera/2025-11/fSsw3uvFCa1Ua8JzZwoEfABK0TeawHAZhelQzcor.jpg', weight: '350 Gm' },
    { id: 'Rich Plum cake Mini', name: 'Rich Plum cake Mini', price: 75, img: 'https://prime-c0.static.urbanpiper.com/cakeopera/2025-06/VYhm0bskSrR9ouLBeJAUlSgowYza6OOjb1PVKUUo.jpg', weight: '150 Gm' },
    { id: 'Banana Walnut Cake ', name: 'Banana Walnut Cake (400 Gm)', price: 480, img: 'https://prime-c0.static.urbanpiper.com/cakeopera/2025-11/EzQoBuScQhUGBKdxLMcmAfo0Eoil4YHRvf23KZYN.jpg', weight: '400 Gm' },
    { id: 'Banana Walnut Mini Dry Cake', name: 'Banana Walnut Mini Dry Cake', price: 280, img: 'https://prime-c0.static.urbanpiper.com/cakeopera/2025-11/EzQoBuScQhUGBKdxLMcmAfo0Eoil4YHRvf23KZYN.jpg', weight: '150 Gm' },
    { id: 'Assorted Brownies', name: 'Assorted Brownies', price: 400, img: 'https://prime-c0.static.urbanpiper.com/cakeopera/2025-06/c9l1AhM8uUj3T9eveFl73hDot0HrOaNU7e1NUP3H.jpg', weight: 'Pack Of 4' },
    { id: 'Assorted Mini Dry Cake Hamper', name: 'Assorted Mini Dry Cake Hamper', price: 1100, img: 'https://prime-c0.static.urbanpiper.com/cakeopera/2025-10/JoLOqZrMR23PU9C3sHY9z4V1t9OBaOBG6y2iwOJd.jpg', weight: 'Pack Of 4' },

 ];

  // ===== Helpers =====
  function getCart(){ return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
  function saveCart(c){ localStorage.setItem(CART_KEY, JSON.stringify(c)); }
  function formatCurrency(n){ return '₹' + parseFloat(n).toFixed(0); }

  function renderCartCount(){
    const count = getCart().reduce((s,i)=>s + i.qty, 0);
    let el = document.getElementById('cart-count-badge');
    if(!el){
      el = document.createElement('a');
      el.id = 'cart-count-badge';
      el.href = 'cart.html';
      el.style.marginLeft = '12px';
      el.style.fontWeight = '700';
      const nav = document.querySelector('header nav');
      if(nav) nav.appendChild(el);
    }
    el.textContent = `Cart (${count})`;
  }

  // ===== Courier Grid (courier.html) =====
  function renderCourierGrid(){
    const grid = document.getElementById('courier-grid');
    if(!grid) return;
    grid.innerHTML = '';
    COURIER_PRODUCTS.forEach(p=>{
      const div = document.createElement('div');
      div.className = 'courier-card';
      div.innerHTML = `
        <img src="${p.img}" alt="${p.name}">
        <h4 style="margin:10px 0 6px">${p.name}</h4>
        <div class="small-muted">${p.weight}</div>
        <p style="margin:8px 0 0;color:#444">${p.name}</p>
        <div class="courier-meta">
          <strong>₹${p.price}</strong>
          <div class="cart-actions">
            <input class="qty-input" type="number" min="1" value="1" id="qty-${p.id}">
            <button class="btn btn-primary" data-add="${p.id}">Add</button>
          </div>
        </div>
      `;
      grid.appendChild(div);
    });

    document.querySelectorAll('[data-add]').forEach(btn=>{
      btn.addEventListener('click', function(){
        const id = this.getAttribute('data-add');
        const qtyEl = document.getElementById('qty-' + id);
        const qty = Math.max(1, parseInt(qtyEl.value || 1));
        addToCart(id, qty);
      });
    });
  }

  function addToCart(productId, qty){
    const product = COURIER_PRODUCTS.find(p => p.id === productId);
    if(!product) return;
    const cart = getCart();
    const found = cart.find(i => i.id === productId);
    if(found) found.qty += qty;
    else cart.push({ id: productId, name: product.name, price: product.price, qty: qty, img: product.img });
    saveCart(cart);
    alert('Added to cart');
    renderCartCount();
  }

  // ===== Cart Page Rendering (cart.html) =====
  function renderCartPage(){
    const container = document.getElementById('cart-container');
    if(!container) return;
    const cart = getCart();
    if(!cart.length){
      container.innerHTML = '<p>Your cart is empty. <a href="courier.html">Browse courier items</a></p>';
      return;
    }

    let table = `<table class="cart-table"><thead><tr><th>Item</th><th>Price</th><th>Qty</th><th>Total</th><th></th></tr></thead><tbody>`;
    cart.forEach(item=>{
      table += `<tr data-id="${item.id}">
        <td><img class="cart-thumb" src="${item.img}" alt="${item.name}"> <div style="display:inline-block;vertical-align:middle;margin-left:8px">${item.name}</div></td>
        <td>${formatCurrency(item.price)}</td>
        <td><input type="number" min="1" value="${item.qty}" class="cart-qty" data-id="${item.id}" style="width:72px;padding:6px;border-radius:6px;border:1px solid #ddd"></td>
        <td class="item-total">${formatCurrency(item.price * item.qty)}</td>
        <td><button class="btn btn-outline remove-item" data-id="${item.id}">Remove</button></td>
      </tr>`;
    });
    table += `</tbody></table>`;

    const subtotal = cart.reduce((s,i)=>s + i.price * i.qty, 0);
    const shipping = 99;
    const total = subtotal + shipping;

    table += `
      <div style="display:flex;gap:20px;flex-wrap:wrap;align-items:flex-start">
        <div style="flex:1 1 420px">
          <div class="checkout-panel">
            <h3>Order Summary</h3>
            <p>Subtotal: <strong>${formatCurrency(subtotal)}</strong></p>
            <p>Courier shipping: <strong>${formatCurrency(shipping)}</strong></p>
            <p style="font-size:1.15rem">Total: <strong>${formatCurrency(total)}</strong></p>

            <h4>Select Payment</h4>
            <div class="pay-method">
            <label><input type="radio" name="paymethod" value="razorpay"> Razorpay</label>
            </div>

            <button id="checkout-pay" class="btn-pay">Pay / Place Order</button>
            <div class="note">
              After payment, you will see an order confirmation. For Razorpay, you will be redirected to the payment provider.
            </div>
            <div id="checkout-msg" style="margin-top:10px;"></div>
          </div>
        </div>

        <div style="flex:1 1 260px">
          <div class="checkout-panel">
            <h3>Shipping</h3>
            <label>Full name<br><input id="ship-name" type="text" placeholder="Name" style="width:100%;padding:8px;margin-top:6px;border-radius:8px;border:1px solid #ddd"></label>
            <label style="display:block;margin-top:8px">Phone<br><input id="ship-phone" type="tel" placeholder="+91" style="width:100%;padding:8px;margin-top:6px;border-radius:8px;border:1px solid #ddd"></label>
            <label style="display:block;margin-top:8px">Address<br><textarea id="ship-address" rows="4" style="width:100%;padding:8px;margin-top:6px;border-radius:8px;border:1px solid #ddd"></textarea></label>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = table;

    // listeners
    document.querySelectorAll('.cart-qty').forEach(input=>{
      input.addEventListener('change', function(){
        const id = this.getAttribute('data-id');
        const val = Math.max(1, parseInt(this.value||1));
        updateQty(id, val);
      });
    });

    document.querySelectorAll('.remove-item').forEach(btn=>{
      btn.addEventListener('click', function(){
        const id = this.getAttribute('data-id');
        removeItem(id);
      });
    });

    document.getElementById('checkout-pay').addEventListener('click', function(){
      handleCheckout(total);
    });
  }

  function updateQty(id, qty){
    const cart = getCart();
    const item = cart.find(i=>i.id === id);
    if(item){
      item.qty = qty;
      saveCart(cart);
      renderCartPage();
      renderCartCount();
    }
  }

  function removeItem(id){
    let cart = getCart();
    cart = cart.filter(i=>i.id !== id);
    saveCart(cart);
    renderCartPage();
    renderCartCount();
  }

// ===== Checkout Handler (Razorpay only) =====
async function handleCheckout(totalAmount, discount, couponCode){
  const name = document.getElementById('ship-name').value.trim();
  const phone = document.getElementById('ship-phone').value.trim();
  const address = document.getElementById('ship-address').value.trim();
  const deliveryDate = document.getElementById('delivery-date')?.value || "";
  const deliverySlot = document.getElementById('delivery-slot')?.value || "";
  const msgEl = document.getElementById('checkout-msg');

  if(!name || !phone || !address){
    msgEl.innerHTML = '<span style="color:#c62828">Please enter your shipping name, phone & address.</span>';
    return;
  }

  const cart = getCart();
  if(!cart.length){
    msgEl.innerHTML = '<span style="color:#c62828">Cart is empty.</span>';
    return;
  }

  // build the order object we want to log into Google Sheets
  const order = {
    id: 'ORD' + Date.now(),
    cart,
    totals: {
      total: totalAmount,
      discount: discount || 0,
      shipping: 99
    },
    couponCode: couponCode || null,
    customer: { name, phone, address },
    delivery: { date: deliveryDate, slot: deliverySlot },
    paymentMethod: 'razorpay'
  };

  msgEl.innerHTML = 'Preparing Razorpay checkout...';
  const amountPaise = Math.round(totalAmount * 100);

  try{
    // 1) create Razorpay order on backend
    const r = await fetch(SERVER_BASE + '/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: amountPaise, currency: 'INR' })
    });
    const data = await r.json();
    if(!data.ok || !data.order) throw new Error(data.error || 'Order creation failed');
    const orderRz = data.order;

    // 2) open Razorpay popup
    const options = {
      key: 'rzp_live_RoMbSPvVvV91G4', // your live key ID
      amount: orderRz.amount,
      currency: orderRz.currency,
      name: 'Cakeopera',
      description: 'Courier order',
      order_id: orderRz.id,
      handler: function (response){
        // 3) verify on backend & send order to Google Sheets
        fetch(SERVER_BASE + '/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            order              // <-- send full order details
          })
        })
        .then(res=>res.json())
        .then(verify => {
          if(verify.ok && verify.verified){
            // clear cart + redirect to thank you page
            localStorage.removeItem(CART_KEY);
            localStorage.removeItem('cakeopera_coupon_code');
            renderCartPage();
            renderCartCount();
            window.location.href = `thankyou.html?orderId=${encodeURIComponent(order.id)}&paid=true`;
          } else {
            msgEl.innerHTML = '<div style="color:#b54">Payment verification failed. Please contact support.</div>';
          }
        }).catch(err=>{
          console.error(err);
          msgEl.innerHTML = '<div style="color:#b54">Verification call failed.</div>';
        });
      },
      prefill: {
        name: name,
        contact: phone
      },
      theme: { color: '#e05572' }
    };

    if(typeof Razorpay !== 'undefined'){
      const rzp = new Razorpay(options);
      rzp.open();
    } else {
      msgEl.innerHTML = '<div style="color:#b54">Razorpay SDK not loaded.</div>';
    }
  }catch(err){
    console.error(err);
    msgEl.innerHTML = '<div style="color:#b54">Order creation failed: ' + err.message + '</div>';
  }
}



  // expose small API
  window.renderCourierGrid = renderCourierGrid;
  window.renderCartPage = renderCartPage;
  window.renderCartCount = renderCartCount;

  document.addEventListener('DOMContentLoaded', function(){
    renderCartCount();
    renderCourierGrid();
    renderCartPage();
  });

})();
