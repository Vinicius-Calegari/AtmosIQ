import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { CloudRain, Droplets, Clock3, Activity, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@presentation/components/common/Card';
import { Button } from '@presentation/components/common/Button';
import { RainForecastSkeleton } from '@presentation/components/common/Skeleton';
import type { RainForecastEntity, HourlyRainPoint } from '@domain/entities/rainForecast';

interface RainForecastProps {
  rainForecast: RainForecastEntity | null;
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
}

export function RainForecast({
  rainForecast,
  isLoading = false,
  error,
  onRetry,
}: RainForecastProps) {
  if (isLoading) {
    return <RainForecastSkeleton />;
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CloudRain className="h-5 w-5 text-accent-secondary" />
            Panorama de chuva
          </CardTitle>
          {onRetry && (
            <Button variant="ghost" size="sm" onClick={onRetry} leftIcon={<RefreshCw size={16} />}>
              Tentar novamente
            </Button>
          )}
        </CardHeader>
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-100">
          {error.message}
        </div>
      </Card>
    );
  }

  if (!rainForecast) {
    return null;
  }

  const nextRainWindow = rainForecast.nextRainWindow;
  const peakWindow = rainForecast.peakRainWindow;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <CloudRain className="h-5 w-5 text-accent-secondary" />
            Panorama de chuva
          </CardTitle>
          <p className="mt-1 text-sm leading-6 text-text-secondary">{rainForecast.summary}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-lg text-sm text-text-muted transition-colors hover:text-text-primary"
          >
            <RefreshCw size={16} />
            Atualizar
          </button>
        )}
      </CardHeader>

      <div className="grid gap-3 sm:grid-cols-3">
        <MetricTile
          icon={<Droplets size={16} />}
          label="Status atual"
          value={rainForecast.isRainingNow ? 'Chovendo agora' : 'Sem chuva agora'}
          hint={`${rainForecast.currentPrecipitationMm.toFixed(1)} mm no último intervalo`}
        />
        <MetricTile
          icon={<Clock3 size={16} />}
          label="Próximo evento"
          value={nextRainWindow ? nextRainWindow.label : 'Sem chuva'}
          hint={
            nextRainWindow
              ? `${nextRainWindow.probability}% de chance`
              : 'Sem sinal relevante em 24h'
          }
        />
        <MetricTile
          icon={<Activity size={16} />}
          label="Acumulado em 24h"
          value={`${rainForecast.next24HourVolumeMm.toFixed(1)} mm`}
          hint={peakWindow ? `Pico previsto para ${peakWindow.label}` : 'Baixo risco de chuva'}
        />
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-text-primary">Próximas 12 horas</h4>
          <p className="text-xs text-text-muted">Chance e volume estimado de precipitação</p>
        </div>
        <div className="grid grid-cols-6 gap-2 sm:grid-cols-12">
          {rainForecast.next12Hours.map((point, index) => (
            <HourlyRainBar key={`${point.time.toISOString()}-${index}`} point={point} />
          ))}
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-text-primary">Tendência de chuva em 5 dias</h4>
          <p className="text-xs text-text-muted">Resumo diário da Open-Meteo</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-5">
          {rainForecast.dailyOutlook.map((day) => (
            <div
              key={day.date.toISOString()}
              className="rounded-2xl border border-white/5 bg-bg-secondary/80 p-4"
            >
              <p className="text-sm font-semibold text-text-primary">{day.label}</p>
              <p className="mt-3 text-2xl font-bold text-white">{day.maxProbability}%</p>
              <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Pico de chance</p>
              <div className="mt-4 space-y-1 text-sm text-text-secondary">
                <p>{day.rainSumMm.toFixed(1)} mm previstos</p>
                <p>{day.precipitationHours.toFixed(1)} h com chuva</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

interface MetricTileProps {
  icon: ReactNode;
  label: string;
  value: string;
  hint: string;
}

function MetricTile({ icon, label, value, hint }: MetricTileProps) {
  return (
    <div className="rounded-2xl border border-white/5 bg-bg-secondary/80 p-4">
      <div className="mb-3 flex items-center gap-2 text-accent-secondary">
        {icon}
        <span className="text-xs uppercase tracking-[0.22em] text-text-muted">{label}</span>
      </div>
      <p className="text-lg font-semibold text-white">{value}</p>
      <p className="mt-1 text-sm text-text-secondary">{hint}</p>
    </div>
  );
}

function HourlyRainBar({ point }: { point: HourlyRainPoint }) {
  const height = Math.max(12, Math.min(80, point.probability * 0.8));
  const intensityClass = getRainTone(point.probability);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/5 bg-bg-secondary/70 p-2 text-center"
    >
      <p className="text-xs font-semibold text-text-primary">{point.label}</p>
      <div className="mt-3 flex h-24 items-end justify-center">
        <div
          className={`w-8 rounded-t-2xl ${intensityClass}`}
          style={{ height: `${height}px` }}
          title={`${point.probability}% de chance / ${point.precipitationMm.toFixed(1)} mm`}
        />
      </div>
      <p className="mt-2 text-xs font-medium text-cyan-200">{point.probability}%</p>
      <p className="text-[11px] text-text-muted">{point.precipitationMm.toFixed(1)} mm</p>
    </motion.div>
  );
}

function getRainTone(probability: number): string {
  if (probability >= 75) return 'bg-gradient-to-t from-cyan-300 to-blue-500';
  if (probability >= 45) return 'bg-gradient-to-t from-sky-400 to-blue-500/80';
  if (probability >= 20) return 'bg-gradient-to-t from-sky-500/70 to-blue-600/60';
  return 'bg-gradient-to-t from-white/10 to-slate-500/30';
}
