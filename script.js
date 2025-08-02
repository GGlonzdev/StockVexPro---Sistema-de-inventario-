// Data
let products = [
    {
        id: 1,
        name: 'MacBook Pro 14"',
        sku: 'MBP-14-001',
        description: 'Laptop profesional con chip M3 Pro',
        price: 2499.99,
        stock: 15,
        supplier: 'Apple Inc.',
        category: 'Laptops',
        entryDate: '2024-01-15'
    },
    {
        id: 2,
        name: 'iPhone 15 Pro',
        sku: 'IPH-15P-128',
        description: 'Smartphone con cámara avanzada 128GB',
        price: 1199.99,
        stock: 8,
        supplier: 'Apple Inc.',
        category: 'Smartphones',
        entryDate: '2024-02-10'
    },
    {
        id: 3,
        name: 'Samsung Galaxy S24',
        sku: 'SGS-S24-256',
        description: 'Smartphone Android flagship 256GB',
        price: 899.99,
        stock: 22,
        supplier: 'Samsung',
        category: 'Smartphones',
        entryDate: '2024-01-28'
    },
    {
        id: 4,
        name: 'iPad Pro 12.9"',
        sku: 'IPD-PRO-128',
        description: 'Tablet profesional con chip M2',
        price: 1299.99,
        stock: 12,
        supplier: 'Apple Inc.',
        category: 'Tablets',
        entryDate: '2024-03-05'
    }
];

let editingProduct = null;
let searchTerm = '';
let filterCategory = '';

// DOM Elements
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const productsGrid = document.getElementById('products-grid');
const emptyState = document.getElementById('empty-state');
const form = document.getElementById('product-form');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');

// Event Listeners
document.getElementById('new-product-btn').addEventListener('click', () => openModal());
document.getElementById('close-modal').addEventListener('click', closeModal);
document.getElementById('cancel-btn').addEventListener('click', closeModal);
form.addEventListener('submit', handleSubmit);
searchInput.addEventListener('input', (e) => {
    searchTerm = e.target.value;
    renderProducts();
});
categoryFilter.addEventListener('change', (e) => {
    filterCategory = e.target.value;
    renderProducts();
});

function openModal(product = null) {
    editingProduct = product;
    modalTitle.textContent = product ? 'Editar Producto' : 'Nuevo Producto';
    document.getElementById('submit-btn').textContent = product ? 'Actualizar' : 'Guardar';
    
    if (product) {
        document.getElementById('name').value = product.name;
        document.getElementById('sku').value = product.sku;
        document.getElementById('description').value = product.description;
        document.getElementById('price').value = product.price;
        document.getElementById('stock').value = product.stock;
        document.getElementById('supplier').value = product.supplier;
        document.getElementById('category').value = product.category;
    } else {
        form.reset();
    }
    
    clearErrors();
    modal.classList.remove('hidden');
}

function closeModal() {
    modal.classList.add('hidden');
    editingProduct = null;
    form.reset();
    clearErrors();
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.classList.add('hidden');
        el.textContent = '';
    });
    document.querySelectorAll('.form-input').forEach(input => {
        input.classList.remove('error');
    });
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(fieldId + '-error');
    
    field.classList.add('error');
    errorEl.textContent = message;
    errorEl.classList.remove('hidden');
}

function validateForm() {
    let isValid = true;
    clearErrors();

    const name = document.getElementById('name').value.trim();
    const sku = document.getElementById('sku').value.trim();
    const description = document.getElementById('description').value.trim();
    const price = parseFloat(document.getElementById('price').value);
    const stock = parseInt(document.getElementById('stock').value);
    const supplier = document.getElementById('supplier').value;
    const category = document.getElementById('category').value;

    if (!name) {
        showError('name', 'Requerido');
        isValid = false;
    }

    if (!sku) {
        showError('sku', 'Requerido');
        isValid = false;
    } else {
        const isDuplicate = products.some(p => 
            p.sku.toLowerCase() === sku.toLowerCase() && 
            (!editingProduct || p.id !== editingProduct.id)
        );
        if (isDuplicate) {
            showError('sku', 'SKU existe');
            isValid = false;
        }
    }

    if (!description) {
        showError('description', 'Requerido');
        isValid = false;
    }

    if (!price || price <= 0) {
        showError('price', 'Precio inválido');
        isValid = false;
    }

    if (isNaN(stock) || stock < 0) {
        showError('stock', 'Stock inválido');
        isValid = false;
    }

    if (!supplier) {
        showError('supplier', 'Requerido');
        isValid = false;
    }

    if (!category) {
        showError('category', 'Requerido');
        isValid = false;
    }

    return isValid;
}

function handleSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) return;

    const productData = {
        name: document.getElementById('name').value.trim(),
        sku: document.getElementById('sku').value.trim(),
        description: document.getElementById('description').value.trim(),
        price: parseFloat(document.getElementById('price').value),
        stock: parseInt(document.getElementById('stock').value),
        supplier: document.getElementById('supplier').value,
        category: document.getElementById('category').value,
        entryDate: new Date().toISOString().split('T')[0]
    };

    if (editingProduct) {
        const index = products.findIndex(p => p.id === editingProduct.id);
        products[index] = { ...productData, id: editingProduct.id };
    } else {
        products.push({ ...productData, id: Date.now() });
    }

    closeModal();
    renderProducts();
    updateStats();
}

function deleteProduct(id) {
    if (confirm('¿Eliminar producto?')) {
        products = products.filter(p => p.id !== id);
        renderProducts();
        updateStats();
    }
}

function getFilteredProducts() {
    return products.filter(product => {
        const matchesSearch = Object.values(product)
            .join(' ')
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesCategory = !filterCategory || product.category === filterCategory;
        return matchesSearch && matchesCategory;
    });
}

function renderProducts() {
    const filteredProducts = getFilteredProducts();
    
    if (filteredProducts.length === 0) {
        productsGrid.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }
    
    productsGrid.classList.remove('hidden');
    emptyState.classList.add('hidden');
    
    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <div class="product-header">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="sku">${product.sku}</div>
                </div>
                <div class="product-actions">
                    <button class="btn-icon" onclick="openModal(products.find(p => p.id === ${product.id}))">✏️</button>
                    <button class="btn-icon" onclick="deleteProduct(${product.id})">🗑️</button>
                </div>
            </div>
            
            <div class="product-description">${product.description}</div>
            
            <div class="product-details">
                <div class="detail-row">
                    <span class="detail-label">Precio</span>
                    <span class="detail-value">$${product.price.toLocaleString()}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Stock</span>
                    <span class="stock-badge ${product.stock <= 10 ? 'stock-low' : 'stock-good'}">
                        ${product.stock}
                    </span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Categoría</span>
                    <span class="detail-value">${product.category}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function updateStats() {
    const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);
    const lowStockProducts = products.filter(p => p.stock <= 10).length;
    
    document.getElementById('total-products').textContent = products.length;
    document.getElementById('total-value').textContent = `$${Math.round(totalValue/1000)}K`;
    document.getElementById('low-stock').textContent = lowStockProducts;
    document.getElementById('header-stats').textContent = 
        `${products.length} productos • $${totalValue.toLocaleString()} total`;
}

// Initialize
renderProducts();
updateStats();