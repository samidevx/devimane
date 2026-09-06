// ===== ADMIN UTILITIES FOR VITE E-COMMERCE (ASTRO COMPATIBLE) =====
import defaultProducts from '../data/products.json';

// Seed Orders matching Astro seed.ts
const now = Date.now();
const d = (daysAgo, hoursAgo = 0) => new Date(now - (daysAgo * 86400000) - (hoursAgo * 3600000)).toISOString();

const defaultOrders = [
  {
    "order_id": "ORD-78101",
    "id": "ORD-78101",
    "nom": "Amadou Koné",
    "customer_name": "Amadou Koné",
    "telephone": "+225 07 12 34 56",
    "pays": "CI",
    "country": "CI",
    "adresse": "Cocody, Abidjan",
    "produit": "Kiné-sciatique™ - Comment j'ai évité l'opération de la hanche",
    "product_name": "Kiné-sciatique™ - Comment j'ai évité l'opération de la hanche",
    "code": "COD05813",
    "quantity": 1,
    "total": 19900,
    "prix": "19.900 CFA",
    "currency": "CFA",
    "status": "COMPLETED",
    "utm_source": "tiktok",
    "utm_medium": "cpc",
    "utm_campaign": "tiktok_viral_kine",
    "utm_content": "video_hook_ugc1",
    "date": "2026-09-06T17:39:45.963Z",
    "timestamp": 1788716385963
  },
  {
    "order_id": "ORD-78102",
    "id": "ORD-78102",
    "nom": "Mamadou Diallo",
    "customer_name": "Mamadou Diallo",
    "telephone": "+224 62 01 23 45",
    "pays": "GN",
    "country": "GN",
    "adresse": "Kaloum, Conakry",
    "produit": "Kiné-sciatique™ - Comment j'ai évité l'opération de la hanche",
    "product_name": "Kiné-sciatique™ - Comment j'ai évité l'opération de la hanche",
    "code": "COD05813",
    "quantity": 1,
    "total": 320000,
    "prix": "320.000 GNF",
    "currency": "GNF",
    "status": "COMPLETED",
    "utm_source": "tiktok",
    "utm_medium": "cpc",
    "utm_campaign": "tiktok_viral_kine",
    "utm_content": "video_hook_ugc1",
    "date": "2026-09-05T15:39:45.963Z",
    "timestamp": 1788623585963
  },
  {
    "order_id": "ORD-78103",
    "id": "ORD-78103",
    "nom": "Aissatou Barry",
    "customer_name": "Aissatou Barry",
    "telephone": "+224 62 29 87 65",
    "pays": "GN",
    "country": "GN",
    "adresse": "Dixinn, Conakry",
    "produit": "Kiné-sciatique™ - Comment j'ai évité l'opération de la hanche",
    "product_name": "Kiné-sciatique™ - Comment j'ai évité l'opération de la hanche",
    "code": "COD05813",
    "quantity": 2,
    "total": 550000,
    "prix": "550.000 GNF",
    "currency": "GNF",
    "status": "COMPLETED",
    "utm_source": "tiktok",
    "utm_medium": "cpc",
    "utm_campaign": "tiktok_viral_kine",
    "utm_content": "video_hook_ugc1",
    "date": "2026-09-04T14:39:45.963Z",
    "timestamp": 1788533585963
  },
  {
    "order_id": "ORD-78104",
    "id": "ORD-78104",
    "nom": "Koffi Serge",
    "customer_name": "Koffi Serge",
    "telephone": "+225 01 23 45 67",
    "pays": "CI",
    "country": "CI",
    "adresse": "Marcory, Abidjan",
    "produit": "Kiné-sciatique™ - Comment j'ai évité l'opération de la hanche",
    "product_name": "Kiné-sciatique™ - Comment j'ai évité l'opération de la hanche",
    "code": "COD05813",
    "quantity": 1,
    "total": 19900,
    "prix": "19.900 CFA",
    "currency": "CFA",
    "status": "COMPLETED",
    "utm_source": "tiktok",
    "utm_medium": "cpc",
    "utm_campaign": "tiktok_viral_kine",
    "utm_content": "video_hook_ugc2",
    "date": "2026-09-04T11:39:45.963Z",
    "timestamp": 1788523585963
  },
  {
    "order_id": "ORD-78105",
    "id": "ORD-78105",
    "nom": "Aïcha Diallo",
    "customer_name": "Aïcha Diallo",
    "telephone": "+221 77 123 45 67",
    "pays": "SN",
    "country": "SN",
    "adresse": "Dakar Plateau",
    "produit": "Kiné-sciatique™ - Comment j'ai évité l'opération de la hanche",
    "product_name": "Kiné-sciatique™ - Comment j'ai évité l'opération de la hanche",
    "code": "COD05813",
    "quantity": 1,
    "total": 19900,
    "prix": "19.900 CFA",
    "currency": "CFA",
    "status": "COMPLETED",
    "utm_source": "tiktok",
    "utm_medium": "cpc",
    "utm_campaign": "tiktok_viral_kine",
    "utm_content": "video_hook_ugc2",
    "date": "2026-09-03T16:39:45.963Z",
    "timestamp": 1788453585963
  },
  {
    "order_id": "ORD-78106",
    "id": "ORD-78106",
    "nom": "Ibrahim Touré",
    "customer_name": "Ibrahim Touré",
    "telephone": "+225 07 44 55 66",
    "pays": "CI",
    "country": "CI",
    "adresse": "Bouaké",
    "produit": "Kiné-sciatique™ - Comment j'ai évité l'opération de la hanche",
    "product_name": "Kiné-sciatique™ - Comment j'ai évité l'opération de la hanche",
    "code": "COD05813",
    "quantity": 1,
    "total": 19900,
    "prix": "19.900 CFA",
    "currency": "CFA",
    "status": "ABANDONED",
    "utm_source": "tiktok",
    "utm_medium": "cpc",
    "utm_campaign": "tiktok_viral_kine",
    "utm_content": "video_hook_ugc1",
    "date": "2026-09-05T18:39:45.963Z",
    "timestamp": 1788633585963
  },
  {
    "order_id": "ORD-78107",
    "id": "ORD-78107",
    "nom": "Clarisse Gbagbo",
    "customer_name": "Clarisse Gbagbo",
    "telephone": "+229 97 00 11 22",
    "pays": "BJ",
    "country": "BJ",
    "adresse": "Cadjehoun, Cotonou",
    "produit": "Alphabook™ ORIGINAL - 4 Cahiers d’écriture réutilisables",
    "product_name": "Alphabook™ ORIGINAL - 4 Cahiers d’écriture réutilisables",
    "code": "COD18461",
    "quantity": 2,
    "total": 35800,
    "prix": "35.800 CFA",
    "currency": "CFA",
    "status": "COMPLETED",
    "utm_source": "facebook",
    "utm_medium": "paid",
    "utm_campaign": "fb_parents_alphabook",
    "utm_content": "carousel_demonstration",
    "date": "2026-09-03T12:39:45.963Z",
    "timestamp": 1788443585963
  },
  {
    "order_id": "ORD-78108",
    "id": "ORD-78108",
    "nom": "Benoit N’Guessan",
    "customer_name": "Benoit N’Guessan",
    "telephone": "+228 90 22 33 44",
    "pays": "TG",
    "country": "TG",
    "adresse": "Lomé Centre",
    "produit": "Alphabook™ ORIGINAL - 4 Cahiers d’écriture réutilisables",
    "product_name": "Alphabook™ ORIGINAL - 4 Cahiers d’écriture réutilisables",
    "code": "COD18461",
    "quantity": 1,
    "total": 17900,
    "prix": "17.900 CFA",
    "currency": "CFA",
    "status": "COMPLETED",
    "utm_source": "facebook",
    "utm_medium": "paid",
    "utm_campaign": "fb_parents_alphabook",
    "utm_content": "carousel_demonstration",
    "date": "2026-09-02T17:39:45.963Z",
    "timestamp": 1788373585963
  },
  {
    "order_id": "ORD-78109",
    "id": "ORD-78109",
    "nom": "Edwige Bamba",
    "customer_name": "Edwige Bamba",
    "telephone": "+241 01 23 45 67",
    "pays": "GA",
    "country": "GA",
    "adresse": "Libreville Mont-Bouet",
    "produit": "Alphabook™ ORIGINAL - 4 Cahiers d’écriture réutilisables",
    "product_name": "Alphabook™ ORIGINAL - 4 Cahiers d’écriture réutilisables",
    "code": "COD18461",
    "quantity": 3,
    "total": 53700,
    "prix": "53.700 CFA",
    "currency": "CFA",
    "status": "COMPLETED",
    "utm_source": "facebook",
    "utm_medium": "paid",
    "utm_campaign": "fb_parents_alphabook",
    "utm_content": "carousel_demonstration",
    "date": "2026-09-02T13:39:45.963Z",
    "timestamp": 1788353585963
  },
  {
    "order_id": "ORD-78110",
    "id": "ORD-78110",
    "nom": "Marcelle Akouba",
    "customer_name": "Marcelle Akouba",
    "telephone": "+225 07 88 99 00",
    "pays": "CI",
    "country": "CI",
    "adresse": "Deux Plateaux, Abidjan",
    "produit": "Alphabook™ ORIGINAL - 4 Cahiers d’écriture réutilisables",
    "product_name": "Alphabook™ ORIGINAL - 4 Cahiers d’écriture réutilisables",
    "code": "COD18461",
    "quantity": 1,
    "total": 17900,
    "prix": "17.900 CFA",
    "currency": "CFA",
    "status": "COMPLETED",
    "utm_source": "tiktok",
    "utm_medium": "cpc",
    "utm_campaign": "summer_promo_alphabook",
    "utm_content": "video_kids_fun",
    "date": "2026-09-01T15:39:45.963Z",
    "timestamp": 1788273585963
  },
  {
    "order_id": "ORD-78111",
    "id": "ORD-78111",
    "nom": "Moussa Diarra",
    "customer_name": "Moussa Diarra",
    "telephone": "+223 76 54 32 10",
    "pays": "ML",
    "country": "ML",
    "adresse": "Bamako Coura",
    "produit": "Kiné-sciatique™ - Comment j'ai évité l'opération de la hanche",
    "product_name": "Kiné-sciatique™ - Comment j'ai évité l'opération de la hanche",
    "code": "COD05813",
    "quantity": 1,
    "total": 19900,
    "prix": "19.900 CFA",
    "currency": "CFA",
    "status": "COMPLETED",
    "utm_source": "facebook",
    "utm_medium": "paid",
    "utm_campaign": "fb_sciatique_retargeting",
    "utm_content": "ad_testimonial_dr",
    "date": "2026-09-01T12:39:45.963Z",
    "timestamp": 1788263585963
  },
  {
    "order_id": "ORD-78112",
    "id": "ORD-78112",
    "nom": "Ousmane Sangaré",
    "customer_name": "Ousmane Sangaré",
    "telephone": "+226 70 11 22 33",
    "pays": "BF",
    "country": "BF",
    "adresse": "Ouagadougou",
    "produit": "Kiné-sciatique™ - Comment j'ai évité l'opération de la hanche",
    "product_name": "Kiné-sciatique™ - Comment j'ai évité l'opération de la hanche",
    "code": "COD05813",
    "quantity": 1,
    "total": 19900,
    "prix": "19.900 CFA",
    "currency": "CFA",
    "status": "COMPLETED",
    "utm_source": "facebook",
    "utm_medium": "paid",
    "utm_campaign": "fb_sciatique_retargeting",
    "utm_content": "ad_testimonial_dr",
    "date": "2026-08-31T17:39:45.963Z",
    "timestamp": 1788193585963
  },
  {
    "order_id": "ORD-78113",
    "id": "ORD-78113",
    "nom": "Mahamat Saleh",
    "customer_name": "Mahamat Saleh",
    "telephone": "+235 66 11 22 33",
    "pays": "TD",
    "country": "TD",
    "adresse": "N'Djamena",
    "produit": "FlyTex™ – Genouillère de compression thermique",
    "product_name": "FlyTex™ – Genouillère de compression thermique",
    "code": "COD11405",
    "quantity": 1,
    "total": 16900,
    "prix": "16.900 CFA",
    "currency": "CFA",
    "status": "COMPLETED",
    "utm_source": "tiktok",
    "utm_medium": "cpc",
    "utm_campaign": "tiktok_viral_kine",
    "utm_content": "video_hook_ugc1",
    "date": "2026-08-30T14:39:45.963Z",
    "timestamp": 1788103585963
  },
  {
    "order_id": "ORD-78114",
    "id": "ORD-78114",
    "nom": "Idrissa Déby",
    "customer_name": "Idrissa Déby",
    "telephone": "+235 99 88 77 66",
    "pays": "TD",
    "country": "TD",
    "adresse": "N'Djamena, Chagoua",
    "produit": "PORTEFEUILLE Premium 2026",
    "product_name": "PORTEFEUILLE Premium 2026",
    "code": "PORT-01",
    "quantity": 1,
    "total": 19900,
    "prix": "19.900 CFA",
    "currency": "CFA",
    "status": "COMPLETED",
    "utm_source": "facebook",
    "utm_medium": "paid",
    "utm_campaign": "fb_parents_alphabook",
    "utm_content": "carousel_demonstration",
    "date": "2026-08-29T18:39:45.963Z",
    "timestamp": 1788023585963
  },
  {
    "order_id": "ORD-78115",
    "id": "ORD-78115",
    "nom": "Fatoumata Camara",
    "customer_name": "Fatoumata Camara",
    "telephone": "+224 62 41 11 22",
    "pays": "GN",
    "country": "GN",
    "adresse": "Kindia centre",
    "produit": "FlyTex™ – Genouillère de compression thermique",
    "product_name": "FlyTex™ – Genouillère de compression thermique",
    "code": "COD11405",
    "quantity": 1,
    "total": 280000,
    "prix": "280.000 GNF",
    "currency": "GNF",
    "status": "COMPLETED",
    "utm_source": "tiktok",
    "utm_medium": "cpc",
    "utm_campaign": "tiktok_viral_kine",
    "utm_content": "video_hook_ugc2",
    "date": "2026-08-29T13:39:45.963Z",
    "timestamp": 1787983585963
  },
  {
    "order_id": "ORD-78116",
    "id": "ORD-78116",
    "nom": "Pauline Kouadio",
    "customer_name": "Pauline Kouadio",
    "telephone": "+225 01 99 88 77",
    "pays": "CI",
    "country": "CI",
    "adresse": "Treichville, Abidjan",
    "produit": "Kiné-sciatique™ - Comment j'ai évité l'opération de la hanche",
    "product_name": "Kiné-sciatique™ - Comment j'ai évité l'opération de la hanche",
    "code": "COD05813",
    "quantity": 1,
    "total": 19900,
    "prix": "19.900 CFA",
    "currency": "CFA",
    "status": "COMPLETED",
    "utm_source": "direct",
    "utm_campaign": "organic",
    "utm_content": "direct_share",
    "date": "2026-08-28T16:39:45.963Z",
    "timestamp": 1787923585963
  }
];

