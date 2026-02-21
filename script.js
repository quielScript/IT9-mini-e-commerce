"use strict";

//  Data
const products = [
	{
		id: 1,
		name: "Apple iPhone 15 Pro",
		price: 64990,
		category: "iphone",
		image: "./images/ip15-pro.jpg",
	},
	{
		id: 2,
		name: "Apple iPhone 13",
		price: 28990,
		category: "iphone",
		image: "./images/ip13.jpg",
	},
	{
		id: 3,
		name: "Apple iPhone 14",
		price: 31990,
		category: "iphone",
		image: "./images/ip14.jpg",
	},
	{
		id: 4,
		name: "Apple AirPods Max (2024)",
		price: 35990,
		category: "audio",
		image: "./images/airpods-max.jpg",
	},
	{
		id: 5,
		name: "Apple AirPods Pro 2",
		price: 14990,
		category: "audio",
		image: "./images/airpods-pro-2.jpg",
	},
	{
		id: 6,
		name: "MacBook Air 13″ M3 (2024)",
		price: 59990,
		category: "mac",
		image: "./images/mac-air-13.jpg",
	},
	{
		id: 7,
		name: "MacBook Air 15″ M3",
		price: 92990,
		category: "mac",
		image: "./images/mac-air-15.jpg",
	},
	{
		id: 8,
		name: "iPad Air 13″ M2 WiFi",
		price: 45990,
		category: "ipad",
		image: "./images/ipad-13-m2.jpg",
	},
	{
		id: 9,
		name: "Apple Watch Series 9",
		price: 29990,
		category: "watch",
		image: "./images/watch-series-9.jpg",
	},
	{
		id: 10,
		name: "Apple Watch Ultra 2",
		price: 54990,
		category: "watch",
		image: "./images/watch-ultra-2.jpg",
	},
];

let cart = [];

// DOM Elements
const productsContainer = document.getElementById("products-container");
const cartItemsBody = document.getElementById("cart-items");
const subtotalEl = document.getElementById("subtotal");
const taxEl = document.getElementById("tax");
const totalEl = document.getElementById("total");
const btnClearCart = document.getElementById("btn-clear-cart");
const btnCheckout = document.getElementById("btn-checkout");
const btnConfirmOrder = document.getElementById("btn-confirm-order");
const searchInput = document.getElementById("search-query");

