import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Location } from '@core/types/weather';

interface DashboardStore {
  selectedLocation: Location | null;
  recentSearches: Location[];
  isChatOpen: boolean;
  setSelectedLocation: (location: Location | null) => void;
  rememberLocation: (location: Location) => void;
  clearRecentSearches: () => void;
  setChatOpen: (open: boolean) => void;
  toggleChat: () => void;
}

const MAX_RECENT_SEARCHES = 6;

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set) => ({
      selectedLocation: null,
      recentSearches: [],
      isChatOpen: false,
      setSelectedLocation: (location) => set({ selectedLocation: location }),
      rememberLocation: (location) =>
        set((state) => {
          const recentSearches = [
            location,
            ...state.recentSearches.filter(
              (item) => item.lat !== location.lat || item.lon !== location.lon
            ),
          ].slice(0, MAX_RECENT_SEARCHES);

          return {
            selectedLocation: location,
            recentSearches,
          };
        }),
      clearRecentSearches: () => set({ recentSearches: [] }),
      setChatOpen: (open) => set({ isChatOpen: open }),
      toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
    }),
    {
      name: 'atmosiq-dashboard',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedLocation: state.selectedLocation,
        recentSearches: state.recentSearches,
        isChatOpen: state.isChatOpen,
      }),
    }
  )
);