const defaultReviews = [
  {
    id: 'REV-1001',
    productId: 'kine',
    productTitle: "Kiné-sciatique™ - Comment j'ai évité l'opération de la hanche",
    productImage: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjSi7bJcBkzia8MviCzfV_0HYzvMzKS0a6yG5z9HtK3gVeeZrjubxGpNsFZyS6COiUUT3fYKooyG2lXm8RQ9m91_pcB6JDxdJ1Uyq-hibe2FC5pAG8Dxlc0tTxLbgu0OwvFI0ndJBM4uQDiUOAK7FqKt6vHNyY1kKjTcDaBcGGeecJngkPZ6L3c3BeC98dp/s1600/IM%202.webp',
    author: 'Dr. Jean-Marc Kouassi',
    city: 'Abidjan',
    country: 'CI',
    rating: 5,
    title: 'Soulagement spectaculaire dès la 2ème semaine',
    content: "En tant que professionnel de santé souvent assis, je souffrais d'une sciatique invalidante depuis 8 mois. Après seulement 12 jours d'utilisation régulière des exercices et du protocole, les décharges nerveuses ont disparu. Vraiment remarquable.",
    verified: true,
    status: 'PUBLISHED',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: 'REV-1002',
    productId: 'alphabook',
    productTitle: "Alphabook™ ORIGINAL - 4 Cahiers d’écriture réutilisables",
    productImage: 'https://alphadigitalservices.store/wp-content/uploads/2025/11/537373591_1407622670338491_6368199435420077491_n-1.jpg',
    author: 'Aïcha Diop',
    city: 'Dakar',
    country: 'SN',
    rating: 5,
    title: 'Mes jumeaux adorent, écriture nettement améliorée !',
    content: "L'encre magique qui s'efface toute seule après quelques minutes est tout simplement géniale. Mes enfants de 5 ans prennent plaisir à s'entraîner chaque soir sans gaspiller de papier. Livraison rapide à Dakar.",
    verified: true,
    status: 'PUBLISHED',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    id: 'REV-1003',
    productId: 'kine-gn',
    productTitle: "Kiné-sciatique™ - Spécial Guinée",
    productImage: 'https://alphadigitalservices.store/wp-content/uploads/2023/11/Capture_d_ecran_2025-07-18_123524.webp',
    author: 'Mamady Camara',
    city: 'Conakry',
    country: 'GN',
    rating: 5,
    title: 'Reçu en 24h à Conakry - Très efficace',
    content: "J'ai payé à la livraison en francs guinéens sans aucun problème. Le produit est conforme aux vidéos et m'a évité des séances de kiné très coûteuses. Je recommande à tous mes collègues.",
    verified: true,
    status: 'PUBLISHED',
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString()
  },
  {
    id: 'REV-1004',
    productId: 'kine',
    productTitle: "Kiné-sciatique™ - Comment j'ai évité l'opération de la hanche",
    productImage: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjSi7bJcBkzia8MviCzfV_0HYzvMzKS0a6yG5z9HtK3gVeeZrjubxGpNsFZyS6COiUUT3fYKooyG2lXm8RQ9m91_pcB6JDxdJ1Uyq-hibe2FC5pAG8Dxlc0tTxLbgu0OwvFI0ndJBM4uQDiUOAK7FqKt6vHNyY1kKjTcDaBcGGeecJngkPZ6L3c3BeC98dp/s1600/IM%202.webp',
    author: 'Mariam Traoré',
    city: 'Bamako',
    country: 'ML',
    rating: 4,
    title: 'Très bon produit, notice claire',
    content: "Très satisfaite de mon achat. Les explications sont simples et faciles à suivre même pour une personne âgée. Petit retard de livraison de 24h mais le livreur était très courtois.",
    verified: true,
    status: 'PUBLISHED',
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString()
  },
  {
    id: 'REV-1005',
    productId: 'alphabook',
    productTitle: "Alphabook™ ORIGINAL - 4 Cahiers d’écriture réutilisables",
    productImage: 'https://alphadigitalservices.store/wp-content/uploads/2025/11/537373591_1407622670338491_6368199435420077491_n-1.jpg',
    author: 'Patrice Ondimba',
    city: 'Libreville',
    country: 'GA',
    rating: 5,
    title: 'Excellente qualité de fabrication',
    content: "Les rainures sont parfaites pour guider la main des petits. Mon fils tient enfin son stylo correctement. Les recharges d'encre fournies sont copieuses.",
    verified: true,
    status: 'PUBLISHED',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString()
  }
];

