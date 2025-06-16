// Initialize cart count
let cartCount = 0;

// Function to update the cart count
function updateCartCount() {
    document.getElementById('cart-count').textContent = cartCount;
}

// Example function to add an item to the cart
function addItemToCart() {
    cartCount++;
    updateCartCount();
}

// Initial update
updateCartCount();

// You can call addItemToCart() whenever an item is added to the cart