(function () {
    const ROUTE_PREFIXES = {
        auth: '/api/auth',
        username: '/api/username',
        userpassword: '/api/userpassword',
        password: '/api/password',
        changestatusclient: '/api/changestatusclient',
        dashboardinformation: '/api/dashboardinformation',
        courses: '/api/courses',
        videos: '/api/videos',
        admin: '/api/admin',
    };

    let apiUrl = '';
    let courseSlug = '';
    let loadPromise = null;

    function normalizeUrl(value) {
        const normalized = String(value || '').trim();
        if (!normalized) {
            return '';
        }

        return normalized.replace(/\/+$/, '');
    }

    function hasKey(obj, key) {
        return Object.prototype.hasOwnProperty.call(obj, key);
    }

    function isLocalHost() {
        const host = window.location.hostname || '';
        return host === 'localhost' || host === '127.0.0.1';
    }

    function getNonEmptyValue(parsed, key) {
        if (!hasKey(parsed, key)) {
            return '';
        }

        return normalizeUrl(parsed[key]);
    }

    function parseEnv(text) {
        const parsed = {};
        const lines = text.split(/\r?\n/);
        for (const rawLine of lines) {
            const line = rawLine.trim();
            if (!line || line.startsWith('#')) {
                continue;
            }

            const idx = line.indexOf('=');
            if (idx === -1) {
                continue;
            }

            const key = line.slice(0, idx).trim();
            const value = line.slice(idx + 1).trim().replace(/^['\"]|['\"]$/g, '');
            parsed[key] = value;

            if (key === 'COURSE_SLUG' && value) {
                courseSlug = value;
            }
        }

        const backUrl = getNonEmptyValue(parsed, 'BACK_URL');
        const backUrlLocal = getNonEmptyValue(parsed, 'BACK_URL_LOCAL');
        const backUrlProd = getNonEmptyValue(parsed, 'BACK_URL_PROD');
        const backUrlFallback = getNonEmptyValue(parsed, 'BACK_URL_FALLBACK') || getNonEmptyValue(parsed, 'FALLBACK_URL');
        const legacyUrl = getNonEmptyValue(parsed, 'URL');

        if (backUrl) {
            apiUrl = backUrl;
            return;
        }

        if (isLocalHost() && backUrlLocal) {
            apiUrl = backUrlLocal;
            return;
        }

        if (!isLocalHost() && backUrlProd) {
            apiUrl = backUrlProd;
            return;
        }

        if (backUrlFallback) {
            apiUrl = backUrlFallback;
            return;
        }

        apiUrl = legacyUrl;
    }

    function authHeaders() {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    }

    async function api(path, options) {
        const requestOptions = options || {};
        const headers = {
            ...(requestOptions.headers || {}),
            ...authHeaders(),
        };

        if (!(requestOptions.body instanceof FormData) && !hasKey(headers, 'Content-Type')) {
            headers['Content-Type'] = 'application/json';
        }

        const res = await fetch(`${apiUrl}${path}`, {
            ...requestOptions,
            headers,
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            throw new Error(data.message || 'Erreur serveur');
        }

        return data;
    }

    async function load() {
        if (loadPromise) {
            return loadPromise;
        }

        loadPromise = (async () => {
            try {
                const response = await fetch('/.env', { cache: 'no-store' });
                if (response.ok) {
                    const content = await response.text();
                    parseEnv(content);
                }
            } catch (error) {
                // Keep currently resolved URL when .env is not reachable.
            }

            return apiUrl;
        })();

        return loadPromise;
    }

    window.ENV_CONFIG = {
        load,
        getApiBaseUrl: () => apiUrl,
        getCourseSlug: () => courseSlug,
        getRoutePrefixes: () => ({ ...ROUTE_PREFIXES }),
    };

    window.API_CLIENT = {
        authHeaders,
        api,
    };
})();