export const api = {
  // --- PRODUCTS ---
  async getProducts() {
    try {
      const saved = localStorage.getItem('store_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    localStorage.setItem('store_products', JSON.stringify(defaultProducts, null, 2));
    return [...defaultProducts];
  },

  async createProduct(data) {
    const products = await api.getProducts();
    const id = data.id || ('prod_' + Date.now().toString(36));
    const newProduct = { ...data, id };
    products.unshift(newProduct);
    localStorage.setItem('store_products', JSON.stringify(products, null, 2));
    return { ok: true, json: async () => newProduct };
  },

  async updateProduct(id, data) {
    const products = await api.getProducts();
    const idx = products.findIndex(p => p.id === id);
    if (idx >= 0) {
      products[idx] = { ...products[idx], ...data };
    } else {
      products.unshift(data);
    }
    localStorage.setItem('store_products', JSON.stringify(products, null, 2));
    return { ok: true, json: async () => (idx >= 0 ? products[idx] : data) };
  },

  async deleteProduct(id) {
    let products = await api.getProducts();
    products = products.filter(p => p.id !== id);
    localStorage.setItem('store_products', JSON.stringify(products, null, 2));
    return { ok: true, json: async () => ({}) };
  },

  // --- ORDERS ---
    async getOrders() {
    try {
      const saved = localStorage.getItem('store_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(o => ({
            ...o,
            order_id: o.order_id || o.id || 'ORD-000',
            id: o.order_id || o.id || 'ORD-000',
            nom: o.nom || o.customer_name || 'Client',
            customer_name: o.nom || o.customer_name || 'Client',
            produit: o.produit || o.product_name || o.product || 'Produit',
            date: (() => {
              const d = new Date(o.date || o.timestamp || Date.now());
              if (isNaN(d.getTime()) || Math.abs(Date.now() - d.getTime()) > 14 * 86400000) {
                const daysAgo = (parseInt(String(o.order_id || o.id || '1').replace(/\D/g, '')) % 10) || 1;
                return new Date(Date.now() - daysAgo * 86400000).toISOString();
              }
              return d.toISOString();
            })()
          }));
        }
      }
    } catch (e) {}
    localStorage.setItem('store_orders', JSON.stringify(defaultOrders));
    return [...defaultOrders];
  },

  async updateOrder(id, data) {
    const orders = await api.getOrders();
    const idx = orders.findIndex(o => (o.order_id === id || o.id === id));
    if (idx >= 0) {
      orders[idx] = { ...orders[idx], ...data };
      localStorage.setItem('store_orders', JSON.stringify(orders));
      return { ok: true, json: async () => orders[idx] };
    }
    return { ok: false, status: 404, json: async () => ({ error: 'Order not found' }) };
  },

  async deleteOrder(id) {
    let orders = await api.getOrders();
    orders = orders.filter(o => (o.order_id !== id && o.id !== id));
    localStorage.setItem('store_orders', JSON.stringify(orders));
    return { ok: true, json: async () => ({}) };
  },

  // --- REVIEWS ---
  async getReviews() {
    try {
      const saved = localStorage.getItem('store_reviews');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    localStorage.setItem('store_reviews', JSON.stringify(defaultReviews));
    return [...defaultReviews];
  },

  async createReview(data) {
    const reviews = await api.getReviews();
    const id = data.id || ('REV-' + Date.now().toString().slice(-5));
    const newRev = { ...data, id, createdAt: data.createdAt || new Date().toISOString() };
    reviews.unshift(newRev);
    localStorage.setItem('store_reviews', JSON.stringify(reviews));
    return { ok: true, json: async () => ({ success: true, review: newRev }) };
  },

  async updateReview(id, data) {
    const reviews = await api.getReviews();
    const idx = reviews.findIndex(r => r.id === id);
    if (idx >= 0) {
      reviews[idx] = { ...reviews[idx], ...data, updatedAt: new Date().toISOString() };
      localStorage.setItem('store_reviews', JSON.stringify(reviews));
      return { ok: true, json: async () => ({ success: true, review: reviews[idx] }) };
    }
    return { ok: false, json: async () => ({ error: 'Review not found' }) };
  },

  async deleteReview(id) {
    let reviews = await api.getReviews();
    reviews = reviews.filter(r => r.id !== id);
    localStorage.setItem('store_reviews', JSON.stringify(reviews));
    return { ok: true, json: async () => ({}) };
  },

  // --- SETTINGS ---
  async getSettings() {
    try {
      const saved = localStorage.getItem('store_settings');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      facebookPixelId: '950990427685437',
      facebookPixelEnabled: true,
      githubToken: localStorage.getItem('gh_token') || '',
      githubRepo: localStorage.getItem('gh_repo') || 'samidevx/Africa-Shop-Goo',
      githubBranch: localStorage.getItem('gh_branch') || 'main',
      githubPath: localStorage.getItem('gh_path') || 'src/data/products.json'
    };
  },

  async updateSettings(data) {
    const current = await api.getSettings();
    const updated = { ...current, ...data };
    localStorage.setItem('store_settings', JSON.stringify(updated));
    if (data.githubToken !== undefined) localStorage.setItem('gh_token', data.githubToken.trim());
    if (data.githubRepo !== undefined) localStorage.setItem('gh_repo', data.githubRepo.trim());
    if (data.githubBranch !== undefined) localStorage.setItem('gh_branch', data.githubBranch.trim());
    return { ok: true, json: async () => updated };
  },

  // --- GITHUB COMMIT (AVOID MANUAL JSON EDITING) ---
  async syncToGitHub() {
    const settings = await api.getSettings();
    if (!settings.githubToken) {
      return {
        success: false,
        error: 'Token GitHub non configuré. Allez dans Paramètres (Settings) et entrez votre GitHub Personal Access Token.'
      };
    }
    const [owner, repo] = (settings.githubRepo || 'samidevx/Africa-Shop-Goo').split('/');
    if (!owner || !repo) return { success: false, error: 'Format du dépôt invalide. Utilisez "owner/repo".' };

    const branch = settings.githubBranch || 'main';
    const filePath = settings.githubPath || 'src/data/products.json';
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`;
    const headers = {
      'Authorization': `Bearer ${settings.githubToken}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    };

    try {
      let sha = null;
      const getRes = await fetch(url, { headers });
      if (getRes.ok) {
        const fileData = await getRes.json();
        sha = fileData.sha;
      }

      const products = await api.getProducts();
      const jsonContent = JSON.stringify(products, null, 2);
      const base64Content = btoa(unescape(encodeURIComponent(jsonContent)));

      const body = {
        message: `Update products catalog via Admin Panel [${new Date().toISOString().slice(0, 16)}]`,
        content: base64Content,
        branch,
        ...(sha ? { sha } : {})
      };

      const putRes = await fetch(url, { method: 'PUT', headers, body: JSON.stringify(body) });
      if (putRes.ok) {
        return {
          success: true,
          message: 'Synchronisation GitHub réussie ! Cloudflare et GitHub déploient automatiquement la mise à jour.'
        };
      } else {
        const err = await putRes.json();
        return { success: false, error: err.message || 'Échec du commit sur GitHub.' };
      }
    } catch (e) {
      return { success: false, error: 'Erreur réseau : ' + e.message };
    }
  },

  async logout() {
    sessionStorage.removeItem('admin_auth');
    window.location.href = '/admin/login';
  },

  async seed() {
    localStorage.setItem('store_orders', JSON.stringify(defaultOrders));
    localStorage.setItem('store_reviews', JSON.stringify(defaultReviews));
    localStorage.setItem('store_products', JSON.stringify(defaultProducts, null, 2));
    return { ok: true, json: async () => ({ success: true }) };
  }
};

