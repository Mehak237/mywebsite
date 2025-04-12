import { db, collection, addDoc, getDocs, storage, ref, uploadBytes, getDownloadURL } from './firebase.js';

document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('product-form');
    const imagePreview = document.getElementById('image-preview');
    const productsList = document.getElementById('products-list');
    let selectedFile = null;
    
    // Preview image before upload
    document.getElementById('product-image').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            selectedFile = file;
            const reader = new FileReader();
            reader.onload = (event) => {
                imagePreview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Submit product form
    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('product-name').value;
        const price = document.getElementById('product-price').value;
        const category = document.getElementById('product-category').value;
        const description = document.getElementById('product-description').value;
        
        if (!selectedFile) {
            alert('Please upload an image');
            return;
        }
        
        try {
            // Upload image to Firebase Storage
            const storageRef = ref(storage, `products/${selectedFile.name}`);
            await uploadBytes(storageRef, selectedFile);
            const imageUrl = await getDownloadURL(storageRef);
            
            // Add product to Firestore
            await addDoc(collection(db, "products"), {
                name,
                price: Number(price),
                category,
                description,
                imageUrl,
                points: Math.floor(price / 10), // 1 point per ₹10
                sellerId: 'current-user-id' // Replace with actual user ID
            });
            
            alert('Product listed successfully!');
            productForm.reset();
            imagePreview.innerHTML = '';
            selectedFile = null;
            loadMyProducts();
        } catch (error) {
            console.error('Error:', error);
            alert('Error listing product');
        }
    });
    
    // Load seller's products
    async function loadMyProducts() {
        const querySnapshot = await getDocs(collection(db, "products"));
        productsList.innerHTML = '';
        
        querySnapshot.forEach((doc) => {
            const product = doc.data();
            // Only show products by current user (in a real app, you'd filter by user ID)
            if (product.sellerId === 'current-user-id') {
                const productItem = document.createElement('div');
                productItem.className = 'product-item';
                productItem.innerHTML = `
                    <img src="${product.imageUrl}" alt="${product.name}">
                    <h4>${product.name}</h4>
                    <p>₹${product.price}</p>
                    <p>${product.category}</p>
                `;
                productsList.appendChild(productItem);
            }
        });
    }
    
    // Initial load
    loadMyProducts();
});
