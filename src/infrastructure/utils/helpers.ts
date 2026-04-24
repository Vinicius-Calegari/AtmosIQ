import { WEATHER_CODES } from '@core/constants/api';

export function getWeatherIcon(code: number): string {
  const codes = WEATHER_CODES as Record<string, readonly number[]>;
  if (codes.THUNDERSTORM.includes(code)) return 'CloudLightning';
  if (codes.DRIZZLE.includes(code)) return 'CloudDrizzle';
  if (codes.RAIN.includes(code)) return 'CloudRain';
  if (codes.SNOW.includes(code)) return 'Snowflake';
  if (codes.FOG.includes(code)) return 'CloudFog';
  if (codes.CLEAR.includes(code) || codes.MAINLY_CLEAR.includes(code)) return 'Sun';
  if (codes.PARTLY_CLOUDY.includes(code) || codes.OVERCAST.includes(code)) return 'Cloud';
  return 'Cloud';
}

export function getWeatherEmoji(icon: string): string {
  const iconMap: Record<string, string> = {
    '01d': 'Ensolarado',
    '01n': 'Noite limpa',
    '02d': 'Predomínio de sol',
    '02n': 'Noite com poucas nuvens',
    '03d': 'Parcialmente nublado',
    '03n': 'Parcialmente nublado',
    '04d': 'Nublado',
    '04n': 'Nublado',
    '09d': 'Pancadas',
    '09n': 'Pancadas',
    '10d': 'Chuva fraca',
    '10n': 'Chuva fraca',
    '11d': 'Tempestade',
    '11n': 'Tempestade',
    '13d': 'Neve',
    '13n': 'Neve',
    '50d': 'Neblina',
    '50n': 'Neblina',
  };
  return iconMap[icon] || 'Clima';
}

export function formatTemperature(temp: number, unit: 'C' | 'F' = 'C'): string {
  if (unit === 'F') {
    return `${Math.round((temp * 9) / 5 + 32)}°F`;
  }

  return `${Math.round(temp)}°C`;
}

export function formatDate(date: Date | number, format: 'short' | 'long' = 'short'): string {
  const value = typeof date === 'number' ? new Date(date * 1000) : date;

  if (format === 'short') {
    return value.toLocaleDateString('pt-BR', { weekday: 'short' });
  }

  return value.toLocaleDateString('pt-BR', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatWindSpeed(speedMps: number): string {
  const kmh = Math.round(speedMps * 3.6);
  return `${kmh} km/h`;
}

export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => func(...args), wait);
  };
}

export function getUVIndexDescription(uvIndex: number): string {
  if (uvIndex <= 2) return 'Baixo';
  if (uvIndex <= 5) return 'Moderado';
  if (uvIndex <= 7) return 'Alto';
  if (uvIndex <= 10) return 'Muito alto';
  return 'Extremo';
}

export function getWindDirection(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}
