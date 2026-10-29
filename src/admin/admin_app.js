import './admin.css';
import { adminUtils } from '../admin_utils.js';

// Helper to determine boolean / yes state
const isYesVal = (val, defaultVal = false) => {
    if (val === undefined || val === null || val === '') return defaultVal;
    const s = String(val).trim().toLowerCase();
    return s === 'yes' || s === 'true' || s === '1' || s === 'on';
};

// Toast notification helper
const showToast = (message, type = 'success') => {
    const existing = document.querySelector('.adm-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `adm-toast ${type}`;
    toast.innerHTML = `<i class="fa ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i> <span>${message}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
};

// Generates slug from title
const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

export const adminApp = {
    // Main render method
    render: (navigate) => {
        const app = document.getElementById('app');
        const path = window.location.pathname;

        const orders = JSON.parse(localStorage.getItem('captured_orders') || sessionStorage.getItem('captured_orders') || '[]');
        const ordersCount = orders.length;

        const isProductsActive = path.startsWith('/admin/products') || path === '/admin';
        const isOrdersActive = path === '/admin/orders';
        const isDashboardActive = path === '/admin/dashboard';
        const isCODActive = path === '/admin/cod';

        const ghCfg = adminUtils.getGitHubConfig();

        app.innerHTML = `
            <div class="adm-layout">
                <!-- SIDEBAR (IMAGE 1) -->
                <aside class="adm-sidebar">
                    <div class="adm-brand">
                        <div class="adm-brand-logo">
                            <i class="fa fa-layer-group"></i>
                        </div>
                        <div class="adm-brand-info">
                            <span class="adm-brand-title">X10 Shopping</span>
                            <span class="adm-brand-subtitle">STORE ADMIN</span>
                        </div>
                    </div>

                    <div class="adm-nav-container">
                        <!-- GENERAL SECTION -->
                        <div class="adm-nav-section">
                            <div class="adm-nav-section-title">General</div>
                            <ul class="adm-nav-list">
                                <li>
                                    <a class="adm-nav-link ${isDashboardActive ? 'active' : ''}" data-route="/admin/dashboard">
                                        <i class="fa fa-chart-pie nav-icon"></i>
                                        <span>Dashboard</span>
                                    </a>
                                </li>
                                <li>
                                    <a class="adm-nav-link ${isOrdersActive ? 'active' : ''}" data-route="/admin/orders">
                                        <i class="fa fa-bag-shopping nav-icon"></i>
                                        <span>Orders</span>
                                        <span class="adm-nav-badge">${ordersCount > 0 ? ordersCount : '414'}</span>
                                        <i class="fa fa-chevron-right adm-nav-arrow"></i>
                                    </a>
                                </li>
                                <li>
                                    <a class="adm-nav-link ${isCODActive ? 'active' : ''}" data-route="/admin/cod">
                                        <i class="fa fa-earth-africa nav-icon"></i>
                                        <span>COD in Africa</span>
                                        <span class="adm-nav-badge blue">COD</span>
                                        <i class="fa fa-chevron-right adm-nav-arrow"></i>
                                    </a>
                                </li>
                                <li>
                                    <a class="adm-nav-link" data-route="/admin/profit">
                                        <i class="fa fa-hand-holding-dollar nav-icon"></i>
                                        <span>Profit & Marges</span>
                                        <i class="fa fa-chevron-right adm-nav-arrow"></i>
                                    </a>
                                </li>
                                <li>
                                    <a class="adm-nav-link" data-route="/admin/customers">
                                        <i class="fa fa-users nav-icon"></i>
                                        <span>Customers</span>
                                    </a>
                                </li>
                                <li>
                                    <a class="adm-nav-link" data-route="/admin/reviews">
                                        <i class="fa fa-star nav-icon"></i>
                                        <span>Reviews</span>
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <!-- INVENTORY SECTION -->
                        <div class="adm-nav-section">
                            <div class="adm-nav-section-title">Inventory</div>
                            <ul class="adm-nav-list">
                                <li>
                                    <a class="adm-nav-link ${isProductsActive ? 'active' : ''}" data-route="/admin/products">
                                        <i class="fa fa-cubes nav-icon"></i>
                                        <span>Products</span>
                                        <i class="fa fa-chevron-right adm-nav-arrow"></i>
                                    </a>
                                </li>
                                <li>
                                    <a class="adm-nav-link" data-route="/admin/delivery">
                                        <i class="fa fa-truck nav-icon"></i>
                                        <span>Delivery</span>
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <!-- SYSTEM SECTION -->
                        <div class="adm-nav-section">
                            <div class="adm-nav-section-title">System</div>
                            <ul class="adm-nav-list">
                                <li>
                                    <a class="adm-nav-link" data-route="/admin/team">
                                        <i class="fa fa-user-gear nav-icon"></i>
                                        <span>Team</span>
                                    </a>
                                </li>
                                <li>
                                    <a class="adm-nav-link" data-route="/admin/ai">
                                        <i class="fa fa-wand-magic-sparkles nav-icon"></i>
                                        <span>AI Agents</span>
                                    </a>
                                </li>
                                <li>
                                    <a class="adm-nav-link" data-route="/admin/api">
                                        <i class="fa fa-code nav-icon"></i>
                                        <span>API Reference</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <!-- SIDEBAR FOOTER -->
                    <div class="adm-sidebar-footer">
                        <button class="adm-settings-pill" id="admSettingsBtn" title="GitHub & Store Settings">
                            <i class="fa-brands fa-github"></i>
                            <span>GitHub Sync</span>
                        </button>

                        <div class="adm-user-card">
                            <div class="adm-user-avatar">AD</div>
                            <div class="adm-user-details">
                                <span class="adm-user-name">Admin</span>
                                <span class="adm-user-role">Administrator</span>
                            </div>
                            <div class="adm-user-actions">
                                <a href="/" target="_blank" class="adm-icon-btn" title="View Storefront">
                                    <i class="fa fa-globe"></i>
                                </a>
                                <button class="adm-icon-btn" id="admLogoutBtn" title="Logout">
                                    <i class="fa fa-arrow-right-from-bracket"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>

                <!-- MAIN WORKSPACE -->
                <main class="adm-main" id="admMain">
                    ${adminApp.renderCurrentView(path, navigate)}
                </main>
            </div>
        `;

        adminApp.bindSidebarEvents(navigate);
        adminApp.bindViewEvents(path, navigate);
    },

    // Resolves and renders the sub-view
    renderCurrentView: (path, navigate) => {
        if (path === '/admin/products/new') {
            return adminApp.renderProductForm(null);
        }
        if (path.startsWith('/admin/products/edit/')) {
            const id = path.replace('/admin/products/edit/', '').replace(/\/$/, '');
            const product = adminUtils.getProduct(id);
            return adminApp.renderProductForm(product);
        }
        if (path === '/admin/orders') {
            return adminApp.renderOrdersView();
        }
        if (path === '/admin/dashboard') {
            return adminApp.renderDashboardView();
        }
        if (path === '/admin/cod') {
            return adminApp.renderCODView();
        }
        // Default to products list (Image 1)
        return adminApp.renderProductsList();
    },

    // =========================================================================
    // 1. PRODUCTS LIST VIEW (MATCHING IMAGE 1)
    // =========================================================================
    renderProductsList: () => {
        const products = adminUtils.getProducts();
        const ghCfg = adminUtils.getGitHubConfig();

        return `
            <!-- Top Header Row -->
            <div class="adm-header-row">
                <div class="adm-title-group">
                    <div style="display:flex; align-items:center; gap:12px; margin-bottom:4px;">
                        <h1 style="margin:0;">Products</h1>
                        <a href="https://github.com/${ghCfg.repo}/blob/main/src/data/products.json" target="_blank" class="adm-badge adm-badge-orders" style="text-decoration:none; gap:6px;" title="Voir src/data/products.json sur GitHub">
                            <i class="fa-brands fa-github"></i>
                            <span>GitHub: ${ghCfg.repo}</span>
                        </a>
                    </div>
                    <p>Manage store inventory, catalog items, pricing, and stock levels.</p>
                </div>
                <div class="adm-actions-group">
                    <button class="adm-icon-btn" style="background:#1a2234; border:1px solid #232f48; padding:9px 12px; border-radius:8px;" id="btnQuickSettings" title="GitHub & Store Settings">
                        <i class="fa fa-gear"></i>
                    </button>
                    <button class="adm-btn adm-btn-secondary" id="btnImportJSON">
                        <i class="fa fa-file-import"></i>
                        <span>Import JSON</span>
                    </button>
                    <button class="adm-btn adm-btn-purple" id="btnAddProduct">
                        <i class="fa fa-plus"></i>
                        <span>Add Product</span>
                    </button>
                </div>
            </div>

            <!-- Toolbar (All Products & Search + Export JSON) -->
            <div class="adm-toolbar">
                <div class="adm-toolbar-left">
                    <div class="adm-all-tab">
                        <i class="fa fa-cubes"></i>
                        <span>All Products</span>
                        <span style="background:rgba(124,58,237,0.2); color:#c4b5fd; font-size:11px; padding:2px 8px; border-radius:10px;">${products.length}</span>
                    </div>
                    <div class="adm-search-box">
                        <i class="fa fa-magnifying-glass"></i>
                        <input type="text" class="adm-search-input" id="admProductSearch" placeholder="Search products..." />
                    </div>
                </div>
                <div class="adm-toolbar-right" style="display:flex; gap:10px;">
                    <button class="adm-btn adm-btn-secondary" id="btnPushGitHubNow" title="Pousser immédiatement tout le catalogue sur GitHub">
                        <i class="fa-brands fa-github"></i>
                        <span>Push to GitHub</span>
                    </button>
                    <button class="adm-btn adm-btn-green" id="btnExportJSON">
                        <i class="fa fa-download"></i>
                        <span>Export JSON</span>
                    </button>
                </div>
            </div>

            <!-- Products Table -->
            <div class="adm-table-card">
                <table class="adm-table" id="admTable">
                    <thead>
                        <tr>
                            <th style="width: 70px;">Image</th>
                            <th>Title</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Home Page</th>
                            <th>Orders</th>
                            <th>Code</th>
                            <th style="text-align: right; width: 150px;">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="admTableBody">
                        ${adminApp.renderTableRows(products)}
                    </tbody>
                </table>
            </div>
        `;
    },

    // Generates table rows
    renderTableRows: (products) => {
        if (!products || products.length === 0) {
            return `
                <tr>
                    <td colspan="8" style="text-align:center; padding: 48px; color: var(--adm-text-dim);">
                        <i class="fa fa-box-open" style="font-size: 36px; margin-bottom: 12px; display: block; opacity: 0.5;"></i>
                        <p style="margin: 0; font-size: 14px;">No products found.</p>
                    </td>
                </tr>
            `;
        }

        return products.map(p => {
            const isVisible = p.homePage === 'yes' || p.displayHomePage === 'yes' || p.homePage === true || p.displayHomePage === true || (p.homePage === undefined && p.displayHomePage === undefined);
            const currency = p.currency || 'FCFA';
            const priceFormatted = Number(p.price || 0).toLocaleString();
            const oldPriceFormatted = p.priceOld ? Number(p.priceOld).toLocaleString() : null;
            const fallbackImg = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=60';
            const imgUrl = p.featuredImage || fallbackImg;
            const ordersMock = p.ordersCount ?? (Math.floor(p.price % 37) + 3);
            const sku = p.code || `COD${String(p.id).slice(0, 6).toUpperCase()}`;

            return `
                <tr data-id="${p.id}">
                    <td>
                        <img src="${imgUrl}" alt="${p.title}" class="adm-prod-img" onerror="this.src='${fallbackImg}'" />
                    </td>
                    <td>
                        <div class="adm-prod-title" title="${p.title}">
                            ${p.title || 'Untitled Product'}
                        </div>
                    </td>
                    <td>
                        <div class="adm-prod-price">${priceFormatted} ${currency}</div>
                        ${oldPriceFormatted ? `<div class="adm-prod-price-old">${oldPriceFormatted}</div>` : ''}
                    </td>
                    <td>
                        <span style="font-weight: 700; color: #fff;">${p.stock ?? 25}</span>
                    </td>
                    <td>
                        <span class="adm-badge ${isVisible ? 'adm-badge-visible' : 'adm-badge-hidden'} btn-toggle-home" data-id="${p.id}" title="Click to toggle visibility on storefront & auto-push to GitHub">
                            <i class="fa ${isVisible ? 'fa-eye' : 'fa-eye-slash'}"></i>
                            <span>${isVisible ? 'Visible' : 'Hidden'}</span>
                        </span>
                    </td>
                    <td>
                        <span class="adm-badge adm-badge-orders">
                            <i class="fa fa-bag-shopping"></i>
                            <span>${ordersMock} orders</span>
                        </span>
                    </td>
                    <td>
                        <span class="adm-sku-code">${sku}</span>
                    </td>
                    <td>
                        <div class="adm-actions-cell" style="justify-content: flex-end;">
                            <a href="/product/${p.id}" target="_blank" class="adm-action-btn" title="View Storefront Page">
                                <i class="fa fa-eye"></i>
                            </a>
                            <button class="adm-action-btn btn-edit-prod" data-id="${p.id}" title="Edit Product">
                                <i class="fa fa-pen"></i>
                            </button>
                            <button class="adm-action-btn btn-duplicate-prod" data-id="${p.id}" title="Duplicate Product">
                                <i class="fa fa-copy"></i>
                            </button>
                            <button class="adm-action-btn delete btn-delete-prod" data-id="${p.id}" title="Delete Product">
                                <i class="fa fa-trash-can"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    },

    // =========================================================================
    // 2. PRODUCT CREATE / EDIT FORM (MATCHING IMAGE 2 & 3)
    // =========================================================================
    renderProductForm: (p = null) => {
        const isEdit = !!p;
        const currency = p?.currency || 'FCFA';

        // Toggles resolution
        const isVisibleHome = isYesVal(p?.homePage ?? p?.displayHomePage, true);
        const isReviews = isYesVal(p?.reviewsSection ?? (p?.reviews ? 'yes' : 'yes'), true);
        const isBundle = isYesVal(p?.bundle, true);
        const isCountdown = isYesVal(p?.countdown, false);
        const isLanding = isYesVal(p?.isLandingPage, false);
        const isDarkMode = isYesVal(p?.modeBlack, false);
        const isQuantity = isYesVal(p?.showQuantity, false);
        const isAnimatedCTA = isYesVal(p?.animated, false);
        const isOrderSummary = isYesVal(p?.resume, true);
        const isExitPopup = isYesVal(p?.remisePopup, false);

        // Offers list
        const offers = p?.offres && Array.isArray(p.offres) && p.offres.length > 0 ? p.offres : [
            { qty: 1, price: p?.price || 12000, oldPrice: p?.priceOld || 19000, title: '1 Exemplaire (Offre Découverte)' },
            { qty: 2, price: Math.round((p?.price || 12000) * 1.8), oldPrice: Math.round((p?.priceOld || 19000) * 2), title: '2 Exemplaires (Offre Duo)' },
            { qty: 3, price: Math.round((p?.price || 12000) * 2.5), oldPrice: Math.round((p?.priceOld || 19000) * 3), title: '3 Exemplaires (Offre Famille)' }
        ];

        // Gallery lines
        const galleryLines = (p?.gallery || []).join('\n');

        return `
            <!-- Form Header Row -->
            <div class="adm-header-row">
                <div class="adm-title-group">
                    <div style="display:flex; align-items:center; gap:12px;">
                        <h1 style="margin:0;">${isEdit ? 'Edit Product' : 'Add Product'}</h1>
                        <span class="adm-badge adm-badge-orders"><i class="fa-brands fa-github"></i> Auto GitHub Sync</span>
                    </div>
                </div>
                <div class="adm-actions-group">
                    ${isEdit ? `
                        <button class="adm-btn adm-btn-secondary" id="formDuplicateBtn" data-id="${p.id}">
                            <i class="fa fa-copy"></i>
                            <span>Duplicate</span>
                        </button>
                    ` : ''}
                    <button class="adm-btn adm-btn-secondary" id="formBackBtn">
                        <i class="fa fa-arrow-left"></i>
                        <span>Back</span>
                    </button>
                </div>
            </div>

            <!-- Form Container (Image 2 & 3) -->
            <div class="adm-form-card">
                <form id="admProductForm">
                    <!-- Core 2-Column Fields Grid (Image 2) -->
                    <div class="adm-form-grid">
                        <div class="adm-field-group">
                            <label class="adm-label">ID (SLUG) <span class="req">*</span></label>
                            <input type="text" class="adm-input" id="inp-id" required value="${p?.id || ''}" placeholder="e.g. luxevue" ${isEdit ? 'readonly style="opacity:0.75; cursor:not-allowed;"' : ''} />
                        </div>
                        <div class="adm-field-group">
                            <label class="adm-label">TITLE <span class="req">*</span></label>
                            <input type="text" class="adm-input" id="inp-title" required value="${p?.title || ''}" placeholder="e.g. LuxeVue™ — Lunettes Premium Anti-Lumière Bleue" />
                        </div>

                        <div class="adm-field-group">
                            <label class="adm-label">PRICE <span class="req">*</span></label>
                            <input type="number" class="adm-input" id="inp-price" required value="${p?.price || ''}" placeholder="12000" />
                        </div>
                        <div class="adm-field-group">
                            <label class="adm-label">OLD PRICE</label>
                            <input type="number" class="adm-input" id="inp-priceOld" value="${p?.priceOld || ''}" placeholder="19000" />
                        </div>

                        <div class="adm-field-group">
                            <label class="adm-label">COST PRICE (COÛT D'ACHAT)</label>
                            <input type="number" class="adm-input" id="inp-costPrice" value="${p?.costPrice || ''}" placeholder="e.g. 4500" />
                        </div>
                        <div class="adm-field-group">
                            <label class="adm-label">SHIPPING COST (FRAIS LIVRAISON)</label>
                            <input type="number" class="adm-input" id="inp-shippingCost" value="${p?.shippingCost || ''}" placeholder="e.g. 1500" />
                        </div>

                        <div class="adm-field-group">
                            <label class="adm-label">CURRENCY</label>
                            <input type="text" class="adm-input" id="inp-currency" value="${currency}" placeholder="FCFA" />
                        </div>
                        <div class="adm-field-group">
                            <label class="adm-label">STOCK</label>
                            <input type="number" class="adm-input" id="inp-stock" value="${p?.stock ?? 25}" placeholder="25" />
                        </div>

                        <div class="adm-field-group">
                            <label class="adm-label">SKU CODE</label>
                            <input type="text" class="adm-input" id="inp-code" value="${p?.code || ''}" placeholder="COD10105" />
                        </div>
                        <div class="adm-field-group">
                            <label class="adm-label">WHATSAPP</label>
                            <input type="text" class="adm-input" id="inp-whatsapp" value="${p?.whatsapp || '2250701825463'}" placeholder="2250701825463" />
                        </div>

                        <div class="adm-field-group">
                            <label class="adm-label">COUNTRIES (COMMA)</label>
                            <input type="text" class="adm-input" id="inp-pays" value="${p?.pays || 'CI'}" placeholder="CI, SN, BF" />
                        </div>
                        <div class="adm-field-group">
                            <label class="adm-label">REVIEWS COUNT</label>
                            <input type="text" class="adm-input" id="inp-reviews" value="${p?.reviews || '329'}" placeholder="329" />
                        </div>

                        <div class="adm-field-group">
                            <label class="adm-label">COLORS (COMMA)</label>
                            <input type="text" class="adm-input" id="inp-couleur" value="${p?.couleur || ''}" placeholder="Noir, Blanc, Bleu" />
                        </div>
                        <div class="adm-field-group">
                            <label class="adm-label">SIZES (COMMA)</label>
                            <input type="text" class="adm-input" id="inp-taille" value="${p?.taille || ''}" placeholder="S, M, L, XL" />
                        </div>
                    </div>

                    <!-- ========================================================
                         DISPLAY & FEATURE TOGGLES (IMAGE 2 & 3)
                         ======================================================== -->
                    <div class="adm-section-header">
                        <div class="adm-section-header-title">
                            <i class="fa fa-sliders"></i>
                            <span>Display & Feature Toggles</span>
                        </div>
                        <div class="adm-section-header-desc">
                            Configure product visibility, interactive elements, and conversion modules with instant toggle buttons
                        </div>
                    </div>

                    <div class="adm-toggles-grid">
                        <!-- Toggle 1: Display on Home Page? -->
                        <div class="adm-toggle-card toggle-card" data-key="homePage">
                            <div class="adm-toggle-left">
                                <div class="adm-toggle-icon"><i class="fa fa-house"></i></div>
                                <div class="adm-toggle-info">
                                    <span class="adm-toggle-title">Display on Home Page?</span>
                                    <span class="adm-toggle-sub">Show this product in the homepage storefront catalogue</span>
                                </div>
                            </div>
                            <div class="adm-switch ${isVisibleHome ? 'is-on' : ''}">
                                <span class="adm-switch-label">${isVisibleHome ? 'YES' : 'NO'}</span>
                                <div class="adm-switch-knob"></div>
                            </div>
                            <input type="hidden" id="toggle-homePage" value="${isVisibleHome ? 'yes' : 'no'}" />
                        </div>

                        <!-- Toggle 2: Reviews Section? -->
                        <div class="adm-toggle-card toggle-card" data-key="reviewsSection">
                            <div class="adm-toggle-left">
                                <div class="adm-toggle-icon"><i class="fa fa-comment-dots"></i></div>
                                <div class="adm-toggle-info">
                                    <span class="adm-toggle-title">Reviews Section?</span>
                                    <span class="adm-toggle-sub">Display customer ratings, reviews, and testimonials on the product page</span>
                                </div>
                            </div>
                            <div class="adm-switch ${isReviews ? 'is-on' : ''}">
                                <span class="adm-switch-label">${isReviews ? 'YES' : 'NO'}</span>
                                <div class="adm-switch-knob"></div>
                            </div>
                            <input type="hidden" id="toggle-reviewsSection" value="${isReviews ? 'yes' : 'no'}" />
                        </div>

                        <!-- Toggle 3: Bundle Offers? -->
                        <div class="adm-toggle-card toggle-card" data-key="bundle">
                            <div class="adm-toggle-left">
                                <div class="adm-toggle-icon"><i class="fa fa-gifts"></i></div>
                                <div class="adm-toggle-info">
                                    <span class="adm-toggle-title">Bundle Offers?</span>
                                    <span class="adm-toggle-sub">Enable multi-pack bundle packages selection</span>
                                </div>
                            </div>
                            <div class="adm-switch ${isBundle ? 'is-on' : ''}">
                                <span class="adm-switch-label">${isBundle ? 'YES' : 'NO'}</span>
                                <div class="adm-switch-knob"></div>
                            </div>
                            <input type="hidden" id="toggle-bundle" value="${isBundle ? 'yes' : 'no'}" />
                        </div>

                        <!-- Toggle 4: Countdown Timer? -->
                        <div class="adm-toggle-card toggle-card" data-key="countdown">
                            <div class="adm-toggle-left">
                                <div class="adm-toggle-icon"><i class="fa fa-stopwatch"></i></div>
                                <div class="adm-toggle-info">
                                    <span class="adm-toggle-title">Countdown Timer?</span>
                                    <span class="adm-toggle-sub">Show an urgency countdown timer bar on the product page</span>
                                </div>
                            </div>
                            <div class="adm-switch ${isCountdown ? 'is-on' : ''}">
                                <span class="adm-switch-label">${isCountdown ? 'YES' : 'NO'}</span>
                                <div class="adm-switch-knob"></div>
                            </div>
                            <input type="hidden" id="toggle-countdown" value="${isCountdown ? 'yes' : 'no'}" />
                        </div>

                        <!-- Toggle 5: Landing Page Mode? -->
                        <div class="adm-toggle-card toggle-card" data-key="isLandingPage">
                            <div class="adm-toggle-left">
                                <div class="adm-toggle-icon"><i class="fa fa-rocket"></i></div>
                                <div class="adm-toggle-info">
                                    <span class="adm-toggle-title">Landing Page Mode?</span>
                                    <span class="adm-toggle-sub">Focus mode without store headers or external distractions</span>
                                </div>
                            </div>
                            <div class="adm-switch ${isLanding ? 'is-on' : ''}">
                                <span class="adm-switch-label">${isLanding ? 'YES' : 'NO'}</span>
                                <div class="adm-switch-knob"></div>
                            </div>
                            <input type="hidden" id="toggle-isLandingPage" value="${isLanding ? 'yes' : 'no'}" />
                        </div>

                        <!-- Toggle 6: Dark Mode Theme? -->
                        <div class="adm-toggle-card toggle-card" data-key="modeBlack">
                            <div class="adm-toggle-left">
                                <div class="adm-toggle-icon"><i class="fa fa-moon"></i></div>
                                <div class="adm-toggle-info">
                                    <span class="adm-toggle-title">Dark Mode Theme?</span>
                                    <span class="adm-toggle-sub">Enable sleek dark mode styling for this product</span>
                                </div>
                            </div>
                            <div class="adm-switch ${isDarkMode ? 'is-on' : ''}">
                                <span class="adm-switch-label">${isDarkMode ? 'YES' : 'NO'}</span>
                                <div class="adm-switch-knob"></div>
                            </div>
                            <input type="hidden" id="toggle-modeBlack" value="${isDarkMode ? 'yes' : 'no'}" />
                        </div>

                        <!-- Toggle 7: Show Quantity Selector? (Image 3) -->
                        <div class="adm-toggle-card toggle-card" data-key="showQuantity">
                            <div class="adm-toggle-left">
                                <div class="adm-toggle-icon"><i class="fa fa-arrows-up-down"></i></div>
                                <div class="adm-toggle-info">
                                    <span class="adm-toggle-title">Show Quantity Selector?</span>
                                    <span class="adm-toggle-sub">Allow customer to increase/decrease quantity directly</span>
                                </div>
                            </div>
                            <div class="adm-switch ${isQuantity ? 'is-on' : ''}">
                                <span class="adm-switch-label">${isQuantity ? 'YES' : 'NO'}</span>
                                <div class="adm-switch-knob"></div>
                            </div>
                            <input type="hidden" id="toggle-showQuantity" value="${isQuantity ? 'yes' : 'no'}" />
                        </div>

                        <!-- Toggle 8: Animated CTA Button? (Image 3) -->
                        <div class="adm-toggle-card toggle-card" data-key="animated">
                            <div class="adm-toggle-left">
                                <div class="adm-toggle-icon"><i class="fa fa-wand-magic-sparkles"></i></div>
                                <div class="adm-toggle-info">
                                    <span class="adm-toggle-title">Animated CTA Button?</span>
                                    <span class="adm-toggle-sub">Add vibrant pulse motion to the order button</span>
                                </div>
                            </div>
                            <div class="adm-switch ${isAnimatedCTA ? 'is-on' : ''}">
                                <span class="adm-switch-label">${isAnimatedCTA ? 'YES' : 'NO'}</span>
                                <div class="adm-switch-knob"></div>
                            </div>
                            <input type="hidden" id="toggle-animated" value="${isAnimatedCTA ? 'yes' : 'no'}" />
                        </div>

                        <!-- Toggle 9: Order Summary Box? (Résumé) (Image 3) -->
                        <div class="adm-toggle-card toggle-card" data-key="resume">
                            <div class="adm-toggle-left">
                                <div class="adm-toggle-icon"><i class="fa fa-file-invoice"></i></div>
                                <div class="adm-toggle-info">
                                    <span class="adm-toggle-title">Order Summary Box? (Résumé)</span>
                                    <span class="adm-toggle-sub">Show or hide the order summary breakdown on checkout</span>
                                </div>
                            </div>
                            <div class="adm-switch ${isOrderSummary ? 'is-on' : ''}">
                                <span class="adm-switch-label">${isOrderSummary ? 'YES' : 'NO'}</span>
                                <div class="adm-switch-knob"></div>
                            </div>
                            <input type="hidden" id="toggle-resume" value="${isOrderSummary ? 'true' : 'false'}" />
                        </div>

                        <!-- Toggle 10: Exit Intent Popup Discount? (Image 3) -->
                        <div class="adm-toggle-card toggle-card" data-key="remisePopup">
                            <div class="adm-toggle-left">
                                <div class="adm-toggle-icon"><i class="fa fa-tags"></i></div>
                                <div class="adm-toggle-info">
                                    <span class="adm-toggle-title">Exit Intent Popup Discount?</span>
                                    <span class="adm-toggle-sub">Display an exit-intent discount popup when customer leaves</span>
                                </div>
                            </div>
                            <div class="adm-switch ${isExitPopup ? 'is-on' : ''}">
                                <span class="adm-switch-label">${isExitPopup ? 'YES' : 'NO'}</span>
                                <div class="adm-switch-knob"></div>
                            </div>
                            <input type="hidden" id="toggle-remisePopup" value="${isExitPopup ? 'YES, 10' : 'no'}" />
                        </div>
                    </div>

                    <!-- ========================================================
                         MEDIA (IMAGE 3)
                         ======================================================== -->
                    <div class="adm-field-group" style="margin-bottom: 24px;">
                        <label class="adm-label">FEATURED IMAGE URL <span class="req">*</span></label>
                        <input type="text" class="adm-input" id="inp-featuredImage" required value="${p?.featuredImage || ''}" placeholder="https://blogger.googleusercontent.com/..." />
                        <div class="adm-img-previews-row" id="featuredImgPreview">
                            ${p?.featuredImage ? `<img src="${p.featuredImage}" class="adm-img-preview-thumb" alt="Featured preview" />` : ''}
                        </div>
                    </div>

                    <div class="adm-field-group" style="margin-bottom: 28px;">
                        <label class="adm-label">GALLERY URLS (ONE PER LINE)</label>
                        <textarea class="adm-input" id="inp-gallery" style="height: 110px; resize: vertical;" placeholder="https://blogger.googleusercontent.com/img/1&#10;https://blogger.googleusercontent.com/img/2">${galleryLines}</textarea>
                        <div class="adm-img-previews-row" id="galleryPreview">
                            ${(p?.gallery || []).map(url => `<img src="${url}" class="adm-img-preview-thumb" alt="Gallery thumb" />`).join('')}
                        </div>
                    </div>

                    <!-- ========================================================
                         PRODUCT OFFERS / BUNDLES (IMAGE 3)
                         ======================================================== -->
                    <div class="adm-offers-container" id="offersContainer" style="${isBundle ? '' : 'opacity:0.6;'}">
                        <div class="adm-offers-header">
                            <div class="adm-offers-title-group">
                                <span class="adm-offers-title">Product Offers / Bundles</span>
                                <span class="adm-offers-badge">ACTIF SUR LA BOUTIQUE</span>
                            </div>
                            <button type="button" class="adm-btn adm-btn-secondary" id="btnAddOfferRow" style="padding: 6px 14px; font-size: 12px;">
                                <i class="fa fa-plus"></i>
                                <span>Add Offer</span>
                            </button>
                        </div>
                        <div class="adm-offers-list" id="offersList">
                            ${offers.map((off, idx) => `
                                <div class="adm-offer-row" data-idx="${idx}">
                                    <div>
                                        <input type="number" class="adm-input off-qty" value="${off.qty}" placeholder="Qty" title="Quantity" style="padding: 7px 10px;" />
                                    </div>
                                    <div>
                                        <input type="text" class="adm-input off-title" value="${off.title}" placeholder="Offer title" style="padding: 7px 10px;" />
                                    </div>
                                    <div>
                                        <input type="number" class="adm-input off-price" value="${off.price}" placeholder="Price" style="padding: 7px 10px;" />
                                    </div>
                                    <div>
                                        <input type="number" class="adm-input off-oldprice" value="${off.oldPrice || ''}" placeholder="Old Price" style="padding: 7px 10px;" />
                                    </div>
                                    <div>
                                        <button type="button" class="adm-action-btn delete btn-remove-offer" title="Remove offer" style="width: 34px; height: 34px;">
                                            <i class="fa fa-xmark"></i>
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- ========================================================
                         DESCRIPTION (HTML) (IMAGE 3)
                         ======================================================== -->
                    <div class="adm-field-group">
                        <label class="adm-label">DESCRIPTION (HTML)</label>
                        <div class="adm-desc-editor-box">
                            <div class="adm-desc-tabs">
                                <button type="button" class="adm-desc-tab-btn active" id="tabDescHtml">HTML Source</button>
                                <button type="button" class="adm-desc-tab-btn" id="tabDescPreview">Visual Preview</button>
                            </div>
                            <textarea class="adm-desc-textarea" id="inp-description" placeholder="&lt;p&gt;Votre description en HTML...&lt;/p&gt;">${p?.description || ''}</textarea>
                            <div class="adm-desc-preview" id="descPreviewBox" style="display: none;"></div>
                        </div>
                    </div>

                    <!-- Bottom Action Buttons (Image 3) -->
                    <div class="adm-form-footer">
                        <button type="button" class="adm-btn adm-btn-ghost" id="formCancelBtn">Cancel</button>
                        <button type="submit" class="adm-btn adm-btn-purple" id="formSubmitBtn" style="padding: 11px 28px; font-size: 14px;">
                            <i class="fa-brands fa-github"></i>
                            <span>${isEdit ? 'Update & Push to GitHub' : 'Create & Push to GitHub'}</span>
                        </button>
                    </div>
                </form>
            </div>
        `;
    },

    // =========================================================================
    // 3. DASHBOARD / ORDERS / COD VIEWS
    // =========================================================================
    renderDashboardView: () => {
        const products = adminUtils.getProducts();
        const orders = JSON.parse(localStorage.getItem('captured_orders') || sessionStorage.getItem('captured_orders') || '[]');
        const totalRev = orders.reduce((acc, o) => acc + (Number(o.total) || 0), 0);

        return `
            <div class="adm-header-row">
                <div class="adm-title-group">
                    <h1>Dashboard Overview</h1>
                    <p>Real-time analytics and store performance statistics.</p>
                </div>
            </div>

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 24px;">
                <div style="background:var(--adm-card); border:1px solid var(--adm-border); border-radius:12px; padding:20px;">
                    <div style="color:var(--adm-text-dim); font-size:11px; font-weight:700; text-transform:uppercase;">Total Products</div>
                    <div style="font-size:28px; font-weight:800; color:#fff; margin-top:8px;">${products.length}</div>
                    <div style="color:#34d399; font-size:12px; margin-top:4px;"><i class="fa fa-circle-check"></i> Catalog active</div>
                </div>
                <div style="background:var(--adm-card); border:1px solid var(--adm-border); border-radius:12px; padding:20px;">
                    <div style="color:var(--adm-text-dim); font-size:11px; font-weight:700; text-transform:uppercase;">Captured Orders</div>
                    <div style="font-size:28px; font-weight:800; color:#60a5fa; margin-top:8px;">${orders.length}</div>
                    <div style="color:var(--adm-text-muted); font-size:12px; margin-top:4px;">Cash on Delivery</div>
                </div>
                <div style="background:var(--adm-card); border:1px solid var(--adm-border); border-radius:12px; padding:20px;">
                    <div style="color:var(--adm-text-dim); font-size:11px; font-weight:700; text-transform:uppercase;">Estimated Revenue</div>
                    <div style="font-size:28px; font-weight:800; color:#a78bfa; margin-top:8px;">${totalRev.toLocaleString()} FCFA</div>
                    <div style="color:var(--adm-text-muted); font-size:12px; margin-top:4px;">From captured orders</div>
                </div>
            </div>

            <div class="adm-table-card">
                <div style="padding:18px 20px; font-weight:800; border-bottom:1px solid var(--adm-border); font-size:14px;">Recent Catalog Items</div>
                <table class="adm-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Title</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Home Page</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${products.slice(0, 5).map(p => `
                            <tr>
                                <td><img src="${p.featuredImage}" class="adm-prod-img" style="width:36px; height:36px;" /></td>
                                <td><strong style="color:#fff;">${p.title}</strong></td>
                                <td>${Number(p.price).toLocaleString()} ${p.currency || 'FCFA'}</td>
                                <td>${p.stock}</td>
                                <td><span class="adm-badge adm-badge-visible"><i class="fa fa-eye"></i> Visible</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    renderOrdersView: () => {
        const orders = JSON.parse(localStorage.getItem('captured_orders') || sessionStorage.getItem('captured_orders') || '[]');

        return `
            <div class="adm-header-row">
                <div class="adm-title-group">
                    <h1>Store Orders</h1>
                    <p>Orders captured via Cash On Delivery form.</p>
                </div>
            </div>

            <div class="adm-table-card">
                <table class="adm-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Customer</th>
                            <th>Phone</th>
                            <th>Country / City</th>
                            <th>Product</th>
                            <th>Total</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orders.length === 0 ? `
                            <tr><td colspan="7" style="text-align:center; padding: 48px; color: var(--adm-text-dim);">No orders received yet.</td></tr>
                        ` : orders.slice().reverse().map(o => `
                            <tr>
                                <td>${new Date().toLocaleDateString()}</td>
                                <td><strong style="color:#fff;">${o.customer_name || 'Client'}</strong></td>
                                <td><a href="tel:${o.telephone}" style="color:#60a5fa; text-decoration:none;">${o.telephone || '-'}</a></td>
                                <td>${o.pays || 'CI'} ${o.commune ? `· ${o.commune}` : ''}</td>
                                <td>${o.product_name || 'Produit'} (x${o.quantity || 1})</td>
                                <td><strong style="color:#34d399;">${Number(o.total || 0).toLocaleString()} FCFA</strong></td>
                                <td><span class="adm-badge adm-badge-visible">Nouvelle Commande</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    renderCODView: () => {
        const countries = [
            { code: 'CI', name: "Côte d'Ivoire", cur: 'FCFA', flag: '🇨🇮', rate: 'Gratuit', status: 'Actif' },
            { code: 'SN', name: 'Sénégal', cur: 'FCFA', flag: '🇸🇳', rate: 'Gratuit', status: 'Actif' },
            { code: 'BF', name: 'Burkina Faso', cur: 'FCFA', flag: '🇧🇫', rate: 'Gratuit', status: 'Actif' },
            { code: 'GN', name: 'Guinée Conakry', cur: 'GNF', flag: '🇬🇳', rate: 'Gratuit', status: 'Actif' },
            { code: 'CM', name: 'Cameroun', cur: 'FCFA', flag: '🇨🇲', rate: 'Gratuit', status: 'Actif' },
            { code: 'GA', name: 'Gabon', cur: 'FCFA', flag: '🇬🇦', rate: 'Gratuit', status: 'Actif' },
            { code: 'ML', name: 'Mali', cur: 'FCFA', flag: '🇲🇱', rate: 'Gratuit', status: 'Actif' }
        ];

        return `
            <div class="adm-header-row">
                <div class="adm-title-group">
                    <h1>COD in Africa</h1>
                    <p>Cash on delivery destinations, local currencies, and delivery hubs.</p>
                </div>
            </div>

            <div class="adm-table-card">
                <table class="adm-table">
                    <thead>
                        <tr>
                            <th>Country</th>
                            <th>ISO Code</th>
                            <th>Currency</th>
                            <th>Shipping Cost</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${countries.map(c => `
                            <tr>
                                <td><span style="font-size:18px; margin-right:8px;">${c.flag}</span> <strong style="color:#fff;">${c.name}</strong></td>
                                <td><span class="adm-sku-code">${c.code}</span></td>
                                <td><strong style="color:#a78bfa;">${c.cur}</strong></td>
                                <td>${c.rate}</td>
                                <td><span class="adm-badge adm-badge-visible">${c.status}</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    // =========================================================================
    // EVENT BINDINGS
    // =========================================================================
    bindSidebarEvents: (navigate) => {
        // Navigation links
        document.querySelectorAll('.adm-nav-link').forEach(link => {
            link.onclick = (e) => {
                e.preventDefault();
                const route = link.dataset.route;
                if (route) navigate(route);
            };
        });

        // Settings button
        const settingsBtn = document.getElementById('admSettingsBtn');
        if (settingsBtn) {
            settingsBtn.onclick = () => adminApp.openSettingsModal();
        }

        // Logout
        const logoutBtn = document.getElementById('admLogoutBtn');
        if (logoutBtn) {
            logoutBtn.onclick = () => {
                sessionStorage.removeItem('admin_auth');
                navigate('/admin/login');
            };
        }
    },

    bindViewEvents: (path, navigate) => {
        // Quick Settings Gear button
        const btnQuickSettings = document.getElementById('btnQuickSettings');
        if (btnQuickSettings) {
            btnQuickSettings.onclick = () => adminApp.openSettingsModal();
        }

        // Push to GitHub Now Button
        const btnPushGitHubNow = document.getElementById('btnPushGitHubNow');
        if (btnPushGitHubNow) {
            btnPushGitHubNow.onclick = async () => {
                const originalHtml = btnPushGitHubNow.innerHTML;
                btnPushGitHubNow.innerHTML = '<i class="fa fa-spinner fa-spin"></i> <span>Pushing...</span>';
                btnPushGitHubNow.disabled = true;

                const res = await adminUtils.persistAndSync(adminUtils.getProducts());
                btnPushGitHubNow.innerHTML = originalHtml;
                btnPushGitHubNow.disabled = false;

                if (res.success) {
                    showToast(res.message || 'Poussé sur GitHub avec succès !');
                } else {
                    alert('Erreur GitHub: ' + res.error);
                }
            };
        }

        // Add Product button
        const btnAddProduct = document.getElementById('btnAddProduct');
        if (btnAddProduct) {
            btnAddProduct.onclick = () => navigate('/admin/products/new');
        }

        // Export JSON button
        const btnExportJSON = document.getElementById('btnExportJSON');
        if (btnExportJSON) {
            btnExportJSON.onclick = () => {
                const json = adminUtils.exportJSON();
                const blob = new Blob([json], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'products.json';
                a.click();
                URL.revokeObjectURL(url);
                showToast('products.json exporté avec succès !');
            };
        }

        // Import JSON button
        const btnImportJSON = document.getElementById('btnImportJSON');
        if (btnImportJSON) {
            btnImportJSON.onclick = () => adminApp.openImportModal(navigate);
        }

        // Live Product Search
        const searchInput = document.getElementById('admProductSearch');
        if (searchInput) {
            searchInput.oninput = () => {
                const query = searchInput.value.toLowerCase().trim();
                const products = adminUtils.getProducts();
                const filtered = products.filter(p => {
                    return (
                        (p.title && p.title.toLowerCase().includes(query)) ||
                        (p.id && p.id.toLowerCase().includes(query)) ||
                        (p.code && p.code.toLowerCase().includes(query))
                    );
                });
                const tbody = document.getElementById('admTableBody');
                if (tbody) {
                    tbody.innerHTML = adminApp.renderTableRows(filtered);
                    adminApp.bindTableActions(navigate);
                }
            };
        }

        // Table actions
        adminApp.bindTableActions(navigate);

        // Form events (if currently on Form view)
        adminApp.bindFormEvents(navigate);
    },

    bindTableActions: (navigate) => {
        // Edit product
        document.querySelectorAll('.btn-edit-prod').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                navigate(`/admin/products/edit/${btn.dataset.id}`);
            };
        });

        // Duplicate product
        document.querySelectorAll('.btn-duplicate-prod').forEach(btn => {
            btn.onclick = async (e) => {
                e.stopPropagation();
                const clone = await adminUtils.duplicateProduct(btn.dataset.id);
                if (clone) {
                    showToast(`Produit dupliqué et synchronisé : ${clone.id}`);
                    navigate(`/admin/products/edit/${clone.id}`);
                }
            };
        });

        // Delete product
        document.querySelectorAll('.btn-delete-prod').forEach(btn => {
            btn.onclick = async (e) => {
                e.stopPropagation();
                const id = btn.dataset.id;
                if (confirm(`Voulez-vous vraiment supprimer "${id}" et pousser la mise à jour sur GitHub ?`)) {
                    await adminUtils.deleteProduct(id);
                    showToast('Produit supprimé et synchronisé sur GitHub !', 'success');
                    adminApp.render(navigate);
                }
            };
        });

        // Toggle HomePage visibility badge directly in table
        document.querySelectorAll('.btn-toggle-home').forEach(btn => {
            btn.onclick = async (e) => {
                e.stopPropagation();
                const id = btn.dataset.id;
                const nextState = await adminUtils.toggleHomePage(id);
                showToast(`Visibilité accueil : ${nextState.toUpperCase()} (Poussé sur GitHub)`);
                adminApp.render(navigate);
            };
        });
    },

    bindFormEvents: (navigate) => {
        const form = document.getElementById('admProductForm');
        if (!form) return;

        // Auto-slugify when creating new product
        const idInput = document.getElementById('inp-id');
        const titleInput = document.getElementById('inp-title');
        if (idInput && titleInput && !idInput.hasAttribute('readonly')) {
            titleInput.addEventListener('input', () => {
                if (!idInput.dataset.manualEdited) {
                    idInput.value = slugify(titleInput.value);
                }
            });
            idInput.addEventListener('input', () => {
                idInput.dataset.manualEdited = 'true';
            });
        }

        // Duplicate button in form header
        const formDuplicateBtn = document.getElementById('formDuplicateBtn');
        if (formDuplicateBtn) {
            formDuplicateBtn.onclick = async () => {
                const clone = await adminUtils.duplicateProduct(formDuplicateBtn.dataset.id);
                if (clone) {
                    showToast('Produit dupliqué & poussé sur GitHub !');
                    navigate(`/admin/products/edit/${clone.id}`);
                }
            };
        }

        // Back / Cancel button
        const backBtn = document.getElementById('formBackBtn');
        if (backBtn) backBtn.onclick = () => navigate('/admin/products');
        const cancelBtn = document.getElementById('formCancelBtn');
        if (cancelBtn) cancelBtn.onclick = () => navigate('/admin/products');

        // Toggle cards click
        document.querySelectorAll('.toggle-card').forEach(card => {
            card.onclick = () => {
                const key = card.dataset.key;
                const hiddenInput = document.getElementById(`toggle-${key}`);
                const sw = card.querySelector('.adm-switch');
                const label = card.querySelector('.adm-switch-label');

                if (hiddenInput && sw) {
                    const isCurrentlyOn = sw.classList.contains('is-on');
                    if (isCurrentlyOn) {
                        sw.classList.remove('is-on');
                        label.textContent = 'NO';
                        hiddenInput.value = (key === 'resume') ? 'false' : 'no';
                    } else {
                        sw.classList.add('is-on');
                        label.textContent = 'YES';
                        hiddenInput.value = (key === 'resume') ? 'true' : (key === 'remisePopup' ? 'YES, 10' : 'yes');
                    }
                }
            };
        });

        // Featured image preview
        const featInput = document.getElementById('inp-featuredImage');
        const featPreview = document.getElementById('featuredImgPreview');
        if (featInput && featPreview) {
            featInput.addEventListener('input', () => {
                const url = featInput.value.trim();
                featPreview.innerHTML = url ? `<img src="${url}" class="adm-img-preview-thumb" onerror="this.remove()" />` : '';
            });
        }

        // Gallery textarea preview
        const galleryInput = document.getElementById('inp-gallery');
        const galleryPreview = document.getElementById('galleryPreview');
        if (galleryInput && galleryPreview) {
            galleryInput.addEventListener('input', () => {
                const lines = galleryInput.value.split('\n').map(s => s.trim()).filter(s => s.length > 0);
                galleryPreview.innerHTML = lines.map(url => `<img src="${url}" class="adm-img-preview-thumb" onerror="this.remove()" />`).join('');
            });
        }

        // Add Offer Row
        const btnAddOfferRow = document.getElementById('btnAddOfferRow');
        const offersList = document.getElementById('offersList');
        if (btnAddOfferRow && offersList) {
            btnAddOfferRow.onclick = () => {
                const count = offersList.querySelectorAll('.adm-offer-row').length + 1;
                const basePrice = Number(document.getElementById('inp-price')?.value) || 12000;
                const baseOld = Number(document.getElementById('inp-priceOld')?.value) || Math.round(basePrice * 1.5);
                const row = document.createElement('div');
                row.className = 'adm-offer-row';
                row.innerHTML = `
                    <div><input type="number" class="adm-input off-qty" value="${count}" placeholder="Qty" style="padding: 7px 10px;" /></div>
                    <div><input type="text" class="adm-input off-title" value="${count} Exemplaires (Offre Spéciale)" placeholder="Offer title" style="padding: 7px 10px;" /></div>
                    <div><input type="number" class="adm-input off-price" value="${basePrice * count}" placeholder="Price" style="padding: 7px 10px;" /></div>
                    <div><input type="number" class="adm-input off-oldprice" value="${baseOld * count}" placeholder="Old Price" style="padding: 7px 10px;" /></div>
                    <div>
                        <button type="button" class="adm-action-btn delete btn-remove-offer" title="Remove offer" style="width: 34px; height: 34px;">
                            <i class="fa fa-xmark"></i>
                        </button>
                    </div>
                `;
                offersList.appendChild(row);
                row.querySelector('.btn-remove-offer').onclick = () => row.remove();
            };
        }

        // Remove offer buttons
        document.querySelectorAll('.btn-remove-offer').forEach(btn => {
            btn.onclick = () => {
                btn.closest('.adm-offer-row').remove();
            };
        });

        // Description Editor Tabs (HTML / Visual Preview)
        const tabDescHtml = document.getElementById('tabDescHtml');
        const tabDescPreview = document.getElementById('tabDescPreview');
        const descTextarea = document.getElementById('inp-description');
        const descPreviewBox = document.getElementById('descPreviewBox');

        if (tabDescHtml && tabDescPreview && descTextarea && descPreviewBox) {
            tabDescHtml.onclick = () => {
                tabDescHtml.classList.add('active');
                tabDescPreview.classList.remove('active');
                descTextarea.style.display = 'block';
                descPreviewBox.style.display = 'none';
            };
            tabDescPreview.onclick = () => {
                tabDescPreview.classList.add('active');
                tabDescHtml.classList.remove('active');
                descTextarea.style.display = 'none';
                descPreviewBox.style.display = 'block';
                descPreviewBox.innerHTML = descTextarea.value || '<p style="color:#94a3b8; font-style:italic;">Aucune description HTML à afficher.</p>';
            };
        }

        // Form Submit
        form.onsubmit = async (e) => {
            e.preventDefault();

            const submitBtn = document.getElementById('formSubmitBtn');
            const originalBtnHtml = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> <span>Synchronisation avec GitHub...</span>';
            submitBtn.disabled = true;

            // Extract offers
            const offerRows = document.querySelectorAll('.adm-offer-row');
            const offres = Array.from(offerRows).map(row => {
                return {
                    qty: Number(row.querySelector('.off-qty')?.value) || 1,
                    title: row.querySelector('.off-title')?.value.trim() || 'Offre',
                    price: Number(row.querySelector('.off-price')?.value) || 0,
                    oldPrice: Number(row.querySelector('.off-oldprice')?.value) || 0
                };
            }).filter(o => o.title);

            // Extract gallery
            const gallery = (document.getElementById('inp-gallery')?.value || '')
                .split('\n')
                .map(s => s.trim())
                .filter(s => s.length > 0);

            // Build payload
            const productData = {
                id: document.getElementById('inp-id').value.trim(),
                title: document.getElementById('inp-title').value.trim(),
                price: Number(document.getElementById('inp-price').value) || 0,
                priceOld: Number(document.getElementById('inp-priceOld').value) || null,
                costPrice: Number(document.getElementById('inp-costPrice').value) || null,
                shippingCost: Number(document.getElementById('inp-shippingCost').value) || null,
                currency: document.getElementById('inp-currency').value.trim() || 'FCFA',
                stock: document.getElementById('inp-stock').value.trim() || '25',
                code: document.getElementById('inp-code').value.trim(),
                whatsapp: document.getElementById('inp-whatsapp').value.trim(),
                pays: document.getElementById('inp-pays').value.trim(),
                reviews: document.getElementById('inp-reviews').value.trim(),
                couleur: document.getElementById('inp-couleur').value.trim(),
                taille: document.getElementById('inp-taille').value.trim(),

                // Toggles
                homePage: document.getElementById('toggle-homePage').value,
                displayHomePage: document.getElementById('toggle-homePage').value,
                reviewsSection: document.getElementById('toggle-reviewsSection').value,
                bundle: document.getElementById('toggle-bundle').value,
                countdown: document.getElementById('toggle-countdown').value,
                isLandingPage: document.getElementById('toggle-isLandingPage').value,
                modeBlack: document.getElementById('toggle-modeBlack').value,
                showQuantity: document.getElementById('toggle-showQuantity').value,
                animated: document.getElementById('toggle-animated').value,
                resume: document.getElementById('toggle-resume').value,
                remisePopup: document.getElementById('toggle-remisePopup').value,
                socialPopup: 'yes',

                // Media & details
                featuredImage: document.getElementById('inp-featuredImage').value.trim(),
                gallery: gallery,
                offres: offres,
                description: document.getElementById('inp-description').value
            };

            // Save via adminUtils (Auto Local + GitHub Sync)
            const syncRes = await adminUtils.upsertProduct(productData);

            submitBtn.innerHTML = originalBtnHtml;
            submitBtn.disabled = false;

            if (syncRes.success) {
                showToast(syncRes.message || 'Produit sauvegardé et poussé sur GitHub !', 'success');
                setTimeout(() => {
                    navigate('/admin/products');
                }, 500);
            } else {
                alert('Erreur de synchronisation GitHub : ' + syncRes.error);
            }
        };
    },

    // =========================================================================
    // MODALS: IMPORT JSON & STORE SETTINGS (GITHUB CONFIG)
    // =========================================================================
    openImportModal: (navigate) => {
        const overlay = document.createElement('div');
        overlay.className = 'adm-modal-overlay';
        overlay.innerHTML = `
            <div class="adm-modal">
                <div class="adm-modal-title">Import products.json</div>
                <div class="adm-modal-desc">
                    Sélectionnez un fichier <code>products.json</code> pour mettre à jour le catalogue et synchroniser avec GitHub.
                </div>
                <div style="margin-bottom: 20px;">
                    <input type="file" id="modalFileInput" accept=".json" style="width: 100%; color: #fff; background: var(--adm-input-bg); padding: 12px; border-radius: 8px; border: 1px dashed var(--adm-border);" />
                </div>
                <div style="margin-bottom: 20px;">
                    <label class="adm-label" style="margin-bottom: 6px;">Ou collez le JSON directement :</label>
                    <textarea id="modalTextareaInput" class="adm-input" style="height: 120px; font-family: monospace; font-size: 11px;" placeholder="[ { &quot;id&quot;: &quot;...&quot;, &quot;title&quot;: &quot;...&quot; } ]"></textarea>
                </div>
                <div style="display: flex; justify-content: flex-end; gap: 10px;">
                    <button class="adm-btn adm-btn-ghost" id="modalCancelBtn">Annuler</button>
                    <button class="adm-btn adm-btn-purple" id="modalConfirmImportBtn">Importer & Push GitHub</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        const close = () => overlay.remove();
        overlay.querySelector('#modalCancelBtn').onclick = close;
        overlay.onclick = (e) => { if (e.target === overlay) close(); };

        const fileInput = overlay.querySelector('#modalFileInput');
        const textArea = overlay.querySelector('#modalTextareaInput');

        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    textArea.value = event.target.result;
                };
                reader.readAsText(file);
            }
        };

        overlay.querySelector('#modalConfirmImportBtn').onclick = async () => {
            const raw = textArea.value.trim();
            if (!raw) {
                alert('Veuillez fournir un JSON valide.');
                return;
            }
            const res = await adminUtils.importJSON(raw);
            if (res.success) {
                close();
                showToast(`${res.count} produits importés et synchronisés !`);
                adminApp.render(navigate);
            } else {
                alert('Erreur d\'importation: ' + res.error);
            }
        };
    },

    openSettingsModal: () => {
        const ghCfg = adminUtils.getGitHubConfig();

        const overlay = document.createElement('div');
        overlay.className = 'adm-modal-overlay';
        overlay.innerHTML = `
            <div class="adm-modal" style="max-width: 600px;">
                <div class="adm-modal-title">
                    <i class="fa-brands fa-github" style="color:var(--adm-purple-light); margin-right:8px;"></i>
                    Paramètres & Synchronisation GitHub
                </div>
                <div class="adm-modal-desc">
                    Toutes les modifications du catalogue seront directement <strong>commit & push</strong> dans <code>src/data/products.json</code> sur GitHub pour déclencher le déploiement automatique.
                </div>

                <div style="background:#090d16; border:1px solid #1f2b42; border-radius:10px; padding:16px; margin-bottom:20px;">
                    <div class="adm-field-group" style="margin-bottom: 14px;">
                        <label class="adm-label">Dépôt GitHub (Repository)</label>
                        <input type="text" class="adm-input" id="cfgGhRepo" value="${ghCfg.repo}" placeholder="username/repository" />
                    </div>

                    <div class="adm-field-group" style="margin-bottom: 14px;">
                        <label class="adm-label">Branche</label>
                        <input type="text" class="adm-input" value="main" readonly style="opacity:0.75;" />
                    </div>

                    <div class="adm-field-group" style="margin-bottom: 14px;">
                        <label class="adm-label">Fichier Cible</label>
                        <input type="text" class="adm-input" value="src/data/products.json" readonly style="opacity:0.75;" />
                    </div>

                    <div class="adm-field-group" style="margin-bottom: 10px;">
                        <label class="adm-label">
                            GitHub Personal Access Token (PAT)
                            <a href="https://github.com/settings/tokens/new?scopes=repo&description=Store+Admin+Panel" target="_blank" style="color:#60a5fa; text-transform:none; margin-left:auto; font-weight:600; text-decoration:none;">
                                <i class="fa fa-arrow-up-right-from-square"></i> Créer un token GitHub
                            </a>
                        </label>
                        <input type="password" class="adm-input" id="cfgGhToken" value="${ghCfg.token}" placeholder="ghp_xxxxxxxxxxxxxxxxxxxx (requis pour commit direct)" />
                        <small style="color:var(--adm-text-dim); font-size:11px; margin-top:4px; display:block;">
                            Le token est stocké en sécurité dans votre navigateur pour pouvoir modifier <code>products.json</code> directement sans passer par la ligne de commande.
                        </small>
                    </div>

                    <div style="display:flex; justify-content:flex-end; margin-top:10px;">
                        <button type="button" class="adm-btn adm-btn-secondary" id="btnTestGitHubSync" style="font-size:12px; padding:6px 14px;">
                            <i class="fa fa-plug"></i> Tester la connexion GitHub
                        </button>
                    </div>
                </div>

                <div class="adm-field-group" style="margin-bottom: 24px;">
                    <label class="adm-label">Réinitialiser les données</label>
                    <button type="button" class="adm-btn adm-btn-ghost" id="btnResetDefaultCatalog" style="color:var(--adm-red); border-color:rgba(239,68,68,0.4); margin-top:6px;">
                        <i class="fa fa-rotate-left"></i> Restaurer products.json d'origine
                    </button>
                </div>

                <div style="display:flex; justify-content:flex-end; gap:10px;">
                    <button class="adm-btn adm-btn-ghost" id="modalCloseSettingsBtn">Fermer</button>
                    <button class="adm-btn adm-btn-purple" id="modalSaveSettingsBtn">Enregistrer les paramètres</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        const close = () => overlay.remove();
        overlay.querySelector('#modalCloseSettingsBtn').onclick = close;
        overlay.onclick = (e) => { if (e.target === overlay) close(); };

        // Save Settings
        overlay.querySelector('#modalSaveSettingsBtn').onclick = () => {
            const token = overlay.querySelector('#cfgGhToken').value.trim();
            const repo = overlay.querySelector('#cfgGhRepo').value.trim();
            adminUtils.setGitHubConfig({ token, repo });
            showToast('Paramètres GitHub enregistrés avec succès !');
            close();
        };

        // Test GitHub Connection
        overlay.querySelector('#btnTestGitHubSync').onclick = async () => {
            const token = overlay.querySelector('#cfgGhToken').value.trim();
            const repo = overlay.querySelector('#cfgGhRepo').value.trim() || 'samidevx/Africa-Shop-Goo';

            if (!token) {
                alert('Veuillez entrer un GitHub Token pour tester.');
                return;
            }

            const testBtn = overlay.querySelector('#btnTestGitHubSync');
            testBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Test en cours...';

            try {
                const testRes = await fetch(`https://api.github.com/repos/${repo}/contents/src/data/products.json?ref=main`, {
                    headers: {
                        'Authorization': `token ${token}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });

                if (testRes.ok) {
                    const data = await testRes.json();
                    alert(`✅ Connexion réussie à GitHub !\nFichier: src/data/products.json trouvé.\nSHA: ${data.sha}\nTaille: ${(data.size / 1024).toFixed(1)} KB`);
                } else {
                    const err = await testRes.json().catch(() => ({}));
                    alert(`❌ Échec de connexion (${testRes.status}) : ${err.message || 'Vérifiez le token ou les permissions.'}`);
                }
            } catch (err) {
                alert(`❌ Erreur réseau : ${err.message}`);
            } finally {
                testBtn.innerHTML = '<i class="fa fa-plug"></i> Tester la connexion GitHub';
            }
        };

        // Reset
        overlay.querySelector('#btnResetDefaultCatalog').onclick = async () => {
            if (confirm('Êtes-vous sûr de vouloir réinitialiser le catalogue avec les données d\'origine ?')) {
                await adminUtils.resetToDefault();
                close();
                showToast('Catalogue réinitialisé !');
                window.location.reload();
            }
        };
    }
};
