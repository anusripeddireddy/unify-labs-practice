// Initial inventory data
let products = [
  {
    id: "p001",
    name: "Wireless Noise-Cancelling Headphones",
    category: "electronics",
    price: 3499,
    stock: 12,
    tags: ["audio", "premium"]
  },
  {
    id: "p002",
    name: "Organic Cotton Oversized T-Shirt",
    category: "fashion",
    price: 899,
    stock: 2,
    tags: ["clothing", "eco"]
  },
  {
    id: "p003",
    name: "Smart LED Desk Lamp",
    category: "home",
    price: 1999,
    stock: 5,
    tags: ["lighting", "smart"]
  },
  {
    id: "p004",
    name: "True Wireless Earbuds Pro",
    category: "electronics",
    price: 2499,
    stock: 0,
    tags: ["audio", "clearance"]
  },
  {
    id: "p005",
    name: "Minimalist Coffee Table",
    category: "home",
    price: 5299,
    stock: 1,
    tags: ["furniture"]
  }
];

// DOM elements
const productList = document.getElementById("productList");
const summaryText = document.getElementById("summaryText");

const priceCategory = document.getElementById("priceCategory");
const pricePercent = document.getElementById("pricePercent");
const btnIncreasePrice = document.getElementById("btnIncreasePrice");

const lowStockThreshold = document.getElementById("lowStockThreshold");
const btnDeleteLowStock = document.getElementById("btnDeleteLowStock");

const tagProductSelect = document.getElementById("tagProductSelect");
const tagInput = document.getElementById("tagInput");
const btnAddTag = document.getElementById("btnAddTag");
const btnRemoveTag = document.getElementById("btnRemoveTag");

// Render inventory to the page
function renderProducts() {
  productList.innerHTML = "";

  if (products.length === 0) {
    productList.innerHTML = "<p>No products in inventory.</p>";
    summaryText.textContent = "Inventory is empty.";
    renderProductSelect();
    return;
  }

  let totalValue = 0;
  let totalStock = 0;

  products.forEach(p => {
    totalValue += p.price * p.stock;
    totalStock += p.stock;

    const card = document.createElement("div");
    card.className = "product-card";

    const header = document.createElement("div");
    header.className = "product-header";

    const name = document.createElement("div");
    name.className = "product-name";
    name.textContent = p.name;

    const price = document.createElement("div");
    price.className = "product-price";
    price.textContent = `₹${p.price.toLocaleString("en-IN")}`;

    header.appendChild(name);
    header.appendChild(price);

    const meta = document.createElement("div");
    meta.className = "product-meta";
    meta.textContent = `${p.category} • Stock: ${p.stock}`;

    const tagsDiv = document.createElement("div");
    tagsDiv.className = "product-tags";

    const stockTag = document.createElement("span");
    stockTag.className = "tag stock";
    stockTag.textContent = p.stock > 0 ? "In stock" : "Out of stock";
    if (p.stock > 0 && p.stock <= 2) {
      stockTag.classList.add("low");
    }
    tagsDiv.appendChild(stockTag);

    p.tags.forEach(t => {
      const tagEl = document.createElement("span");
      tagEl.className = "tag";
      tagEl.textContent = t;
      tagsDiv.appendChild(tagEl);
    });

    card.appendChild(header);
    card.appendChild(meta);
    card.appendChild(tagsDiv);

    productList.appendChild(card);
  });

  summaryText.textContent =
    `Products: ${products.length} • Total stock units: ${totalStock} • ` +
    `Inventory value: ₹${totalValue.toLocaleString("en-IN")}`;

  renderProductSelect();
}

// Populate select for tag management
function renderProductSelect() {
  tagProductSelect.innerHTML = "";

  products.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = `${p.name} (${p.id})`;
    tagProductSelect.appendChild(opt);
  });
}

// Mass price increase
btnIncreasePrice.addEventListener("click", () => {
  const percent = Number(pricePercent.value);
  if (Number.isNaN(percent) || percent === 0) {
    alert("Please enter a valid percentage.");
    return;
  }

  const category = priceCategory.value;

  products = products.map(p => {
    if (category === "all" || p.category === category) {
      const newPrice = Math.round(p.price * (1 + percent / 100));
      return { ...p, price: newPrice };
    }
    return p;
  });

  renderProducts();
  pricePercent.value = "";
});

// Delete low-stock items
btnDeleteLowStock.addEventListener("click", () => {
  const threshold = Number(lowStockThreshold.value);
  if (Number.isNaN(threshold) || threshold < 0) {
    alert("Please enter a valid stock threshold.");
    return;
  }

  const beforeCount = products.length;
  products = products.filter(p => p.stock >= threshold);
  const deleted = beforeCount - products.length;

  alert(`Deleted ${deleted} product(s) below stock ${threshold}.`);
  renderProducts();
  lowStockThreshold.value = "";
});

// Add a tag to selected product
btnAddTag.addEventListener("click", () => {
  const productId = tagProductSelect.value;
  const tag = tagInput.value.trim();
  if (!productId || !tag) {
    alert("Select a product and enter a tag.");
    return;
  }

  products = products.map(p => {
    if (p.id === productId) {
      if (!p.tags.includes(tag)) {
        return { ...p, tags: [...p.tags, tag] };
      } else {
        alert("Tag already exists on this product.");
      }
    }
    return p;
  });

  tagInput.value = "";
  renderProducts();
});

// Remove a tag from selected product
btnRemoveTag.addEventListener("click", () => {
  const productId = tagProductSelect.value;
  const tag = tagInput.value.trim();
  if (!productId || !tag) {
    alert("Select a product and enter the tag to remove.");
    return;
  }

  let changed = false;
  products = products.map(p => {
    if (p.id === productId && p.tags.includes(tag)) {
      changed = true;
      return { ...p, tags: p.tags.filter(t => t !== tag) };
    }
    return p;
  });

  if (!changed) {
    alert("Tag not found on this product.");
  }

  tagInput.value = "";
  renderProducts();
});

// Initial render
renderProducts();
