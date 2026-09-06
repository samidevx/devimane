import { initAdminApp } from './admin_app.js';

export const renderAdminApp = (navigateFn) => {
    const app = document.getElementById('app');
    let root = document.getElementById('admin-root');
    if (!root) {
        app.innerHTML = '<div id="admin-root"></div>';
    }
    initAdminApp();
};
