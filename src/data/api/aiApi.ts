import { AI_CONFIG } from '@core/constants/config';
import { toAppError } from '@core/errors/appError';
import type { AIRequest, AIInsight } from '@core/types/ai';
import {
  buildFallbackChatResponse,
  buildFallbackInsights,
} from '@domain/services/localInsightEngine';

interface InsightGatewayResponse {
  insights: AIInsight[];
}

interface ChatGatewayResponse {
  message: string;
}

class AIApiClient {
  private readonly gatewayUrl = AI_CONFIG.GATEWAY_URL;
  private readonly timeoutMs = AI_CONFIG.REQUEST_TIMEOUT_MS;

  async generateInsights(weatherData: AIRequest['weatherData']): Promise<AIInsight[]> {
    if (!this.gatewayUrl) {
      return buildFallbackInsights(weatherData);
    }

    try {
      const response = await this.post<InsightGatewayResponse>('/insights', {
        weatherData,
      });
      return response.insights;
    } catch (error) {
      console.warn('Gateway de IA indisponível, usando fallback local.', error);
      return buildFallbackInsights(weatherData);
    }
  }

  async chat(weatherData: AIRequest['weatherData'], userQuestion: string): Promise<string> {
    if (!this.gatewayUrl) {
      return buildFallbackChatResponse(weatherData, userQuestion);
    }

    try {
      const response = await this.post<ChatGatewayResponse>('/chat', {
        weatherData,
        userQuestion,
      });
      return response.message;
    } catch (error) {
      console.warn('Chat de IA indisponível, usando fallback local.', error);
      return buildFallbackChatResponse(weatherData, userQuestion);
    }
  }

  private async post<T>(path: string, body: Record<string, unknown>): Promise<T> {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(`${this.gatewayUrl}${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`AI gateway returned status ${response.status}`);
      }

      return response.json();
    } catch (error) {
      throw toAppError(error, 'Não foi possível carregar os insights de IA agora.');
    } finally {
      window.clearTimeout(timeoutId);
    }
  }
}

export const aiApi = new AIApiClient();
