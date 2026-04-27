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

        apiUrl = getNonEmptyValue(parsed, 'URL');
    }

    function requireApiBaseUrl() {
        const resolved = normalizeUrl(apiUrl);
        if (!resolved) {
            throw new Error('Missing backend URL. Set URL in Front-end/.env');
        }

        return resolved;
    }

    function authHeaders() {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    }

    async function api(path, options) {
        const baseUrl = requireApiBaseUrl();
        const requestOptions = options || {};
        const headers = {
            ...(requestOptions.headers || {}),
            ...authHeaders(),
        };

        if (!(requestOptions.body instanceof FormData) && !hasKey(headers, 'Content-Type')) {
            headers['Content-Type'] = 'application/json';
        }

        const res = await fetch(`${baseUrl}${path}`, {
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
        requireApiBaseUrl,
        getCourseSlug: () => courseSlug,
        getRoutePrefixes: () => ({ ...ROUTE_PREFIXES }),
    };

    window.API_CLIENT = {
        authHeaders,
        api,
    };
})();
