/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ESPO_API_URL: string;
  readonly VITE_AUTO_REFRESH_INTERVAL: string;
  readonly VITE_AUTH_MODE: string;
  readonly VITE_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
