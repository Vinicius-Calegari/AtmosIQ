/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME?: string;
  readonly VITE_AI_GATEWAY_URL?: string;
  readonly VITE_DEFAULT_LAT?: string;
  readonly VITE_DEFAULT_LON?: string;
  readonly VITE_DEFAULT_CITY?: string;
  readonly VITE_DEFAULT_COUNTRY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
