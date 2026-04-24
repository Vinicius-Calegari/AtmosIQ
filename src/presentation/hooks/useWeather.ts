import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { weatherApi } from '@data/api/weatherApi';
import { createWeatherEntity, type WeatherEntity } from '@domain/entities/weather';
import { DEFAULT_LOCATION } from '@core/constants/api';
import type { Location } from '@core/types/weather';

interface UseWeatherResult {
  weather: WeatherEntity | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useWeather(location: Location | null): UseWeatherResult {
  const [weather, setWeather] = useState<WeatherEntity | null>(null);
  
  const lat = location?.lat ?? DEFAULT_LOCATION.lat;
  const lon = location?.lon ?? DEFAULT_LOCATION.lon;

  const {
    data,
    isLoading,
    error,
    refetch: refetchQuery,
  } = useQuery({
    queryKey: ['weather-bundle', lat, lon, location?.name],
    queryFn: () => weatherApi.getWeatherBundle(lat, lon, location ?? undefined),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (data) {
      const entity = createWeatherEntity(data.current, data.forecast, location || undefined);
      setWeather(entity);
    }
  }, [data, location]);
  
  const refetch = useCallback(() => {
    void refetchQuery();
  }, [refetchQuery]);

  return {
    weather,
    isLoading,
    error: error as Error | null,
    refetch,
  };
}
