import { featureFlags, runtimeConfig } from '@core/config/env';

// Application Configuration
export const APP_CONFIG = {
  NAME: runtimeConfig.appName,
  VERSION: '2.0.0',
  DESCRIPTION: 'plataforma de inteligência climática com IA',
  AUTHOR: 'AtmosIQ Studio',
} as const;

// AI Configuration
export const AI_CONFIG = {
  MODE: featureFlags.hasAIGateway ? 'gateway' : 'local-fallback',
  GATEWAY_URL: runtimeConfig.aiGatewayUrl,
  REQUEST_TIMEOUT_MS: 12000,
  ASSISTANT_NAME: 'Assistente Atmos',
} as const;

// Feature Flags
export const FEATURES = {
  AI_INSIGHTS: true,
  AI_CHAT: true,
  FORECAST: true,
  LOCATION_SEARCH: true,
  RECENT_SEARCHES: true,
  ANIMATIONS: true,
} as const;

// Environment
export const ENV = {
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
} as const;
