// app.js

import { initDB, addProduct, getProducts, addOrder, getOrders, updateOrder } from './db.js';

// DOM Elements
const navLinks = document.querySelectorAll('nav a');
const sections = document.querySelectorAll('main > section');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const addProductForm = document.getElementById('add-product-form');
const productList = document.getElementById('product-list');
const cartItems = document.getElementById('cart-items');
const placeOrderButton = document.getElementById('place-order');
const orderList = document.getElementById('order-list');

// State
let currentUser = null;
let products = [];
let cart = [];
let orders = [];

// Navigation
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').slice(1);
        sections.forEach(section => {
            section.classList.add('hidden');
        });
        document.getElementById(targetId).classList.remove('hidden');
    });
});

// User Authentication
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    try {
        // TODO: Implement actual authentication
        await simulateApiCall({ email, password });
        currentUser = { email: email, role: 'user' };
        updateUIForLoggedInUser();
        showNotification('Logged in successfully!');
    } catch (error) {
        showNotification('Login failed. Please try again.', 'error');
    }
});

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    try {
        // TODO: Implement actual registration
        await simulateApiCall({ name, email, password });
        currentUser = { email: email, role: 'user' };
        updateUIForLoggedInUser();
        showNotification('Registered successfully!');
    } catch (error) {
        showNotification('Registration failed. Please try again.', 'error');
    }
});

function updateUIForLoggedInUser() {
    document.getElementById('login').classList.add('hidden');
    document.getElementById('register').classList.add('hidden');
    document.getElementById('products').classList.remove('hidden');
    if (currentUser.role === 'admin') {
        document.getElementById('admin').classList.remove('hidden');
    }
}

// Product Management
addProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('product-name').value;
    const price = document.getElementById('product-price').value;
    const description = document.getElementById('product-description').value;
    try {
        const product = {
            id: Date.now(),
            name: name,
            price: parseFloat(price),
            description: description
        };
        await addProduct(product);
        products = await getProducts();
        renderProducts();
        showNotification('Product added successfully!');
        addProductForm.reset();
    } catch (error) {
        console.error('Error adding product:', error);
        showNotification('Failed to add product. Please try again.', 'error');
    }
});

function renderProducts() {
    productList.innerHTML = '';
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product-card', 'fade-in');
        productElement.innerHTML = `
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>$${product.price.toFixed(2)}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productList.appendChild(productElement);
    });
}

// Shopping Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        renderCart();
        showNotification('Product added to cart!');
    }
}

function renderCart() {
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item', 'fade-in');
        itemElement.innerHTML = `
            <h3>${item.name}</h3>
            <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
            <button onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartItems.appendChild(itemElement);
        total += item.price * item.quantity;
    });
    const totalElement = document.createElement('div');
    totalElement.innerHTML = `<strong>Total: $${total.toFixed(2)}</strong>`;
    cartItems.appendChild(totalElement);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    renderCart();
    showNotification('Product removed from cart.');
}

// Order Placement
// Order Placement
placeOrderButton.addEventListener('click', async () => {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    try {
        const order = {
            id: Date.now(),
            userId: currentUser.email,
            items: cart,
            total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
            status: 'Pending',
            date: new Date().toISOString()
        };
        await addOrder(order);
        orders = await getOrders();
        cart = [];
        renderCart();
        renderOrders();
        showNotification('Order placed successfully!');
        saveOrderDetails(order);
    } catch (error) {
        console.error('Error placing order:', error);
        showNotification('Failed to place order. Please try again.', 'error');
    }
});

// Admin Order Management
function renderOrders() {
    if (currentUser.role !== 'admin') return;
    orderList.innerHTML = '';
    orders.forEach(order => {
        const orderElement = document.createElement('div');
        orderElement.classList.add('order-item', 'fade-in');
        orderElement.innerHTML = `
            <h3>Order #${order.id}</h3>
            <p>User: ${order.userId}</p>
            <p>Total: $${order.total.toFixed(2)}</p>
            <p>Status: ${order.status}</p>
            <button onclick="updateOrderStatus(${order.id})">Update Status</button>
        `;
        orderList.appendChild(orderElement);
    });
}

async function updateOrderStatus(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        try {
            order.status = order.status === 'Pending' ? 'Completed' : 'Pending';
            await updateOrder(order);
            orders = await getOrders();
            renderOrders();
            showNotification('Order status updated successfully!');
        } catch (error) {
            console.error('Error updating order status:', error);
            showNotification('Failed to update order status. Please try again.', 'error');
        }
    }
}

// Utility Functions
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function saveOrderDetails(order) {
    // Implement order saving logic here
    console.log('Order saved:', order);
}

function simulateApiCall(data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(data);
        }, 500);
    });
}

function log(message, data) {
    console.log(`${new Date().toISOString()} - ${message}`, data);
}

// Initialize the application
async function init() {
    try {
        await initDB();
        products = await getProducts();
        if (products.length === 0) {
            // Add initial products if the database is empty
            await addProduct({ id: Date.now(), name: 'cheif special pizza', price: 70.50, description: 'A selection of our finest appetizers' });
            await addProduct({ id: Date.now() + 1, name: 'Vegetarian thali', price: 60.40, description: 'Assortment of gourmet vegetarian dishes' });
            await addProduct({ id: Date.now() + 2, name: 'Pron lababdar', price: 129.30, description: 'A variety of premium seafood dishes' });
            await addProduct({ id: Date.now() + 3, name: 'Rasmalai', price: 49.20, description: 'An array of delightful desserts' });
            products = await getProducts();
        }
        renderProducts();
        orders = await getOrders();
        renderOrders();
        log('Application initialized', {});
    } catch (error) {
        console.error('Initialization error:', error);
        showNotification('Failed to initialize the application. Please refresh the page.', 'error');
    }
}

init();

// Make functions available globally for onclick events
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateOrderStatus = updateOrderStatus;