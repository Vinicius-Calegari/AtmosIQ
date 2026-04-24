import type { WeatherEntity } from '@domain/entities/weather';
import type { AIInsight, AIRequest } from '@core/types/ai';
import { buildFallbackInsights } from '@domain/services/localInsightEngine';

export const generateInsightsUseCase = {
  async execute(weather: WeatherEntity): Promise<AIInsight[]> {
    const weatherData: AIRequest['weatherData'] = {
      city: weather.cityName,
      temperature: weather.temperature,
      feelsLike: weather.feelsLike,
      humidity: weather.humidity,
      windSpeed: weather.windSpeed,
      condition: weather.condition,
      description: weather.description,
    };

    // Use local insight engine to generate insights
    const insights = buildFallbackInsights(weatherData);

    return insights;
  },
};

export const chatWithAIUseCase = {
  async execute(weather: WeatherEntity, message: string): Promise<string> {
    // For now, return a simple response based on weather data
    const weatherContext = `Clima atual em ${weather.cityName}: ${weather.temperature}°C, ${weather.condition}.`;
    
    return `Com base no clima atual (${weatherContext}), ${generateChatResponse(message, weather)}`;
  },
};

function generateChatResponse(message: string, weather: WeatherEntity): string {
  const q = message.toLowerCase();
  
  if (q.includes('roupa') || q.includes('vestir') || q.includes('vestuário')) {
    if (weather.condition.toLowerCase().includes('chuva')) {
      return 'recomendo levar um guarda-chuva e usar roupas impermeáveis.';
    }
    if (weather.temperature >= 30) {
      return 'use roupas leves e protetor solar.';
    }
    if (weather.temperature <= 15) {
      return 'use roupas quentes e um casaco.';
    }
    return 'use roupas confortáveis conforme a temperatura.';
  }
  
  if (q.includes('atividades') || q.includes('fazer') || q.includes('plano')) {
    if (weather.condition.toLowerCase().includes('chuva')) {
      return 'atividades internas são recomendadas.';
    }
    if (weather.windSpeed >= 28) {
      return 'evite atividades ao ar livre com vento forte.';
    }
    return 'o clima favorece atividades ao ar livre.';
  }
  
  if (q.includes('saúde') || q.includes('cuidados') || q.includes('conforto')) {
    if (weather.humidity >= 75) {
      return 'a umidade está alta, mantenha-se hidratado.';
    }
    if (weather.temperature >= 32) {
      return 'beba bastante água e evite exposição solar prolongada.';
    }
    if (weather.temperature <= 10) {
      return 'mantenha-se aquecido e evite mudanças bruscas de temperatura.';
    }
    return 'o clima está favorável para atividades normais.';
  }
  
  return 'posso ajudar com informações sobre roupas, atividades ou cuidados com a saúde baseados no clima atual.';
}