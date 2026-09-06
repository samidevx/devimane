import { adminState } from './admin/admin_state.js';

export const adminUtils = {
    // Read from adminState (which checks localStorage first, then bundled products.json)
    getProducts: () => {
        return adminState.getProducts();
    },

    // Add or Update a product with instant persistence
    upsertProduct: (product) => {
        return adminState.upsertProduct(product);
    },

    // Delete a product with instant persistence
    deleteProduct: (id) => {
        return adminState.deleteProduct(id);
    },

    // Export current products as a downloadable products.json
    exportJSON: () => {
        return adminState.exportJSON();
    },

    // Fetch orders (reads from adminState)
    fetchOrders: async () => {
        return adminState.getOrders();
    }
};
