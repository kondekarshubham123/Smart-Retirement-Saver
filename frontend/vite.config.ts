import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// we export a function so that `mode` is available.  environment
// variables are loaded via `loadEnv` since `import.meta.env` is not
// populated when the config file is executed by Node.
export default ({ mode }) => {
    // load all env vars prefixed with VITE_
    const env = loadEnv(mode, process.cwd(), 'VITE_');

    return defineConfig({
        // when deploying to GitHub Pages (or any sub-path) the `base` option
        // controls where assets are loaded from.  developers can override it
        // at build time using the VITE_BASE environment variable:
        base: env.VITE_BASE || '/',
        plugins: [react()],
        server: {
            port: 3000,
            proxy: {
                '/blackrock': {
                    // read from env if developer wants to proxy to a different
                    // backend during local testing (e.g. a deployed server).
                    target: process.env.API_PROXY_TARGET || 'http://localhost:5477',
                    changeOrigin: true,
                }
            }
        }
    });
};
