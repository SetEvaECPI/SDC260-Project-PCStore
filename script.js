const products = [
  { id: 1, name: "RTX 5070 Graphics Card", category: "GPU", price: 599.99, stock: 6, description: "High-performance graphics for modern PC gaming." },
  { id: 2, name: "RX 9070 XT Graphics Card", category: "GPU", price: 649.99, stock: 5, description: "Strong raster performance for high-resolution gaming." },
  { id: 3, name: "Ryzen 7 Gaming Processor", category: "CPU", price: 349.99, stock: 8, description: "Fast multi-core performance for gaming and streaming." },
  { id: 4, name: "Core Ultra Desktop Processor", category: "CPU", price: 399.99, stock: 7, description: "Modern desktop processor for gaming and productivity." },
  { id: 5, name: "32 GB DDR5 Memory", category: "RAM", price: 119.99, stock: 12, description: "High-speed memory for smooth multitasking." },
  { id: 6, name: "64 GB DDR5 Memory", category: "RAM", price: 219.99, stock: 9, description: "Extra capacity for gaming, creation, and development." },
  { id: 7, name: "2 TB NVMe SSD", category: "Storage", price: 139.99, stock: 10, description: "Fast solid-state storage for games and applications." },
  { id: 8, name: "850W Gold Power Supply", category: "Power Supply", price: 149.99, stock: 7, description: "Efficient modular power supply for performance builds." },
  { id: 9, name: "Mechanical Gaming Keyboard", category: "Accessory", price: 109.99, stock: 14, description: "Responsive mechanical keyboard with gaming-focused features." },
  { id: 10, name: "Lightweight Gaming Mouse", category: "Accessory", price: 79.99, stock: 15, description: "Precise lightweight mouse with programmable controls." },
  { id: 11, name: "Wireless Gaming Headset", category: "Accessory", price: 129.99, stock: 11, description: "Comfortable wireless headset for gaming and voice chat." },
  { id: 12, name: "240mm Liquid Cooler", category: "Cooling", price: 129.99, stock: 8, description: "Liquid CPU cooling for modern gaming systems." }
];

const CART_COOKIE = "evansPcCart";
const INVENTORY_COOKIE = "evansPcInventory";
let currentDiscountRate = 0;

