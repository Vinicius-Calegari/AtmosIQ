import { motion } from 'framer-motion';
import { Droplets } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@presentation/components/common/Card';
import { WeatherIcon } from '@presentation/components/weather/WeatherIcon';
import {
  formatTemperature,
  formatDate,
  formatPercentage,
} from '@infrastructure/utils/helpers';
import type { DailyForecast } from '@domain/entities/weather';

interface ForecastProps {
  forecast: DailyForecast[];
}

export function Forecast({ forecast }: ForecastProps) {
  if (!forecast || forecast.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Previsão para 5 dias</CardTitle>
      </CardHeader>
      <div className="space-y-2">
        {forecast.map((day, index) => (
          <ForecastItem key={day.date.toISOString()} day={day} index={index} />
        ))}
      </div>
    </Card>
  );
}

interface ForecastItemProps {
  day: DailyForecast;
  index: number;
}

function ForecastItem({ day, index }: ForecastItemProps) {
  const isToday = index === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`
        flex items-center justify-between rounded-xl bg-bg-secondary p-3 transition-colors duration-200 hover:bg-bg-card/50 sm:p-4
        ${isToday ? 'border border-accent-primary/30' : ''}
      `}
    >
      <div className="w-20 sm:w-24">
        <span
          className={`text-sm font-medium ${
            isToday ? 'text-accent-primary' : 'text-text-primary'
          }`}
        >
          {isToday ? 'Hoje' : formatDate(day.date)}
        </span>
      </div>

      <div className="flex w-14 justify-center sm:w-16">
        <WeatherIcon icon={day.icon} size="md" />
      </div>

      <div className="hidden w-24 text-center sm:block">
        <span className="text-sm capitalize text-text-secondary">{day.description}</span>
      </div>

      <div className="w-16 text-right">
        <div className="flex items-center justify-end gap-1 text-sm">
          <Droplets size={14} className="text-accent-secondary" />
          <span className="text-text-secondary">{formatPercentage(day.precipitation)}</span>
        </div>
      </div>

      <div className="flex w-24 items-center justify-end gap-2 text-right">
        <span className="text-lg font-semibold text-text-primary">
          {formatTemperature(day.tempMax)}
        </span>
        <span className="text-text-muted">/</span>
        <span className="text-text-secondary">{formatTemperature(day.tempMin)}</span>
      </div>
    </motion.div>
  );
}
