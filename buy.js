import { db, collection, getDocs } from './firebase.js';

document.addEventListener('DOMContentLoaded', () => {
    const productsContainer = document.getElementById('products-container');
    const cartCount = document.getElementById('cart-count');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Update cart count
    cartCount.textContent = cart.length;
    
    // Load products from Firebase
    async function loadProducts() {
        const querySnapshot = await getDocs(collection(db, "products"));
        productsContainer.innerHTML = '';
        
        querySnapshot.forEach((doc) => {
            const product = doc.data();
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product.imageUrl}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-price">₹${product.price}</p>
                    <p class="product-points">Earn ${product.points} Eco-Points</p>
                    <button class="add-to-cart" data-id="${doc.id}">Add to Cart</button>
                </div>
            `;
            productsContainer.appendChild(productCard);
        });
        
        // Add event listeners to all "Add to Cart" buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', addToCart);
        });
    }
    
    // Add product to cart
    function addToCart(e) {
        const productId = e.target.getAttribute('data-id');
        cart.push(productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        cartCount.textContent = cart.length;
        alert('Product added to cart!');
    }
    
    // Filter products
    document.getElementById('category-filter').addEventListener('change', (e) => {
        // Implement filtering logic here
        console.log('Filter by:', e.target.value);
    });
    
    // Initial load
    loadProducts();
});
