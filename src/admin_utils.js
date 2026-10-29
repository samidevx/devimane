import defaultProducts from './data/products.json';

const STORAGE_KEY = 'store_products_data_v2';
const GITHUB_TOKEN_KEY = 'store_admin_github_token';
const GITHUB_REPO_KEY = 'store_admin_github_repo';
const DEFAULT_REPO = 'samidevx/devimane';
const DEFAULT_BRANCH = 'main';
const DEFAULT_PATH = 'src/data/products.json';

// --- AUTH & PASSWORD SECURITY ---
const AUTH_SALT = '_x10_store_secure_salt_2026_';
// SHA-256 salted hash of initial default 'admin123'
const DEFAULT_PASS_HASH = 'feb4bc5695b1cffe2cbf58d5bfdd5a942515d6bbb40e54ecae184e4268ccc6ad';
const HASH_STORAGE_KEY = 'store_admin_pass_hash_v1';
const FAILED_ATTEMPTS_KEY = 'store_admin_failed_attempts';
const LOCKOUT_KEY = 'store_admin_lockout_time';
const SESSION_KEY = 'store_admin_auth_session';

// One-way SHA-256 cryptographic hashing with Salt
const hashPassword = async (pass) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(pass + AUTH_SALT);
    const hashBuf = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuf))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
};

// Helper to safely load products from localStorage or fall back to products.json
const loadProducts = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        }
    } catch (e) {
        console.warn('Failed to parse products from localStorage:', e);
    }
    return JSON.parse(JSON.stringify(defaultProducts));
};

let currentProducts = loadProducts();

// Encode string to UTF-8 Base64 (supporting Unicode & emojis)
const toBase64Utf8 = (str) => {
    return btoa(unescape(encodeURIComponent(str)));
};

