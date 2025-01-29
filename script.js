const products = [
    {
        id: 1,
        name: "MacBook Pro M2",
        price: 1499.99,
        rental_price: 149.99,
        category: "laptops",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
        description: "Revolutionary performance with the M2 chip",
        specs: {
            processor: "Apple M2",
            ram: "16GB Unified Memory",
            storage: "512GB SSD",
            display: "14\" Liquid Retina XDR"
        }
    },
    {
        id: 2,
        name: "iPhone 15 Pro Max",
        price: 1199.99,
        rental_price: 99.99,
        category: "phones",
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
        description: "Pro camera system with 48MP main sensor",
        specs: {
            screen: "6.7\" Super Retina XDR",
            camera: "48MP Triple Camera",
            processor: "A17 Pro",
            storage: "256GB"
        }
    },
    {
        id: 3,
        name: "Sony WH-1000XM5",
        price: 399.99,
        rental_price: 39.99,
        category: "accessories",
        image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
        description: "Industry-leading noise cancellation",
        specs: {
            battery: "30 Hours",
            noise_cancelling: "Advanced ANC",
            audio: "LDAC Hi-Res",
            features: "Multipoint Connection"
        }
    },
    {
        id: 4,
        name: "Steam Deck OLED",
        price: 549.99,
        rental_price: 59.99,
        category: "gaming",
        image: "https://images.unsplash.com/photo-1640955014216-75201056c829?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
        description: "Portable PC gaming powerhouse",
        specs: {
            display: "7.4\" HDR OLED",
            storage: "512GB NVMe SSD",
            ram: "16GB LPDDR5",
            battery: "50Wh"
        }
    }
];

// Enhanced Cart Management
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(productId, isRental = false) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const cartItem = {
            ...product,
            isRental,
            price: isRental ? product.rental_price : product.price,
            quantity: 1
        };
        
        const existingItemIndex = cart.findIndex(item => 
            item.id === productId && item.isRental === isRental
        );

        if (existingItemIndex >= 0) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push(cartItem);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        showNotification(`${product.name} added to cart!`);
    }
}

function removeFromCart(index) {
    const item = cart[index];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    showNotification(`${item.name} removed from cart!`);
}

function updateCartDisplay() {
    const cartItems = document.querySelector('.cart-items');
    const cartSubtotal = document.getElementById('cart-subtotal');
    
    if (cartItems) {
        cartItems.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p>${item.isRental ? 'Rental' : 'Purchase'}: $${item.price}</p>
                    <p>Quantity: ${item.quantity}</p>
                </div>
                <button class="btn" onclick="removeFromCart(${index})">Remove</button>
            </div>
        `).join('');

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartSubtotal.textContent = `$${total.toFixed(2)}`;
    }
}

// Modern Product Display
function displayProducts() {
    const productsGrid = document.querySelector('.product-grid');
    const isRentalPage = new URLSearchParams(window.location.search).get('type') === 'rental';
    
    if (productsGrid) {
        productsGrid.innerHTML = products.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price">
                        ${isRentalPage ? 
                            `$${product.rental_price}/month` : 
                            `$${product.price}`
                        }
                    </p>
                    <button class="btn" onclick="addToCart(${product.id}, ${isRentalPage})">
                        ${isRentalPage ? 'Rent Now' : 'Add to Cart'}
                    </button>
                </div>
                <div class="product-details">
                    <p>${product.description}</p>
                    <ul class="specs-list">
                        ${Object.entries(product.specs).map(([key, value]) => `
                            <li>
                                <span>${key.replace('_', ' ')}:</span>
                                <span>${value}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `).join('');
    }
}

// Notification System
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--primary);
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        animation: slideIn 0.3s ease-out;
        z-index: 1000;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    updateCartDisplay();
});


















// Filter and Search Functionality
const searchInput = document.getElementById('search-input');
const categoryCheckboxes = document.querySelectorAll('.filter-group input[type="checkbox"]');
const priceRange = document.getElementById('price-range');
const minPriceInput = document.getElementById('min-price');
const maxPriceInput = document.getElementById('max-price');
const sortSelect = document.getElementById('sort-select');

// Filters
let filters = {
    searchQuery: '',
    categories: [],
    minPrice: 0,
    maxPrice: 2000,
    sortBy: 'featured'
};

// Update Filters Based on Input
function updateFilters() {
    filters.searchQuery = searchInput.value.toLowerCase();
    filters.categories = Array.from(categoryCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);
    filters.minPrice = parseFloat(minPriceInput.value) || 0;
    filters.maxPrice = parseFloat(maxPriceInput.value) || 2000;
    filters.sortBy = sortSelect.value;

    displayProducts();
}

// Product Display Logic with Filters
function displayProducts() {
    const productsGrid = document.querySelector('.product-grid');
    const filteredProducts = products.filter(product => {
        // Search Filter
        const matchesSearch = product.name.toLowerCase().includes(filters.searchQuery);
        
        // Category Filter
        const matchesCategory = filters.categories.length === 0 || filters.categories.includes(product.category);
        
        // Price Filter
        const matchesPrice = product.price >= filters.minPrice && product.price <= filters.maxPrice;
        
        return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sorting Logic
    let sortedProducts = [...filteredProducts];
    switch (filters.sortBy) {
        case 'price-low':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
            sortedProducts.sort((a, b) => b.id - a.id); // Assuming ID reflects the order
            break;
        default:
            // Default sorting (e.g., by featured or id)
            break;
    }

    if (productsGrid) {
        productsGrid.innerHTML = sortedProducts.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price">
                        ${new URLSearchParams(window.location.search).get('type') === 'rental' ? 
                            `$${product.rental_price}/month` : 
                            `$${product.price}`
                        }
                    </p>
                    <button class="btn" onclick="addToCart(${product.id}, ${new URLSearchParams(window.location.search).get('type') === 'rental'})">
                        ${new URLSearchParams(window.location.search).get('type') === 'rental' ? 'Rent Now' : 'Add to Cart'}
                    </button>
                </div>
                <div class="product-details">
                    <p>${product.description}</p>
                    <ul class="specs-list">
                        ${Object.entries(product.specs).map(([key, value]) => `
                            <li>
                                <span>${key.replace('_', ' ')}:</span>
                                <span>${value}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `).join('');
    }
}

// Event Listeners for Filters and Search
searchInput.addEventListener('input', updateFilters);
categoryCheckboxes.forEach(checkbox => checkbox.addEventListener('change', updateFilters));
priceRange.addEventListener('input', () => {
    minPriceInput.value = priceRange.value ? priceRange.value : 0;
    updateFilters();
});
minPriceInput.addEventListener('input', updateFilters);
maxPriceInput.addEventListener('input', updateFilters);
sortSelect.addEventListener('change', updateFilters);

// Initialize Filters and Display
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
});
    