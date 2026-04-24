export interface RainForecastApiResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  current: {
    time: string;
    interval: number;
    precipitation: number;
    rain: number;
    showers: number;
  };
  hourly: {
    time: string[];
    precipitation_probability: number[];
    precipitation: number[];
    rain: number[];
    showers: number[];
  };
  daily: {
    time: string[];
    rain_sum: number[];
    precipitation_hours: number[];
    precipitation_probability_max: number[];
  };
}
