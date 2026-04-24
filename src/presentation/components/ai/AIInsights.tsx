import { motion } from 'framer-motion';
import { Sparkles, Shirt, Activity, Heart, AlertTriangle, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@presentation/components/common/Card';
import { Skeleton } from '@presentation/components/common/Skeleton';
import type { AIInsight } from '@core/types/ai';

interface AIInsightsProps {
  insights: AIInsight[];
  isLoading?: boolean;
  error?: string | null;
  mode?: 'gateway' | 'local-fallback';
  onRefresh?: () => void;
}

export function AIInsights({
  insights,
  isLoading = false,
  error,
  mode = 'local-fallback',
  onRefresh,
}: AIInsightsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent-secondary" />
            Insights com IA
          </CardTitle>
        </CardHeader>
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
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent-secondary" />
            Insights com IA
          </CardTitle>
          <p className="mt-1 text-xs text-text-muted">
            {mode === 'gateway' ? 'Gateway seguro de IA ativado' : 'Resumo local inteligente ativado'}
          </p>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-2 text-text-muted hover:text-text-primary hover:bg-bg-secondary rounded-lg transition-colors"
            title="Atualizar insights"
          >
            <RefreshCw size={16} />
          </button>
        )}
      </CardHeader>
      {error && (
        <div className="mb-4 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-amber-100">
          {error}
        </div>
      )}
      {insights.length > 0 ? (
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <InsightItem key={insight.id} insight={insight} index={index} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-white/10 bg-bg-secondary/60 px-4 py-6 text-sm text-text-muted">
          Os insights aparecem aqui assim que um local for carregado e o mecanismo de análise terminar o processamento.
        </div>
      )}
    </Card>
  );
}

interface InsightItemProps {
  insight: AIInsight;
  index: number;
}

function InsightItem({ insight, index }: InsightItemProps) {
  const IconComponent = getIconForType(insight.type);
  const priorityColor = getPriorityColor(insight.priority);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`
        flex gap-3 p-4 bg-bg-secondary rounded-xl
        ${insight.priority === 'high' ? 'border-l-4 border-l-yellow-500' : ''}
        hover:bg-bg-card/50 transition-colors duration-200
      `}
    >
      <div className={`p-2 rounded-lg ${priorityColor.bg}`}>
        <IconComponent size={20} className={priorityColor.text} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-sm font-semibold text-text-primary">
            {insight.title}
          </h4>
          {insight.priority === 'high' && (
            <AlertTriangle size={14} className="text-yellow-500" />
          )}
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">
          {insight.content}
        </p>
      </div>
    </motion.div>
  );
}

function getIconForType(type: AIInsight['type']) {
  const icons = {
    summary: Sparkles,
    outfit: Shirt,
    activity: Activity,
    health: Heart,
    alert: AlertTriangle,
  };
  return icons[type] || Sparkles;
}

function getPriorityColor(priority: AIInsight['priority']) {
  const colors = {
    low: { bg: 'bg-gray-500/10', text: 'text-gray-400' },
    medium: { bg: 'bg-accent-primary/10', text: 'text-accent-primary' },
    high: { bg: 'bg-yellow-500/10', text: 'text-yellow-500' },
  };
  return colors[priority];
}
