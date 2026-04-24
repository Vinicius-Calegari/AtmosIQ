import type { CurrentWeather, ForecastData, Location } from '@core/types/weather';

export interface WeatherEntity {
  cityName: string;
  country: string;
  temperature: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDeg: number;
  windGust?: number;
  visibility: number;
  cloudiness: number;
  condition: string;
  description: string;
  icon: string;
  sunrise: number;
  sunset: number;
  timestamp: number;
  current: {
    wind: { speed: number };
    visibility: number;
    main: { pressure: number };
    sys: { sunrise: number; sunset: number };
  };
  dailyForecast: DailyForecast[];
  location?: Location;
}

export interface DailyForecast {
  date: Date;
  temperature: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  description: string;
  icon: string;
  precipitation: number;
  precipitationProbability: number;
}

export function createWeatherEntity(
  current: CurrentWeather,
  forecast: ForecastData,
  location?: Location
): WeatherEntity {
  const weather = current.weather[0];
  const cityName = location?.name ?? current.sys.country ?? 'Unknown';
  const country = location?.country ?? current.sys.country ?? '';

  return {
    cityName,
    country,
    temperature: Math.round(current.main.temp),
    feelsLike: Math.round(current.main.feels_like),
    tempMin: Math.round(current.main.temp_min),
    tempMax: Math.round(current.main.temp_max),
    humidity: current.main.humidity,
    pressure: current.main.pressure,
    windSpeed: Math.round(current.wind.speed * 3.6), // Convert m/s to km/h
    windDeg: current.wind.deg,
    windGust: current.wind.gust ? Math.round(current.wind.gust * 3.6) : undefined,
    visibility: current.visibility,
    cloudiness: current.clouds.all,
    condition: weather.main,
    description: weather.description,
    icon: weather.icon,
    sunrise: current.sys.sunrise,
    sunset: current.sys.sunset,
    timestamp: current.dt,
    current: {
      wind: { speed: current.wind.speed },
      visibility: current.visibility,
      main: { pressure: current.main.pressure },
      sys: { sunrise: current.sys.sunrise, sunset: current.sys.sunset },
    },
    dailyForecast: forecast.list.map((item) => ({
      date: new Date(item.dt * 1000),
      temperature: Math.round(item.main.temp),
      tempMin: Math.round(item.main.temp_min),
      tempMax: Math.round(item.main.temp_max),
      humidity: item.main.humidity,
      windSpeed: Math.round(item.wind.speed * 3.6),
      condition: item.weather[0].main,
      description: item.weather[0].description,
      icon: item.weather[0].icon,
      precipitation: item.pop * 100,
      precipitationProbability: Math.round(item.pop * 100),
    })),
    location,
  };
}