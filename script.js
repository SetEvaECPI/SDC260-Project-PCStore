const products = [
  { name: "RTX 5070 Graphics Card", category: "GPU", price: 599.99, description: "High-performance graphics for modern PC gaming." },
  { name: "RX 9070 XT Graphics Card", category: "GPU", price: 649.99, description: "Strong raster performance for high-resolution gaming." },
  { name: "Ryzen 7 Gaming Processor", category: "CPU", price: 349.99, description: "Fast multi-core performance for gaming and streaming." },
  { name: "Core Ultra Desktop Processor", category: "CPU", price: 399.99, description: "Modern desktop processor for gaming and productivity." },
  { name: "32 GB DDR5 Memory", category: "RAM", price: 119.99, description: "High-speed memory for smooth multitasking." },
  { name: "64 GB DDR5 Memory", category: "RAM", price: 219.99, description: "Extra capacity for gaming, creation, and development." },
  { name: "2 TB NVMe SSD", category: "Storage", price: 139.99, description: "Fast solid-state storage for games and applications." },
  { name: "850W Gold Power Supply", category: "Power Supply", price: 149.99, description: "Efficient modular power supply for performance builds." },
  { name: "Mechanical Gaming Keyboard", category: "Accessory", price: 109.99, description: "Responsive mechanical keyboard with gaming-focused features." },
  { name: "Lightweight Gaming Mouse", category: "Accessory", price: 79.99, description: "Precise lightweight mouse with programmable controls." },
  { name: "Wireless Gaming Headset", category: "Accessory", price: 129.99, description: "Comfortable wireless headset for gaming and voice chat." },
  { name: "240mm Liquid Cooler", category: "Cooling", price: 129.99, description: "Liquid CPU cooling for modern gaming systems." }
];

function displayProducts() {
  const productGrid = document.getElementById("product-grid");
  if (!productGrid) return;

  for (const product of products) {
    const card = document.createElement("article");
    card.className = "product-card";

    card.innerHTML = `
      <div class="product-image">${product.category} Image</div>
      <p class="product-category">${product.category}</p>
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <p class="price">$${product.price.toFixed(2)}</p>
      <a class="button" href="product.html">View Product</a>
    `;

    productGrid.appendChild(card);
  }
}

function setError(id, message) {
  const error = document.getElementById(id);
  if (error) {
    error.textContent = message;
  }
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

  const success = document.getElementById("checkout-success");
  success.textContent = valid ? "Order information is valid and ready to submit." : "";
}

function applyCoupon() {
  const couponInput = document.getElementById("coupon-code");
  const couponMessage = document.getElementById("coupon-message");
  if (!couponInput || !couponMessage) return;

  const code = couponInput.value.trim().toUpperCase();
  const subtotal = 679.98;
  const validCoupons = {
    SAVE10: 0.10,
    GAMER15: 0.15
  };

  let discountAmount = 0;

  if (validCoupons[code]) {
    discountAmount = subtotal * validCoupons[code];
    couponMessage.textContent = `${code} applied successfully.`;
    couponMessage.className = "success";
  } else {
    couponMessage.textContent = "Coupon code is not valid.";
    couponMessage.className = "error-message";
  }

  document.getElementById("discount").textContent = `-$${discountAmount.toFixed(2)}`;
  document.getElementById("total").textContent = `$${(subtotal - discountAmount).toFixed(2)}`;
}

document.addEventListener("DOMContentLoaded", () => {
  displayProducts();

  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", validateContactForm);
  }

  const checkoutForm = document.getElementById("checkout-form");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", validateCheckoutForm);
  }

  const couponButton = document.getElementById("apply-coupon");
  if (couponButton) {
    couponButton.addEventListener("click", applyCoupon);
  }
});
