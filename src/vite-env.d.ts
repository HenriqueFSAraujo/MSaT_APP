/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly DEV: boolean;
    readonly PROD: boolean;
    readonly VITE_API_URL: string;
    // outras env vars que você usa, se quiser
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