export function toast(msg, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<i class="fa ${type === 'success' ? 'fa-check-circle' : 'fa-circle-exclamation'}"></i><span>${msg}</span>`;
  container.appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

export function navigate(path) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new Event('routechange'));
}

export function fmtPrice(n) {
  return Number(n || 0).toLocaleString('fr-FR');
}

export function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function statusBadge(status) {
  const map = {
    COMPLETED: 'badge-green',
    ABANDONED: 'badge-orange',
    PENDING: 'badge-blue',
  };
  return `<span class="badge ${map[status] || 'badge-blue'}">${status || 'UNKNOWN'}</span>`;
}

export function confirmDialog(msg) {
  return new Promise(resolve => {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,0.45);backdrop-filter:blur(6px);z-index:2000;display:flex;align-items:center;justify-content:center;padding:24px;';
    overlay.innerHTML = `
      <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:20px;padding:32px;max-width:380px;width:100%;text-align:center;box-shadow:0 20px 40px -10px rgba(0,0,0,0.12);">
        <i class="fa fa-triangle-exclamation" style="font-size:36px;color:#f59e0b;margin-bottom:16px;display:block;"></i>
        <p style="font-size:15px;margin-bottom:24px;color:#0f172a;font-weight:600;line-height:1.5;">${msg}</p>
        <div style="display:flex;gap:10px;justify-content:center;">
          <button id="cd-cancel" style="background:#f1f5f9;border:1px solid #e2e8f0;color:#475569;border-radius:10px;padding:10px 20px;cursor:pointer;font-size:14px;font-weight:600;font-family:inherit;">Cancel</button>
          <button id="cd-ok" style="background:#ef4444;border:none;color:#fff;border-radius:10px;padding:10px 20px;cursor:pointer;font-size:14px;font-weight:700;font-family:inherit;box-shadow:0 4px 12px rgba(239,68,68,0.3);">Delete</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    overlay.querySelector('#cd-ok').onclick = () => { overlay.remove(); resolve(true); };
    overlay.querySelector('#cd-cancel').onclick = () => { overlay.remove(); resolve(false); };
  });
}