export const adminUtils = {
    // Read products list
    getProducts: () => {
        return currentProducts;
    },

    // Get single product by id
    getProduct: (id) => {
        return currentProducts.find(p => p.id === id) || null;
    },

    // =========================================================================
    // AUTHENTICATION & PASSWORD SECURITY
    // =========================================================================

    // Check if user has an active authenticated session
    isAuthenticated: () => {
        try {
            const raw = sessionStorage.getItem(SESSION_KEY);
            if (!raw) return false;
            const session = JSON.parse(raw);
            if (session.expiresAt && Date.now() < session.expiresAt) {
                return true;
            }
        } catch (e) {}
        return false;
    },

    // Get remaining lockout time in seconds
    getLockoutSeconds: () => {
        const lockoutTime = Number(localStorage.getItem(LOCKOUT_KEY) || 0);
        const remaining = Math.ceil((lockoutTime - Date.now()) / 1000);
        return remaining > 0 ? remaining : 0;
    },

    // Verify password & login (with rate limiting / brute force prevention)
    login: async (inputPass) => {
        // 1. Check if user is locked out
        const lockSec = adminUtils.getLockoutSeconds();
        if (lockSec > 0) {
            return {
                success: false,
                locked: true,
                message: `Trop de tentatives erronées. Réessayez dans ${lockSec} secondes.`
            };
        }

        // 2. Hash input and compare with stored hash
        const inputHash = await hashPassword(inputPass);
        const targetHash = localStorage.getItem(HASH_STORAGE_KEY) || DEFAULT_PASS_HASH;

        if (inputHash === targetHash) {
            // Success: Reset failed attempts and set 24h expiration session
            localStorage.removeItem(FAILED_ATTEMPTS_KEY);
            localStorage.removeItem(LOCKOUT_KEY);
            const session = {
                authenticated: true,
                createdAt: Date.now(),
                expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
            };
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
            sessionStorage.setItem('admin_auth', 'true');
            return { success: true };
        } else {
            // Failed attempt: increment counter
            let attempts = Number(localStorage.getItem(FAILED_ATTEMPTS_KEY) || 0) + 1;
            localStorage.setItem(FAILED_ATTEMPTS_KEY, String(attempts));

            if (attempts >= 5) {
                // Lock out for 5 minutes
                const lockoutUntil = Date.now() + 5 * 60 * 1000;
                localStorage.setItem(LOCKOUT_KEY, String(lockoutUntil));
                return {
                    success: false,
                    locked: true,
                    message: '5 tentatives incorrectes consécutives. Accès bloqué pendant 5 minutes.'
                };
            }

            const remaining = 5 - attempts;
            return {
                success: false,
                locked: false,
                remainingAttempts: remaining,
                message: `Mot de passe incorrect. Il vous reste ${remaining} tentative${remaining > 1 ? 's' : ''}.`
            };
        }
    },

    // Logout
    logout: () => {
        sessionStorage.removeItem(SESSION_KEY);
        sessionStorage.removeItem('admin_auth');
    },

    // Change Password
    changePassword: async (oldPass, newPass) => {
        if (!newPass || newPass.length < 6) {
            return {
                success: false,
                error: 'Le nouveau mot de passe doit comporter au moins 6 caractères.'
            };
        }

        const oldHash = await hashPassword(oldPass);
        const currentHash = localStorage.getItem(HASH_STORAGE_KEY) || DEFAULT_PASS_HASH;

        if (oldHash !== currentHash) {
            return {
                success: false,
                error: 'L\'ancien mot de passe est incorrect.'
            };
        }

        const newHash = await hashPassword(newPass);
        localStorage.setItem(HASH_STORAGE_KEY, newHash);
        return {
            success: true,
            newHash: newHash,
            message: 'Mot de passe sécurisé et mis à jour avec succès !'
        };
    },

    // Helper to generate hash for custom code setting
    generateHash: async (pass) => {
        return await hashPassword(pass);
    },

    // =========================================================================
    // GITHUB SETTINGS & SYNC
    // =========================================================================
    getGitHubConfig: () => {
        return {
            repo: localStorage.getItem(GITHUB_REPO_KEY) || DEFAULT_REPO,
            branch: DEFAULT_BRANCH,
            path: DEFAULT_PATH,
            token: localStorage.getItem(GITHUB_TOKEN_KEY) || ''
        };
    },

    setGitHubConfig: ({ token, repo }) => {
        if (token !== undefined) {
            localStorage.setItem(GITHUB_TOKEN_KEY, token.trim());
        }
        if (repo !== undefined) {
            localStorage.setItem(GITHUB_REPO_KEY, repo.trim() || DEFAULT_REPO);
        }
    },

    // Direct push to GitHub via GitHub Contents REST API
    pushToGitHubAPI: async (products) => {
        const cfg = adminUtils.getGitHubConfig();
        if (!cfg.token) {
            return {
                success: false,
                error: 'GitHub Token manquant. Allez dans Settings pour configurer votre GitHub Personal Access Token (PAT).'
            };
        }

        try {
            const getUrl = `https://api.github.com/repos/${cfg.repo}/contents/${cfg.path}?ref=${cfg.branch}&_t=${Date.now()}`;
            const getRes = await fetch(getUrl, {
                headers: {
                    'Authorization': `token ${cfg.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!getRes.ok) {
                const errData = await getRes.json().catch(() => ({}));
                throw new Error(errData.message || `Impossible de lire ${cfg.path} sur GitHub (${getRes.status})`);
            }

            const fileData = await getRes.json();
            const currentSha = fileData.sha;

            // Prepare UTF-8 Base64 content
            const jsonString = JSON.stringify(products, null, 2);
            const contentBase64 = toBase64Utf8(jsonString);

            // Commit and push
            const putUrl = `https://api.github.com/repos/${cfg.repo}/contents/${cfg.path}`;
            const putRes = await fetch(putUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${cfg.token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: `Auto-update products.json from Store Admin [${products.length} products]`,
                    content: contentBase64,
                    sha: currentSha,
                    branch: cfg.branch
                })
            });

            if (!putRes.ok) {
                const errData = await putRes.json().catch(() => ({}));
                throw new Error(errData.message || `Erreur commit GitHub (${putRes.status})`);
            }

            const commitData = await putRes.json();
            return {
                success: true,
                commitUrl: commitData.commit?.html_url || `https://github.com/${cfg.repo}/commits/${cfg.branch}`,
                message: 'Committed and pushed to GitHub main branch!'
            };
        } catch (e) {
            return {
                success: false,
                error: e.message
            };
        }
    },

    // Central Save Method (LocalStorage + Dev-Server Git Push + GitHub API Fallback)
    persistAndSync: async (products) => {
        currentProducts = products;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
        } catch (e) {
            console.error('Failed to write products to localStorage:', e);
        }

        // 1. Try local dev-server endpoint
        try {
            const res = await fetch('/api/save-products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(products)
            });

            if (res.ok) {
                const data = await res.json();
                if (data.gitPushed) {
                    return {
                        success: true,
                        method: 'local_git_push',
                        message: 'Sauvegardé et poussé automatiquement sur GitHub (branche main) !'
                    };
                }
            }
        } catch (e) {
            // Local dev server not reachable
        }

        // 2. If running on GitHub Pages or local git push failed, use GitHub REST API directly
        const cfg = adminUtils.getGitHubConfig();
        if (cfg.token) {
            const ghRes = await adminUtils.pushToGitHubAPI(products);
            if (ghRes.success) {
                return {
                    success: true,
                    method: 'github_api',
                    commitUrl: ghRes.commitUrl,
                    message: 'Commit & Push effectué avec succès sur GitHub !'
                };
            } else {
                return {
                    success: false,
                    error: `Erreur GitHub API: ${ghRes.error}`
                };
            }
        }

        return {
            success: true,
            method: 'local_only',
            warning: 'Sauvegardé en mémoire locale. Pour pousser automatiquement sur GitHub depuis ce domaine, ajoutez votre GitHub Token dans Paramètres.'
        };
    },

    // Add or Update product
    upsertProduct: async (product) => {
        const list = [...currentProducts];
        const index = list.findIndex(p => p.id === product.id);
        if (index > -1) {
            list[index] = { ...list[index], ...product };
        } else {
            list.unshift(product);
        }
        return await adminUtils.persistAndSync(list);
    },

    // Duplicate product
    duplicateProduct: async (id) => {
        const original = currentProducts.find(p => p.id === id);
        if (!original) return null;

        let newId = `${original.id}-copy`;
        let counter = 1;
        while (currentProducts.some(p => p.id === newId)) {
            newId = `${original.id}-copy-${counter++}`;
        }

        const clone = JSON.parse(JSON.stringify(original));
        clone.id = newId;
        clone.title = `${original.title} (Copie)`;
        if (clone.code) {
            clone.code = `${original.code}-C`;
        }

        const list = [clone, ...currentProducts];
        await adminUtils.persistAndSync(list);
        return clone;
    },

    // Delete product
    deleteProduct: async (id) => {
        const list = currentProducts.filter(p => p.id !== id);
        return await adminUtils.persistAndSync(list);
    },

    // Toggle HomePage visibility
    toggleHomePage: async (id) => {
        const list = [...currentProducts];
        const item = list.find(p => p.id === id);
        if (item) {
            const isVis = item.homePage === 'yes' || item.displayHomePage === 'yes' || item.homePage === true || item.displayHomePage === true || (item.homePage === undefined && item.displayHomePage === undefined);
            const nextState = isVis ? 'no' : 'yes';
            item.homePage = nextState;
            item.displayHomePage = nextState;
            await adminUtils.persistAndSync(list);
            return nextState;
        }
        return null;
    },

    // Export current products as downloadable products.json
    exportJSON: () => {
        return JSON.stringify(currentProducts, null, 2);
    },

    // Import products from JSON string
    importJSON: async (jsonString) => {
        try {
            const parsed = JSON.parse(jsonString);
            if (!Array.isArray(parsed)) throw new Error('Le fichier doit contenir un tableau JSON de produits.');
            if (parsed.length === 0) throw new Error('Le fichier est vide.');
            if (!parsed[0].id || !parsed[0].title) throw new Error('Structure JSON invalide: id et title sont requis.');

            const res = await adminUtils.persistAndSync(parsed);
            return { success: true, count: parsed.length, syncRes: res };
        } catch (e) {
            return { success: false, error: e.message };
        }
    },

    // Reset to initial bundled products.json
    resetToDefault: async () => {
        const def = JSON.parse(JSON.stringify(defaultProducts));
        await adminUtils.persistAndSync(def);
        return def;
    },

    // Fetch orders
    fetchOrders: async (webhookUrl) => {
        try {
            if (webhookUrl) {
                const response = await fetch(webhookUrl);
                if (response.ok) return await response.json();
            }
            return JSON.parse(localStorage.getItem('captured_orders') || sessionStorage.getItem('captured_orders') || '[]');
        } catch (e) {
            return JSON.parse(localStorage.getItem('captured_orders') || sessionStorage.getItem('captured_orders') || '[]');
        }
    }
};
