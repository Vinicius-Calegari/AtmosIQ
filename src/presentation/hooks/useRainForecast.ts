import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DEFAULT_LOCATION, CACHE_CONFIG } from '@core/constants/api';
import type { Location } from '@core/types/weather';
import { rainApi } from '@data/api/rainApi';
import {
  createRainForecastEntity,
  type RainForecastEntity,
} from '@domain/entities/rainForecast';

interface UseRainForecastResult {
  rainForecast: RainForecastEntity | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useRainForecast(location: Location | null): UseRainForecastResult {
  const lat = location?.lat ?? DEFAULT_LOCATION.lat;
  const lon = location?.lon ?? DEFAULT_LOCATION.lon;

  const {
    data,
    isLoading,
    error,
    refetch: refetchQuery,
  } = useQuery({
    queryKey: ['rain-forecast', lat, lon],
    queryFn: () => rainApi.getRainForecast(lat, lon),
    staleTime: CACHE_CONFIG.STALE_TIME,
    gcTime: CACHE_CONFIG.CACHE_TIME,
    retry: CACHE_CONFIG.RETRY_ATTEMPTS,
  });

  const rainForecast = useMemo(
    () => (data ? createRainForecastEntity(data) : null),
    [data]
  );

  return {
    rainForecast,
    isLoading,
    error: error as Error | null,
    refetch: () => {
      void refetchQuery();
    },
  };
}
