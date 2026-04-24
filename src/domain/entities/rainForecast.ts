import type { RainForecastApiResponse } from '@core/types/rain';

export interface HourlyRainPoint {
  time: Date;
  label: string;
  probability: number;
  precipitationMm: number;
  rainMm: number;
  showersMm: number;
}

export interface DailyRainSummary {
  date: Date;
  label: string;
  rainSumMm: number;
  precipitationHours: number;
  maxProbability: number;
}

export class RainForecastEntity {
  constructor(private readonly data: RainForecastApiResponse) {}

  get hourlyTimeline(): HourlyRainPoint[] {
    return this.data.hourly.time.map((time, index) => {
      const date = new Date(time);

      return {
        time: date,
        label: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        probability: this.data.hourly.precipitation_probability[index] ?? 0,
        precipitationMm: roundToOneDecimal(this.data.hourly.precipitation[index] ?? 0),
        rainMm: roundToOneDecimal(this.data.hourly.rain[index] ?? 0),
        showersMm: roundToOneDecimal(this.data.hourly.showers[index] ?? 0),
      };
    });
  }

  get next12Hours(): HourlyRainPoint[] {
    return this.hourlyTimeline.slice(0, 12);
  }

  get next24Hours(): HourlyRainPoint[] {
    return this.hourlyTimeline.slice(0, 24);
  }

  get dailyOutlook(): DailyRainSummary[] {
    return this.data.daily.time.map((time, index) => {
      const date = new Date(time);

      return {
        date,
        label: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
        rainSumMm: roundToOneDecimal(this.data.daily.rain_sum[index] ?? 0),
        precipitationHours: roundToOneDecimal(this.data.daily.precipitation_hours[index] ?? 0),
        maxProbability: this.data.daily.precipitation_probability_max[index] ?? 0,
      };
    });
  }

  get isRainingNow(): boolean {
    return this.currentPrecipitationMm > 0.1 || this.currentRainMm > 0.1 || this.currentShowersMm > 0.1;
  }

  get currentPrecipitationMm(): number {
    return roundToOneDecimal(this.data.current.precipitation ?? 0);
  }

  get currentRainMm(): number {
    return roundToOneDecimal(this.data.current.rain ?? 0);
  }

  get currentShowersMm(): number {
    return roundToOneDecimal(this.data.current.showers ?? 0);
  }

  get nextRainWindow(): HourlyRainPoint | null {
    return this.next24Hours.find((point) => point.probability >= 35 || point.precipitationMm >= 0.2) ?? null;
  }

  get peakRainWindow(): HourlyRainPoint | null {
    return this.next24Hours.reduce<HourlyRainPoint | null>((peak, point) => {
      if (!peak) {
        return point;
      }

      if (point.probability > peak.probability) {
        return point;
      }

      if (point.probability === peak.probability && point.precipitationMm > peak.precipitationMm) {
        return point;
      }

      return peak;
    }, null);
  }

  get next24HourVolumeMm(): number {
    return roundToOneDecimal(
      this.next24Hours.reduce((total, point) => total + point.precipitationMm, 0)
    );
  }

  get summary(): string {
    if (this.isRainingNow) {
      return `Está chovendo agora, com ${this.currentPrecipitationMm.toFixed(1)} mm no intervalo mais recente.`;
    }

    if (this.nextRainWindow && this.peakRainWindow) {
      return `O próximo sinal relevante de chuva começa por volta de ${this.nextRainWindow.label}, com pico de ${this.peakRainWindow.probability}% nas próximas 24 horas.`;
    }

    return 'Não há sinal relevante de chuva nas próximas 24 horas para este local.';
  }
}

export function createRainForecastEntity(data: RainForecastApiResponse): RainForecastEntity {
  return new RainForecastEntity(data);
}

function roundToOneDecimal(value: number): number {
  return Math.round(value * 10) / 10;
}
