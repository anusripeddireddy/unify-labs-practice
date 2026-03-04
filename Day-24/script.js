// Sample "MongoDB-like" product documents
const products = [
  {
    _id: "p001",
    name: "Wireless Noise‑Cancelling Headphones",
    category: "electronics",
    brand: "NovaTech",
    price: 3499,
    stock: 12,
    rating: 4.6,
    variants: [
      { sku: "P001-BLK", color: "Black", inStock: true },
      { sku: "P001-WHT", color: "White", inStock: false }
    ],
    specs: {
      connectivity: ["Bluetooth 5.2", "3.5mm jack"],
      batteryLifeHours: 30,
      highlights: ["ANC", "Foldable", "Fast charge"]
    }
  },
  {
    _id: "p002",
    name: "Organic Cotton Oversized T‑Shirt",
    category: "fashion",
    brand: "UrbanWear",
    price: 899,
    stock: 0,
    rating: 4.2,
    variants: [
      { sku: "P002-BLK-M", size: "M", color: "Black", inStock: false },
      { sku: "P002-GRN-L", size: "L", color: "Olive", inStock: true }
    ],
    specs: {
      material: "100% organic cotton",
      fit: "Relaxed",
      highlights: ["Breathable", "Unisex"]
    }
  },
  {
    _id: "p003",
    name: "Smart LED Desk Lamp",
    category: "home",
    brand: "Acme",
    price: 1999,
    stock: 5,
    rating: 4.8,
    variants: [
      { sku: "P003-WHT", color: "White", inStock: true }
    ],
    specs: {
      powerWatts: 12,
      features: ["Touch controls", "3 color modes", "USB charging port"]
    }
  },
  {
    _id: "p004",
    name: "True Wireless Earbuds Pro",
    category: "electronics",
    brand: "Acme",
    price: 2499,
    stock: 30,
    rating: 4.3,
    variants: [
      { sku: "P004-BLK", color: "Black", inStock: true },
      { sku: "P004-BLU", color: "Blue", inStock: true }
    ],
    specs: {
      connectivity: ["Bluetooth 5.3"],
      batteryLifeHours: 24,
      highlights: ["IPX4 water resistance", "Low‑latency mode"]
    }
  },
  {
    _id: "p005",
    name: "Minimalist Coffee Table",
    category: "home",
    brand: "HomeCraft",
    price: 5299,
    stock: 2,
    rating: 3.9,
    variants: [
      { sku: "P005-OAK", color: "Oak", inStock: true }
    ],
    specs: {
      material: "Engineered wood",
      dimensionsCm: { w: 110, d: 55, h: 42 },
      highlights: ["Matte finish", "Easy assembly"]
    }
  }
];

const productsGrid = document.getElementById("productsGrid");
const queryPreview = document.getElementById("queryPreview");
const resultsCount = document.getElementById("resultsCount");

const categoryFilter = document.getElementById("categoryFilter");
const brandFilter = document.getElementById("brandFilter");
const priceFilter = document.getElementById("priceFilter");
const inStockFilter = document.getElementById("inStockFilter");
const ratingFilter = document.getElementById("ratingFilter");

const applyBtn = document.getElementById("applyFilters");
const resetBtn = document.getElementById("resetFilters");

// Build a "query object" like you would in MongoDB
function buildQuery() {
  const query = {};

  if (categoryFilter.value !== "all") {
    query.category = categoryFilter.value;
  }

  if (brandFilter.value !== "all") {
    query.brand = brandFilter.value;
  }

  const maxPrice = Number(priceFilter.value);
  if (!Number.isNaN(maxPrice) && maxPrice > 0) {
    query.price = { $lte: maxPrice };
  }

  if (inStockFilter.checked) {
    query.stock = { $gt: 0 };
  }

  const minRating = Number(ratingFilter.value);
  if (minRating > 0) {
    query.rating = { $gte: minRating };
  }

  return query;
}

// Apply query to product array (client-side simulation)
function filterProducts(query) {
  return products.filter(p => {
    if (query.category && p.category !== query.category) return false;
    if (query.brand && p.brand !== query.brand) return false;
    if (query.price && !(p.price <= query.price.$lte)) return false;
    if (query.stock && !(p.stock > query.stock.$gt)) return false;
    if (query.rating && !(p.rating >= query.rating.$gte)) return false;
    return true;
  });
}

// Render products on screen
function renderProducts(list) {
  productsGrid.innerHTML = "";

  if (list.length === 0) {
    productsGrid.innerHTML = "<p>No products match this query.</p>";
    resultsCount.textContent = "0 products found.";
    return;
  }

  resultsCount.textContent = `${list.length} product(s) found.`;

  list.forEach(p => {
    const card = document.createElement("article");
    card.className = "product-card";

    const header = document.createElement("div");
    header.className = "product-header";

    const title = document.createElement("div");
    title.className = "product-title";
    title.textContent = p.name;

    const price = document.createElement("div");
    price.className = "product-price";
    price.textContent = `₹${p.price.toLocaleString("en-IN")}`;

    header.appendChild(title);
    header.appendChild(price);

    const meta = document.createElement("div");
    meta.className = "product-meta";
    meta.textContent = `${p.brand} • ${p.category}`;

    const rating = document.createElement("div");
    rating.className = "rating";
    rating.textContent = `★ ${p.rating.toFixed(1)}`;

    const tags = document.createElement("div");
    tags.className = "product-tags";

    const variantTag = document.createElement("span");
    variantTag.className = "tag variant";
    variantTag.textContent = `${p.variants.length} variant(s)`;
    tags.appendChild(variantTag);

    const stockTag = document.createElement("span");
    stockTag.className = "tag stock";
    stockTag.textContent = p.stock > 0 ? "In stock" : "Out of stock";
    if (p.stock === 0) stockTag.classList.add("out");
    tags.appendChild(stockTag);

    const specs = document.createElement("div");
    specs.className = "product-specs";

    const highlightText = Array.isArray(p.specs.highlights)
      ? p.specs.highlights.slice(0, 2).join(", ")
      : "";

    specs.textContent = highlightText
      ? `Highlights: ${highlightText}`
      : "Rich product document with embedded specs.";

    card.appendChild(header);
    card.appendChild(meta);
    card.appendChild(rating);
    card.appendChild(tags);
    card.appendChild(specs);

    productsGrid.appendChild(card);
  });
}

// Render query preview as JSON
function renderQueryPreview(query) {
  if (Object.keys(query).length === 0) {
    queryPreview.textContent = "// db.products.find({})";
  } else {
    queryPreview.textContent =
      "db.products.find(\n" +
      JSON.stringify(query, null, 2) +
      "\n)";
  }
}

// Initial load
function runInitial() {
  const query = {};
  renderQueryPreview(query);
  renderProducts(products);
}

// Event handlers
applyBtn.addEventListener("click", () => {
  const query = buildQuery();
  const filtered = filterProducts(query);
  renderQueryPreview(query);
  renderProducts(filtered);
});

resetBtn.addEventListener("click", () => {
  categoryFilter.value = "all";
  brandFilter.value = "all";
  priceFilter.value = "";
  inStockFilter.checked = false;
  ratingFilter.value = "0";
  runInitial();
});

// Start
runInitial();
