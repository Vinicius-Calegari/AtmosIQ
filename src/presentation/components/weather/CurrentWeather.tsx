import { motion } from 'framer-motion';
import {
  Thermometer,
  Droplets,
  Wind,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
} from 'lucide-react';
import { Card } from '@presentation/components/common/Card';
import { WeatherIcon } from '@presentation/components/weather/WeatherIcon';
import {
  formatTemperature,
  formatWindSpeed,
  formatPercentage,
  formatTime,
} from '@infrastructure/utils/helpers';
import type { WeatherEntity } from '@domain/entities/weather';

interface CurrentWeatherProps {
  weather: WeatherEntity;
}

export function CurrentWeather({ weather }: CurrentWeatherProps) {
  const details = [
    {
      icon: <Thermometer className="h-5 w-5" />,
      label: 'Sensação',
      value: formatTemperature(weather.feelsLike),
    },
    {
      icon: <Droplets className="h-5 w-5" />,
      label: 'Umidade',
      value: formatPercentage(weather.humidity),
    },
    {
      icon: <Wind className="h-5 w-5" />,
      label: 'Vento',
      value: formatWindSpeed(weather.current.wind.speed),
    },
    {
      icon: <Eye className="h-5 w-5" />,
      label: 'Visibilidade',
      value: `${(weather.current.visibility / 1000).toFixed(1)} km`,
    },
    {
      icon: <Gauge className="h-5 w-5" />,
      label: 'Pressão',
      value: `${weather.current.main.pressure} hPa`,
    },
  ];

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-accent-primary/10 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-accent-secondary/10 blur-2xl" />

      <div className="relative z-10">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-1 text-2xl font-bold text-text-primary sm:text-3xl"
            >
              {weather.cityName}
            </motion.h2>
            <p className="text-text-secondary">
              {weather.country} - {weather.description}
            </p>
          </div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/5"
          >
            <WeatherIcon icon={weather.icon} size="xl" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <span className="text-6xl font-bold text-text-primary sm:text-7xl">
            {formatTemperature(weather.temperature)}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-4 sm:grid-cols-3"
        >
          {details.map((detail) => (
            <div
              key={detail.label}
              className="flex items-center gap-3 rounded-xl bg-bg-secondary p-3"
            >
              <div className="text-accent-primary">{detail.icon}</div>
              <div>
                <p className="text-xs text-text-muted">{detail.label}</p>
                <p className="text-sm font-semibold text-text-primary">{detail.value}</p>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 flex items-center justify-center gap-8 border-t border-white/5 pt-6"
        >
          <div className="flex items-center gap-2 text-text-secondary">
            <Sunrise className="h-5 w-5 text-orange-400" />
            <span className="text-sm">{formatTime(weather.current.sys.sunrise)}</span>
          </div>
          <div className="flex items-center gap-2 text-text-secondary">
            <Sunset className="h-5 w-5 text-orange-500" />
            <span className="text-sm">{formatTime(weather.current.sys.sunset)}</span>
          </div>
        </motion.div>
      </div>
    </Card>
  );
}
