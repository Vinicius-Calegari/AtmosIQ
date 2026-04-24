import { RAIN_API } from '@core/constants/api';
import { AppError, toAppError } from '@core/errors/appError';
import type { RainForecastApiResponse } from '@core/types/rain';

class RainApiClient {
  private readonly baseUrl = RAIN_API.BASE_URL;

  async getRainForecast(lat: number, lon: number): Promise<RainForecastApiResponse> {
    const params = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lon),
      current: 'precipitation,rain,showers',
      hourly: 'precipitation_probability,precipitation,rain,showers',
      daily: 'rain_sum,precipitation_hours,precipitation_probability_max',
      forecast_hours: String(RAIN_API.FORECAST_HOURS),
      forecast_days: String(RAIN_API.FORECAST_DAYS),
      timezone: 'auto',
      precipitation_unit: 'mm',
    });

    return this.fetchWithErrorHandling<RainForecastApiResponse>(`${this.baseUrl}?${params.toString()}`);
  }

  private async fetchWithErrorHandling<T>(url: string): Promise<T> {
    let response: Response;

    try {
      response = await fetch(url);
    } catch (error) {
      throw toAppError(error, 'Não foi possível acessar o serviço de previsão de chuva agora.');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new AppError(
        error.reason || 'Erro inesperado ao carregar a previsão de chuva.',
        'service_unavailable',
        response.status
      );
    }

    return response.json();
  }
}

export const rainApi = new RainApiClient();
