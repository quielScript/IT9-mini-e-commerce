"use strict";

const data = [
	{
		name: "Apple iPhone 15 Pro",
		price: 64990,
		category: "iphone",
		image: "./images/ip15-pro.jpg",
	},
	{
		name: "Apple iPhone 13",
		price: 28990,
		category: "iphone",
		image: "./images/ip13.jpg",
	},
	{
		name: "Apple iPhone 14",
		price: 31990,
		category: "iphone",
		image: "./images/ip14.jpg",
	},
	{
		name: "Apple AirPods Max (2024)",
		price: 35990,
		category: "audio",
		image: "./images/airpods-max.jpg",
	},
	{
		name: "Apple AirPods Pro 2",
		price: 14990,
		category: "audio",
		image: "./images/airpods-pro-2.jpg",
	},
	{
		name: "Apple MacBook Air (13-inch, M3, 2024)",
		price: 59990,
		category: "mac",
		image: "./images/mac-air-13.jpg",
	},
	{
		name: "Apple MacBook Air (15-inch, M3)",
		price: 92990,
		category: "mac",
		image: "./images/mac-air-15.jpg",
	},
	{
		name: "Apple iPad Air 13-inch (M2, WiFi)",
		price: 45990,
		category: "ipad",
		image: "./images/ipad-13-m2.jpg",
	},
	{
		name: "Apple Watch Series 9 (GPS) Sport Band",
		price: 29990,
		category: "watch",
		image: "./images/watch-series-9.jpg",
	},
	{
		name: "Apple Watch Ultra 2 (GPS + Cellular) Trail Loop",
		price: 54990,
		category: "watch",
		image: "./images/watch-ultra-2.jpg",
	},
];

// DOM Elements
const productsContainer = document.getElementById("products-container");
const searchInputEl = document.getElementById("search-query");

function renderProducts(products) {
	productsContainer.innerHTML = "";

	products.forEach((product) => {
		const card = document.createElement("div");
		card.className = "col";

		card.innerHTML = `
            <div class="card h-100 shadow-sm border-0">
                <img 
                    src="${product.image}" 
                    alt="${product.name}" 
                    class="card-img-top"
                    style="height: 220px; object-fit: contain; padding: 1.25rem;"
                >
                <div class="card-body d-flex flex-column">
                    <p class="text-muted small mb-1">${product.category}</p>
                    <h5 class="card-title mb-2">${product.name}</h5>
                    <p class="card-text fw-bold fs-5 mb-3 mt-auto">
                        ₱${product.price.toLocaleString()}
                    </p>
                    <button class="btn btn-dark w-100 mt-2">Add to Cart</button>
                </div>
            </div>
        `;

		productsContainer.appendChild(card);
	});
}

// Show all products when page loads
renderProducts(data);

// Event listeners & handlers
searchInputEl.addEventListener("input", (e) => {
	const query = e.target.value.toLowerCase().trim();

	const filtered = data.filter(
		(product) =>
			product.name.toLowerCase().includes(query) ||
			product.category.toLowerCase().includes(query),
	);

	renderProducts(filtered);
});
