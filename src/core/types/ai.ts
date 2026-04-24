export interface AIInsight {
  id: string;
  type: 'summary' | 'outfit' | 'activity' | 'health' | 'alert';
  title: string;
  content: string;
  icon: string;
  priority: 'low' | 'medium' | 'high';
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface AIChatState {
  messages: AIChatMessage[];
  isLoading: boolean;
  error: string | null;
}

export interface AIRequest {
  weatherData: {
    city: string;
    temperature: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    condition: string;
    description: string;
  };
  userQuestion?: string;
}

export interface AIResponse {
  insights: AIInsight[];
  chatResponse?: string;
}

export const AI_PROMPTS = {
  WEATHER_SUMMARY: (data: AIRequest['weatherData']) => `
Clima atual em ${data.city}:
- Temperatura: ${data.temperature}°C (sensação de ${data.feelsLike}°C)
- Umidade: ${data.humidity}%
- Vento: ${data.windSpeed} km/h
- Condição: ${data.condition} (${data.description})

Gere um resumo operacional curto explicando o que isso significa para as próximas horas da pessoa usuária.
`,

  OUTFIT_RECOMMENDATION: (data: AIRequest['weatherData']) => `
Com base nesses dados, sugira roupas práticas:
- Temperatura: ${data.temperature}°C
- Sensação térmica: ${data.feelsLike}°C
- Umidade: ${data.humidity}%
- Vento: ${data.windSpeed} km/h
- Condição: ${data.condition}

Retorne 2 ou 3 recomendações concretas.
`,

  ACTIVITY_SUGGESTION: (data: AIRequest['weatherData']) => `
Clima atual em ${data.city}:
- Temperatura: ${data.temperature}°C
- Condição: ${data.condition}
- Vento: ${data.windSpeed} km/h
- Umidade: ${data.humidity}%

Sugira 2 ou 3 atividades adequadas para essas condições.
`,

  HEALTH_TIPS: (data: AIRequest['weatherData']) => `
Condições climáticas:
- Temperatura: ${data.temperature}°C
- Umidade: ${data.humidity}%
- Vento: ${data.windSpeed} km/h

Forneça orientações de conforto, saúde ou segurança relevantes para essas condições.
`,

  CHAT: (data: AIRequest) => `
Pergunta da pessoa usuária sobre o clima em ${data.weatherData.city}:
${data.userQuestion}

Condições atuais: ${data.weatherData.temperature}°C, ${data.weatherData.condition}, ${data.weatherData.humidity}% de umidade.

Responda de forma útil e concisa.
`,
} as const;
