(function () {
    const FALLBACK_URL = 'https://smail-app-production.up.railway.app';
    let apiUrl = FALLBACK_URL;
    let loadPromise = null;

    function parseEnv(text) {
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

            if (key === 'URL' && value) {
                apiUrl = value;
            }
        }
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
                // Keep fallback URL when .env is not reachable in production.
            }

            return apiUrl;
        })();

        return loadPromise;
    }

    window.ENV_CONFIG = {
        load,
        getApiBaseUrl: () => apiUrl,
    };
})();
