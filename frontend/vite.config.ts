import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        proxy: {
            '/blackrock': {
                target: 'http://localhost:5477',
                changeOrigin: true,
            }
        }
    }
})
