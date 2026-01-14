/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_USE_MOCKS: string
    readonly VITE_API_URL: string
    readonly VITE_PRODUCT_API_BASE_URL?: string
    readonly VITE_BRAIN_API_BASE_URL?: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
