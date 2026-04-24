import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, MapPin, WifiOff } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message: string;
  variant?: 'default' | 'network' | 'location' | 'not-found';
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Algo deu errado',
  message,
  variant = 'default',
  onRetry,
}: ErrorStateProps) {
  const icons = {
    default: <AlertTriangle className="w-12 h-12 text-yellow-500" />,
    network: <WifiOff className="w-12 h-12 text-red-500" />,
    location: <MapPin className="w-12 h-12 text-blue-500" />,
    'not-found': <AlertTriangle className="w-12 h-12 text-orange-500" />,
  };

  const titles = {
    default: 'Ops! Algo deu errado',
    network: 'Sem conexão com a internet',
    location: 'Acesso à localização negado',
    'not-found': 'Cidade não encontrada',
  };

  const messages = {
    default: message || 'Encontramos um erro inesperado. Tente novamente.',
    network: 'Verifique sua conexão com a internet e tente novamente.',
    location: 'Ative a localização ou pesquise uma cidade manualmente.',
    'not-found': 'Não encontramos a cidade pesquisada. Tente outro nome.',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-8 text-center"
    >
      <div className="mb-4 p-4 bg-bg-card rounded-full">
        {icons[variant]}
      </div>
      <h3 className="text-xl font-semibold text-text-primary mb-2">
        {title || titles[variant]}
      </h3>
      <p className="text-text-secondary mb-6 max-w-md">
        {message || messages[variant]}
      </p>
      {onRetry && (
        <Button
          variant="secondary"
          onClick={onRetry}
          leftIcon={<RefreshCw size={18} />}
        >
          Tentar novamente
        </Button>
      )}
    </motion.div>
  );
}

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({ title, message, icon, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-8 text-center"
    >
      {icon && (
        <div className="mb-4 p-4 bg-bg-card rounded-full">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold text-text-primary mb-2">
        {title}
      </h3>
      <p className="text-text-secondary mb-6 max-w-md">
        {message}
      </p>
      {action}
    </motion.div>
  );
}