// Functions
function renderProducts(filtered = products) {
	productsContainer.innerHTML = "";
	filtered.forEach((product) => {
		const col = document.createElement("div");
		col.className = "col";
		col.innerHTML = `
            <div class="card h-100 shadow-sm border-0">
                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                <div class="card-body d-flex flex-column">
                    <small class="text-muted">${product.category}</small>
                    <h6 class="card-title mt-1 mb-2">${product.name}</h6>
                    <p class="fw-bold text-dark mb-3 mt-auto">₱${product.price.toLocaleString()}</p>
                    <button class="btn btn-dark btn-sm w-100" onclick="addToCart(${product.id})">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
		productsContainer.appendChild(col);
	});
}

function addToCart(productId) {
	const product = products.find((p) => p.id === productId);
	if (!product) return;

	const existing = cart.find((item) => item.id === productId);
	if (existing) {
		existing.qty += 1;
	} else {
		cart.push({ ...product, qty: 1 });
	}
	renderCart();
}

function changeQty(id, delta) {
	const item = cart.find((i) => i.id === id);

	if (!item) return;

	item.qty = Math.max(0, item.qty + delta);

	if (item.qty === 0) removeItem(item.id);

	renderCart();
}

function removeItem(id) {
	cart = cart.filter((i) => i.id !== id);
	renderCart();
}

function clearCart() {
	if (cart.length === 0) return;

	if (!confirm("Clear all items in cart?")) return;
	cart = [];
	renderCart();
}

function computeTotals() {
	const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

	// Discount Rule: 10% discount if Subtotal >= ₱1000
	const discount = subtotal >= 1000 ? subtotal * 0.1 : 0;

	// Tax: 12% of (Subtotal - Discount)
	const taxableAmount = subtotal - discount;
	const tax = taxableAmount * 0.12;

	// Shipping Fee: ₱80 if subtotal < ₱500, Free if subtotal ≥ ₱500
	const shipping = subtotal < 500 ? 80 : 0;

	// Grand Total: (Subtotal - Discount) + Tax + Shipping
	const total = taxableAmount + tax + shipping;

	subtotalEl.textContent =
		"₱" + subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 });
	document.getElementById("discount").textContent =
		"₱" + discount.toLocaleString(undefined, { minimumFractionDigits: 2 });
	taxEl.textContent =
		"₱" + tax.toLocaleString(undefined, { minimumFractionDigits: 2 });
	document.getElementById("shipping").textContent =
		"₱" + shipping.toLocaleString(undefined, { minimumFractionDigits: 2 });
	totalEl.textContent =
		"₱" + total.toLocaleString(undefined, { minimumFractionDigits: 2 });

	btnCheckout.disabled = cart.length === 0;
}

function renderCart() {
	cartItemsBody.innerHTML = "";

	if (cart.length === 0) {
		cartItemsBody.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-muted">Cart is empty</td></tr>`;
	} else {
		cart.forEach((item) => {
			const row = document.createElement("tr");
			row.innerHTML = `
                <td>${item.name}</td>
                <td>₱${item.price.toLocaleString()}</td>
                <td>
                    <div class="d-flex align-items-center">
                        <button class="btn btn-sm btn-outline-secondary me-1" onclick="changeQty(${item.id}, -1)">−</button>
                        <input type="number" class="form-control form-control-sm quantity-input text-center" value="${item.qty}" readonly>
                        <button class="btn btn-sm btn-outline-secondary ms-1" onclick="changeQty(${item.id}, 1)">+</button>
                    </div>
                </td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="removeItem(${item.id})">×</button>
                </td>
            `;
			cartItemsBody.appendChild(row);
		});
	}

	computeTotals();
}

function generateReceipt() {
	const now = new Date();
	const orderId = "ORD-" + now.getTime().toString().slice(-8);
	const name = document.getElementById("fullName").value;
	const email = document.getElementById("email").value;
	const method = document.getElementById("paymentMethod").value;

	let html = `
        <div class="text-center mb-4">
            <h4>Mini Checkout System</h4>
            <small>Order Receipt</small><br>
            <small>${now.toLocaleString()}</small>
        </div>
        <hr>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Customer:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Payment:</strong> ${method.charAt(0).toUpperCase() + method.slice(1)}</p>
        <hr>
        <table class="table table-sm">
            <thead><tr><th>Item</th><th class="text-end">Price</th><th class="text-end">Qty</th><th class="text-end">Total</th></tr></thead>
            <tbody>
    `;

	cart.forEach((item) => {
		const lineTotal = item.price * item.qty;
		html += `<tr>
            <td>${item.name}</td>
            <td class="text-end">₱${item.price.toLocaleString()}</td>
            <td class="text-end">${item.qty}</td>
            <td class="text-end">₱${lineTotal.toLocaleString()}</td>
        </tr>`;
	});

	const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
	const discount = subtotal >= 1000 ? subtotal * 0.1 : 0;
	const taxableAmount = subtotal - discount;
	const tax = taxableAmount * 0.12;
	const shipping = subtotal < 500 ? 80 : 0;
	const total = taxableAmount + tax + shipping;

	html += `
            </tbody>
        </table>
        <hr>
        <div class="d-flex justify-content-between"><strong>Subtotal</strong><span>₱${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
        <div class="d-flex justify-content-between"><strong>Discount (10%)</strong><span>−₱${discount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
        <div class="d-flex justify-content-between"><strong>Tax (12%)</strong><span>₱${tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
        <div class="d-flex justify-content-between"><strong>Shipping Fee</strong><span>₱${shipping.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
        <hr>
        <div class="d-flex justify-content-between fs-5 fw-bold"><span>Total</span><span>₱${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
        <div class="text-center mt-4 text-muted small">Thank you for your purchase!</div>
    `;

	document.getElementById("receipt-content").innerHTML = html;
}

// Event listeners & handlers
searchInput.addEventListener("input", (e) => {
	const q = e.target.value.toLowerCase().trim();
	const filtered = products.filter(
		(p) =>
			p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q),
	);
	renderProducts(filtered);
});

btnClearCart.addEventListener("click", clearCart);

btnConfirmOrder.addEventListener("click", () => {
	const form = document.getElementById("checkout-form");
	if (!form.checkValidity()) {
		form.reportValidity();
		return;
	}

	generateReceipt();

	const checkoutModal = bootstrap.Modal.getInstance(
		document.getElementById("checkoutModal"),
	);
	checkoutModal.hide();

	const receiptModal = new bootstrap.Modal(
		document.getElementById("receiptModal"),
	);
	receiptModal.show();

	// Reset after showing receipt
	cart = [];
	renderCart();
	form.reset();
});

// Init
renderProducts();
renderCart();
