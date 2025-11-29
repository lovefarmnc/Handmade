// On all pages: call updateCartCount() on load!
document.addEventListener('DOMContentLoaded', updateCartCount);

// Utility to get cart from localStorage
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// Utility to save cart
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update cart count in nav/header
function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const el = document.getElementById('cart-count');
    if (el) el.textContent = count;
}

// Add an item (with product name and size, etc.)
function addItemToCart({ product, size, quantity }) {
    let cart = getCart();
    // You may want to distinguish by product+size
    let found = cart.find(item => item.product === product && item.size === size);
    if (found) {
        found.quantity += quantity;
    } else {
        cart.push({ product, size, quantity });
    }
    saveCart(cart);
    updateCartCount();
}

// Calculate total cost
function calculateCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}
window.removeFromCart = function(index) {
    let cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    renderCartItems();
    updateCartCount();
};

window.removeFromCart = function(index) {
    if (confirm("Are you sure you want to remove this item from your cart?")) {
        let cart = getCart();
        cart.splice(index, 1);
        saveCart(cart);
        renderCartItems();
        updateCartCount();
    }
};

// Render cart items and subtotal (for cart.html)
function renderCartItems() {
    const cart = getCart();
    const cartItemsDiv = document.getElementById('cart-items');
    const cartSubtotalDiv = document.getElementById('cart-subtotal');
    if (!cartItemsDiv || !cartSubtotalDiv) return;

    cartItemsDiv.innerHTML = '';

    if (cart.length === 0) {
        cartItemsDiv.textContent = 'Your cart is empty.';
        cartSubtotalDiv.textContent = '';
        return;
    }

    let subtotal = 0;

    cart.forEach((item, index) => {
        // Create item display with product, size, quantity, price
        const itemDiv = document.createElement('div');
        const price = item.price || 0; // fallback if price not set
        const totalPrice = price * item.quantity;
        subtotal += totalPrice;

        itemDiv.innerHTML = `
            <p>${item.product} (${item.size}) x ${item.quantity} - $${totalPrice.toFixed(2)}</p>
            <button onclick="removeFromCart(${index})">Remove</button>
        `;

        cartItemsDiv.appendChild(itemDiv);
    });

    cartSubtotalDiv.textContent = `Subtotal: $${subtotal.toFixed(2)}`;
}

// Modify addItemToCart to include price
function addItemToCart({ product, size, quantity, price }) {
    let cart = getCart();
    let found = cart.find(item => item.product === product && item.size === size);
    if (found) {
        found.quantity += quantity;
    } else {
        cart.push({ product, size, quantity, price });
    }
    saveCart(cart);
    updateCartCount();
}

// Call renderCartItems on cart page load
document.addEventListener('DOMContentLoaded', () => {
    renderCartItems();
    updateCartCount();
});

document.getElementById('addToCartBtn').addEventListener('click', () => {
    const btn = document.getElementById('addToCartBtn');
    const product = btn.dataset.product;
    const price = parseFloat(btn.dataset.price);
    const size = document.querySelector('input[name="size"]:checked').value;
    const quantity = 1;

    addItemToCart({ product, size, quantity, price });
});
