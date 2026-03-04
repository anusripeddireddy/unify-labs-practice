class ShopAPI {
    constructor() {
        this.baseURL = 'http://localhost:3000/api';
        this.productsContainer = document.getElementById('productsContainer');
        this.loadingEl = document.getElementById('loading');
        this.noProductsEl = document.getElementById('noProducts');
        this.productsCountEl = document.getElementById('productsCount');
        this.apiStatusEl = document.getElementById('apiStatus');
        this.modal = document.getElementById('editModal');
        
        this.init();
    }

    async init() {
        this.bindEvents();
        await this.loadProducts();
        await this.testConnection();
    }

    bindEvents() {
        document.getElementById('createForm').addEventListener('submit', (e) => this.createProduct(e));
        document.getElementById('editForm').addEventListener('submit', (e) => this.updateProduct(e));
        document.querySelector('.close').addEventListener('click', () => this.closeModal());
        document.getElementById('deleteBtn').addEventListener('click', () => this.deleteProduct());
        
        // Close modal on outside click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });
    }

    async testConnection() {
        try {
            await fetch(`${this.baseURL}/products`);
            this.apiStatusEl.textContent = '🟢 Connected';
            this.apiStatusEl.className = 'api-status connected';
        } catch {
            this.apiStatusEl.textContent = '🔴 Disconnected';
            this.apiStatusEl.className = 'api-status error';
        }
    }

    async loadProducts() {
        this.showLoading();
        try {
            const response = await fetch(`${this.baseURL}/products`);
            const result = await response.json();
            
            if (result.success) {
                this.productsCountEl.textContent = result.data.length;
                this.renderProducts(result.data);
            }
        } catch (error) {
            console.error('Error loading products:', error);
            this.showError('Failed to load products');
        }
        this.hideLoading();
    }

    renderProducts(products) {
        if (products.length === 0) {
            this.noProductsEl.classList.add('active');
            this.productsContainer.innerHTML = '';
            return;
        }
        
        this.noProductsEl.classList.remove('active');
        this.productsContainer.innerHTML = products.map(product => `
            <div class="product-card" data-id="${product._id}">
                <div class="product-header">
                    <div class="product-name">${product.name}</div>
                    <div class="product-price">$${parseFloat(product.price).toFixed(2)}</div>
                </div>
                <div class="product-image">
                    ${product.image ? `<img src="${product.image}" alt="${product.name}">` : '🛍️'}
                </div>
                <div class="product-details">
                    <p>${product.description || 'No description'}</p>
                </div>
                <div class="product-actions">
                    <button onclick="shopAPI.editProduct('${product._id}')" class="btn-edit">✏️ Edit</button>
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
                this.resetForm('createForm');
                this.loadProducts();
                this.showNotification('Product created successfully! ✅');
            }
        } catch (error) {
            this.showNotification('Failed to create product ❌', true);
        }
    }

    async editProduct(id) {
        try {
            const response = await fetch(`${this.baseURL}/products`);
            const result = await response.json();
            const product = result.data.find(p => p._id === id);
            
            if (product) {
                document.getElementById('editId').value = id;
                document.getElementById('editName').value = product.name;
                document.getElementById('editPrice').value = product.price;
                document.getElementById('editImage').value = product.image || '';
                document.getElementById('editDescription').value = product.description || '';
                this.modal.style.display = 'block';
            }
        } catch (error) {
            console.error('Error loading product for edit:', error);
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
                this.showNotification('Product updated successfully! ✅');
            }
        } catch (error) {
            this.showNotification('Failed to update product ❌', true);
        }
    }

    async deleteProduct() {
        const id = document.getElementById('editId').value;
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const response = await fetch(`${this.baseURL}/products/${id}`, {
                method: 'DELETE'
            });
            const result = await response.json();
            
            if (result.success) {
                this.closeModal();
                this.loadProducts();
                this.showNotification('Product deleted successfully! ✅');
            }
        } catch (error) {
            this.showNotification('Failed to delete product ❌', true);
        }
    }

    closeModal() {
        this.modal.style.display = 'none';
        document.getElementById('editForm').reset();
    }

    resetForm(formId) {
        document.getElementById(formId).reset();
    }

    showLoading() {
        this.loadingEl.classList.add('active');
        this.noProductsEl.classList.remove('active');
    }

    hideLoading() {
        this.loadingEl.classList.remove('active');
    }

    showError(message) {
        this.productsContainer.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:#ef4444;">${message}</div>`;
    }

    showNotification(message, isError = false) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px; padding: 15px 20px; 
            background: ${isError ? '#ef4444' : '#10b981'}; color: white; 
            border-radius: 10px; z-index: 2000; font-weight: bold;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }
}

// Global instance
const shopAPI = new ShopAPI();
