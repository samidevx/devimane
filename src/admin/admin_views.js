import { adminState } from './admin_state.js';

// Format numbers with space separator (e.g. 553 618)
const fmtNum = (n) => (n || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

// Toast Notification Helper
export const showToast = (message, type = 'success') => {
    const existing = document.querySelector('.adm-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `adm-toast ${type}`;
    const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
    toast.innerHTML = `<i class="fa ${icon}"></i> <span>${message}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
};

// --- RENDER SIDEBAR ---
export const renderAdminSidebar = (activePath) => {
    const orders = adminState.getOrders();
    const orderCount = orders.length;

    return `
        <aside class="adm-sidebar">
            <a href="/admin" class="adm-brand" data-admin-nav>
                <div class="adm-brand-icon">
                    <i class="fa fa-layer-group"></i>
                </div>
                <div class="adm-brand-info">
                    <span class="adm-brand-title">Dashboard</span>
                    <span class="adm-brand-sub">DASHBOARD</span>
                </div>
            </a>

            <div class="adm-nav-scroll">
                <!-- GENERAL -->
                <div class="adm-nav-group">
                    <div class="adm-group-title">GENERAL</div>
                    <ul class="adm-nav-list">
                        <li>
                            <a href="/admin" class="adm-nav-link ${activePath === '/admin' ? 'active' : ''}" data-admin-nav>
                                <i class="fa fa-chart-pie adm-nav-icon"></i>
                                <span class="adm-nav-text">Dashboard</span>
                            </a>
                        </li>
                        <li>
                            <a href="/admin/orders" class="adm-nav-link ${activePath === '/admin/orders' ? 'active' : ''}" data-admin-nav>
                                <i class="fa fa-shopping-bag adm-nav-icon"></i>
                                <span class="adm-nav-text">Orders</span>
                                <span class="adm-badge-pill">${orderCount}</span>
                                <i class="fa fa-chevron-right adm-nav-chevron"></i>
                            </a>
                        </li>
                        <li>
                            <a href="/admin/profit" class="adm-nav-link ${activePath === '/admin/profit' ? 'active' : ''}" data-admin-nav>
                                <i class="fa fa-sack-dollar adm-nav-icon"></i>
                                <span class="adm-nav-text">Profit & Marges</span>
                                <i class="fa fa-chevron-right adm-nav-chevron"></i>
                            </a>
                        </li>
                        <li>
                            <a href="/admin/customers" class="adm-nav-link ${activePath === '/admin/customers' ? 'active' : ''}" data-admin-nav>
                                <i class="fa fa-users adm-nav-icon"></i>
                                <span class="adm-nav-text">Customers</span>
                            </a>
                        </li>
                        <li>
                            <a href="/admin/reviews" class="adm-nav-link ${activePath === '/admin/reviews' ? 'active' : ''}" data-admin-nav>
                                <i class="fa fa-star adm-nav-icon"></i>
                                <span class="adm-nav-text">Reviews</span>
                            </a>
                        </li>
                    </ul>
                </div>

                <!-- INVENTORY -->
                <div class="adm-nav-group">
                    <div class="adm-group-title">INVENTORY</div>
                    <ul class="adm-nav-list">
                        <li>
                            <a href="/admin/products" class="adm-nav-link ${activePath.startsWith('/admin/products') ? 'active' : ''}" data-admin-nav>
                                <i class="fa fa-box-open adm-nav-icon"></i>
                                <span class="adm-nav-text">Products</span>
                                <i class="fa fa-chevron-right adm-nav-chevron"></i>
                            </a>
                        </li>
                        <li>
                            <a href="/admin/delivery" class="adm-nav-link ${activePath === '/admin/delivery' ? 'active' : ''}" data-admin-nav>
                                <i class="fa fa-truck-fast adm-nav-icon"></i>
                                <span class="adm-nav-text">Delivery</span>
                            </a>
                        </li>
                    </ul>
                </div>

                <!-- SYSTEM -->
                <div class="adm-nav-group">
                    <div class="adm-group-title">SYSTEM</div>
                    <ul class="adm-nav-list">
                        <li>
                            <a href="/admin/team" class="adm-nav-link ${activePath === '/admin/team' ? 'active' : ''}" data-admin-nav>
                                <i class="fa fa-id-badge adm-nav-icon"></i>
                                <span class="adm-nav-text">Team</span>
                            </a>
                        </li>
                        <li>
                            <a href="/admin/ai-agents" class="adm-nav-link ${activePath === '/admin/ai-agents' ? 'active' : ''}" data-admin-nav>
                                <i class="fa fa-wand-magic-sparkles adm-nav-icon"></i>
                                <span class="adm-nav-text">AI Agents</span>
                            </a>
                        </li>
                        <li>
                            <a href="/admin/api" class="adm-nav-link ${activePath === '/admin/api' ? 'active' : ''}" data-admin-nav>
                                <i class="fa fa-code adm-nav-icon"></i>
                                <span class="adm-nav-text">API Reference</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- SIDEBAR FOOTER -->
            <div class="adm-sidebar-footer">
                <a href="/admin/settings" class="adm-btn-settings" data-admin-nav>
                    <i class="fa fa-gear"></i>
                    <span>Settings</span>
                </a>

                <div class="adm-user-profile">
                    <div class="adm-user-avatar">AD</div>
                    <div class="adm-user-details">
                        <span class="adm-user-name">Admin</span>
                        <span class="adm-user-role">ADMINISTRATOR</span>
                    </div>
                    <button class="adm-icon-btn" id="adminThemeToggle" title="Changer de thème">
                        <i class="fa fa-moon"></i>
                    </button>
                    <button class="adm-icon-btn" id="adminLogoutBtn" title="Déconnexion">
                        <i class="fa fa-right-from-bracket"></i>
                    </button>
                </div>
            </div>
        </aside>
    `;
};

// --- RENDER TOPBAR ---
export const renderAdminTopbar = (title, subtitle) => {
    return `
        <header class="adm-topbar">
            <div class="adm-page-title-group">
                <h1>${title}</h1>
                <p>${subtitle}</p>
            </div>

            <div class="adm-top-actions">
                <!-- Period Filter Pills -->
                <div class="adm-filter-pills" id="admPeriodFilters">
                    <button class="adm-filter-btn active" data-period="all">All Time</button>
                    <button class="adm-filter-btn" data-period="today">Today</button>
                    <button class="adm-filter-btn" data-period="7days">7 Days</button>
                    <button class="adm-filter-btn" data-period="30days">30 Days</button>
                </div>

                <!-- Date Range Selector -->
                <div class="adm-date-range">
                    <span>FROM</span>
                    <input type="text" class="adm-date-input" placeholder="mm/dd/yyyy" id="admDateFrom" value="08/24/2026">
                    <span>TO</span>
                    <input type="text" class="adm-date-input" placeholder="mm/dd/yyyy" id="admDateTo" value="09/06/2026">
                    <i class="fa fa-calendar-days" style="color:var(--adm-text-subtle); font-size:12px;"></i>
                </div>

                <!-- GitHub Sync Action Button -->
                <button class="adm-action-circle-btn" id="btnSyncGitHubTop" title="Synchroniser avec GitHub / Cloudflare">
                    <i class="fa fa-cloud-arrow-up"></i>
                </button>

                <!-- Dark Mode Toggle -->
                <button class="adm-action-circle-btn" id="btnAdminDarkTop" title="Mode sombre">
                    <i class="fa fa-moon"></i>
                </button>

                <!-- Notifications -->
                <button class="adm-action-circle-btn" title="Notifications">
                    <i class="fa fa-bell"></i>
                    <span class="adm-notif-dot"></span>
                </button>
            </div>
        </header>
    `;
};

// --- RENDER DASHBOARD VIEW (Matching Reference Screenshot) ---
export const renderDashboardView = (period = 'all') => {
    const stats = adminState.getAnalytics(period);

    return `
        ${renderAdminTopbar('Dashboard', 'Real-time overview of store performance, revenue, and order metrics.')}

        <!-- 6 KPI CARDS -->
        <div class="adm-kpi-grid">
            <!-- 1: TOTAL REVENUE -->
            <div class="adm-kpi-card">
                <div class="adm-kpi-header">
                    <div class="adm-kpi-icon-wrap green"><i class="fa fa-money-bill-wave"></i></div>
                </div>
                <div class="adm-kpi-label">TOTAL REVENUE</div>
                <div class="adm-kpi-val">${fmtNum(stats.totalRevenue)} <span style="font-size:14px; font-weight:700;">CFA</span></div>
                <div class="adm-kpi-sub">
                    <span style="color:#059669; display:inline-flex; align-items:center; gap:4px;">
                        <span style="width:6px; height:6px; border-radius:50%; background:#059669;"></span>
                        ${stats.completedCount} paid orders
                    </span>
                    <span style="color:var(--adm-text-subtle); margin-left:4px;">(GN converted)</span>
                </div>
            </div>

            <!-- 2: TOTAL ORDERS -->
            <div class="adm-kpi-card">
                <div class="adm-kpi-header">
                    <div class="adm-kpi-icon-wrap blue"><i class="fa fa-bag-shopping"></i></div>
                </div>
                <div class="adm-kpi-label">TOTAL ORDERS</div>
                <div class="adm-kpi-val">${stats.totalOrdersCount}</div>
                <div class="adm-kpi-sub">
                    <span style="display:inline-flex; align-items:center; gap:4px;">
                        <span style="width:6px; height:6px; border-radius:50%; background:#3b82f6;"></span>
                        ${stats.completedCount} completed · ${stats.abandonedCount} abandoned
                    </span>
                </div>
            </div>

            <!-- 3: CONVERSION RATE -->
            <div class="adm-kpi-card">
                <div class="adm-kpi-header">
                    <div class="adm-kpi-icon-wrap amber"><i class="fa fa-percent"></i></div>
                </div>
                <div class="adm-kpi-label">CONVERSION RATE</div>
                <div class="adm-kpi-val">${stats.convRate}%</div>
                <div class="adm-kpi-sub">
                    <span style="color:#d97706; display:inline-flex; align-items:center; gap:4px;">
                        <i class="fa fa-arrow-trend-up"></i>
                        ${stats.completedCount}/${stats.totalOrdersCount} total
                    </span>
                </div>
            </div>

            <!-- 4: AVERAGE ORDER VALUE -->
            <div class="adm-kpi-card">
                <div class="adm-kpi-header">
                    <div class="adm-kpi-icon-wrap purple"><i class="fa fa-ticket"></i></div>
                </div>
                <div class="adm-kpi-label">AVERAGE ORDER VALUE</div>
                <div class="adm-kpi-val">${fmtNum(stats.aov)} <span style="font-size:14px; font-weight:700;">CFA</span></div>
                <div class="adm-kpi-sub">
                    <span style="color:#7c3aed; display:inline-flex; align-items:center; gap:4px;">
                        <i class="fa fa-chart-column"></i>
                        Avg per checkout
                    </span>
                </div>
            </div>

            <!-- 5: BEST SELLER -->
            <div class="adm-kpi-card">
                <div class="adm-kpi-header">
                    <div class="adm-kpi-icon-wrap teal"><i class="fa fa-trophy"></i></div>
                </div>
                <div class="adm-kpi-label">BEST SELLER</div>
                <div class="adm-kpi-val" title="${stats.bestSeller.name}">${stats.bestSeller.name.substring(0, 18)}..</div>
                <div class="adm-kpi-sub">
                    <span style="color:#0891b2;">
                        ${stats.bestSeller.orders} orders (${fmtNum(stats.bestSeller.revenue)} CFA)
                    </span>
                </div>
            </div>

            <!-- 6: ACTIVE PRODUCTS -->
            <div class="adm-kpi-card">
                <div class="adm-kpi-header">
                    <div class="adm-kpi-icon-wrap pink"><i class="fa fa-gift"></i></div>
                </div>
                <div class="adm-kpi-label">ACTIVE PRODUCTS</div>
                <div class="adm-kpi-val">${stats.activeProductsCount}</div>
                <div class="adm-kpi-sub">
                    <a href="/admin/products" data-admin-nav>View catalog &rarr;</a>
                </div>
            </div>
        </div>

        <!-- CHARTS ROW (DUAL AXIS TREND & ORDER STATUS DONUT) -->
        <div class="adm-charts-row">
            <!-- REVENUE & ORDER TREND -->
            <div class="adm-card">
                <div class="adm-card-header">
                    <div class="adm-card-title">
                        <i class="fa fa-chart-line" style="color:#7c3aed;"></i>
                        Revenue & Order Trend
                    </div>
                    <div class="adm-card-subtitle">Daily Revenue (CFA) & Total Orders</div>
                </div>
                <div class="adm-card-body">
                    <div class="adm-chart-legend">
                        <div class="adm-legend-item">
                            <span class="adm-legend-box rev"></span>
                            <span>Revenue (CFA)</span>
                        </div>
                        <div class="adm-legend-item">
                            <span class="adm-legend-box orders"></span>
                            <span>Total Orders</span>
                        </div>
                    </div>

                    <!-- DUAL AXIS SVG CHART -->
                    <div style="width:100%; height:260px; position:relative; overflow:hidden;">
                        <svg viewBox="0 0 760 250" style="width:100%; height:100%; overflow:visible;">
                            <defs>
                                <linearGradient id="revGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stop-color="#7c3aed" stop-opacity="0.25"/>
                                    <stop offset="100%" stop-color="#7c3aed" stop-opacity="0.0"/>
                                </linearGradient>
                            </defs>

                            <!-- Horizontal Grid lines (Left Axis: 0 to 200,000) -->
                            <line x1="60" y1="20" x2="710" y2="20" stroke="var(--adm-border-light)" stroke-dasharray="3,3"/>
                            <line x1="60" y1="60" x2="710" y2="60" stroke="var(--adm-border-light)" stroke-dasharray="3,3"/>
                            <line x1="60" y1="100" x2="710" y2="100" stroke="var(--adm-border-light)" stroke-dasharray="3,3"/>
                            <line x1="60" y1="140" x2="710" y2="140" stroke="var(--adm-border-light)" stroke-dasharray="3,3"/>
                            <line x1="60" y1="180" x2="710" y2="180" stroke="var(--adm-border-light)" stroke-dasharray="3,3"/>
                            <line x1="60" y1="210" x2="710" y2="210" stroke="var(--adm-border)"/>

                            <!-- Left Axis Labels (Revenue) -->
                            <text x="50" y="24" text-anchor="end" font-size="9.5" fill="var(--adm-text-subtle)" font-weight="600">200,000</text>
                            <text x="50" y="64" text-anchor="end" font-size="9.5" fill="var(--adm-text-subtle)" font-weight="600">160,000</text>
                            <text x="50" y="104" text-anchor="end" font-size="9.5" fill="var(--adm-text-subtle)" font-weight="600">120,000</text>
                            <text x="50" y="144" text-anchor="end" font-size="9.5" fill="var(--adm-text-subtle)" font-weight="600">80,000</text>
                            <text x="50" y="184" text-anchor="end" font-size="9.5" fill="var(--adm-text-subtle)" font-weight="600">40,000</text>
                            <text x="50" y="214" text-anchor="end" font-size="9.5" fill="var(--adm-text-subtle)" font-weight="600">0</text>

                            <!-- Right Axis Labels (Orders) -->
                            <text x="720" y="24" text-anchor="start" font-size="9.5" fill="var(--adm-text-subtle)" font-weight="600">10</text>
                            <text x="720" y="64" text-anchor="start" font-size="9.5" fill="var(--adm-text-subtle)" font-weight="600">8</text>
                            <text x="720" y="104" text-anchor="start" font-size="9.5" fill="var(--adm-text-subtle)" font-weight="600">6</text>
                            <text x="720" y="144" text-anchor="start" font-size="9.5" fill="var(--adm-text-subtle)" font-weight="600">4</text>
                            <text x="720" y="184" text-anchor="start" font-size="9.5" fill="var(--adm-text-subtle)" font-weight="600">2</text>
                            <text x="720" y="214" text-anchor="start" font-size="9.5" fill="var(--adm-text-subtle)" font-weight="600">0</text>

                            <!-- Bars (Total Orders): 28 Aug (x=260), 29 Aug (x=310), 31 Aug (x=410), 01 Sept (x=460) -->
                            <!-- 28 Aug: 8 orders -> h=152 (y=58, h=152) -->
                            <rect x="250" y="58" width="22" height="152" rx="3" fill="#dbeafe"/>
                            <!-- 29 Aug: 10 orders -> h=190 (y=20, h=190) -->
                            <rect x="300" y="20" width="22" height="190" rx="3" fill="#dbeafe"/>
                            <!-- 31 Aug: 3 orders -> h=57 (y=153, h=57) -->
                            <rect x="398" y="153" width="22" height="57" rx="3" fill="#dbeafe"/>
                            <!-- 01 Sept: 10 orders -> h=190 (y=20, h=190) -->
                            <rect x="448" y="20" width="22" height="190" rx="3" fill="#dbeafe"/>

                            <!-- Spline curve (Revenue CFA): Peak on 28 & 29 Aug (~175k -> y=44), valley on 30 Aug (~20k -> y=190), small peak 01 Sept (~60k -> y=150) -->
                            <!-- Area fill -->
                            <path d="M 60 210 
                                     L 210 210 
                                     C 230 210, 245 44, 280 44 
                                     C 300 44, 315 50, 335 150 
                                     C 350 200, 370 190, 390 170 
                                     C 420 140, 440 150, 470 150 
                                     C 500 150, 520 210, 550 210 
                                     L 710 210 Z" 
                                  fill="url(#revGradient)"/>

                            <!-- Stroke line -->
                            <path d="M 60 210 
                                     L 210 210 
                                     C 230 210, 245 44, 280 44 
                                     C 300 44, 315 50, 335 150 
                                     C 350 200, 370 190, 390 170 
                                     C 420 140, 440 150, 470 150 
                                     C 500 150, 520 210, 550 210 
                                     L 710 210" 
                                  fill="none" stroke="#7c3aed" stroke-width="3" stroke-linecap="round"/>

                            <!-- Highlight Peak points -->
                            <circle cx="280" cy="44" r="4" fill="#7c3aed" stroke="#fff" stroke-width="2"/>
                            <circle cx="470" cy="150" r="4" fill="#7c3aed" stroke="#fff" stroke-width="2"/>

                            <!-- X Axis Dates Labels -->
                            <text x="110" y="228" text-anchor="middle" font-size="9" fill="var(--adm-text-subtle)">24 Aug</text>
                            <text x="160" y="228" text-anchor="middle" font-size="9" fill="var(--adm-text-subtle)">25 Aug</text>
                            <text x="210" y="228" text-anchor="middle" font-size="9" fill="var(--adm-text-subtle)">26 Aug</text>
                            <text x="260" y="228" text-anchor="middle" font-size="9" fill="var(--adm-text-subtle)">27 Aug</text>
                            <text x="310" y="228" text-anchor="middle" font-size="9" fill="var(--adm-text-subtle)" font-weight="700">28 Aug</text>
                            <text x="360" y="228" text-anchor="middle" font-size="9" fill="var(--adm-text-subtle)" font-weight="700">29 Aug</text>
                            <text x="410" y="228" text-anchor="middle" font-size="9" fill="var(--adm-text-subtle)">30 Aug</text>
                            <text x="460" y="228" text-anchor="middle" font-size="9" fill="var(--adm-text-subtle)">31 Aug</text>
                            <text x="510" y="228" text-anchor="middle" font-size="9" fill="var(--adm-text-subtle)" font-weight="700">01 Sept</text>
                            <text x="560" y="228" text-anchor="middle" font-size="9" fill="var(--adm-text-subtle)">02 Sept</text>
                            <text x="610" y="228" text-anchor="middle" font-size="9" fill="var(--adm-text-subtle)">03 Sept</text>
                            <text x="660" y="228" text-anchor="middle" font-size="9" fill="var(--adm-text-subtle)">04 Sept</text>
                            <text x="700" y="228" text-anchor="middle" font-size="9" fill="var(--adm-text-subtle)">06 Sept</text>
                        </svg>
                    </div>
                </div>
            </div>

            <!-- ORDER STATUS DONUT -->
            <div class="adm-card">
                <div class="adm-card-header">
                    <div class="adm-card-title">
                        <i class="fa fa-chart-pie" style="color:#f59e0b;"></i>
                        Order Status
                    </div>
                    <div class="adm-card-subtitle">Distribution</div>
                </div>
                <div class="adm-card-body">
                    <div class="adm-donut-wrap">
                        <!-- SVG Donut Chart -->
                        <!-- Completed: 28 (77.8%), Abandoned: 8 (22.2%) -->
                        <svg width="180" height="180" viewBox="0 0 42 42">
                            <circle class="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="var(--adm-border-light)" stroke-width="6"></circle>
                            <!-- Completed: 78% (stroke-dasharray="78 22", offset 25) -->
                            <circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#10b981" stroke-width="6" stroke-dasharray="78 22" stroke-dashoffset="25"></circle>
                            <!-- Abandoned: 22% (stroke-dasharray="22 78", offset -53) -->
                            <circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#f59e0b" stroke-width="6" stroke-dasharray="22 78" stroke-dashoffset="-53"></circle>
                        </svg>

                        <div class="adm-donut-legend">
                            <div class="adm-donut-legend-item">
                                <span class="adm-donut-dot completed"></span>
                                <span>Completed</span>
                            </div>
                            <div class="adm-donut-legend-item">
                                <span class="adm-donut-dot abandoned"></span>
                                <span>Abandoned</span>
                            </div>
                            <div class="adm-donut-legend-item">
                                <span class="adm-donut-dot pending"></span>
                                <span>Pending</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- BOTTOM ROW (TOP PRODUCTS BY SALES & SALES BY COUNTRY) -->
        <div class="adm-bottom-row">
            <!-- TOP PRODUCTS BY SALES -->
            <div class="adm-card">
                <div class="adm-card-header">
                    <div class="adm-card-title">
                        <i class="fa fa-fire" style="color:#ef4444;"></i>
                        Top Products by Sales
                    </div>
                    <div class="adm-card-subtitle">${stats.topProducts.length} products sold</div>
                </div>
                <div class="adm-card-body" style="padding:0;">
                    <table class="adm-table">
                        <thead>
                            <tr>
                                <th style="width:40px;">#</th>
                                <th>PRODUCT</th>
                                <th style="text-align:center;">ORDERS</th>
                                <th style="text-align:right;">REVENUE</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${stats.topProducts.slice(0, 5).map((p, idx) => `
                                <tr>
                                    <td style="color:var(--adm-text-subtle); font-weight:700;">#${idx + 1}</td>
                                    <td style="max-width:240px; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                                        ${p.name}
                                    </td>
                                    <td style="text-align:center;">
                                        <span class="adm-order-badge">${p.orders}</span>
                                    </td>
                                    <td style="text-align:right; font-weight:700; color:var(--adm-text-main);">
                                        ${fmtNum(p.revenue)} CFA
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- SALES BY COUNTRY -->
            <div class="adm-card">
                <div class="adm-card-header">
                    <div class="adm-card-title">
                        <i class="fa fa-globe" style="color:#3b82f6;"></i>
                        Sales by Country
                    </div>
                    <div class="adm-card-subtitle">${stats.salesByCountry.length} countries</div>
                </div>
                <div class="adm-card-body">
                    <div class="adm-country-list">
                        ${stats.salesByCountry.slice(0, 4).map(c => `
                            <div class="adm-country-item">
                                <div class="adm-country-header">
                                    <div class="adm-country-name">
                                        <span class="adm-country-dot"></span>
                                        <span>${c.name}</span>
                                    </div>
                                    <div class="adm-country-stats">
                                        <strong>${c.orders} orders</strong> (${c.pct}%)
                                    </div>
                                </div>
                                <div class="adm-country-bar">
                                    <div class="adm-country-fill" style="width:${c.pct * 2.5}%;"></div>
                                </div>
                                <div class="adm-country-subline">
                                    <span>Completed: ${c.completed}</span>
                                    <span style="font-weight:700; color:#059669;">${fmtNum(c.revenue)} CFA</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
};

// --- RENDER PRODUCTS VIEW ---
export const renderProductsView = () => {
    const products = adminState.getProducts();

    return `
        ${renderAdminTopbar('Products', 'Manage your catalog, prices, stocks, and sync changes directly to your live store.')}

        <div class="adm-card" style="margin-bottom:20px;">
            <div class="adm-card-body" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
                <div style="display:flex; gap:12px; align-items:center; flex:1; max-width:500px;">
                    <div style="position:relative; flex:1;">
                        <i class="fa fa-search" style="position:absolute; left:12px; top:50%; transform:translateY(-50%); color:var(--adm-text-subtle);"></i>
                        <input type="text" id="prodSearchInput" class="adm-input" placeholder="Rechercher un produit ou SKU..." style="padding-left:36px; width:100%;">
                    </div>
                </div>

                <div style="display:flex; gap:10px; align-items:center;">
                    <button class="adm-btn-secondary" id="btnExportJson">
                        <i class="fa fa-download"></i> Export JSON
                    </button>
                    <label class="adm-btn-secondary" style="cursor:pointer; margin:0;">
                        <i class="fa fa-upload"></i> Import JSON
                        <input type="file" id="btnImportJson" accept=".json" style="display:none;">
                    </label>
                    <button class="adm-btn-success" id="btnSyncToGitHub">
                        <i class="fa fa-cloud-arrow-up"></i> Sauvegarder sur GitHub
                    </button>
                    <a href="/admin/products/new" class="adm-btn-primary" data-admin-nav>
                        <i class="fa fa-plus"></i> Nouveau Produit
                    </a>
                </div>
            </div>
        </div>

        <div class="adm-card">
            <div class="adm-card-body" style="padding:0;">
                <table class="adm-table" id="admProductsTable">
                    <thead>
                        <tr>
                            <th style="width:50px;">Image</th>
                            <th>Titre</th>
                            <th>Prix</th>
                            <th>Ancien Prix</th>
                            <th>Stock</th>
                            <th>SKU</th>
                            <th>Pays</th>
                            <th style="text-align:right;">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${products.map(p => `
                            <tr data-prod-id="${p.id}">
                                <td>
                                    <img src="${p.featuredImage || ''}" style="width:42px; height:42px; border-radius:6px; object-fit:cover; background:#eee;" onerror="this.src='https://via.placeholder.com/42'">
                                </td>
                                <td style="max-width:260px;">
                                    <div style="font-weight:700; color:var(--adm-text-main); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                                        ${p.title}
                                    </div>
                                    <small style="color:var(--adm-text-subtle); font-family:monospace;">/${p.id}</small>
                                </td>
                                <td style="font-weight:700; color:#7c3aed;">
                                    ${fmtNum(p.price)} ${p.currency || 'CFA'}
                                </td>
                                <td style="color:var(--adm-text-subtle); text-decoration:line-through;">
                                    ${p.priceOld ? fmtNum(p.priceOld) + ' ' + (p.currency || 'CFA') : '-'}
                                </td>
                                <td>
                                    <span class="adm-status-badge ${parseInt(p.stock || '0') > 0 ? 'completed' : 'cancelled'}">
                                        ${p.stock || 0} en stock
                                    </span>
                                </td>
                                <td style="font-family:monospace; font-size:11px;">
                                    ${p.code || '-'}
                                </td>
                                <td style="font-size:11px; color:var(--adm-text-muted);">
                                    ${p.pays || 'Tous'}
                                </td>
                                <td style="text-align:right;">
                                    <div style="display:inline-flex; gap:6px;">
                                        <a href="/product/${p.id}" target="_blank" class="adm-btn-secondary" style="padding:4px 8px; font-size:11px;" title="Voir sur le site">
                                            <i class="fa fa-arrow-up-right-from-square"></i>
                                        </a>
                                        <a href="/admin/products/edit/${p.id}" class="adm-btn-secondary" style="padding:4px 8px; font-size:11px;" title="Modifier" data-admin-nav>
                                            <i class="fa fa-pen-to-square"></i>
                                        </a>
                                        <button class="adm-btn-danger btn-delete-product" data-id="${p.id}" style="padding:4px 8px; font-size:11px;" title="Supprimer">
                                            <i class="fa fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
};

// --- RENDER PRODUCT ADD / EDIT FORM ---
export const renderProductFormView = (product = null) => {
    const isEdit = !!product;
    const isYes = (val) => Boolean(val && val.toString().trim().toLowerCase() === 'yes');

    return `
        <header class="adm-topbar">
            <div class="adm-page-title-group">
                <h1>${isEdit ? 'Modifier le Produit' : 'Créer un Nouveau Produit'}</h1>
                <p>Configurez les tarifs, offres groupées, logistique et boosters de conversion.</p>
            </div>
            <div class="adm-top-actions">
                <a href="/admin/products" class="adm-btn-secondary" data-admin-nav>
                    <i class="fa fa-arrow-left"></i> Retour au catalogue
                </a>
            </div>
        </header>

        <form id="admProductFullForm" class="adm-card" style="padding:28px;">
            <!-- 1. INFORMATIONS GÉNÉRALES -->
            <h3 style="margin:0 0 16px 0; font-size:16px; font-weight:800; color:var(--adm-primary);">1. Informations Principales</h3>
            <div class="adm-form-grid">
                <div class="adm-form-group">
                    <label class="adm-label">Identifiant URL (Slug ID) *</label>
                    <input type="text" class="adm-input" id="p-id" value="${product?.id || ''}" required ${isEdit ? 'readonly' : ''} placeholder="ex: ma-ceinture-lombaire">
                    <small style="color:var(--adm-text-subtle); font-size:11px;">Sera utilisé dans l'URL: /product/votre-id</small>
                </div>
                <div class="adm-form-group" style="grid-column: span 2;">
                    <label class="adm-label">Titre du Produit *</label>
                    <input type="text" class="adm-input" id="p-title" value="${(product?.title || '').replace(/"/g, '&quot;')}" required placeholder="Nom complet du produit">
                </div>
                <div class="adm-form-group">
                    <label class="adm-label">Prix de Vente *</label>
                    <input type="number" class="adm-input" id="p-price" value="${product?.price || ''}" required placeholder="ex: 19900">
                </div>
                <div class="adm-form-group">
                    <label class="adm-label">Ancien Prix (Barré)</label>
                    <input type="number" class="adm-input" id="p-priceOld" value="${product?.priceOld || ''}" placeholder="ex: 29900">
                </div>
                <div class="adm-form-group">
                    <label class="adm-label">Devise</label>
                    <input type="text" class="adm-input" id="p-currency" value="${product?.currency || 'CFA'}" placeholder="CFA, GNF, $">
                </div>
                <div class="adm-form-group">
                    <label class="adm-label">Catégorie</label>
                    <input type="text" class="adm-input" id="p-category" value="${product?.category || 'Mode'}" placeholder="Mode, Santé, Maison">
                </div>
                <div class="adm-form-group">
                    <label class="adm-label">Stock Initial</label>
                    <input type="number" class="adm-input" id="p-stock" value="${product?.stock || '25'}">
                </div>
                <div class="adm-form-group">
                    <label class="adm-label">Code Produit (SKU)</label>
                    <input type="text" class="adm-input" id="p-code" value="${product?.code || ''}" placeholder="ex: COD05813">
                </div>
            </div>

            <hr style="border:none; border-top:1px solid var(--adm-border-light); margin:28px 0;">

            <!-- 2. LOGISTIQUE & OFFRES -->
            <h3 style="margin:0 0 16px 0; font-size:16px; font-weight:800; color:var(--adm-primary);">2. Logistique, WhatsApp & Offres Groupées</h3>
            <div class="adm-form-grid">
                <div class="adm-form-group">
                    <label class="adm-label">Numéro WhatsApp (avec indicatif)</label>
                    <input type="text" class="adm-input" id="p-whatsapp" value="${product?.whatsapp || '2250701825463'}" placeholder="ex: 2250701825463">
                </div>
                <div class="adm-form-group">
                    <label class="adm-label">Bouton Sticky WhatsApp</label>
                    <select class="adm-select" id="p-whatsappSticky">
                        <option value="on" ${(product?.['whatsapp-sticky'] ?? 'on').toString().toLowerCase() === 'on' ? 'selected' : ''}>Activé (Visible en bas)</option>
                        <option value="off" ${(product?.['whatsapp-sticky'] ?? 'on').toString().toLowerCase() === 'off' ? 'selected' : ''}>Désactivé (Bouton Commander pleine largeur)</option>
                    </select>
                </div>
                <div class="adm-form-group">
                    <label class="adm-label">Pays cibles (Codes ISO séparés par des virgules)</label>
                    <input type="text" class="adm-input" id="p-pays" value="${product?.pays || 'CI,SN,BF,TG,BJ,ML,GA,CM,NE,CG,CD,GN,TD'}">
                </div>
                <div class="adm-form-group">
                    <label class="adm-label">Activer Offre Groupée (Bundle) ?</label>
                    <select class="adm-select" id="p-bundle">
                        <option value="no" ${!isYes(product?.bundle) ? 'selected' : ''}>Non</option>
                        <option value="yes" ${isYes(product?.bundle) ? 'selected' : ''}>Oui</option>
                    </select>
                </div>
                <div class="adm-form-group" id="bundle-group" style="${isYes(product?.bundle) ? 'grid-column: span 3;' : 'display:none; grid-column: span 3;'}">
                    <label class="adm-label">Lignes d'offres (Format: <code>quantité,prix,ancien_prix,titre</code>)</label>
                    <textarea class="adm-textarea" id="p-offres" style="height:110px; font-family:monospace; font-size:12px;" placeholder="1,19900,29900,1 Exemplaire (Offre Découverte)&#10;2,34900,59800,2 Exemplaires (Offre Duo)">${(product?.offres || []).map(o => `${o.qty},${o.price},${o.oldPrice},${o.title}`).join('\n')}</textarea>
                </div>
            </div>

            <hr style="border:none; border-top:1px solid var(--adm-border-light); margin:28px 0;">

            <!-- 3. BOOSTERS DE CONVERSION & VARIANTES -->
            <h3 style="margin:0 0 16px 0; font-size:16px; font-weight:800; color:var(--adm-primary);">3. Boosters de Conversion & Variantes</h3>
            <div class="adm-form-grid">
                <div class="adm-form-group">
                    <label class="adm-label">Compte à rebours (Urgence)</label>
                    <select class="adm-select" id="p-countdown">
                        <option value="NO" ${!isYes(product?.countdown) ? 'selected' : ''}>Non</option>
                        <option value="yes" ${isYes(product?.countdown) ? 'selected' : ''}>Oui</option>
                    </select>
                </div>
                <div class="adm-form-group">
                    <label class="adm-label">Bouton Commander Animé</label>
                    <select class="adm-select" id="p-animated">
                        <option value="no" ${!isYes(product?.animated) ? 'selected' : ''}>Non</option>
                        <option value="yes" ${isYes(product?.animated) ? 'selected' : ''}>Oui</option>
                    </select>
                </div>
                <div class="adm-form-group">
                    <label class="adm-label">Popup Preuve Sociale (Achats récents)</label>
                    <select class="adm-select" id="p-socialPopup">
                        <option value="no" ${!isYes(product?.socialPopup) ? 'selected' : ''}>Non</option>
                        <option value="yes" ${isYes(product?.socialPopup) ? 'selected' : ''}>Oui</option>
                    </select>
                </div>
                <div class="adm-form-group">
                    <label class="adm-label">Popup de Réduction à la Sortie</label>
                    <input type="text" class="adm-input" id="p-remisePopup" value="${product?.remisePopup || 'no, 10'}" placeholder="yes, 10 ou no, 10">
                </div>
                <div class="adm-form-group">
                    <label class="adm-label">Couleurs disponibles (séparées par des virgules)</label>
                    <input type="text" class="adm-input" id="p-couleur" value="${product?.couleur || ''}" placeholder="Noir, Bleu, Rouge">
                </div>
                <div class="adm-form-group">
                    <label class="adm-label">Tailles disponibles (séparées par des virgules)</label>
                    <input type="text" class="adm-input" id="p-taille" value="${product?.taille || ''}" placeholder="S, M, L, XL">
                </div>
            </div>

            <hr style="border:none; border-top:1px solid var(--adm-border-light); margin:28px 0;">

            <!-- 4. MÉDIAS & DESCRIPTION -->
            <h3 style="margin:0 0 16px 0; font-size:16px; font-weight:800; color:var(--adm-primary);">4. Images & Description Détaillée</h3>
            <div class="adm-form-group" style="margin-bottom:18px;">
                <label class="adm-label">URL Image Principale (Featured Image) *</label>
                <input type="text" class="adm-input" id="p-featuredImage" value="${product?.featuredImage || ''}" required placeholder="https://...">
            </div>
            <div class="adm-form-group" style="margin-bottom:18px;">
                <label class="adm-label">Galerie d'images (Une URL par ligne)</label>
                <textarea class="adm-textarea" id="p-gallery" style="height:90px;" placeholder="https://image1.jpg&#10;https://image2.jpg">${(product?.gallery || []).join('\n')}</textarea>
            </div>
            <div class="adm-form-group">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                    <label class="adm-label">Description du produit (Format HTML ou Visuel)</label>
                    <div style="display:flex; gap:4px;">
                        <button type="button" id="tab-visual-editor" class="adm-btn-secondary" style="padding:3px 10px; font-size:11px;">Visuel</button>
                        <button type="button" id="tab-html-editor" class="adm-btn-secondary" style="padding:3px 10px; font-size:11px;">Code HTML</button>
                    </div>
                </div>
                <div id="desc-quill-container" style="min-height:280px; background:#fff; border:1px solid var(--adm-border); border-radius:var(--adm-radius-sm);">
                    ${product?.description || ''}
                </div>
                <textarea id="desc-html-textarea" class="adm-textarea" style="height:280px; display:none; font-family:monospace; font-size:12px; background:#1e293b; color:#f8fafc;">${product?.description || ''}</textarea>
                <input type="hidden" id="p-description-hidden" value="${(product?.description || '').replace(/"/g, '&quot;')}">
            </div>

            <div style="display:flex; justify-content:flex-end; gap:12px; margin-top:32px;">
                <a href="/admin/products" class="adm-btn-secondary" data-admin-nav>Annuler</a>
                <button type="submit" class="adm-btn-primary" style="padding:10px 24px;">
                    <i class="fa fa-check"></i> ${isEdit ? 'Enregistrer les Modifications' : 'Créer le Produit'}
                </button>
            </div>
        </form>
    `;
};

// --- RENDER ORDERS VIEW ---
export const renderOrdersView = () => {
    const orders = adminState.getOrders();

    return `
        ${renderAdminTopbar('Orders Management', 'Consultez, filtrez et traitez les commandes des clients en temps réel.')}

        <div class="adm-card" style="margin-bottom:20px;">
            <div class="adm-card-body" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
                <div style="display:flex; gap:12px; align-items:center; flex:1; max-width:400px;">
                    <div style="position:relative; flex:1;">
                        <i class="fa fa-search" style="position:absolute; left:12px; top:50%; transform:translateY(-50%); color:var(--adm-text-subtle);"></i>
                        <input type="text" id="orderSearchInput" class="adm-input" placeholder="Rechercher par client ou téléphone..." style="padding-left:36px; width:100%;">
                    </div>
                </div>

                <div class="adm-filter-pills" id="orderStatusFilters">
                    <button class="adm-filter-btn active" data-status="all">Toutes (${orders.length})</button>
                    <button class="adm-filter-btn" data-status="COMPLETED">Payées / Livrées</button>
                    <button class="adm-filter-btn" data-status="ABANDONED">Paniers Abandonnés</button>
                    <button class="adm-filter-btn" data-status="PENDING">En attente</button>
                </div>
            </div>
        </div>

        <div class="adm-card">
            <div class="adm-card-body" style="padding:0;">
                <table class="adm-table" id="admOrdersTable">
                    <thead>
                        <tr>
                            <th>N° Commande</th>
                            <th>Date</th>
                            <th>Client & Contact</th>
                            <th>Pays / Ville</th>
                            <th>Produit</th>
                            <th>Total</th>
                            <th>Statut</th>
                            <th style="text-align:right;">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orders.map(o => `
                            <tr data-order-status="${o.status}" data-order-search="${(o.customer_name + ' ' + o.telephone).toLowerCase()}">
                                <td style="font-family:monospace; font-weight:700; color:var(--adm-primary);">
                                    ${o.id}
                                </td>
                                <td style="font-size:11.5px; color:var(--adm-text-subtle);">
                                    ${o.dateStr}
                                </td>
                                <td>
                                    <div style="font-weight:700;">${o.customer_name}</div>
                                    <a href="https://wa.me/${o.telephone.replace(/\D/g, '')}" target="_blank" style="color:#10b981; font-size:11.5px; text-decoration:none; display:inline-flex; align-items:center; gap:4px;">
                                        <i class="fa-brands fa-whatsapp"></i> ${o.telephone}
                                    </a>
                                </td>
                                <td>
                                    <span class="adm-order-badge">${o.pays}</span>
                                    <small style="color:var(--adm-text-muted); display:block;">${o.adresse}</small>
                                </td>
                                <td style="max-width:200px; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                                    ${o.produit} x ${o.quantity || 1}
                                </td>
                                <td style="font-weight:700; color:var(--adm-text-main);">
                                    ${fmtNum(o.total)} ${o.currency || 'CFA'}
                                </td>
                                <td>
                                    <select class="adm-select order-status-select" data-order-id="${o.id}" style="padding:4px 8px; font-size:11px; font-weight:700;">
                                        <option value="COMPLETED" ${o.status === 'COMPLETED' ? 'selected' : ''}>COMPLETED</option>
                                        <option value="ABANDONED" ${o.status === 'ABANDONED' ? 'selected' : ''}>ABANDONED</option>
                                        <option value="PENDING" ${o.status === 'PENDING' ? 'selected' : ''}>PENDING</option>
                                        <option value="CANCELLED" ${o.status === 'CANCELLED' ? 'selected' : ''}>CANCELLED</option>
                                    </select>
                                </td>
                                <td style="text-align:right;">
                                    <button class="adm-btn-danger btn-delete-order" data-order-id="${o.id}" style="padding:4px 8px;" title="Supprimer">
                                        <i class="fa fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
};

// --- RENDER PROFIT & MARGES VIEW ---
export const renderProfitView = () => {
    const stats = adminState.getAnalytics();
    const cogsEst = Math.round(stats.totalRevenue * 0.35); // 35% estimated cost of goods
    const deliveryEst = stats.completedCount * 3000; // 3000 CFA avg delivery fee
    const netProfit = stats.totalRevenue - cogsEst - deliveryEst;
    const marginPct = ((netProfit / stats.totalRevenue) * 100).toFixed(1);

    return `
        ${renderAdminTopbar('Profit & Marges', 'Analyse détaillée des coûts, marges nettes et rentabilité par produit.')}

        <div class="adm-kpi-grid" style="grid-template-columns: repeat(4, 1fr);">
            <div class="adm-kpi-card">
                <div class="adm-kpi-label">CHIFFRE D'AFFAIRES BRUT</div>
                <div class="adm-kpi-val">${fmtNum(stats.totalRevenue)} CFA</div>
                <div class="adm-kpi-sub" style="color:#059669;">28 commandes payées</div>
            </div>
            <div class="adm-kpi-card">
                <div class="adm-kpi-label">COÛT D'ACHAT (COGS EST.)</div>
                <div class="adm-kpi-val" style="color:#ef4444;">${fmtNum(cogsEst)} CFA</div>
                <div class="adm-kpi-sub">~35% du CA</div>
            </div>
            <div class="adm-kpi-card">
                <div class="adm-kpi-label">FRAIS DE LIVRAISON (EST.)</div>
                <div class="adm-kpi-val" style="color:#f59e0b;">${fmtNum(deliveryEst)} CFA</div>
                <div class="adm-kpi-sub">3 000 CFA / colis</div>
            </div>
            <div class="adm-kpi-card">
                <div class="adm-kpi-label">BÉNÉFICE NET ESTIMÉ</div>
                <div class="adm-kpi-val" style="color:#7c3aed;">${fmtNum(netProfit)} CFA</div>
                <div class="adm-kpi-sub" style="color:#7c3aed; font-weight:700;">Marge Nette : ${marginPct}%</div>
            </div>
        </div>

        <div class="adm-card">
            <div class="adm-card-header">
                <div class="adm-card-title"><i class="fa fa-chart-pie"></i> Rentabilité par Produit Phare</div>
            </div>
            <div class="adm-card-body" style="padding:0;">
                <table class="adm-table">
                    <thead>
                        <tr>
                            <th>Produit</th>
                            <th>Commandes</th>
                            <th>CA Généré</th>
                            <th>Coût Estimé</th>
                            <th style="text-align:right;">Marge Nette Estimée</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${stats.topProducts.map(p => {
                            const pCogs = Math.round(p.revenue * 0.35);
                            const pDel = p.orders * 3000;
                            const pNet = p.revenue - pCogs - pDel;
                            return `
                                <tr>
                                    <td style="font-weight:700;">${p.name}</td>
                                    <td><span class="adm-order-badge">${p.orders}</span></td>
                                    <td>${fmtNum(p.revenue)} CFA</td>
                                    <td style="color:#ef4444;">${fmtNum(pCogs + pDel)} CFA</td>
                                    <td style="text-align:right; font-weight:800; color:#059669;">${fmtNum(pNet)} CFA</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
};

// --- RENDER CUSTOMERS VIEW ---
export const renderCustomersView = () => {
    const orders = adminState.getOrders();
    const customerMap = {};

    orders.forEach(o => {
        const key = o.telephone || o.customer_name;
        if (!customerMap[key]) {
            customerMap[key] = {
                name: o.customer_name,
                phone: o.telephone,
                pays: o.pays,
                adresse: o.adresse,
                ordersCount: 0,
                totalSpent: 0,
                lastOrder: o.dateStr
            };
        }
        customerMap[key].ordersCount += 1;
        customerMap[key].totalSpent += (o.total || 0);
    });

    const customers = Object.values(customerMap);

    return `
        ${renderAdminTopbar('Customers CRM', 'Liste des clients, historiques d\'achats et contact direct WhatsApp.')}

        <div class="adm-card">
            <div class="adm-card-body" style="padding:0;">
                <table class="adm-table">
                    <thead>
                        <tr>
                            <th>Nom du Client</th>
                            <th>Téléphone & WhatsApp</th>
                            <th>Pays / Ville</th>
                            <th>Nb Commandes</th>
                            <th>Total Dépensé</th>
                            <th>Dernière Commande</th>
                            <th style="text-align:right;">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${customers.map(c => `
                            <tr>
                                <td style="font-weight:700;">${c.name}</td>
                                <td>
                                    <a href="https://wa.me/${c.phone.replace(/\D/g, '')}" target="_blank" style="color:#10b981; font-weight:600; text-decoration:none; display:inline-flex; align-items:center; gap:6px;">
                                        <i class="fa-brands fa-whatsapp"></i> ${c.phone}
                                    </a>
                                </td>
                                <td>
                                    <span class="adm-order-badge">${c.pays}</span> ${c.adresse || ''}
                                </td>
                                <td><strong>${c.ordersCount}</strong></td>
                                <td style="font-weight:700; color:var(--adm-primary);">${fmtNum(c.totalSpent)} CFA</td>
                                <td style="color:var(--adm-text-subtle);">${c.lastOrder}</td>
                                <td style="text-align:right;">
                                    <a href="https://wa.me/${c.phone.replace(/\D/g, '')}" target="_blank" class="adm-btn-secondary" style="padding:4px 10px; font-size:11.5px; color:#10b981;">
                                        <i class="fa-brands fa-whatsapp"></i> Relancer
                                    </a>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
};

// --- RENDER DELIVERY VIEW ---
export const renderDeliveryView = () => {
    const stats = adminState.getAnalytics();

    return `
        ${renderAdminTopbar('Delivery & Logistics', 'Suivi des expéditions par pays et partenaires de livraison.')}

        <div class="adm-card">
            <div class="adm-card-header">
                <div class="adm-card-title"><i class="fa fa-truck-fast"></i> Répartition des Expéditions par Pays</div>
            </div>
            <div class="adm-card-body" style="padding:0;">
                <table class="adm-table">
                    <thead>
                        <tr>
                            <th>Pays</th>
                            <th>Colis Total</th>
                            <th>Livrés & Encaissés</th>
                            <th>Taux de Livraison</th>
                            <th>Statut Logistique</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${stats.salesByCountry.map(c => `
                            <tr>
                                <td style="font-weight:700;">${c.name}</td>
                                <td><span class="adm-order-badge">${c.orders}</span></td>
                                <td style="font-weight:700; color:#059669;">${c.completed}</td>
                                <td>
                                    <div style="display:flex; align-items:center; gap:8px;">
                                        <div class="adm-country-bar" style="width:100px;">
                                            <div class="adm-country-fill" style="width:${Math.round((c.completed/c.orders)*100)}%;"></div>
                                        </div>
                                        <small style="font-weight:700;">${Math.round((c.completed/c.orders)*100)}%</small>
                                    </div>
                                </td>
                                <td>
                                    <span class="adm-status-badge completed">Opérationnel</span>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
};

// --- RENDER REVIEWS VIEW ---
export const renderReviewsView = () => {
    return `
        ${renderAdminTopbar('Reviews & Testimonials', 'Gérez les avis clients et la réputation de vos produits.')}

        <div class="adm-card">
            <div class="adm-card-body">
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:20px;">
                    <div>
                        <h3 style="margin:0 0 4px 0;">Note globale du magasin</h3>
                        <div style="color:#f59e0b; font-size:18px;">
                            <i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star-half-stroke"></i>
                            <span style="font-size:15px; font-weight:800; color:var(--adm-text-main); margin-left:8px;">4.8 / 5</span>
                        </div>
                    </div>
                    <button class="adm-btn-primary" onclick="alert('Module d\'ajout d\'avis en développement')">
                        <i class="fa fa-plus"></i> Ajouter un avis
                    </button>
                </div>

                <div style="display:flex; flex-direction:column; gap:12px;">
                    <div style="padding:14px; border:1px solid var(--adm-border-light); border-radius:8px;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                            <strong>Aissatou B. (Guinée)</strong>
                            <span style="color:#f59e0b;"><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i></span>
                        </div>
                        <p style="margin:0; font-size:12.5px; color:var(--adm-text-muted);">"Produit FlyTex reçu très rapidement à Conakry. Qualité au top, je recommande vivement !"</p>
                    </div>
                    <div style="padding:14px; border:1px solid var(--adm-border-light); border-radius:8px;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                            <strong>Koffi K. (Abidjan)</strong>
                            <span style="color:#f59e0b;"><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i></span>
                        </div>
                        <p style="margin:0; font-size:12.5px; color:var(--adm-text-muted);">"Le portefeuille est encore plus beau en vrai. Paiement à la livraison sans aucun souci."</p>
                    </div>
                </div>
            </div>
        </div>
    `;
};

// --- RENDER TEAM VIEW ---
export const renderTeamView = () => {
    return `
        ${renderAdminTopbar('Team & Access', 'Membres de l\'équipe et niveaux d\'autorisation.')}

        <div class="adm-card">
            <div class="adm-card-body" style="padding:0;">
                <table class="adm-table">
                    <thead>
                        <tr>
                            <th>Utilisateur</th>
                            <th>Rôle</th>
                            <th>Email</th>
                            <th>Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="font-weight:700;">Admin Store</td>
                            <td><span class="adm-status-badge completed">Super Admin</span></td>
                            <td style="color:var(--adm-text-subtle);">admin@kenyamarket.online</td>
                            <td><span style="color:#059669; font-weight:700;">Actif</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
};

// --- RENDER AI AGENTS VIEW ---
export const renderAIAgentsView = () => {
    return `
        ${renderAdminTopbar('AI E-Commerce Agents', 'Outils intelligents pour générer des descriptions vendeuses et analyser vos ventes.')}

        <div class="adm-card" style="padding:24px;">
            <h3 style="margin:0 0 12px 0;"><i class="fa fa-wand-magic-sparkles" style="color:#7c3aed;"></i> Générateur de Description E-Commerce</h3>
            <p style="color:var(--adm-text-muted); font-size:13px; margin-bottom:20px;">Entrez simplement le nom de votre produit pour obtenir une fiche produit persuasive orientée conversion COD.</p>

            <div class="adm-form-group" style="margin-bottom:14px;">
                <label class="adm-label">Nom du Produit & Bénéfice Principal</label>
                <input type="text" id="aiProdInput" class="adm-input" placeholder="ex: Genouillère magnétique anti-douleur">
            </div>
            <button class="adm-btn-primary" id="btnRunAI">
                <i class="fa fa-bolt"></i> Générer avec l'IA
            </button>

            <div id="aiResultBlock" style="margin-top:20px; display:none; padding:16px; background:var(--adm-border-light); border-radius:8px;">
                <div style="font-weight:700; margin-bottom:8px; color:var(--adm-primary);">Proposition générée :</div>
                <div id="aiResultContent" style="font-size:13px; line-height:1.5;"></div>
            </div>
        </div>
    `;
};

// --- RENDER API REFERENCE VIEW ---
export const renderAPIView = () => {
    const settings = adminState.getSettings();

    return `
        ${renderAdminTopbar('API & Webhooks Reference', 'Intégrez Google Sheets, Cloudflare Workers et vos outils publicitaires.')}

        <div class="adm-card" style="padding:24px; margin-bottom:20px;">
            <h3 style="margin:0 0 12px 0;"><i class="fa fa-cloud" style="color:#3b82f6;"></i> Synchronisation GitHub & Cloudflare</h3>
            <p style="color:var(--adm-text-muted); font-size:13px; line-height:1.6;">
                Dépôt cible : <code>${settings.githubRepo}</code><br>
                Branche : <code>${settings.githubBranch}</code><br>
                Fichier : <code>${settings.githubPath}</code><br>
                Lorsque vous cliquez sur <strong>"Sauvegarder sur GitHub"</strong>, l'API REST GitHub crée un commit officiel qui déclenche automatiquement le déploiement Cloudflare Workers/Pages en moins de 60 secondes.
            </p>
        </div>

        <div class="adm-card" style="padding:24px;">
            <h3 style="margin:0 0 12px 0;"><i class="fa fa-table" style="color:#059669;"></i> Webhook Google Sheets</h3>
            <p style="color:var(--adm-text-muted); font-size:13px; line-height:1.6;">
                Toutes les commandes soumises via le formulaire de commande sont envoyées en arrière-plan vers votre Google Apps Script pour un suivi en temps réel dans votre feuille Google Sheets.
            </p>
        </div>
    `;
};

// --- RENDER SETTINGS VIEW ---
export const renderSettingsView = () => {
    const settings = adminState.getSettings();

    return `
        ${renderAdminTopbar('Settings', 'Configurez votre accès GitHub, vos clés de synchronisation et les paramètres généraux.')}

        <div class="adm-card" style="padding:28px; margin-bottom:24px;">
            <h3 style="margin:0 0 8px 0; color:var(--adm-primary);">
                <i class="fa-brands fa-github"></i> Intégration GitHub API (Déploiement Cloudflare Automatique)
            </h3>
            <p style="color:var(--adm-text-muted); font-size:13px; margin-bottom:20px; line-height:1.5;">
                Pour modifier vos produits sans devoir éditer le fichier <code>products.json</code> à la main sur GitHub, entrez votre <strong>GitHub Personal Access Token</strong> ci-dessous. Vos modifications seront commitées directement sur votre dépôt et Cloudflare déploiera automatiquement le nouveau site.
            </p>

            <form id="admGitHubSettingsForm">
                <div class="adm-form-grid">
                    <div class="adm-form-group" style="grid-column: span 2;">
                        <label class="adm-label">GitHub Personal Access Token (PAT) *</label>
                        <input type="password" class="adm-input" id="cfg-token" value="${settings.githubToken}" placeholder="ghp_xxxxxxxxxxxxxxxxxxxx">
                        <small style="color:var(--adm-text-subtle); font-size:11.5px; margin-top:4px;">
                            Créez un token sur GitHub : <em>GitHub → Settings → Developer Settings → Personal access tokens → Tokens (classic)</em> avec la case <strong>repo</strong> cochée.
                        </small>
                    </div>
                    <div class="adm-form-group">
                        <label class="adm-label">Dépôt GitHub (owner/repo)</label>
                        <input type="text" class="adm-input" id="cfg-repo" value="${settings.githubRepo}" placeholder="samidevx/Africa-Shop-Goo">
                    </div>
                    <div class="adm-form-group">
                        <label class="adm-label">Branche</label>
                        <input type="text" class="adm-input" id="cfg-branch" value="${settings.githubBranch}" placeholder="main">
                    </div>
                    <div class="adm-form-group">
                        <label class="adm-label">Chemin du fichier JSON</label>
                        <input type="text" class="adm-input" id="cfg-path" value="${settings.githubPath}" placeholder="src/data/products.json">
                    </div>
                </div>

                <div style="display:flex; gap:12px; margin-top:20px;">
                    <button type="submit" class="adm-btn-primary">
                        <i class="fa fa-save"></i> Enregistrer la configuration
                    </button>
                    <button type="button" class="adm-btn-success" id="btnTestGitHubSync">
                        <i class="fa fa-rotate"></i> Tester & Synchroniser maintenant
                    </button>
                </div>
            </form>
        </div>

        <div class="adm-card" style="padding:28px; margin-bottom:24px;">
            <h3 style="margin:0 0 16px 0; color:var(--adm-primary);">Paramètres de la Boutique & Sécurité</h3>
            <form id="admStoreSettingsForm">
                <div class="adm-form-grid">
                    <div class="adm-form-group">
                        <label class="adm-label">Nom de la Boutique</label>
                        <input type="text" class="adm-input" id="cfg-store-name" value="${settings.storeName}">
                    </div>
                    <div class="adm-form-group">
                        <label class="adm-label">Devise par défaut</label>
                        <input type="text" class="adm-input" id="cfg-store-currency" value="${settings.defaultCurrency}">
                    </div>
                    <div class="adm-form-group">
                        <label class="adm-label">WhatsApp Support Global</label>
                        <input type="text" class="adm-input" id="cfg-store-wa" value="${settings.whatsappNumber}">
                    </div>
                    <div class="adm-form-group">
                        <label class="adm-label">Mot de Passe Administrateur</label>
                        <input type="password" class="adm-input" id="cfg-admin-pwd" value="${settings.adminPassword}">
                    </div>
                </div>
                <div style="margin-top:20px;">
                    <button type="submit" class="adm-btn-primary">
                        <i class="fa fa-check"></i> Sauvegarder les paramètres généraux
                    </button>
                </div>
            </form>
        </div>

        <div class="adm-card" style="padding:28px;">
            <h3 style="margin:0 0 8px 0; color:#ef4444;">Sauvegardes & Réinitialisation</h3>
            <p style="color:var(--adm-text-muted); font-size:13px; margin-bottom:16px;">
                Vous pouvez réinitialiser le catalogue local avec les données d'origine de <code>products.json</code> si nécessaire.
            </p>
            <button type="button" class="adm-btn-danger" id="btnResetCatalog">
                <i class="fa fa-triangle-exclamation"></i> Réinitialiser le catalogue par défaut
            </button>
        </div>
    `;
};