function setCookie(name, value, days = 7) {
  const expires = new Date(Date.now() + days * 86400000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name) {
  const prefix = `${name}=`;
  const cookie = document.cookie.split("; ").find(item => item.startsWith(prefix));
  if (!cookie) return null;

  try {
    return JSON.parse(decodeURIComponent(cookie.substring(prefix.length)));
  } catch (error) {
    return null;
  }
}

function getCart() {
  return getCookie(CART_COOKIE) || [];
}

function saveCart(cart) {
  setCookie(CART_COOKIE, cart);
  updateCartCount();
}

function getInventory() {
  const savedInventory = getCookie(INVENTORY_COOKIE);
  if (savedInventory) return savedInventory;

  const inventory = {};
  for (const product of products) {
    inventory[product.id] = product.stock;
  }
  setCookie(INVENTORY_COOKIE, inventory);
  return inventory;
}

function saveInventory(inventory) {
  setCookie(INVENTORY_COOKIE, inventory);
}

function getProduct(productId) {
  return products.find(product => product.id === Number(productId));
}

function showFeedback(message) {
  let feedback = document.getElementById("cart-feedback");
  if (!feedback) {
    feedback = document.createElement("div");
    feedback.id = "cart-feedback";
    feedback.className = "cart-feedback";
    feedback.setAttribute("role", "status");
    feedback.setAttribute("aria-live", "polite");
    document.body.appendChild(feedback);
  }

  feedback.textContent = message;
  feedback.classList.add("show");
  clearTimeout(showFeedback.timeoutId);
  showFeedback.timeoutId = setTimeout(() => feedback.classList.remove("show"), 1800);
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const cartLinks = document.querySelectorAll('a[href="cart.html"]');

  for (const link of cartLinks) {
    link.textContent = `Cart (${count})`;
  }
}

function displayProducts() {
  const productGrid = document.getElementById("product-grid");
  if (!productGrid) return;

  const inventory = getInventory();
  productGrid.innerHTML = "";

  for (const product of products) {
    const available = inventory[product.id] ?? 0;
    const card = document.createElement("article");
    card.className = "product-card";

    card.innerHTML = `
      <div class="product-image">${product.category} Image</div>
      <p class="product-category">${product.category}</p>
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <p class="price">$${product.price.toFixed(2)}</p>
      <p class="stock ${available === 0 ? "out-of-stock" : ""}">Stock: ${available}</p>
      <button class="add-to-cart" data-product-id="${product.id}" ${available === 0 ? 'disabled title="Out of Stock"' : ""}>
        ${available === 0 ? "Out of Stock" : "Add to Cart"}
      </button>
    `;

    productGrid.appendChild(card);
  }

  for (const button of document.querySelectorAll(".add-to-cart")) {
    button.addEventListener("click", () => addToCart(Number(button.dataset.productId)));
  }
}

function addToCart(productId) {
  const product = getProduct(productId);
  const cart = getCart();
  const inventory = getInventory();

  if (!product || inventory[productId] <= 0) {
    showFeedback("This item is out of stock.");
    return;
  }

  const cartItem = cart.find(item => item.id === productId);
  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  inventory[productId] -= 1;
  saveCart(cart);
  saveInventory(inventory);
  showFeedback(`${product.name} added to cart.`);
  displayProducts();
  renderProductDetail();
}

function removeFromCart(productId) {
  const cart = getCart();
  const inventory = getInventory();
  const cartItem = cart.find(item => item.id === productId);
  if (!cartItem) return;

  inventory[productId] += cartItem.quantity;
  const newCart = cart.filter(item => item.id !== productId);
  saveCart(newCart);
  saveInventory(inventory);
  renderCart();
}

function changeQuantity(productId, change) {
  const cart = getCart();
  const inventory = getInventory();
  const cartItem = cart.find(item => item.id === productId);
  if (!cartItem) return;

  if (change > 0) {
    if (inventory[productId] <= 0) {
      showFeedback("No more stock is available for this item.");
      return;
    }
    cartItem.quantity += 1;
    inventory[productId] -= 1;
  } else if (change < 0) {
    cartItem.quantity -= 1;
    inventory[productId] += 1;

    if (cartItem.quantity <= 0) {
      const index = cart.findIndex(item => item.id === productId);
      cart.splice(index, 1);
    }
  }

  saveCart(cart);
  saveInventory(inventory);
  renderCart();
}

function clearCart() {
  const cart = getCart();
  const inventory = getInventory();

  for (const item of cart) {
    inventory[item.id] += item.quantity;
  }

  saveCart([]);
  saveInventory(inventory);
  renderCart();
  showFeedback("Cart cleared.");
}

function cartSubtotal() {
  return getCart().reduce((total, item) => {
    const product = getProduct(item.id);
    return product ? total + product.price * item.quantity : total;
  }, 0);
}

function renderCart() {
  const cartBody = document.getElementById("cart-items");
  const totalElement = document.getElementById("cart-total");
  const emptyMessage = document.getElementById("empty-cart-message");
  const checkoutButton = document.getElementById("checkout-button");
  const clearButton = document.getElementById("clear-cart");
  if (!cartBody || !totalElement) return;

  const cart = getCart();
  cartBody.innerHTML = "";

  if (cart.length === 0) {
    emptyMessage.hidden = false;
    checkoutButton.classList.add("disabled-link");
    checkoutButton.setAttribute("aria-disabled", "true");
    clearButton.disabled = true;
  } else {
    emptyMessage.hidden = true;
    checkoutButton.classList.remove("disabled-link");
    checkoutButton.removeAttribute("aria-disabled");
    clearButton.disabled = false;
  }

  for (const item of cart) {
    const product = getProduct(item.id);
    if (!product) continue;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${product.name}</td>
      <td>
        <div class="quantity-controls">
          <button type="button" aria-label="Decrease ${product.name} quantity" data-action="decrease" data-product-id="${product.id}">−</button>
          <span>${item.quantity}</span>
          <button type="button" aria-label="Increase ${product.name} quantity" data-action="increase" data-product-id="${product.id}">+</button>
        </div>
      </td>
      <td>$${product.price.toFixed(2)}</td>
      <td>$${(product.price * item.quantity).toFixed(2)}</td>
      <td><button type="button" class="remove-button" data-action="remove" data-product-id="${product.id}">Remove</button></td>
    `;
    cartBody.appendChild(row);
  }

  totalElement.textContent = `$${cartSubtotal().toFixed(2)}`;

  for (const button of cartBody.querySelectorAll("button[data-action]")) {
    const id = Number(button.dataset.productId);
    if (button.dataset.action === "increase") button.addEventListener("click", () => changeQuantity(id, 1));
    if (button.dataset.action === "decrease") button.addEventListener("click", () => changeQuantity(id, -1));
    if (button.dataset.action === "remove") button.addEventListener("click", () => removeFromCart(id));
  }
}

function renderProductDetail() {
  const stockElement = document.getElementById("detail-stock");
  const addButton = document.getElementById("detail-add-cart");
  if (!stockElement || !addButton) return;

  const productId = Number(addButton.dataset.productId);
  const inventory = getInventory();
  const available = inventory[productId] ?? 0;
  stockElement.textContent = `${available} available`;
  addButton.disabled = available === 0;
  addButton.textContent = available === 0 ? "Out of Stock" : "Add to Cart";

  if (available === 0) {
    addButton.title = "Out of Stock";
  } else {
    addButton.removeAttribute("title");
  }
}

function renderCheckoutSummary() {
  const summaryItems = document.getElementById("checkout-summary-items");
  const subtotalElement = document.getElementById("subtotal");
  const discountElement = document.getElementById("discount");
  const totalElement = document.getElementById("total");
  const placeOrderButton = document.querySelector('#checkout-form button[type="submit"]');
  if (!summaryItems || !subtotalElement || !discountElement || !totalElement) return;

  const cart = getCart();
  summaryItems.innerHTML = "";

  if (cart.length === 0) {
    summaryItems.innerHTML = '<p class="empty-summary">Your cart is empty. <a href="products.html">Shop products</a>.</p>';
    if (placeOrderButton) placeOrderButton.disabled = true;
  } else {
    if (placeOrderButton) placeOrderButton.disabled = false;
    for (const item of cart) {
      const product = getProduct(item.id);
      if (!product) continue;
      const line = document.createElement("p");
      line.innerHTML = `${product.name} × ${item.quantity} <span>$${(product.price * item.quantity).toFixed(2)}</span>`;
      summaryItems.appendChild(line);
    }
  }

  const subtotal = cartSubtotal();
  const discount = subtotal * currentDiscountRate;
  subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
  discountElement.textContent = `-$${discount.toFixed(2)}`;
  totalElement.textContent = `$${(subtotal - discount).toFixed(2)}`;
}

function setError(id, message) {
  const error = document.getElementById(id);
  if (error) error.textContent = message;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateContactForm(event) {
  event.preventDefault();

  const email = document.getElementById("contact-email").value.trim();
  const message = document.getElementById("message").value.trim();
  let valid = true;

  setError("contact-email-error", "");
  setError("message-error", "");

  if (email === "") {
    setError("contact-email-error", "Email address is required.");
    valid = false;
  } else if (!isValidEmail(email)) {
    setError("contact-email-error", "Enter a valid email address.");
    valid = false;
  }

  if (message === "") {
    setError("message-error", "Message is required.");
    valid = false;
  }

  const success = document.getElementById("contact-success");
  success.textContent = valid ? "Your message is ready to be submitted." : "";
}

function validateCheckoutForm(event) {
  event.preventDefault();

  if (getCart().length === 0) {
    document.getElementById("checkout-success").textContent = "Add items to your cart before placing an order.";
    return;
  }

  const fields = [
    ["ship-name", "ship-name-error", "Full name is required."],
    ["street", "street-error", "Street address is required."],
    ["city", "city-error", "City is required."],
    ["state", "state-error", "State is required."],
    ["zip", "zip-error", "ZIP code is required."],
    ["phone", "phone-error", "Phone number is required."],
    ["card-name", "card-name-error", "Cardholder name is required."],
    ["card-number", "card-number-error", "Credit card number is required."],
    ["expiration", "expiration-error", "Expiration date is required."],
    ["security-code", "security-code-error", "Security code is required."]
  ];

  let valid = true;

  for (const [fieldId, errorId, message] of fields) {
    const field = document.getElementById(fieldId);
    setError(errorId, "");
    if (field.value.trim() === "") {
      setError(errorId, message);
      valid = false;
    }
  }

  const state = document.getElementById("state").value.trim();
  const zip = document.getElementById("zip").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const cardNumber = document.getElementById("card-number").value.replace(/\s/g, "");
  const securityCode = document.getElementById("security-code").value.trim();

  if (state && !/^[A-Za-z]{2}$/.test(state)) {
    setError("state-error", "Enter a 2-letter state abbreviation.");
    valid = false;
  }
  if (zip && !/^\d{5}(-\d{4})?$/.test(zip)) {
    setError("zip-error", "Enter a valid ZIP code.");
    valid = false;
  }
  if (phone && !/^[0-9()\-\s]{10,14}$/.test(phone)) {
    setError("phone-error", "Enter a valid phone number.");
    valid = false;
  }
  if (cardNumber && !/^\d{13,19}$/.test(cardNumber)) {
    setError("card-number-error", "Enter a valid credit card number.");
    valid = false;
  }
  if (securityCode && !/^\d{3,4}$/.test(securityCode)) {
    setError("security-code-error", "Enter a 3 or 4 digit security code.");
    valid = false;
  }

  if (valid) completeOrder();
}

function completeOrder() {
  const orderNumber = `EPT-${Date.now().toString().slice(-6)}`;
  saveCart([]);
  currentDiscountRate = 0;

  const form = document.getElementById("checkout-form");
  form.reset();
  document.getElementById("checkout-success").innerHTML = `Order confirmed! Your confirmation number is <strong>${orderNumber}</strong>.`;
  document.getElementById("coupon-message").textContent = "";
  renderCheckoutSummary();
  updateCartCount();
}

function applyCoupon() {
  const couponInput = document.getElementById("coupon-code");
  const couponMessage = document.getElementById("coupon-message");
  if (!couponInput || !couponMessage) return;

  const code = couponInput.value.trim().toUpperCase();
  const validCoupons = { SAVE10: 0.10, GAMER15: 0.15 };

  if (validCoupons[code]) {
    currentDiscountRate = validCoupons[code];
    couponMessage.textContent = `${code} applied successfully.`;
    couponMessage.className = "success";
  } else {
    currentDiscountRate = 0;
    couponMessage.textContent = "Coupon code is not valid.";
    couponMessage.className = "error-message";
  }

  renderCheckoutSummary();
}

document.addEventListener("DOMContentLoaded", () => {
  getInventory();
  displayProducts();
  renderCart();
  renderCheckoutSummary();
  renderProductDetail();
  updateCartCount();

  const contactForm = document.getElementById("contact-form");
  if (contactForm) contactForm.addEventListener("submit", validateContactForm);

  const checkoutForm = document.getElementById("checkout-form");
  if (checkoutForm) checkoutForm.addEventListener("submit", validateCheckoutForm);

  const couponButton = document.getElementById("apply-coupon");
  if (couponButton) couponButton.addEventListener("click", applyCoupon);

  const clearButton = document.getElementById("clear-cart");
  if (clearButton) clearButton.addEventListener("click", clearCart);

  const detailAddButton = document.getElementById("detail-add-cart");
  if (detailAddButton) {
    detailAddButton.addEventListener("click", () => addToCart(Number(detailAddButton.dataset.productId)));
  }
});
