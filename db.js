// db.js

let db;

const dbName = 'CateringSystem';
const dbVersion = 1;

const initDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, dbVersion);

        request.onerror = (event) => {
            console.error('IndexedDB error:', event.target.error);
            reject('IndexedDB error');
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            console.log('IndexedDB opened successfully');
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            db = event.target.result;
            
            // Create object stores
            if (!db.objectStoreNames.contains('products')) {
                db.createObjectStore('products', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('orders')) {
                db.createObjectStore('orders', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('users')) {
                db.createObjectStore('users', { keyPath: 'email' });
            }
        };
    });
};

const addProduct = (product) => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['products'], 'readwrite');
        const store = transaction.objectStore('products');
        const request = store.add(product);

        request.onerror = (event) => {
            console.error('Error adding product:', event.target.error);
            reject('Error adding product');
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
    });
};

const getProducts = () => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['products'], 'readonly');
        const store = transaction.objectStore('products');
        const request = store.getAll();

        request.onerror = (event) => {
            console.error('Error getting products:', event.target.error);
            reject('Error getting products');
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
    });
};

const addOrder = (order) => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['orders'], 'readwrite');
        const store = transaction.objectStore('orders');
        const request = store.add(order);

        request.onerror = (event) => {
            console.error('Error adding order:', event.target.error);
            reject('Error adding order');
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
    });
};

const getOrders = () => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['orders'], 'readonly');
        const store = transaction.objectStore('orders');
        const request = store.getAll();

        request.onerror = (event) => {
            console.error('Error getting orders:', event.target.error);
            reject('Error getting orders');
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
    });
};



const updateProduct = (product) => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['products'], 'readwrite');
        const store = transaction.objectStore('products');
        const request = store.put(product);

        request.onerror = (event) => {
            console.error('Error updating product:', event.target.error);
            reject('Error updating product');
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
    });
};

const deleteProduct = (productId) => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['products'], 'readwrite');
        const store = transaction.objectStore('products');
        const request = store.delete(productId);

        request.onerror = (event) => {
            console.error('Error deleting product:', event.target.error);
            reject('Error deleting product');
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
    });
};

const updateOrder = (order) => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['orders'], 'readwrite');
        const store = transaction.objectStore('orders');
        const request = store.put(order);

        request.onerror = (event) => {
            console.error('Error updating order:', event.target.error);
            reject('Error updating order');
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
    });
};

const deleteOrder = (orderId) => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['orders'], 'readwrite');
        const store = transaction.objectStore('orders');
        const request = store.delete(orderId);

        request.onerror = (event) => {
            console.error('Error deleting order:', event.target.error);
            reject('Error deleting order');
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
    });
};

export { initDB, addProduct, getProducts, addOrder, getOrders, updateProduct, deleteProduct, updateOrder, deleteOrder };