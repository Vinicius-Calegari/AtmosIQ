import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { generateInsightsUseCase, chatWithAIUseCase } from '@domain/usecases/generateInsights';
import type { WeatherEntity } from '@domain/entities/weather';
import type { AIInsight, AIChatMessage } from '@core/types/ai';
import { generateId } from '@infrastructure/utils/helpers';

interface UseAIInsightsResult {
  insights: AIInsight[];
  isLoading: boolean;
  error: string | null;
  generateInsights: (weather: WeatherEntity) => Promise<void>;
}

export function useAIInsights(): UseAIInsightsResult {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync: generateInsightsMutation, isPending: insightsLoading } = useMutation({
    mutationFn: (weather: WeatherEntity) => generateInsightsUseCase.execute(weather),
  });

  const generateInsights = useCallback(async (weather: WeatherEntity) => {
    setError(null);

    try {
      const result = await generateInsightsMutation(weather);
      setInsights(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível gerar os insights.');
    }
  }, [generateInsightsMutation]);

  return {
    insights,
    isLoading: insightsLoading,
    error,
    generateInsights,
  };
}

interface UseAIChatResult {
  messages: AIChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (weather: WeatherEntity, message: string) => Promise<void>;
  clearMessages: () => void;
}

export function useAIChat(): UseAIChatResult {
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync: sendChatMutation, isPending: chatLoading } = useMutation({
    mutationFn: ({ weather, message }: { weather: WeatherEntity; message: string }) =>
      chatWithAIUseCase.execute(weather, message),
  });

  const sendMessage = useCallback(async (weather: WeatherEntity, message: string) => {
    // Add user message
    const userMessage: AIChatMessage = {
      id: generateId(),
      role: 'user',
      content: message,
      timestamp: Date.now(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setError(null);

    try {
      const response = await sendChatMutation({ weather, message });
      
      const assistantMessage: AIChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível obter a resposta.');
      setMessages(prev => [
        ...prev,
        {
          id: generateId(),
          role: 'assistant',
          content: 'Não consegui responder agora. Tente novamente em instantes.',
          timestamp: Date.now(),
        },
      ]);
    }
  }, [sendChatMutation]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading: chatLoading,
    error,
    sendMessage,
    clearMessages,
  };
}
