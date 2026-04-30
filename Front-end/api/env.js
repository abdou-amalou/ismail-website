module.exports = (req, res) => {
    const runtimeEnv = {
        URL: process.env.URL || '',
        COURSE_SLUG: process.env.COURSE_SLUG || '',
        BACK_URL: process.env.BACK_URL || '',
        BACK_URL_LOCAL: process.env.BACK_URL_LOCAL || '',
        BACK_URL_PROD: process.env.BACK_URL_PROD || '',
        BACK_URL_FALLBACK: process.env.BACK_URL_FALLBACK || '',
        VITE_URL: process.env.VITE_URL || '',
        NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL || '',
    };

    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).send(
        `window.process = window.process || {};\n` +
        `window.process.env = Object.assign({}, window.process.env || {}, ${JSON.stringify(runtimeEnv)});\n`
    );
};