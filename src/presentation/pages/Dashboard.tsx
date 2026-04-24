import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  MapPin,
  Navigation,
  Sparkles,
  MessageCircle,
  Loader2,
  Layers3,
  CloudRainWind,
} from 'lucide-react';
import { APP_CONFIG, AI_CONFIG } from '@core/constants/config';
import { UI_CONFIG } from '@core/constants/api';
import { Input } from '@presentation/components/common/Input';
import { Button } from '@presentation/components/common/Button';
import { Card } from '@presentation/components/common/Card';
import {
  WeatherCardSkeleton,
  ForecastSkeleton,
} from '@presentation/components/common/Skeleton';
import { ErrorState } from '@presentation/components/common/ErrorState';
import { CurrentWeather } from '@presentation/components/weather/CurrentWeather';
import { Forecast } from '@presentation/components/weather/Forecast';
import { RainForecast } from '@presentation/components/weather/RainForecast';
import { AIInsights } from '@presentation/components/ai/AIInsights';
import { AIChat } from '@presentation/components/ai/AIChat';
import { useWeather } from '@presentation/hooks/useWeather';
import { useRainForecast } from '@presentation/hooks/useRainForecast';
import { useLocation } from '@presentation/hooks/useLocation';
import { useAIInsights, useAIChat } from '@presentation/hooks/useAIInsights';
import { useDashboardStore } from '@presentation/stores/useDashboardStore';
import type { Location } from '@core/types/weather';

export function Dashboard() {
  return <DashboardContent />;
}

function DashboardContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const normalizedSearchQuery = searchQuery.trim();
  const shouldShowSearchPanel = normalizedSearchQuery.length >= 2 && !isSearching;

  const {
    selectedLocation,
    recentSearches,
    isChatOpen,
    setSelectedLocation,
    rememberLocation,
    clearRecentSearches,
    toggleChat,
    setChatOpen,
  } = useDashboardStore();

  const {
    isLoading: locationLoading,
    error: locationError,
    clearError: clearLocationError,
    detectLocation,
    searchLocations,
  } = useLocation();

  const {
    weather,
    isLoading: weatherLoading,
    error: weatherError,
    refetch,
  } = useWeather(selectedLocation);

  const {
    rainForecast,
    isLoading: rainLoading,
    error: rainError,
    refetch: refetchRainForecast,
  } = useRainForecast(selectedLocation);

  const {
    insights,
    isLoading: insightsLoading,
    error: insightsError,
    generateInsights,
  } = useAIInsights();

  const {
    messages,
    isLoading: chatLoading,
    error: chatError,
    sendMessage,
  } = useAIChat();

  useEffect(() => {
    if (selectedLocation) {
      return;
    }

    let cancelled = false;

    void detectLocation().then((resolvedLocation) => {
      if (!cancelled) {
        setSelectedLocation(resolvedLocation);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [detectLocation, selectedLocation, setSelectedLocation]);

  useEffect(() => {
    if (weather && insights.length === 0) {
      void generateInsights(weather);
    }
  }, [weather, insights.length, generateInsights]);

  useEffect(() => {
    const normalizedQuery = searchQuery.trim();

    if (normalizedQuery.length < 2) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    let active = true;
    setIsSearching(true);

    const timer = window.setTimeout(async () => {
      const results = await searchLocations(normalizedQuery);

      if (active) {
        setSearchResults(results);
        setIsSearching(false);
      }
    }, UI_CONFIG.DEBOUNCE_DELAY);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [searchLocations, searchQuery]);

  const handleLocationSelect = useCallback(
    (location: Location) => {
      rememberLocation(location);
      clearLocationError();
      setSearchQuery('');
      setSearchResults([]);
    },
    [clearLocationError, rememberLocation]
  );

  const handleUseMyLocation = useCallback(async () => {
    const resolvedLocation = await detectLocation();
    setSelectedLocation(resolvedLocation);
  }, [detectLocation, setSelectedLocation]);

  const handleRefreshInsights = useCallback(() => {
    if (weather) {
      void generateInsights(weather);
    }
  }, [generateInsights, weather]);

  const handleSendChatMessage = useCallback(
    (message: string) => {
      if (weather) {
        void sendMessage(weather, message);
      }
    },
    [sendMessage, weather]
  );

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <header className="sticky top-0 z-40 border-b border-white/5 bg-bg-primary/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-gradient-accent p-2.5 shadow-lg shadow-accent-primary/20">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-text-muted">Inteligência climática</p>
              <h1 className="text-xl font-bold text-text-primary">{APP_CONFIG.NAME}</h1>
            </div>
          </div>

          <div className="relative hidden max-w-md flex-1 md:block">
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Pesquise uma cidade para saber se vai chover"
              leftIcon={<Search size={18} />}
              rightIcon={
                isSearching ? <Loader2 size={16} className="animate-spin" /> : undefined
              }
              onClear={() => {
                setSearchQuery('');
                setSearchResults([]);
              }}
            />
            <p className="mt-2 px-1 text-xs text-text-muted">
              Pesquise qualquer cidade, região ou aeroporto para atualizar a previsão de chuva.
            </p>

            <AnimatePresence>
              {shouldShowSearchPanel && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-bg-card shadow-2xl shadow-black/30"
                >
                  {searchResults.length > 0 ? (
                    searchResults.map((result) => (
                      <button
                        key={`${result.lat}-${result.lon}`}
                        onClick={() => handleLocationSelect(result)}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-bg-secondary"
                      >
                        <MapPin size={16} className="text-text-muted" />
                        <div>
                          <p className="text-sm font-medium text-text-primary">{result.name}</p>
                          <p className="text-xs text-text-muted">
                            {result.state ? `${result.state}, ` : ''}
                            {result.country}
                          </p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-4 text-sm text-text-muted">
                      Nenhum local foi encontrado para "{normalizedSearchQuery}".
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUseMyLocation}
              isLoading={locationLoading}
              title="Usar localização atual"
            >
              <Navigation size={18} />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={toggleChat}
              leftIcon={<MessageCircle size={18} />}
            >
              <span className="hidden sm:inline">Assistente</span>
            </Button>
          </div>
        </div>

        <div className="mx-auto block max-w-7xl px-4 pb-4 md:hidden sm:px-6">
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Pesquise uma cidade para ver a chuva"
            leftIcon={<Search size={18} />}
            rightIcon={isSearching ? <Loader2 size={16} className="animate-spin" /> : undefined}
            onClear={() => {
              setSearchQuery('');
              setSearchResults([]);
            }}
          />
          <p className="mt-2 px-1 text-xs text-text-muted">
            Pesquise qualquer lugar e o panorama de chuva abaixo será atualizado para esse local.
          </p>

          <AnimatePresence>
            {shouldShowSearchPanel && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-2 overflow-hidden rounded-2xl border border-white/10 bg-bg-card shadow-2xl shadow-black/30"
              >
                {searchResults.length > 0 ? (
                  searchResults.map((result) => (
                    <button
                      key={`${result.lat}-${result.lon}`}
                      onClick={() => handleLocationSelect(result)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-bg-secondary"
                    >
                      <MapPin size={16} className="text-text-muted" />
                      <div>
                        <p className="text-sm font-medium text-text-primary">{result.name}</p>
                        <p className="text-xs text-text-muted">
                          {result.state ? `${result.state}, ` : ''}
                          {result.country}
                        </p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-4 text-sm text-text-muted">
                    Nenhum local foi encontrado para "{normalizedSearchQuery}".
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <section className="mb-6">
          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.22),_transparent_36%),linear-gradient(135deg,rgba(7,15,29,1),rgba(17,24,39,0.92))] p-6 shadow-2xl shadow-black/20 sm:p-8">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="absolute -bottom-24 left-0 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative z-10 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
              <div>
                <p className="mb-3 text-sm font-medium uppercase tracking-[0.28em] text-cyan-300/80">
                  Resumo climático com IA
                </p>
                <h2 className="max-w-3xl text-3xl font-bold leading-tight text-white sm:text-4xl">
                  Pesquise qualquer lugar e entenda o risco de chuva antes de sair de casa.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                  {APP_CONFIG.NAME} combina dados climáticos em tempo real, previsão de chuva,
                  cache no cliente e uma camada de interpretação inteligente para entregar contexto,
                  não só números.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                <MetricPill
                  icon={<CloudRainWind size={18} />}
                  label="Fonte de dados"
                  value="Open-Meteo"
                />
                <MetricPill
                  icon={<Layers3 size={18} />}
                  label="Modo de IA"
                  value={AI_CONFIG.MODE === 'gateway' ? 'Gateway seguro' : 'Modo local'}
                />
                <MetricPill
                  icon={<MapPin size={18} />}
                  label="Contexto"
                  value={
                    selectedLocation
                      ? `${selectedLocation.name}, ${selectedLocation.country}`
                      : 'Carregando localização'
                  }
                />
              </div>
            </div>
          </div>
        </section>

        {locationError && (
          <div className="mb-6">
            <Card className="border border-amber-500/20 bg-amber-500/5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-amber-300">Aviso de localização</p>
                  <p className="text-sm text-amber-100/90">{locationError}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={clearLocationError}>
                    Fechar
                  </Button>
                  <Button variant="secondary" size="sm" onClick={handleUseMyLocation}>
                    Tentar de novo
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {weatherError ? (
              <ErrorState
                variant="default"
                title="Resumo do clima indisponível"
                message={weatherError.message}
                onRetry={refetch}
              />
            ) : weatherLoading || !weather ? (
              <WeatherCardSkeleton />
            ) : (
              <CurrentWeather weather={weather} />
            )}

            <RainForecast
              rainForecast={rainForecast}
              isLoading={rainLoading}
              error={rainError}
              onRetry={refetchRainForecast}
            />

            {weatherError ? null : weatherLoading || !weather ? (
              <ForecastSkeleton />
            ) : (
              <Forecast forecast={weather.dailyForecast} />
            )}
          </div>

          <div className="space-y-6">
            <AIInsights
              insights={insights}
              isLoading={insightsLoading}
              error={insightsError}
              mode={AI_CONFIG.MODE}
              onRefresh={handleRefreshInsights}
            />

            {recentSearches.length > 0 && (
              <Card padding="sm">
                <div className="mb-3 flex items-center justify-between px-3">
                  <h3 className="text-sm font-semibold text-text-primary">Locais recentes</h3>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-text-muted transition-colors hover:text-text-primary"
                  >
                    Limpar
                  </button>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((location, index) => (
                    <button
                      key={`${location.lat}-${location.lon}-${index}`}
                      onClick={() => handleLocationSelect(location)}
                      className="flex w-full items-center gap-2 rounded-xl p-2 text-left transition-colors hover:bg-bg-secondary"
                    >
                      <MapPin size={14} className="text-text-muted" />
                      <span className="text-sm text-text-secondary">
                        {location.name}, {location.country}
                      </span>
                    </button>
                  ))}
                </div>
              </Card>
            )}

            <AnimatePresence>
              {isChatOpen && weather && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <AIChat
                    messages={messages}
                    isLoading={chatLoading}
                    error={chatError}
                    onSendMessage={handleSendChatMessage}
                    onClose={() => setChatOpen(false)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <footer className="mt-12 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <p className="text-center text-sm text-text-muted">
            {APP_CONFIG.NAME} - projeto de portfólio com inteligência climática, interface em português e arquitetura pronta para IA.
          </p>
        </div>
      </footer>
    </div>
  );
}

interface MetricPillProps {
  icon: ReactNode;
  label: string;
  value: string;
}

function MetricPill({ icon, label, value }: MetricPillProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
      <div className="mb-2 flex items-center gap-2 text-cyan-300">
        {icon}
        <span className="text-xs uppercase tracking-[0.22em] text-cyan-300/80">{label}</span>
      </div>
      <p className="text-sm font-semibold text-white">{value}</p>
    </div>
  );
}
