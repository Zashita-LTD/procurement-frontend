import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 3001,
        proxy: {
            // Запросы к продуктам (поиск, каталог) -> Product Service
            '/api/products': {
                target: 'http://localhost:8000',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/products/, '/api/v1/products'),
            },
            // Запросы к Brain Service (документы, matching) -> Procurement Brain
            '/api/brain': {
                target: 'http://localhost:8001',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/brain/, '/api/v1'),
            },
        },
    },
})

