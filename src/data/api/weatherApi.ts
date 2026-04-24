import { WEATHER_API } from '@core/constants/api';
import { AppError, toAppError } from '@core/errors/appError';
import type { OpenMeteoGeocodingResponse, OpenMeteoWeatherResponse } from '@core/types/openMeteo';
import type { CurrentWeather, ForecastData, ForecastItem, Location, WeatherCondition } from '@core/types/weather';

interface WeatherBundle {
  current: CurrentWeather;
  forecast: ForecastData;
}

class WeatherApiClient {
  private readonly baseUrl = WEATHER_API.BASE_URL;
  private readonly geoUrl = WEATHER_API.GEO_URL;

  async getWeatherBundle(lat: number, lon: number, location?: Location): Promise<WeatherBundle> {
    const data = await this.fetchForecast(lat, lon);
    const current = mapCurrentWeather(data, location);
    const forecast = mapForecastData(data, current, location);

    return { current, forecast };
  }

  async getCurrentWeather(lat: number, lon: number, location?: Location): Promise<CurrentWeather> {
    const bundle = await this.getWeatherBundle(lat, lon, location);
    return bundle.current;
  }

  async getForecast(lat: number, lon: number, location?: Location): Promise<ForecastData> {
    const bundle = await this.getWeatherBundle(lat, lon, location);
    return bundle.forecast;
  }

  async searchLocations(query: string): Promise<Location[]> {
    if (!query.trim()) return [];

    const params = new URLSearchParams({
      name: query,
      count: '5',
      language: 'pt',
      format: 'json',
    });

    const results = await this.fetchWithErrorHandling<OpenMeteoGeocodingResponse>(
      `${this.geoUrl}?${params.toString()}`
    );

    return (results.results ?? []).map((item) => ({
      name: item.name,
      lat: item.latitude,
      lon: item.longitude,
      country: item.country,
      state: item.admin1,
    }));
  }

  async reverseGeocode(lat: number, lon: number): Promise<Location | null> {
    return {
      name: 'Sua localização',
      lat,
      lon,
      country: 'Local atual',
    };
  }

  private async fetchForecast(lat: number, lon: number): Promise<OpenMeteoWeatherResponse> {
    const params = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lon),
      timezone: 'auto',
      current: [
        'temperature_2m',
        'apparent_temperature',
        'relative_humidity_2m',
        'precipitation',
        'weather_code',
        'cloud_cover',
        'pressure_msl',
        'wind_speed_10m',
        'wind_direction_10m',
        'wind_gusts_10m',
        'is_day',
        'visibility',
      ].join(','),
      hourly: [
        'temperature_2m',
        'apparent_temperature',
        'relative_humidity_2m',
        'precipitation_probability',
        'precipitation',
        'weather_code',
        'cloud_cover',
        'pressure_msl',
        'wind_speed_10m',
        'wind_direction_10m',
        'wind_gusts_10m',
        'visibility',
      ].join(','),
      daily: [
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
        'precipitation_probability_max',
        'precipitation_hours',
        'sunrise',
        'sunset',
        'rain_sum',
      ].join(','),
      forecast_days: '5',
      wind_speed_unit: 'ms',
      precipitation_unit: 'mm',
    });

    return this.fetchWithErrorHandling<OpenMeteoWeatherResponse>(`${this.baseUrl}?${params.toString()}`);
  }

  private async fetchWithErrorHandling<T>(url: string): Promise<T> {
    let response: Response;

    try {
      response = await fetch(url);
    } catch (error) {
      throw toAppError(error, 'Não foi possível se conectar ao serviço de clima agora.');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new AppError(
        error.reason || 'O serviço de clima retornou uma resposta inválida.',
        mapWeatherErrorCode(response.status),
        response.status
      );
    }

    return response.json();
  }
}

export const weatherApi = new WeatherApiClient();

function mapCurrentWeather(data: OpenMeteoWeatherResponse, location?: Location): CurrentWeather {
  const currentCondition = mapCondition(data.current.weather_code, data.current.is_day === 1);
  const sunrise = parseIsoTime(data.daily.sunrise[0]);
  const sunset = parseIsoTime(data.daily.sunset[0]);
  const cityName = location?.name || 'Local selecionado';
  const country = location?.country || 'Local atual';

  return {
    coord: {
      lon: data.longitude,
      lat: data.latitude,
    },
    weather: [currentCondition],
    base: 'open-meteo',
    main: {
      temp: data.current.temperature_2m,
      feels_like: data.current.apparent_temperature,
      temp_min: data.daily.temperature_2m_min[0] ?? data.current.temperature_2m,
      temp_max: data.daily.temperature_2m_max[0] ?? data.current.temperature_2m,
      pressure: data.current.pressure_msl,
      humidity: data.current.relative_humidity_2m,
      sea_level: data.current.pressure_msl,
      grnd_level: data.current.pressure_msl,
    },
    visibility: data.current.visibility ?? 10000,
    wind: {
      speed: data.current.wind_speed_10m,
      deg: data.current.wind_direction_10m,
      gust: data.current.wind_gusts_10m,
    },
    clouds: {
      all: data.current.cloud_cover,
    },
    dt: parseIsoTime(data.current.time),
    sys: {
      type: 1,
      id: 1,
      country,
      sunrise,
      sunset,
    },
    timezone: data.utc_offset_seconds,
    id: 0,
    name: cityName,
    cod: 200,
  };
}

