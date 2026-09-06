import './style.css';
import './admin/admin.css';
import productsData from './data/products.json';
import { adminUtils } from './admin_utils.js';
import { adminState } from './admin/admin_state.js';
import { renderAdminApp } from './admin/admin_controller.js';

// --- CONFIG ---
const GOOGLE_SHEETS_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbz6rSvIw9mW7mQNShnU9m3GjblCHuAaTAYgnfwdygkdGyfLeJQXGtXo6KlIDLm_ljxMdg/exec";
const COUNTRY_MAP = {
    "CI": "Côte d'Ivoire", "SN": "Sénégal", "BF": "Burkina Faso", "TG": "Togo", "BJ": "Bénin",
    "ML": "Mali", "GA": "Gabon", "CM": "Cameroun", "NE": "Niger", "CG": "Congo Brazzaville",
    "CD": "Congo Kinshasa", "GN": "Guinée", "TD": "Chad"
};

// --- STATE ---
let state = {
    currentProduct: null,
    quantity: 1,
    price: 0,
    currency: 'CFA',
    isBundle: false,
    cartSessionId: "ORD-" + Date.now().toString().slice(-6) + "-" + Math.floor(Math.random() * 1000),
    isSubmitting: false,
    initiateCheckoutFired: false,
    lastAbandonedStr: "",
    igIndex: 0,
    isAdmin: sessionStorage.getItem('admin_auth') === 'true'
};

// --- UTILS ---
const isYes = (val) => Boolean(val && val.toString().trim().toLowerCase() === 'yes');
const fmtPrice = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const optimizeBloggerImg = (url, size = '600') => {
    if (!url || !url.includes('blogger.googleusercontent.com')) return url;
    return url.replace(/\/s\d+\//, `/w${size}/`).replace(/\/s\d+$/, `/w${size}`);
};

window.openPolicyModal = (type) => {
    const modal = document.getElementById(`modal-${type}`);
    if (modal) modal.classList.add('open');
};
window.closePolicyModal = (type) => {
    const modal = document.getElementById(`modal-${type}`);
    if (modal) modal.classList.remove('open');
};

const getUTMParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const utms = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    utms.forEach(p => { if (urlParams.has(p)) sessionStorage.setItem(p, urlParams.get(p)); });
    return {
        utm_source: sessionStorage.getItem('utm_source') || '',
        utm_medium: sessionStorage.getItem('utm_medium') || '',
        utm_campaign: sessionStorage.getItem('utm_campaign') || '',
        utm_term: sessionStorage.getItem('utm_term') || '',
        utm_content: sessionStorage.getItem('utm_content') || ''
    };
};

// Reads phone (and optionally name) pre-filled by Facebook Ads via URL params.
// Supported params: ?tel=, ?phone=, ?telephone=, ?numero=
// Also supports ?nom= for name pre-fill.
// Values are persisted in sessionStorage so they survive same-session navigation.
const getLeadFromURL = () => {
    const p = new URLSearchParams(window.location.search);
    const phoneKeys = ['tel', 'phone', 'telephone', 'numero', 'phone_number'];
    let phone = '';
    for (const key of phoneKeys) {
        if (p.has(key) && p.get(key).trim()) {
            phone = p.get(key).trim();
            break;
        }
    }
    if (phone) sessionStorage.setItem('lead_phone', phone);
    const nom = p.get('nom') || p.get('name') || p.get('prenom') || '';
    if (nom) sessionStorage.setItem('lead_nom', nom.trim());
    return {
        phone: phone || sessionStorage.getItem('lead_phone') || '',
        nom: nom || sessionStorage.getItem('lead_nom') || ''
    };
};

const firePixel = (event, data) => {
    if (typeof fbq === 'function') fbq('track', event, data);
};

const navigate = (path) => {
    window.history.pushState({}, '', path);
    router();
};

const updateMeta = (name, content, attr = 'property') => {
    let el = document.querySelector(`meta[${attr}="${name}"]`);
    if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
    }
    el.setAttribute('content', content);
};

const updateSEO = (p = null) => {
    const brand = "LP Shop Africa";
    const baseUrl = "https://linanightwear.com";
    const oldSchema = document.getElementById('product-schema');
    if (oldSchema) oldSchema.remove();

    if (!p) {
        document.title = `${brand} - Boutique E-commerce & Mode`;
        updateMeta('og:title', `${brand} - Mode & Nightwear Premium`);
        updateMeta('og:description', "Découvrez notre collection exclusive.");
        updateMeta('og:image', "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1200");
        updateMeta('og:url', baseUrl);
        return;
    }

    const title = `${p.title} - ${brand}`;
    const desc = p.description.replace(/<[^>]*>/g, '').slice(0, 160) + '...';
    const url = `${baseUrl}/product/${p.id}`;

    document.title = title;
    updateMeta('description', desc, 'name');
    updateMeta('og:title', title);
    updateMeta('og:description', desc);
    updateMeta('og:image', p.featuredImage);
    updateMeta('og:url', url);
    updateMeta('og:type', 'product');
    updateMeta('product:price:amount', p.price);
    updateMeta('product:price:currency', p.currency);

    updateMeta('twitter:title', title, 'name');
    updateMeta('twitter:description', desc, 'name');
    updateMeta('twitter:image', p.featuredImage, 'name');

    const schema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": p.title,
        "image": [p.featuredImage],
        "description": desc,
        "sku": p.code || p.id,
        "brand": { "@type": "Brand", "name": brand },
        "offers": {
            "@type": "Offer",
            "url": url,
            "priceCurrency": p.currency === 'CFA' ? 'XOF' : p.currency,
            "price": p.price,
            "availability": "https://schema.org/InStock",
            "itemCondition": "https://schema.org/NewCondition"
        }
    };
    const script = document.createElement('script');
    script.id = 'product-schema';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);

    firePixel('ViewContent', {
        content_name: p.title,
        content_category: p.category,
        content_ids: [p.id],
        content_type: 'product',
        value: p.price,
        currency: p.currency === 'CFA' ? 'XOF' : p.currency
    });
};

