import { runtimeConfig } from '@core/config/env';

export const WEATHER_API = {
  BASE_URL: 'https://api.open-meteo.com/v1/forecast',
  GEO_URL: 'https://geocoding-api.open-meteo.com/v1/search',
} as const;

export const RAIN_API = {
  BASE_URL: 'https://api.open-meteo.com/v1/forecast',
  FORECAST_HOURS: 24,
  FORECAST_DAYS: 5,
} as const;

// Cache Configuration
export const CACHE_CONFIG = {
  STALE_TIME: 5 * 60 * 1000, // 5 minutes
  CACHE_TIME: 30 * 60 * 1000, // 30 minutes
  RETRY_ATTEMPTS: 2,
} as const;

// UI Configuration
export const UI_CONFIG = {
  DEBOUNCE_DELAY: 300,
  MAX_RECENT_SEARCHES: 5,
  ANIMATION_DURATION: 0.3,
} as const;

// Open-Meteo weather codes (WMO)
export const WEATHER_CODES = {
  CLEAR: [0],
  MAINLY_CLEAR: [1],
  PARTLY_CLOUDY: [2],
  OVERCAST: [3],
  FOG: [45, 48],
  DRIZZLE: [51, 53, 55, 56, 57],
  RAIN: [61, 63, 65, 66, 67, 80, 81, 82],
  SNOW: [71, 73, 75, 77, 85, 86],
  THUNDERSTORM: [95, 96, 99],
} as const;

// Default Location
export const DEFAULT_LOCATION = {
  lat: runtimeConfig.defaultLocation.lat,
  lon: runtimeConfig.defaultLocation.lon,
  name: runtimeConfig.defaultLocation.name,
  country: runtimeConfig.defaultLocation.country,
} as const;
