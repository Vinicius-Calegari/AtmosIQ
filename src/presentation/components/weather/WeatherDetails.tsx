import { motion } from 'framer-motion';
import {
  Thermometer,
  Droplets,
  Wind,
  Eye,
  Gauge,
  Cloud,
  type LucideIcon,
} from 'lucide-react';
import { Card } from '@presentation/components/common/Card';

interface WeatherDetail {
  icon: LucideIcon;
  label: string;
  value: string;
  description?: string;
}

interface WeatherDetailsProps {
  details: WeatherDetail[];
}

export function WeatherDetails({ details }: WeatherDetailsProps) {
  return (
    <Card padding="sm">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {details.map((detail, index) => (
          <motion.div
            key={detail.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-3 rounded-xl bg-bg-secondary p-3"
          >
            <div className="rounded-lg bg-accent-primary/10 p-2 text-accent-primary">
              <detail.icon size={20} />
            </div>
            <div>
              <p className="text-xs text-text-muted">{detail.label}</p>
              <p className="text-sm font-semibold text-text-primary">{detail.value}</p>
              {detail.description && (
                <p className="text-xs text-text-secondary">{detail.description}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}

export function getWeatherDetails(weather: {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    temp_min: number;
    temp_max: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  visibility: number;
  clouds: {
    all: number;
  };
  sys: {
    sunrise: number;
    sunset: number;
  };
}): WeatherDetail[] {
  const getWindDirection = (deg: number): string => {
    const directions = ['N', 'NE', 'L', 'SE', 'S', 'SO', 'O', 'NO'];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
  };

  return [
    {
      icon: Thermometer,
      label: 'Sensação',
      value: `${Math.round(weather.main.feels_like)}°C`,
      description: getFeelsLikeDescription(weather.main.feels_like, weather.main.temp),
    },
    {
      icon: Droplets,
      label: 'Umidade',
      value: `${weather.main.humidity}%`,
      description: getHumidityDescription(weather.main.humidity),
    },
    {
      icon: Wind,
      label: 'Vento',
      value: `${Math.round(weather.wind.speed * 3.6)} km/h`,
      description: getWindDirection(weather.wind.deg),
    },
    {
      icon: Eye,
      label: 'Visibilidade',
      value: `${(weather.visibility / 1000).toFixed(1)} km`,
    },
    {
      icon: Gauge,
      label: 'Pressão',
      value: `${weather.main.pressure} hPa`,
      description: getPressureDescription(weather.main.pressure),
    },
    {
      icon: Cloud,
      label: 'Nebulosidade',
      value: `${weather.clouds.all}%`,
    },
  ];
}

function getFeelsLikeDescription(feelsLike: number, actual: number): string {
  const diff = feelsLike - actual;
  if (Math.abs(diff) <= 2) return 'Próxima da temperatura real';
  if (diff > 0) return 'Mais quente por causa da umidade';
  return 'Mais fria por causa do vento';
}

function getHumidityDescription(humidity: number): string {
  if (humidity < 30) return 'Seco';
  if (humidity < 60) return 'Confortável';
  if (humidity < 80) return 'Úmido';
  return 'Muito úmido';
}

function getPressureDescription(pressure: number): string {
  if (pressure < 1000) return 'Baixa';
  if (pressure < 1020) return 'Normal';
  return 'Alta';
}