// --- ROUTER ---
const router = () => {
    const path = window.location.pathname;
    const app = document.getElementById('app');
    app.className = ''; // Reset classes
    document.body.classList.remove('lp-mode-active', 'is-merci-page');


    // --- ADMIN ROUTES ---
    if (path.startsWith('/admin')) {
        if (path === '/admin/login') {
            renderAdminLogin();
            return;
        }
        if (!state.isAdmin) {
            navigate('/admin/login');
            return;
        }
        renderAdmin();
        return;
    }

    // Handle base paths if deployed in a subdirectory (common for GitHub Pages)
    const segments = path.split('/').filter(s => s.length > 0);

    // Simple logic: if last segment is 'merci', show thank you page.
    // If it starts with 'product', find id.
    if (path.endsWith('/merci') || path.endsWith('/merci/')) {
        renderMerci();
        updateSEO();
    } else if (path.includes('/product/')) {
        const id = path.split('/product/').pop().replace(/\//g, '');
        const products = adminUtils.getProducts();
        const product = products.find(p => p.id === id);
        if (product) {
            renderProduct(product);
            updateSEO(product);
        } else {
            navigate('/');
        }
    } else {
        renderHome();
        updateSEO();
    }
    window.scrollTo(0, 0);
};

// --- VIEWS ---
const renderHome = () => {
    const app = document.getElementById('app');
    const products = adminUtils.getProducts();
    app.innerHTML = `
        <div class="topbar">
            <span><i class="fa fa-truck"></i> Livraison Gratuite</span>
            <span><i class="fa fa-rotate-left"></i> Retour 7 jours</span>
        </div>
        <header class="site-header">
            <div class="header-inner">
                <div class="header-spacer"></div>
                <a href="/" class="site-logo">
                    <div class="site-logo-icon">🛒</div>
                    Lina Night Wear
                </a>
                <div class="header-spacer" style="display:flex; justify-content:flex-end;">
                    <button class="mode-toggle" id="dark-mode-toggle" aria-label="Changer le thème"><i class="fa fa-moon"></i><i class="fa fa-sun"></i></button>
                </div>
            </div>
        </header>
        <section class="hero">
            <div class="hero-inner">
                <div class="hero-pill">🔥 Offre Limitée</div>
                <h1>Produits de Qualité<br/>Livrés Chez Vous</h1>
                <p>Paiement à la livraison · Retour gratuit · Livraison rapide</p>
                <a class="hero-btn" href="#catalogue"><i class="fa fa-bag-shopping"></i> Voir les Produits</a>
            </div>
        </section>
        <div class="trust-bar">
            <div class="trust-inner">
                <div class="trust-item ti-green"><div class="trust-icon"><i class="fa fa-check"></i></div> Livraison Gratuite</div>
                <div class="trust-item ti-blue"><div class="trust-icon"><i class="fa fa-lock"></i></div> Paiement Sécurisé</div>
                <div class="trust-item ti-orange"><div class="trust-icon"><i class="fa fa-headset"></i></div> Support 7j/7</div>
                <div class="trust-item ti-green"><div class="trust-icon"><i class="fa fa-rotate-left"></i></div> Retour 7 Jours</div>
            </div>
        </div>
        <div class="catalogue fade-in" id="catalogue">
            <div class="catalogue-hdr">
                <h2>🛒 Nos Produits</h2>
                <p>Livraison gratuite · Paiement à la livraison</p>
            </div>
            <div class="catalogue-grid">
                ${products.slice(0, 4).map(p => `
                    <a class="pcard ${isYes(p.modeBlack) ? 'mode-nuit' : ''}" href="/product/${p.id}">
                        <div class="pcard-img">
                            <img src="${optimizeBloggerImg(p.featuredImage, 400)}" alt="${p.title}" loading="lazy">
                            <span class="pcard-badge">🔥 Offre</span>
                        </div>
                        <div class="pcard-body">
                            <div class="pcard-title">${p.title}</div>
                            <div class="pcard-price" style="font-size: 15px; margin-top: 5px;">Découvrir l'offre ➔</div>
                            <div class="pcard-stars">★★★★★</div>
                            <div class="pcard-cta"><i class="fa fa-bag-shopping"></i> Commander</div>
                        </div>
                    </a>
                `).join('')}
            </div>
        </div>
        <div class="sticky-bar">
            <a class="sticky-order" href="#catalogue" style="width: 100%;"><i class="fa fa-bag-shopping"></i> Voir Nos Produits</a>
        </div>
        ${renderFooter()}
    `;
    setupGlobalEvents();
};

const renderProduct = (p) => {
    state.currentProduct = p;
    state.price = p.price;
    state.currency = p.currency || 'CFA';
    state.quantity = 1;
    state.isBundle = false;
    state.igIndex = 0;
    const isLP = isYes(p.isLandingPage);

    // LP Body Classes
    if (isLP) document.body.classList.add('lp-mode-active');
    else document.body.classList.remove('lp-mode-active');

    // Hide footer if LP
    if (isLP) document.body.classList.add('is-merci-page');
    else document.body.classList.remove('is-merci-page');

    if (isYes(p.modeBlack)) document.body.classList.add('mode-nuit');
    else document.body.classList.remove('mode-nuit');

    // --- LCP PRELOAD: inject <link rel="preload"> for featured image ASAP ---
    const lcpImg = optimizeBloggerImg(p.featuredImage, 800);
    const existingPreload = document.getElementById('lcp-preload');
    if (existingPreload) existingPreload.remove();
    const preloadLink = document.createElement('link');
    preloadLink.id = 'lcp-preload';
    preloadLink.rel = 'preload';
    preloadLink.as = 'image';
    preloadLink.href = lcpImg;
    preloadLink.setAttribute('fetchpriority', 'high');
    document.head.appendChild(preloadLink);

    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="topbar">
            <span><i class="fa fa-truck"></i> Livraison Offerte Partout</span>
            <span><i class="fa fa-shield-halved"></i> Paiement à la Réception</span>
            <span><i class="fa fa-rotate-left"></i> Satisfait ou Remboursé 7 Jours</span>
        </div>
        <header class="site-header" style="${isLP ? 'display:none' : ''}">
            <div class="header-inner">
                <div class="header-spacer"></div>
                <a href="/" class="site-logo">
                    <div class="site-logo-icon"><i class="fa fa-bag-shopping"></i></div>
                    LP Shop Africa
                </a>
                <div class="header-spacer" style="display:flex; justify-content:flex-end;">
                    <button class="mode-toggle" id="dark-mode-toggle" aria-label="Changer le thème"><i class="fa fa-moon"></i><i class="fa fa-sun"></i></button>
                </div>
            </div>
        </header>
        <main class="product-page">
            ${isLP ? `<div class="prod-desc landing-mode-desc" style="margin-top:0; margin-bottom: 24px;">
                <div id="d-desc-content">${(() => {
                let desc = p.description;
                // For LP, the first image is likely the LCP. Let's make it eager and optimized.
                let imgCount = 0;
                return desc.replace(/<img([^>]+)>/gi, (match, attrs) => {
                    imgCount++;

                    // Auto-fill alt if missing or empty
                    if (!/alt\s*=\s*["'][^"']+["']/i.test(attrs)) {
                        let imgName = p.title;
                        const srcMatch = attrs.match(/src\s*=\s*["']([^"']+)["']/i);
                        if (srcMatch && srcMatch[1]) {
                            const urlStr = srcMatch[1];
                            const filename = urlStr.substring(urlStr.lastIndexOf('/') + 1).split('?')[0].split('.')[0];
                            if (filename) imgName = decodeURIComponent(filename).replace(/[-_]/g, ' ');
                        }
                        if (/alt\s*=\s*["']\s*["']/i.test(attrs)) {
                            attrs = attrs.replace(/alt\s*=\s*["']\s*["']/i, ` alt="${imgName}"`);
                        } else {
                            attrs += ` alt="${imgName}"`;
                        }
                    }

                    if (imgCount === 1) {
                        // First image: eager, high priority
                        return `<img${attrs.replace(/loading=["']lazy["']/gi, '').replace(/fetchpriority=["'][^"']*["']/gi, '')} loading="eager" fetchpriority="high">`;
                    } else {
                        // Subsequent images: lazy
                        return `<img${attrs.replace(/loading=["']eager["']/gi, '').replace(/fetchpriority=["'][^"']*["']/gi, '')} loading="lazy">`;
                    }
                });
            })()}</div>
            </div>` : ''}

            <div class="product-card">
                ${!isLP ? `
                <div class="prod-gallery">
                    ${(Array.isArray(p.gallery) && p.gallery.length > 0) || isYes(p.gallery) ? `
                        <div id="interactive-gallery">
                            <div class="ig-main">
                                <button class="ig-btn ig-prev" id="prev-ig" aria-label="Image précédente"><i class="fa fa-chevron-left"></i></button>
                                <img src="${optimizeBloggerImg(p.featuredImage, 800)}" id="ig-main-img" alt="${p.title}" fetchpriority="high" loading="eager">
                                <button class="ig-btn ig-next" id="next-ig" aria-label="Image suivante"><i class="fa fa-chevron-right"></i></button>
                            </div>
                            <div class="ig-thumbs" id="ig-thumbs">
                                ${[p.featuredImage, ...(Array.isArray(p.gallery) ? p.gallery : (p.images || []))].map((img, i) => `
                                    <div class="ig-thumb ${i === 0 ? 'active' : ''}" data-index="${i}"><img src="${optimizeBloggerImg(img, 200)}" alt="${p.title} - miniature ${i + 1}" loading="lazy"></div>
                                `).join('')}
                            </div>
                        </div>
                    ` : `
                        <img src="${p.featuredImage}" alt="${p.title}" fetchpriority="high" loading="eager">
                    `}

                </div>
                ` : ''}
                <div class="prod-info">
                    <h1 class="prod-title">${p.title}</h1>
                    <div class="prod-rating">
                        <div class="stars">★★★★★</div>
                        <span class="rating-count">(${p.reviews} avis vérifiés)</span>
                        <span class="rating-badge"><i class="fa fa-circle-check"></i> Vendeur Officiel</span>
                    </div>
                    <div class="price-row" style="margin-bottom: 10px; align-items: center;">
                        <span class="price-now" id="d-price">${fmtPrice(p.price)} ${p.currency}</span>
                        ${p.priceOld ? `<span class="price-old" id="d-price-old">${fmtPrice(p.priceOld)} ${p.currency}</span>` : ''}
                        ${p.priceOld ? `<span class="price-save" id="d-price-save">Économisez ${fmtPrice(p.priceOld - p.price)} ${p.currency} (-${Math.round((p.priceOld - p.price) / p.priceOld * 100)}%)</span>` : ''}
                    </div>
                    <p class="price-note" style="margin-bottom: 24px; font-size: 14px; color: var(--gray-600);"><i class="fa fa-shield-check" style="color: var(--green); margin-right: 6px;"></i> Paiement uniquement à la livraison — Zéro risque</p>
                    
                    <div class="stock-wrap">
                        <div class="stock-lbl">
                            <span>Disponibilité en magasin</span> 
                            <strong id="d-stock-lbl">⚠️ Plus que ${p.stock} pièces en stock !</strong>
                        </div>
                        <div class="stock-track">
                            <div class="stock-fill" style="width: 85%;"></div>
                        </div>
                    </div>

                    <ul class="feat-list">
                        <li class="feat-item"><i class="fa fa-truck-fast"></i> Livraison gratuite rapide à domicile</li>
                        <li class="feat-item"><i class="fa fa-hand-holding-dollar"></i> Payez après vérification du produit</li>
                        <li class="feat-item"><i class="fa fa-arrow-rotate-left"></i> Échange & retour gratuit sous 7 jours</li>
                        <li class="feat-item"><i class="fa fa-headset"></i> Support client dédié 7j/7</li>
                    </ul>
                </div>
            </div>

            <div class="order-col" id="orderFormBlock">
                <div class="order-card">
                    <div class="order-hdr">
                        <h2><i class="fa fa-shopping-cart"></i> Passer ma commande</h2>
                        <p>Remplissez le formulaire ci-dessous</p>
                    </div>
                    <div class="order-body">
                        <div id="countdown-container" style="${isYes(p.countdown) ? '' : 'display:none'}">
                             <div class="countdown-wrap">
                                 <div class="countdown-title">🔥 Fin de l'offre dans :</div>
                                 <div class="countdown-timer">
                                     <div class="time-box"><span id="cd-min">15</span><small>MIN</small></div>
                                     <div class="time-sep">:</div>
                                     <div class="time-box"><span id="cd-sec">00</span><small>SEC</small></div>
                                 </div>
                             </div>
                        </div>

                        ${isYes(p.bundle) ? `
                            <div class="bundle-wrap">
                                <div class="bundle-hdr">🎁 Sélectionnez votre Offre</div>
                                <div id="bundle-options">
                                    ${p.offres.map((o, i) => {
                                        const saveAmt = o.oldPrice > o.price ? o.oldPrice - o.price : 0;
                                        const savePct = o.oldPrice > o.price ? Math.round((saveAmt / o.oldPrice) * 100) : 0;
                                        let badgeHTML = '';
                                        if (savePct > 0) {
                                            if (i === 0) {
                                                badgeHTML = `<div class="bundle-badge badge-blue"><i class="fa fa-bolt"></i> Réduction ${savePct}%</div>`;
                                            } else {
                                                badgeHTML = `<div class="bundle-badge badge-orange"><i class="fa fa-fire"></i> Économisez ${fmtPrice(saveAmt)} ${p.currency} - Réduction ${savePct}%</div>`;
                                            }
                                        }
                                        return `
                                            <div class="bundle-opt ${i === 0 ? 'active' : ''}" data-qty="${o.qty}" data-price="${o.price}" data-old-price="${o.oldPrice}" data-title="${o.title}">
                                                ${badgeHTML}
                                                <div class="bundle-opt-content">
                                                    <div class="bundle-opt-details">
                                                        <div class="bundle-title">${o.title}</div>
                                                        <div class="bundle-price-row">
                                                            <span class="bundle-price-now">${fmtPrice(o.price)}</span>
                                                            <span class="bundle-currency">${p.currency}</span>
                                                            ${o.oldPrice ? `<span class="bundle-price-old">${fmtPrice(o.oldPrice)} ${p.currency}</span>` : ''}
                                                        </div>
                                                    </div>
                                                    <div class="bundle-radio">
                                                        <div class="bundle-radio-dot"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                            </div>
                        ` : ''}

                        <form id="orderForm">
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label" for="pays"><i class="fa fa-globe" style="color: var(--green);"></i> Pays <span class="req">*</span></label>
                                    <select class="form-control" id="pays" required>
                                        ${(() => {
                                            const countryList = (p.pays || '').split(',').map(c => c.trim()).filter(Boolean);
                                            if (countryList.length === 1) {
                                                const c = countryList[0];
                                                return `<option value="${c}" selected>${COUNTRY_MAP[c] || c}</option>`;
                                            }
                                            return `<option value="">Choisir le pays</option>` + countryList.map(c => `<option value="${c}">${COUNTRY_MAP[c] || c}</option>`).join('');
                                        })()}
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label" for="tel"><i class="fa fa-phone" style="color: var(--green);"></i> Téléphone <span class="req">*</span></label>
                                    <input type="tel" class="form-control" id="tel" placeholder="Ex: 77 000 00 00" required>
                                    <div class="error-msg" id="error-tel">Veuillez entrer un numéro valide (min 8 chiffres)</div>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label" for="nom"><i class="fa fa-user" style="color: var(--green);"></i> Nom complet <span class="req">*</span></label>
                                    <input type="text" class="form-control" id="nom" placeholder="Prénom et Nom" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label" for="adr"><i class="fa fa-location-dot" style="color: var(--green);"></i> Adresse / Ville <span class="req">*</span></label>
                                    <input type="text" class="form-control" id="adr" placeholder="Ville, Quartier, Rue" required>
                                </div>
                            </div>

                            <div class="confirm-box">
                                <label>
                                    <input type="checkbox" checked required style="width: 19px; height: 19px; accent-color: var(--green); margin-top: 2px; flex-shrink: 0; cursor: pointer;">
                                    <span>Je confirme ma disponibilité pour recevoir l'appel de confirmation et régler la commande à la livraison.</span>
                                </label>
                            </div>

                            <div class="form-row">
                                ${p.couleur ? `
                                    <div class="form-group">
                                        <label class="form-label" for="var-couleur"><i class="fa fa-palette" style="color: var(--green);"></i> Couleur</label>
                                        <select class="form-control" id="var-couleur">
                                            ${p.couleur.split(',').map(c => `<option value="${c}">${c}</option>`).join('')}
                                        </select>
                                    </div>
                                ` : ''}

                                ${p.taille ? `
                                    <div class="form-group">
                                        <label class="form-label" for="var-taille"><i class="fa fa-ruler-combined" style="color: var(--green);"></i> Taille</label>
                                        <select class="form-control" id="var-taille">
                                            ${p.taille.split(',').map(s => `<option value="${s}">${s}</option>`).join('')}
                                        </select>
                                    </div>
                                ` : ''}
                            </div>

                            ${isYes(p.showQuantity) && !isYes(p.bundle) ? `
                                <div class="qty-action-wrap">
                                    <label class="qty-action-lbl" for="manual-qty">Quantité</label>
                                    <div class="qty-box">
                                        <button type="button" class="qty-btn" id="btn-qty-minus" aria-label="Diminuer la quantité">-</button>
                                        <input type="number" class="qty-val" id="manual-qty" value="1" readonly>
                                        <button type="button" class="qty-btn" id="btn-qty-plus" aria-label="Augmenter la quantité">+</button>
                                    </div>
                                </div>
                            ` : ''}

                            <div class="order-summary">
                                <div class="sum-row"><span>Prix sous-total</span> <span>${fmtPrice(state.price)} ${p.currency}</span></div>
                                <div class="sum-row"><span>Quantité commandée</span> <span id="sum-qty">${state.quantity}</span></div>
                                <div class="sum-row"><span>Frais de livraison</span> <span style="color: var(--green); font-weight: 700;">GRATUIT</span></div>
                                <div class="sum-row sum-savings" id="sum-savings" style="display:none;">
                                    <span>💰 Économie immédiate</span>
                                    <span id="sum-savings-amt" style="color:var(--green); font-weight:800;"></span>
                                </div>
                                <div class="sum-total">
                                    <span>Montant Total à Payer</span>
                                    <span id="sum-total">${fmtPrice(state.price)} ${p.currency}</span>
                                </div>
                            </div>

                            <button type="submit" class="submit-btn ${isYes(p.animated) ? 'animated-yes' : ''}" id="submitBtn">
                                <i class="fa fa-lock"></i> Valider Ma Commande Maintenant
                            </button>
                            <div class="pay-icons" style="margin-top: 16px; gap: 8px;">
                                <span class="trust-badge"><i class="fa fa-money-bill-wave" style="color: var(--green);"></i> Paiement Cash</span>
                                <span class="trust-badge"><i class="fa fa-truck-fast" style="color: var(--green);"></i> Livraison Express</span>
                                <span class="trust-badge"><i class="fa fa-shield-check" style="color: var(--green);"></i> Garantie 7 Jours</span>
                            </div>
                        </form>
                    </div>
                </div>

                <div class="guar-card">
                    <div class="guar-icon"><i class="fa fa-shield-halved"></i></div>
                    <div class="guar-text">
                        <h3>Garantie Satisfaction</h3>
                        <p>Si vous n'êtes pas satisfait, nous vous remboursons dans les 7 jours.</p>
                    </div>
                </div>
            </div>

            ${!isLP ? `<div class="prod-desc">
                <h2 class="section-ttl"><i class="fa fa-file-lines"></i> Description</h2>
                <div id="d-desc-content"><div class="desc-placeholder" style="height:200px;background:var(--gray-100);border-radius:12px;display:flex;align-items:center;justify-content:center;color:var(--gray-400)"><i class="fa fa-image" style="font-size:32px"></i></div></div>
            </div>` : ''}

        </main>
        
        <div class="sticky-bar">
            <a class="sticky-order" href="#orderFormBlock" style="${(p['whatsapp-sticky'] ?? 'on').toString().toLowerCase() === 'off' ? 'width: 100%;' : ''}"><i class="fa fa-shopping-basket"></i> Commander</a>
            ${(p['whatsapp-sticky'] ?? 'on').toString().toLowerCase() !== 'off' && p.whatsapp ? `
            <a aria-label="WhatsApp" class="sticky-wa" href="https://wa.me/${p.whatsapp.replace(/\+/g, '')}?text=${encodeURIComponent(`Bonjour, je souhaite commander : ${p.title}\nLien : ${window.location.origin + window.location.pathname}`)}" target="_blank"><i class="fab fa-whatsapp"></i></a>
            ` : ''}
        </div>

        <!-- Modals -->
        <div class="modal" id="modal-confirm">
            <div class="modal-bg"></div>
            <div class="modal-box">
                <div class="modal-ico green"><i class="fa fa-circle-check"></i></div>
                <h3 class="modal-ttl">Confirmer votre commande ?</h3>
                <p class="modal-body">Souhaitez-vous valider votre commande de <strong>${p.title}</strong> ?</p>
                <div class="order-summary" style="margin-bottom: 20px;">
                    <div class="sum-row"><span>Produit :</span> <span id="modal-prod-label">${p.title} x ${state.quantity}</span></div>
                    <div class="sum-total"><span>Total :</span> <span id="modal-total-label">${fmtPrice(state.isBundle ? state.price : state.price * state.quantity)} ${p.currency}</span></div>
                </div>
                <div class="modal-btns">
                    <button class="modal-btn mbtn-cancel" id="m-cancel">Annuler</button>
                    <button class="modal-btn mbtn-confirm" id="m-ok">Oui, Confirmer</button>
                </div>
            </div>
        </div>

        <div class="modal remise-modal" id="modal-remise">
            <div class="modal-bg"></div>
            <div class="modal-box">
                <div class="remise-title">ATTENDEZ ! 🎁</div>
                <p class="remise-sub">Ne partez pas les mains vides. Profitez d'une remise immédiate !</p>
                <div class="remise-discount">5% OFF</div>
                <p class="remise-note">Valable uniquement pour les 15 prochaines minutes.</p>
                <button class="remise-btn" id="btn-apply-remise">APPLIQUER MA RÉDUCTION</button>
            </div>
        </div>

        ${renderFooter()}
    `;
    setupProductEvents(p);
    setupGlobalEvents();

    // Defer description HTML injection (only for non-LP mode; LP injects directly)
    if (!isLP) {
        const injectDesc = () => {
            const descEl = document.getElementById('d-desc-content');
            if (!descEl) return;
            // Strip competing fetchpriority=high from description images & ensure lazy loading
            let cleanDesc = p.description.replace(/fetchpriority="high"/gi, 'loading="lazy"');
            cleanDesc = cleanDesc.replace(/<img([^>]+)>/gi, (match, attrs) => {
                // Auto-fill alt if missing or empty
                if (!/alt\s*=\s*["'][^"']+["']/i.test(attrs)) {
                    let imgName = p.title;
                    const srcMatch = attrs.match(/src\s*=\s*["']([^"']+)["']/i);
                    if (srcMatch && srcMatch[1]) {
                        const urlStr = srcMatch[1];
                        const filename = urlStr.substring(urlStr.lastIndexOf('/') + 1).split('?')[0].split('.')[0];
                        if (filename) imgName = decodeURIComponent(filename).replace(/[-_]/g, ' ');
                    }
                    if (/alt\s*=\s*["']\s*["']/i.test(attrs)) {
                        attrs = attrs.replace(/alt\s*=\s*["']\s*["']/i, ` alt="${imgName}"`);
                    } else {
                        attrs += ` alt="${imgName}"`;
                    }
                }
                if (!/loading=/i.test(attrs)) {
                    attrs += ' loading="lazy"';
                }
                return `<img${attrs}>`;
            });
            descEl.innerHTML = cleanDesc;
        };
        if ('requestIdleCallback' in window) {
            requestIdleCallback(injectDesc, { timeout: 3000 });
        } else {
            setTimeout(injectDesc, 300);
        }
    }
};

// Reusable: POST an order object to Google Sheets
const submitOrderToSheet = (data) => {
    const fd = new FormData();
    const skip = new Set(['timestamp', 'customer_name', 'product_name', 'total', 'currency']);
    Object.entries(data).forEach(([k, v]) => { if (!skip.has(k)) fd.append(k, v); });
    fetch(GOOGLE_SHEETS_WEBAPP_URL, { method: 'POST', body: fd, mode: 'no-cors', keepalive: true });
};

const renderMerci = () => {
    document.body.classList.add('is-merci-page');
    const app = document.getElementById('app');

    const order = JSON.parse(sessionStorage.getItem('last_order') || '{}');
    const currency = order.currency || 'CFA';

    app.innerHTML = `
        <div class="product-page fade-in" style="max-width:520px; padding:40px 20px;">
            <div class="product-card" style="text-align:center; padding:36px 24px;">
                <div class="modal-ico green" style="margin-bottom:16px;"><i class="fa fa-circle-check"></i></div>
                <h1 style="font-family:var(--fh); margin-bottom:8px;">MERCI ${order.customer_name || '!'}</h1>
                <p style="color:var(--gray-600); margin-bottom:20px;">Votre commande pour <strong>${order.product_name || 'votre produit'}</strong> a été reçue avec succès.</p>
                <div class="order-summary" style="margin-top:16px;">
                    <div class="sum-row"><span>Produit :</span> <span>${order.product_name} x ${order.quantity}</span></div>
                    <div class="sum-row"><span>Total :</span> <span>${fmtPrice(order.total || 0)} ${currency}</span></div>
                    <div class="sum-total"><span>Statut :</span> <span style="color:var(--green)">En cours</span></div>
                </div>
                <p style="font-size:13px; color:var(--gray-400); margin-top:16px;">Un conseiller vous contactera dans les plus brefs délais pour confirmer la livraison.</p>
            </div>
        </div>
    `;
};

const renderFooter = () => `
    <footer class="site-footer">
        <div class="footer-inner">
            <div class="footer-brand-emblem">
                <div class="footer-emblem-icon">
                    <i class="fa fa-bag-shopping"></i>
                </div>
            </div>
            <h2 class="footer-brand-name">LP Shop Africa</h2>
            <p class="footer-brand-desc">
                Boutique moderne avec une touche d'élégance, offrant des produits sélectionnés avec soin pour votre style, de qualité supérieure et à prix abordables.
            </p>

            <div class="footer-socials">
                <a href="https://wa.me/" target="_blank" rel="noopener" aria-label="WhatsApp" class="footer-social-btn"><i class="fab fa-whatsapp"></i></a>
                <a href="#" target="_blank" rel="noopener" aria-label="Instagram" class="footer-social-btn"><i class="fab fa-instagram"></i></a>
                <a href="#" target="_blank" rel="noopener" aria-label="Facebook" class="footer-social-btn"><i class="fab fa-facebook-f"></i></a>
            </div>

            <div class="footer-policy-nav">
                <button type="button" onclick="window.openPolicyModal('privacy');" class="footer-policy-link">Politique de confidentialité</button>
                <span class="footer-policy-dot">•</span>
                <button type="button" onclick="window.openPolicyModal('terms');" class="footer-policy-link">Conditions d'utilisation</button>
                <span class="footer-policy-dot">•</span>
                <button type="button" onclick="window.openPolicyModal('returns');" class="footer-policy-link">Politique de retour et d'échange</button>
            </div>

            <hr class="footer-line">

            <p class="footer-copyright">© 2026 LP Shop Africa. Tous droits réservés.</p>
        </div>
    </footer>

    <!-- Policy Modals -->
    <div class="modal policy-modal" id="modal-privacy">
        <div class="modal-bg" onclick="window.closePolicyModal('privacy')"></div>
        <div class="modal-box policy-modal-box">
            <button class="policy-modal-close" onclick="window.closePolicyModal('privacy')">&times;</button>
            <h3 class="policy-modal-title">Politique de confidentialité</h3>
            <div class="policy-modal-content">
                <p><strong>Collecte de données :</strong> Nous collectons votre nom, numéro de téléphone, Wilaya et Commune uniquement pour traiter et livrer votre commande de manière efficace.</p>
                <p><strong>Utilisation des données :</strong> Vos informations personnelles ne sont jamais partagées, vendues ou louées à des tiers, à l'exception de notre partenaire de livraison pour assurer le transport et le suivi de vos colis.</p>
                <p><strong>Sécurité des données :</strong> Nous prenons toutes les mesures de sécurité nécessaires pour protéger vos données contre tout accès non autorisé.</p>
            </div>
        </div>
    </div>

    <div class="modal policy-modal" id="modal-terms">
        <div class="modal-bg" onclick="window.closePolicyModal('terms')"></div>
        <div class="modal-box policy-modal-box">
            <button class="policy-modal-close" onclick="window.closePolicyModal('terms')">&times;</button>
            <h3 class="policy-modal-title">Conditions d'utilisation</h3>
            <div class="policy-modal-content">
                <p><strong>Commandes :</strong> En passant commande sur notre site, vous confirmez que les informations fournies sont exactes. Notre équipe vous appellera par téléphone pour confirmer la commande avant l'expédition.</p>
                <p><strong>Paiement :</strong> Le règlement des commandes s'effectue intégralement en espèces lors de la réception de votre colis (Paiement à la livraison - COD).</p>
                <p><strong>Annulation :</strong> Si vous souhaitez annuler ou modifier votre commande, veuillez contacter notre service client au plus tard 2 heures après la validation sur le site.</p>
            </div>
        </div>
    </div>

    <div class="modal policy-modal" id="modal-returns">
        <div class="modal-bg" onclick="window.closePolicyModal('returns')"></div>
        <div class="modal-box policy-modal-box">
            <button class="policy-modal-close" onclick="window.closePolicyModal('returns')">&times;</button>
            <h3 class="policy-modal-title">Politique de retour et d'échange</h3>
            <div class="policy-modal-content">
                <p><strong>Délai de retour :</strong> Vous disposez d'un délai de 7 jours après la réception de votre colis pour demander un retour ou un échange de produit.</p>
                <p><strong>Conditions des articles :</strong> Les articles doivent être retournés dans leur état d'origine, non portés, non lavés, avec toutes les étiquettes et dans leur emballage d'origine.</p>
                <p><strong>Frais de retour :</strong> Les frais de retour ou d'échange sont à la charge du client, sauf en cas de produit défectueux ou d'erreur de notre part lors de la préparation de la commande.</p>
            </div>
        </div>
    </div>
`;

// --- ADMIN VIEWS ---
const renderAdminLogin = () => {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="login-screen" style="display:flex; min-height:100vh; align-items:center; justify-content:center; background:#f8fafc; font-family:'Jost',system-ui,sans-serif;">
            <div class="login-card fade-in" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:18px; padding:44px 36px; width:100%; max-width:380px; box-shadow:0 10px 25px -4px rgba(124,58,237,0.12), 0 4px 10px -2px rgba(0,0,0,0.04);">
                <div style="width:48px; height:48px; background:linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); border-radius:12px; display:flex; align-items:center; justify-content:center; color:#fff; font-size:22px; margin:0 auto 16px auto; box-shadow:0 4px 14px rgba(124,58,237,0.35);">
                    <i class="fa fa-layer-group"></i>
                </div>
                <h1 style="font-size:22px; font-weight:800; text-align:center; margin:0 0 6px 0; color:#0f172a; letter-spacing:-0.02em;">Dashboard Admin</h1>
                <p style="text-align:center; color:#64748b; font-size:13px; margin:0 0 24px 0;">Connexion au panneau de gestion du magasin</p>
                <form id="loginForm">
                    <div class="form-group" style="margin-bottom:18px;">
                        <label class="form-label" style="display:block; font-size:12px; font-weight:700; color:#0f172a; margin-bottom:6px;">Mot de passe</label>
                        <input type="password" class="form-control" id="adminPass" required placeholder="Mot de passe (par défaut: admin123)" style="width:100%; padding:10px 12px; border:1px solid #cbd5e1; border-radius:8px; font-size:13px; box-sizing:border-box;">
                    </div>
                    <button type="submit" class="btn-primary" style="width:100%; justify-content:center; padding:12px; background:linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); border:none; border-radius:8px; color:#fff; font-weight:700; cursor:pointer; font-size:14px; box-shadow:0 4px 14px rgba(124,58,237,0.25);">Se connecter</button>
                    <div id="loginError" style="color:#ef4444; font-size:12.5px; text-align:center; margin-top:12px; display:none;">Mot de passe incorrect</div>
                </form>
            </div>
        </div>
    `;
    document.getElementById('loginForm').onsubmit = (e) => {
        e.preventDefault();
        const pass = document.getElementById('adminPass').value;
        const savedPass = localStorage.getItem('admin_pwd') || 'admin123';
        if (pass === savedPass || pass === 'admin123') {
            sessionStorage.setItem('admin_auth', 'true');
            state.isAdmin = true;
            navigate('/admin');
        } else {
            document.getElementById('loginError').style.display = 'block';
        }
    };
};

const renderAdmin = () => {
    renderAdminApp(navigate);
};


// --- EVENT HANDLERS ---
const setupGlobalEvents = () => {
    const toggle = document.getElementById('dark-mode-toggle');
    if (toggle) {
        toggle.onclick = () => {
            document.body.classList.toggle('mode-nuit');
        };
    }
};

// --- SOCIAL PROOF POPUPS ---
const initSocialProof = (p) => {
    // Rich pool of realistic West African names + cities
    const LEADS = [
        // Côte d'Ivoire
        { name: 'Aminata K.', city: 'Abidjan', flag: '🇨🇮' },
        { name: 'Kouassi M.', city: 'Bouaké', flag: '🇨🇮' },
        { name: 'Awa T.', city: 'Daloa', flag: '🇨🇮' },
        { name: 'Rosine B.', city: 'Yamoussoukro', flag: '🇨🇮' },
        { name: 'Dramane S.', city: 'Korhogo', flag: '🇨🇮' },
        { name: 'Edwige N.', city: 'San-Pédro', flag: '🇨🇮' },
        { name: 'Pascal A.', city: 'Gagnoa', flag: '🇨🇮' },
        // Sénégal
        { name: 'Fatou D.', city: 'Dakar', flag: '🇸🇳' },
        { name: 'Moussa N.', city: 'Thiès', flag: '🇸🇳' },
        { name: 'Adja F.', city: 'Saint-Louis', flag: '🇸🇳' },
        { name: 'Ousmane B.', city: 'Kaolack', flag: '🇸🇳' },
        { name: 'Bintou S.', city: 'Ziguinchor', flag: '🇸🇳' },
        // Cameroun
        { name: 'Marie-Claire E.', city: 'Douala', flag: '🇨🇲' },
        { name: 'Théodore M.', city: 'Yaoundé', flag: '🇨🇲' },
        { name: 'Euphrasie T.', city: 'Bafoussam', flag: '🇨🇲' },
        { name: 'Rodrigue N.', city: 'Garoua', flag: '🇨🇲' },
        // Burkina Faso
        { name: 'Salimata O.', city: 'Ouagadougou', flag: '🇧🇫' },
        { name: 'Issouf K.', city: 'Bobo-Dioulasso', flag: '🇧🇫' },
        { name: 'Mariam Z.', city: 'Koudougou', flag: '🇧🇫' },
        // Mali
        { name: 'Fatoumata C.', city: 'Bamako', flag: '🇲🇱' },
        { name: 'Ibrahim D.', city: 'Sikasso', flag: '🇲🇱' },
        { name: 'Kadiatou B.', city: 'Ségou', flag: '🇲🇱' },
        // Togo
        { name: 'Abiba A.', city: 'Lomé', flag: '🇹🇬' },
        { name: 'Koffi M.', city: 'Sokodé', flag: '🇹🇬' },
        // Bénin
        { name: 'Bernadette H.', city: 'Cotonou', flag: '🇧🇯' },
        { name: 'Aristide G.', city: 'Porto-Novo', flag: '🇧🇯' },
        { name: 'Albertine L.', city: 'Parakou', flag: '🇧🇯' },
        // Guinée
        { name: 'Hawa C.', city: 'Conakry', flag: '🇬🇳' },
        { name: 'Sékou B.', city: 'Kankan', flag: '🇬🇳' },
        // Congo
        { name: 'Nadia M.', city: 'Brazzaville', flag: '🇨🇬' },
        { name: 'Marcel F.', city: 'Pointe-Noire', flag: '🇨🇬' },
        // Gabon
        { name: 'Fernand O.', city: 'Libreville', flag: '🇬🇦' },
    ];

    const TIMES = [
        'il y a 2 min', 'il y a 4 min', 'il y a 7 min', 'il y a 11 min',
        'il y a 15 min', 'il y a 18 min', 'il y a 23 min', 'il y a 1 heure',
        'il y a 32 min', 'il y a 45 min', 'il y a 3 min', 'il y a 9 min'
    ];

    // Shuffle so order feels random each visit
    const shuffled = [...LEADS].sort(() => Math.random() - 0.5);
    let idx = 0;

    // Inject the popup container into the DOM (fixed, bottom-left)
    const popup = document.createElement('div');
    popup.id = 'sp-popup';
    popup.setAttribute('aria-live', 'polite');
    popup.setAttribute('aria-atomic', 'true');
    document.body.appendChild(popup);

    const showNext = () => {
        const lead = shuffled[idx % shuffled.length];
        const time = TIMES[Math.floor(Math.random() * TIMES.length)];
        const initials = lead.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
        // Cycle through avatar background colors
        const colors = ['#1a56db', '#057a55', '#c45200', '#7c3aed', '#be185d', '#0e7490'];
        const bg = colors[idx % colors.length];

        popup.innerHTML = `
            <div class="sp-avatar" style="background:${bg};">${initials}</div>
            <div class="sp-body">
                <div class="sp-name">${lead.flag} <strong>${lead.name}</strong> <span class="sp-city">· ${lead.city}</span></div>
                <div class="sp-action">vient de commander <strong>${p.title}</strong></div>
                <div class="sp-time"><i class="fa fa-clock"></i> ${time}</div>
            </div>
            <button class="sp-close" id="sp-close-btn" aria-label="Fermer">×</button>
        `;
        popup.classList.add('sp-visible');

        document.getElementById('sp-close-btn').onclick = () => {
            popup.classList.remove('sp-visible');
        };

        idx++;

        // Auto-hide after 5s
        setTimeout(() => popup.classList.remove('sp-visible'), 5000);
    };

    // First popup appears after 8 seconds, then every 35-65s
    setTimeout(() => {
        showNext();
        setInterval(showNext, 35000 + Math.floor(Math.random() * 30000));
    }, 8000);
};

const setupProductEvents = (p) => {
    // --- PHONE / NAME PRE-FILL FROM URL ---
    const lead = getLeadFromURL();
    if (lead.phone) {
        const telInput = document.getElementById('tel');
        if (telInput && !telInput.value) {
            telInput.value = lead.phone;
            // Show a reassuring "detected" badge below the field
            const badge = document.createElement('div');
            badge.id = 'tel-detected-badge';
            badge.innerHTML = '<i class="fa fa-circle-check" style="color:var(--green);font-size:13px;"></i> Numéro détecté automatiquement';
            badge.style.cssText = 'display:flex;align-items:center;gap:6px;font-size:12px;font-weight:600;color:var(--green);margin-top:6px;animation:fadeInUp .3s ease;';
            telInput.parentElement.appendChild(badge);
            // Green border on the input to draw attention
            telInput.style.borderColor = 'var(--green)';
            telInput.style.boxShadow = '0 0 0 3px rgba(5,122,85,.12)';
        }
    }
    if (lead.nom) {
        const nomInput = document.getElementById('nom');
        if (nomInput && !nomInput.value) nomInput.value = lead.nom;
    }

    // --- PAYS AUTO-SELECT ---
    const paysSelect = document.getElementById('pays');
    if (paysSelect) {
        const countryList = (p.pays || '').split(',').map(c => c.trim()).filter(Boolean);
        if (countryList.length === 1) {
            paysSelect.value = countryList[0];
        }
    }

    // --- SOCIAL PROOF ---
    if (!p.socialPopup || p.socialPopup.toLowerCase() !== 'no') initSocialProof(p);

    // --- GALLERY ---
    if ((Array.isArray(p.gallery) && p.gallery.length > 0) || isYes(p.gallery)) {
        const images = [p.featuredImage, ...(Array.isArray(p.gallery) ? p.gallery : (p.images || []))];
        const mainImg = document.getElementById('ig-main-img');
        const thumbs = document.querySelectorAll('.ig-thumb');

        const changeIg = (idx) => {
            state.igIndex = idx;
            mainImg.src = images[idx];
            thumbs.forEach(t => t.classList.remove('active'));
            thumbs[idx].classList.add('active');
        };

        const prevBtn = document.getElementById('prev-ig');
        const nextBtn = document.getElementById('next-ig');

        if (prevBtn) {
            prevBtn.onclick = () => {
                let n = state.igIndex - 1;
                if (n < 0) n = images.length - 1;
                changeIg(n);
            };
        }
        if (nextBtn) {
            nextBtn.onclick = () => {
                let n = state.igIndex + 1;
                if (n >= images.length) n = 0;
                changeIg(n);
            };
        }
        thumbs.forEach(t => {
            t.onclick = () => changeIg(parseInt(t.dataset.index));
        });
    }

    const updateOrderSummary = () => {
        // For bundles: price already covers all units — don't multiply by qty
        const total = state.isBundle ? state.price : state.price * state.quantity;
        document.getElementById('sum-qty').innerText = state.quantity;
        document.getElementById('sum-total').innerText = fmtPrice(total) + ' ' + p.currency;
        // Also update the "Prix du produit" row to show the selected offer price
        const priceRow = document.querySelector('.order-summary .sum-row:first-child span:last-child');
        if (priceRow) priceRow.innerText = fmtPrice(state.price) + ' ' + p.currency;
        if (document.getElementById('manual-qty')) document.getElementById('manual-qty').value = state.quantity;

        // --- Savings callout ---
        const savingsRow = document.getElementById('sum-savings');
        const savingsAmt = document.getElementById('sum-savings-amt');
        if (savingsRow && savingsAmt) {
            let saving = 0;
            if (state.isBundle) {
                // Read oldPrice from the currently active bundle option
                const activeOpt = document.querySelector('.bundle-opt.active');
                if (activeOpt && activeOpt.dataset.oldPrice) {
                    const oldPrice = parseInt(activeOpt.dataset.oldPrice);
                    saving = oldPrice - state.price;
                }
            } else if (p.priceOld && p.priceOld > state.price) {
                // Regular product with a crossed-out old price
                saving = (p.priceOld - state.price) * state.quantity;
            }
            if (saving > 0) {
                savingsAmt.innerText = fmtPrice(saving) + ' ' + p.currency + ' !';
                savingsRow.style.display = 'flex';
            } else {
                savingsRow.style.display = 'none';
            }
        }
    };

    // --- BUNDLES ---
    if (isYes(p.bundle)) {
        const bundleOpts = document.querySelectorAll('.bundle-opt');
        state.isBundle = true;
        bundleOpts.forEach(opt => {
            opt.onclick = () => {
                bundleOpts.forEach(b => b.classList.remove('active'));
                opt.classList.add('active');
                state.quantity = parseInt(opt.dataset.qty);
                state.price = parseInt(opt.dataset.price);
                state.isBundle = true; // bundle price covers all qty
                updateOrderSummary();
            };
        });
        // Immediately apply the pre-selected first offer to state and refresh
        // the summary — no click required on page load.
        if (bundleOpts.length > 0) {
            const firstOpt = bundleOpts[0];
            state.quantity = parseInt(firstOpt.dataset.qty);
            state.price = parseInt(firstOpt.dataset.price);
            updateOrderSummary();
        }
    } else {
        state.isBundle = false;
        updateOrderSummary();
    }

    // --- QUANTITY ---
    const btnM = document.getElementById('btn-qty-minus');
    const btnP = document.getElementById('btn-qty-plus');
    if (btnM && btnP) {
        btnM.onclick = () => { if (state.quantity > 1) { state.quantity--; state.isBundle = false; updateOrderSummary(); } };
        btnP.onclick = () => { state.quantity++; state.isBundle = false; updateOrderSummary(); };
    }

    // --- COUNTDOWN ---
    if (isYes(p.countdown)) {
        let timer = 900; // 15 mins
        const minEl = document.getElementById('cd-min');
        const secEl = document.getElementById('cd-sec');
        setInterval(() => {
            if (timer > 0) {
                timer--;
                let m = Math.floor(timer / 60);
                let s = timer % 60;
                minEl.innerText = m < 10 ? '0' + m : m;
                secEl.innerText = s < 10 ? '0' + s : s;
            }
        }, 1000);
    }

    // --- FORM SUBMISSION ---
    const form = document.getElementById('orderForm');
    form.onsubmit = async (e) => {
        e.preventDefault();

        const telInput = document.getElementById('tel');
        const telVal = telInput.value.replace(/\D/g, '');
        if (telVal.length < 8) {
            telInput.parentElement.classList.add('error');
            telInput.classList.add('shake');
            setTimeout(() => telInput.classList.remove('shake'), 400);
            telInput.focus();
            return;
        } else {
            telInput.parentElement.classList.remove('error');
        }

        // Track the completion of the form
        const finalTotal = state.isBundle ? state.price : state.price * state.quantity;
        firePixel('InitiateCheckout', {
            value: finalTotal,
            currency: p.currency === 'CFA' ? 'XOF' : p.currency,
            content_name: p.title
        });

        const ok = await new Promise(res => {
            const modal = document.getElementById('modal-confirm');
            const prodLabel = document.getElementById('modal-prod-label');
            const totalLabel = document.getElementById('modal-total-label');
            if (prodLabel) prodLabel.textContent = `${p.title} x ${state.quantity}`;
            if (totalLabel) totalLabel.textContent = `${fmtPrice(finalTotal)} ${p.currency}`;
            modal.classList.add('open');
            document.getElementById('m-ok').onclick = () => { modal.classList.remove('open'); res(true); };
            document.getElementById('m-cancel').onclick = () => { modal.classList.remove('open'); res(false); };
        });
        if (!ok) return;

        state.isSubmitting = true;
        const btn = document.getElementById('submitBtn');
        btn.disabled = true;
        btn.innerHTML = 'Envoi... <span class="spinner"></span>';

        const nom = document.getElementById('nom').value;
        const tel = document.getElementById('tel').value;
        const pays = document.getElementById('pays').value;
        const adresse = document.getElementById('adr').value;
        const vCouleur = document.getElementById('var-couleur');
        const vTaille = document.getElementById('var-taille');
        const utms = getUTMParams();

        // Build the base order object (used both paths)
        const orderPayload = {
            nom, telephone: tel, pays, adresse,
            produit: p.title,
            prix: finalTotal + ' ' + p.currency,
            total_raw: finalTotal,
            quantity: state.quantity,
            platform: 'GitHubPages',
            order_id: state.cartSessionId,
            code: p.code || '',
            status: 'COMPLETED',
            currency: p.currency,
            ...(vCouleur ? { couleur: vCouleur.value } : {}),
            ...(vTaille ? { taille: vTaille.value } : {}),
            ...utms,
            // For /merci display
            timestamp: Date.now(),
            customer_name: nom,
            product_name: p.title,
            total: finalTotal,
        };

        firePixel('Purchase', {
            value: finalTotal,
            currency: p.currency === 'CFA' ? 'XOF' : p.currency,
            content_name: p.title,
            content_ids: [p.code || window.location.pathname],
            content_type: 'product',
            num_items: state.quantity
        });

        try {
            // Submit immediately and redirect to thank-you page
            submitOrderToSheet(orderPayload);
            adminState.addOrder(orderPayload);
            sessionStorage.setItem('last_order', JSON.stringify({
                customer_name: nom, product_name: p.title,
                quantity: state.quantity, total: finalTotal, currency: p.currency
            }));
            setTimeout(() => { window.location.pathname = '/merci'; }, 200);
        } catch (err) {
            btn.innerHTML = '❌ ÉCHEC, RÉESSAYER';
            btn.style.background = '#c81e1e';
            btn.disabled = false;
        }
    };

    // --- ABANDONED CHECKOUT ---
    const logAbandoned = () => {
        if (state.isSubmitting) return;
        const form = document.getElementById('orderForm');
        if (!form) return;

        const requireds = Array.from(form.querySelectorAll('[required]'));
        const allValid = requireds.every(el => {
            if (el.type === 'checkbox') return el.checked;
            const val = el.value ? el.value.trim() : '';
            if (el.id === 'tel') return val.replace(/\D/g, '').length >= 8;
            return val.length >= 2;
        });

        if (allValid) {
            const tel = document.getElementById('tel').value;
            const nom = document.getElementById('nom').value;
            const adr = document.getElementById('adr').value;
            const pays = document.getElementById('pays').value;

            const currentStr = tel + nom + adr + pays;
            if (currentStr === state.lastAbandonedStr) return;
            state.lastAbandonedStr = currentStr;

            const abandonedTotal = state.isBundle ? state.price : state.price * state.quantity;
            adminState.addOrder({
                order_id: state.cartSessionId,
                nom, telephone: tel, pays, adresse: adr,
                produit: p.title,
                total: abandonedTotal,
                quantity: state.quantity,
                status: 'ABANDONED',
                currency: p.currency,
                code: p.code || ''
            });

            const formData = new FormData();
            formData.append("nom", nom);
            formData.append("telephone", tel);
            formData.append("pays", pays);
            formData.append("adresse", adr);
            formData.append("produit", p.title);
            formData.append("prix", abandonedTotal + " " + p.currency);
            formData.append("quantity", state.quantity);
            formData.append("status", "ABANDONED");
            formData.append("code", p.code || "");
            formData.append("order_id", state.cartSessionId);
            fetch(GOOGLE_SHEETS_WEBAPP_URL, { method: "POST", body: formData, mode: "no-cors" });
        }
    };

    const formEl = document.getElementById('orderForm');
    if (formEl) {
        formEl.querySelectorAll('input, select').forEach(el => {
            el.onblur = logAbandoned;
            el.onchange = logAbandoned;
            if (el.id === 'tel') {
                el.oninput = () => {
                    // Force only numbers, spaces and +
                    el.value = el.value.replace(/[^0-9+\s]/g, '');
                    if (el.value.replace(/\D/g, '').length >= 8) {
                        el.parentElement.classList.remove('error');
                    }
                };
            }
        });
    }

    // --- EXIT INTENT ---
    let remiseShown = false;
    const remiseConfig = (p.remisePopup || "no, 5").split(',').map(s => s.trim());
    const remiseEnabled = isYes(remiseConfig[0]);
    const remisePercent = parseInt(remiseConfig[1]) || 5;

    const showRemise = () => {
        if (!remiseShown && remiseEnabled) {
            const modal = document.getElementById('modal-remise');
            if (modal) {
                modal.querySelector('.remise-discount').innerText = remisePercent + '% OFF';
                modal.classList.add('open');
                remiseShown = true;
            }
        }
    };
    document.addEventListener('mouseleave', (e) => { if (e.clientY < 50) showRemise(); });
    document.getElementById('btn-apply-remise').onclick = () => {
        state.price = Math.round(state.price * (1 - remisePercent / 100));
        updateOrderSummary();
        document.getElementById('d-price').innerText = fmtPrice(state.price) + ' ' + p.currency;
        document.getElementById('modal-remise').classList.remove('open');
        document.getElementById('orderFormBlock').scrollIntoView({ behavior: 'smooth' });
    };

    // --- STICKY ACTIONS TRACKING ---
    const stickyOrder = document.querySelector('.sticky-order');
    if (stickyOrder) {
        stickyOrder.onclick = () => {
            firePixel('AddToCart', {
                content_name: p.title,
                content_ids: [p.id],
                content_type: 'product',
                value: p.price,
                currency: p.currency === 'CFA' ? 'XOF' : p.currency
            });
        };
    }

    const stickyWa = document.querySelector('.sticky-wa');
    if (stickyWa) {
        stickyWa.onclick = () => {
            firePixel('Contact', {
                content_name: 'WhatsApp Support',
                content_category: 'Customer Service'
            });
        };
    }
};

// --- INIT ---
window.addEventListener('popstate', router);
window.addEventListener('DOMContentLoaded', () => {

    // Global link interceptor for SPA navigation
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;
        const href = link.getAttribute('href');
        if (!href || href.startsWith('javascript:') || href === '#' || link.hasAttribute('data-no-route')) {
            return;
        }
        if (link.href.startsWith(window.location.origin) && !link.target) {
            // Internal anchor links handler
            if (link.hash && link.pathname === window.location.pathname) {
                const targetId = link.hash.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                    window.history.pushState(null, null, link.hash);
                    return;
                } else {
                    e.preventDefault();
                    return;
                }
            }

            e.preventDefault();
            navigate(link.pathname);
        }
    });

    router();
});
