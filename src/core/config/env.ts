const DEFAULT_LAT = -23.55052;
const DEFAULT_LON = -46.633308;

function readString(value: string | undefined, fallback = ''): string {
  return value?.trim() || fallback;
}

function readNumber(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeBaseUrl(value: string | undefined): string | null {
  const normalized = value?.trim();

  if (!normalized) {
    return null;
  }

  return normalized.endsWith('/') ? normalized.slice(0, -1) : normalized;
}

export const runtimeConfig = {
  appName: readString(import.meta.env.VITE_APP_NAME, 'AtmosIQ'),
  aiGatewayUrl: normalizeBaseUrl(import.meta.env.VITE_AI_GATEWAY_URL),
  defaultLocation: {
    lat: readNumber(import.meta.env.VITE_DEFAULT_LAT, DEFAULT_LAT),
    lon: readNumber(import.meta.env.VITE_DEFAULT_LON, DEFAULT_LON),
    name: readString(import.meta.env.VITE_DEFAULT_CITY, 'São Paulo'),
    country: readString(import.meta.env.VITE_DEFAULT_COUNTRY, 'BR'),
  },
} as const;

export const featureFlags = {
  hasAIGateway: Boolean(runtimeConfig.aiGatewayUrl),
} as const;
