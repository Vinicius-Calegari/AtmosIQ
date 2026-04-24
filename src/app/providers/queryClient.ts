import { QueryClient } from '@tanstack/react-query';
import { CACHE_CONFIG } from '@core/constants/api';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: CACHE_CONFIG.STALE_TIME,
      gcTime: CACHE_CONFIG.CACHE_TIME,
      retry: CACHE_CONFIG.RETRY_ATTEMPTS,
      refetchOnWindowFocus: false,
    },
  },
});
