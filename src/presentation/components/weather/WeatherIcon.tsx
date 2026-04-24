import { 
  Sun, 
  Moon, 
  Cloud, 
  CloudRain, 
  CloudLightning, 
  CloudSnow, 
  CloudFog,
  CloudDrizzle,
  type LucideIcon
} from 'lucide-react';
import { motion } from 'framer-motion';

interface WeatherIconProps {
  icon: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
}

export function WeatherIcon({ icon, size = 'md', animated = true }: WeatherIconProps) {
  const IconComponent = getIconComponent(icon);
  const iconSize = getSizeValue(size);

  const iconElement = (
    <IconComponent 
      size={iconSize} 
      className={getIconColor(icon)}
    />
  );

  if (!animated) {
    return iconElement;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      {iconElement}
    </motion.div>
  );
}

function getIconComponent(icon: string): LucideIcon {
  const iconMap: Record<string, LucideIcon> = {
    '01d': Sun,
    '01n': Moon,
    '02d': Cloud,
    '02n': Cloud,
    '03d': Cloud,
    '03n': Cloud,
    '04d': Cloud,
    '04n': Cloud,
    '09d': CloudRain,
    '09n': CloudRain,
    '10d': CloudDrizzle,
    '10n': CloudRain,
    '11d': CloudLightning,
    '11n': CloudLightning,
    '13d': CloudSnow,
    '13n': CloudSnow,
    '50d': CloudFog,
    '50n': CloudFog,
  };

  return iconMap[icon] || Cloud;
}

function getSizeValue(size: 'sm' | 'md' | 'lg' | 'xl'): number {
  const sizes = {
    sm: 20,
    md: 24,
    lg: 32,
    xl: 48,
  };
  return sizes[size];
}

function getIconColor(icon: string): string {
  if (icon.includes('01d')) return 'text-yellow-400';
  if (icon.includes('01n')) return 'text-blue-300';
  if (icon.includes('02') || icon.includes('03') || icon.includes('04')) return 'text-gray-400';
  if (icon.includes('09') || icon.includes('10')) return 'text-blue-400';
  if (icon.includes('11')) return 'text-purple-400';
  if (icon.includes('13')) return 'text-cyan-200';
  if (icon.includes('50')) return 'text-gray-300';
  return 'text-gray-400';
}