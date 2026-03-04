class CloudShopAPI {
    constructor() {
        this.baseURL = 'http://localhost:3000/api';
        this.init();
    }

    async init() {
        this.bindEvents();
        await this.loadProducts();
        await this.checkAtlasConnection();
    }

    bindEvents() {
        document.getElementById('createForm').addEventListener('submit', (e) => this.createProduct(e));
        document.getElementById('editForm').addEventListener('submit', (e) => this.updateProduct(e));
        document.querySelector('.close').addEventListener('click', () => this.closeModal());
        document.getElementById('deleteBtn').addEventListener('click', () => this.deleteProduct());
        document.getElementById('editModal').addEventListener('click', (e) => {
            if (e.target === document.getElementById('editModal')) this.closeModal();
        });
    }

    async checkAtlasConnection() {
        const statusEl = document.getElementById('apiStatus');
        statusEl.textContent = '🔄 Connecting to Atlas...';
        statusEl.className = 'status-card connecting';
        
        try {
            const response = await fetch(`${this.baseURL}/products`);
            statusEl.textContent = '✅ Atlas Connected';
            statusEl.className = 'status-card connected';
        } catch {
            statusEl.textContent = '❌ Atlas Failed';
            statusEl.className = 'status-card error';
        }
    }

    async loadProducts() {
        const container = document.getElementById('productsContainer');
        const loading = document.getElementById('loading');
        const noProducts = document.getElementById('noProducts');
        const countEl = document.getElementById('count');
        
        loading.classList.add('active');
        noProducts.classList.remove('active');
        
        try {
            const response = await fetch(`${this.baseURL}/products`);
            const result = await response.json();
            
            countEl.textContent = result.data.length;
            
            if (result.success && result.data.length === 0) {
                noProducts.classList.add('active');
                container.innerHTML = '';
            } else if (result.success) {
                noProducts.classList.remove('active');
                this.renderProducts(result.data);
            }
        } catch (error) {
            console.error('Atlas error:', error);
            container.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px;color:#ef4444;">Failed to connect to Atlas cloud</div>';
        }
        
        loading.classList.remove('active');
    }

    renderProducts(products) {
        document.getElementById('productsContainer').innerHTML = products.map(product => `
            <div class="product-card" data-id="${product._id}">
                <div class="product-header">
                    <div class="product-name">${product.name}</div>
                    <div class="product-price">$${parseFloat(product.price).toFixed(2)}</div>
                </div>
                <div class="product-image">
                    ${product.image ? `<img src="${product.image}" alt="${product.name}" style="max-height:100%;max-width:100%;object-fit:cover;border-radius:10px;">` : '🛒'}
                </div>
                <div class="product-details">
                    <p>${product.description || 'No description available'}</p>
                </div>
                <div class="product-actions">
                    <button onclick="cloudShop.editProduct('${product._id}')" class="btn-edit">✏️ Edit</button>
                </div>
            </div>
        `).join('');
    }

    async createProduct(e) {
        e.preventDefault();
        const formData = {
            name: document.getElementById('name').value,
            price: parseFloat(document.getElementById('price').value),
            image: document.getElementById('image').value,
            description: document.getElementById('description').value
        };

        try {
            const response = await fetch(`${this.baseURL}/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            
            if (result.success) {
                document.getElementById('createForm').reset();
                this.loadProducts();
                this.showToast('✅ Saved to Atlas Cloud!');
            }
        } catch (error) {
            this.showToast('❌ Failed to save to cloud', true);
        }
    }

    async editProduct(id) {
        try {
            const response = await fetch(`${this.baseURL}/products`);
            const result = await response.json();
            const product = result.data.find(p => p._id === id);
            
            document.getElementById('editId').value = id;
            document.getElementById('editName').value = product.name;
            document.getElementById('editPrice').value = product.price;
            document.getElementById('editImage').value = product.image || '';
            document.getElementById('editDescription').value = product.description || '';
            document.getElementById('editModal').style.display = 'block';
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async updateProduct(e) {
        e.preventDefault();
        const id = document.getElementById('editId').value;
        const formData = {
            name: document.getElementById('editName').value,
            price: parseFloat(document.getElementById('editPrice').value),
            image: document.getElementById('editImage').value,
            description: document.getElementById('editDescription').value
        };

        try {
            const response = await fetch(`${this.baseURL}/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            
            if (result.success) {
                this.closeModal();
                this.loadProducts();
                this.showToast('✅ Updated in Atlas!');
            }
        } catch (error) {
            this.showToast('❌ Update failed', true);
        }
    }

    async deleteProduct() {
        const id = document.getElementById('editId').value;
        if (!confirm('Delete from Atlas Cloud?')) return;

        try {
            const response = await fetch(`${this.baseURL}/products/${id}`, { method: 'DELETE' });
            const result = await response.json();
            
            if (result.success) {
                this.closeModal();
                this.loadProducts();
                this.showToast('✅ Deleted from cloud!');
            }
        } catch (error) {
            this.showToast('❌ Delete failed', true);
        }
    }

    closeModal() {
        document.getElementById('editModal').style.display = 'none';
        document.getElementById('editForm').reset();
    }

    showToast(message, isError = false) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed; top: 30px; right: 30px; padding: 20px 25px;
            background: ${isError ? '#ef4444' : '#10b981'}; color: white;
            border-radius: 15px; z-index: 3000; font-weight: bold;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => document.body.removeChild(toast), 3000);
    }
}

const cloudShop = new CloudShopAPI();
