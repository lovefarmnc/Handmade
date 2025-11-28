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

// Render cart items (for cart.html)
function renderCartItems() {
    const cart = getCart();
    const cartItemsDiv = document.getElementById('cart-items');
    if (!cartItemsDiv) return;
    cartItemsDiv.innerHTML = '';
    if (cart.length === 0) {
        cartItemsDiv.textContent = 'Cart is empty.';
    } else {
        cart.forEach((item, idx) => {
            let div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                ${item.quantity} x ${item.product} (${item.size})
                <button onclick="removeFromCart(${idx})">Remove</button>
            `;
            cartItemsDiv.appendChild(div);
        });
    }
    // Show summary
    const summary = document.getElementById('cart-summary');
    if (summary) {
        summary.textContent = `Total items: ${cart.reduce((sum, item) => sum + item.quantity, 0)}`;
    }
}
document.getElementById('addToCartBtn').addEventListener('click', () => {
    const product = document.getElementById('addToCartBtn').dataset.product;
    const size = document.querySelector('input[name="size"]:checked').value;
    const quantity = 1;

    addItemToCart({ product, size, quantity });
});
