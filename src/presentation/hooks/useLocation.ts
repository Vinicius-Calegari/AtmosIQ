import { useCallback, useState } from 'react';
import { weatherApi } from '@data/api/weatherApi';
import { DEFAULT_LOCATION } from '@core/constants/api';
import type { Location } from '@core/types/weather';

interface UseLocationResult {
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  detectLocation: () => Promise<Location>;
  searchLocations: (query: string) => Promise<Location[]>;
}

export function useLocation(): UseLocationResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detectLocation = useCallback(async (): Promise<Location> => {
    if (!navigator.geolocation) {
      const fallback = buildDefaultLocation();
      setError('A geolocalização não é suportada neste navegador. Usando a cidade padrão.');
      return fallback;
    }

    setIsLoading(true);
    setError(null);

    try {
      const coordinates = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        });
      });

      const lat = coordinates.coords.latitude;
      const lon = coordinates.coords.longitude;

      try {
        const resolvedLocation = await weatherApi.reverseGeocode(lat, lon);

        if (resolvedLocation) {
          return resolvedLocation;
        }
      } catch {
        setError('Localização detectada, mas não foi possível identificar o nome da cidade.');
      }

      return {
        name: 'Sua localização',
        lat,
        lon,
        country: 'Local atual',
      };
    } catch (error) {
      setError(getGeolocationErrorMessage(error));
      return buildDefaultLocation();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchLocations = useCallback(async (query: string): Promise<Location[]> => {
    if (!query.trim() || query.length < 2) {
      return [];
    }

    try {
      setError(null);
      return await weatherApi.searchLocations(query);
    } catch {
      setError('Não foi possível pesquisar locais agora. Tente novamente em instantes.');
      return [];
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    clearError,
    detectLocation,
    searchLocations,
  };
}

function buildDefaultLocation(): Location {
  return {
    name: DEFAULT_LOCATION.name,
    lat: DEFAULT_LOCATION.lat,
    lon: DEFAULT_LOCATION.lon,
    country: DEFAULT_LOCATION.country,
  };
}

function getGeolocationErrorMessage(error: unknown): string {
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? Number((error as { code?: number }).code)
      : undefined;

  switch (code) {
    case GeolocationPositionError.PERMISSION_DENIED:
      return 'Permissão de localização negada. Usando a cidade padrão.';
    case GeolocationPositionError.POSITION_UNAVAILABLE:
      return 'As informações de localização não estão disponíveis. Usando a cidade padrão.';
    case GeolocationPositionError.TIMEOUT:
      return 'A busca pela localização expirou. Usando a cidade padrão.';
    default:
      return 'Não foi possível detectar sua localização. Usando a cidade padrão.';
  }
}
