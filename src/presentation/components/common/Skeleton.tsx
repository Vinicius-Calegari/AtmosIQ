

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
}: SkeletonProps) {
  const baseStyles = 'bg-gradient-to-r from-bg-card via-bg-secondary to-bg-card bg-[length:200%_100%] animate-shimmer';
  
  const variants = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  };

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${className}`}
      style={{ width, height }}
    />
  );
}

// Predefined skeleton patterns
export function WeatherCardSkeleton() {
  return (
    <div className="bg-bg-card rounded-2xl border border-white/5 p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <Skeleton width={120} height={24} className="mb-2" />
          <Skeleton width={80} height={16} />
        </div>
        <Skeleton width={64} height={64} variant="circular" />
      </div>
      <Skeleton width={200} height={72} className="mb-4" />
      <div className="grid grid-cols-3 gap-4">
        <Skeleton height={60} />
        <Skeleton height={60} />
        <Skeleton height={60} />
      </div>
    </div>
  );
}

export function ForecastSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center justify-between p-4 bg-bg-secondary rounded-xl">
          <Skeleton width={60} height={20} />
          <Skeleton width={40} height={40} variant="circular" />
          <Skeleton width={80} height={20} />
        </div>
      ))}
    </div>
  );
}

export function RainForecastSkeleton() {
  return (
    <div className="bg-bg-card rounded-2xl border border-white/5 p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <Skeleton width={140} height={24} className="mb-2" />
          <Skeleton width="100%" height={16} />
        </div>
        <Skeleton width={28} height={28} variant="circular" />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Skeleton height={92} />
        <Skeleton height={92} />
        <Skeleton height={92} />
      </div>
      <div className="mt-6 grid grid-cols-6 gap-2 sm:grid-cols-12">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Skeleton key={item} height={112} />
        ))}
      </div>
    </div>
  );
}

export function InsightsSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-3 p-4 bg-bg-secondary rounded-xl">
          <Skeleton width={40} height={40} variant="circular" />
          <div className="flex-1">
            <Skeleton width={100} height={16} className="mb-2" />
            <Skeleton width="100%" height={14} />
            <Skeleton width="70%" height={14} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SearchSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton height={48} />
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3 p-3">
          <Skeleton width={20} height={20} variant="circular" />
          <Skeleton width="100%" height={16} />
        </div>
      ))}
    </div>
  );
}