function mapForecastData(
  data: OpenMeteoWeatherResponse,
  current: CurrentWeather,
  location?: Location
): ForecastData {
  const list: ForecastItem[] = data.daily.time.map((time, index) => {
    const isDay = true;
    const condition = mapCondition(data.daily.weather_code[index] ?? data.current.weather_code, isDay);

    return {
      dt: parseIsoTime(time),
      main: {
        temp: average(
          data.daily.temperature_2m_min[index] ?? current.main.temp_min,
          data.daily.temperature_2m_max[index] ?? current.main.temp_max
        ),
        feels_like: average(
          data.daily.temperature_2m_min[index] ?? current.main.feels_like,
          data.daily.temperature_2m_max[index] ?? current.main.feels_like
        ),
        temp_min: data.daily.temperature_2m_min[index] ?? current.main.temp_min,
        temp_max: data.daily.temperature_2m_max[index] ?? current.main.temp_max,
        pressure: current.main.pressure,
        humidity: current.main.humidity,
        sea_level: current.main.sea_level,
        grnd_level: current.main.grnd_level,
      },
      weather: [condition],
      clouds: {
        all: current.clouds.all,
      },
      wind: {
        speed: current.wind.speed,
        deg: current.wind.deg,
        gust: current.wind.gust,
      },
      visibility: current.visibility,
      pop: (data.daily.precipitation_probability_max[index] ?? 0) / 100,
      rain: {
        '3h': (data.daily.rain_sum[index] ?? 0) / Math.max(data.daily.precipitation_hours[index] ?? 1, 1),
      },
      sys: {
        pod: 'd',
      },
      dt_txt: time,
    };
  });

  return {
    cod: '200',
    message: 0,
    cnt: list.length,
    list,
    city: {
      id: 0,
      name: location?.name || current.name,
      coord: {
        lat: data.latitude,
        lon: data.longitude,
      },
      country: location?.country || current.sys.country,
      population: 0,
      timezone: data.utc_offset_seconds,
      sunrise: parseIsoTime(data.daily.sunrise[0]),
      sunset: parseIsoTime(data.daily.sunset[0]),
    },
  };
}

function mapWeatherErrorCode(status: number) {
  switch (status) {
    case 400:
      return 'not_found' as const;
    case 429:
      return 'rate_limit' as const;
    case 500:
    case 502:
    case 503:
    case 504:
      return 'service_unavailable' as const;
    default:
      return 'unknown' as const;
  }
}

function parseIsoTime(value: string | undefined): number {
  return value ? Math.floor(new Date(value).getTime() / 1000) : Math.floor(Date.now() / 1000);
}

function average(a: number, b: number): number {
  return (a + b) / 2;
}

function mapCondition(weatherCode: number, isDay: boolean): WeatherCondition {
  if (weatherCode === 0) {
    return buildCondition(800, 'Céu limpo', 'céu limpo', isDay ? '01d' : '01n');
  }

  if (weatherCode === 1) {
    return buildCondition(801, 'Predomínio de sol', 'predomínio de sol', isDay ? '02d' : '02n');
  }

  if (weatherCode === 2) {
    return buildCondition(802, 'Parcialmente nublado', 'parcialmente nublado', isDay ? '03d' : '03n');
  }

  if (weatherCode === 3) {
    return buildCondition(804, 'Nublado', 'nublado', isDay ? '04d' : '04n');
  }

  if ([45, 48].includes(weatherCode)) {
    return buildCondition(741, 'Neblina', 'neblina', isDay ? '50d' : '50n');
  }

  if ([51, 53, 55, 56, 57].includes(weatherCode)) {
    return buildCondition(301, 'Garoa', 'garoa', isDay ? '10d' : '10n');
  }

  if ([61, 63, 65, 66, 67].includes(weatherCode)) {
    return buildCondition(501, 'Chuva', 'chuva', isDay ? '09d' : '09n');
  }

  if ([80, 81, 82].includes(weatherCode)) {
    return buildCondition(520, 'Pancadas de chuva', 'pancadas de chuva', isDay ? '09d' : '09n');
  }

  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
    return buildCondition(601, 'Neve', 'neve', isDay ? '13d' : '13n');
  }

  if ([95, 96, 99].includes(weatherCode)) {
    return buildCondition(211, 'Tempestade', 'tempestade', isDay ? '11d' : '11n');
  }

  return buildCondition(803, 'Tempo variável', 'tempo variável', isDay ? '03d' : '03n');
}

function buildCondition(id: number, main: string, description: string, icon: string): WeatherCondition {
  return { id, main, description, icon };
}
