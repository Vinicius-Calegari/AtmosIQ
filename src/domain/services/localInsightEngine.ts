import type { AIInsight, AIRequest } from '@core/types/ai';

export function buildFallbackInsights(weatherData: AIRequest['weatherData']): AIInsight[] {
  const insights: AIInsight[] = [];
  const condition = weatherData.condition.toLowerCase();
  const description = weatherData.description.toLowerCase();
  const isRainy = condition.includes('chuva') || condition.includes('tempestade') || description.includes('chuva');
  const isHot = weatherData.temperature >= 30 || weatherData.feelsLike >= 32;
  const isCold = weatherData.temperature <= 12 || weatherData.feelsLike <= 10;
  const isWindy = weatherData.windSpeed >= 28;
  const isHumid = weatherData.humidity >= 75;

  insights.push({
    id: 'briefing-summary',
    type: 'summary',
    title: 'Resumo do dia',
    content: buildSummary(weatherData, { isRainy, isHot, isCold, isWindy, isHumid }),
    icon: 'summary',
    priority: 'high',
  });

  insights.push({
    id: 'briefing-outfit',
    type: 'outfit',
    title: 'Como se vestir',
    content: buildOutfitRecommendation({ isRainy, isHot, isCold }),
    icon: 'outfit',
    priority: 'high',
  });

  insights.push({
    id: 'briefing-activity',
    type: 'activity',
    title: 'Melhor tipo de atividade',
    content: buildActivityRecommendation(weatherData, { isRainy, isHot, isCold, isWindy }),
    icon: 'activity',
    priority: 'medium',
  });

  insights.push({
    id: 'briefing-health',
    type: 'health',
    title: 'Conforto e cuidados',
    content: buildHealthRecommendation({ isHot, isCold, isHumid, isWindy }),
    icon: 'health',
    priority: isHot || isRainy || isWindy ? 'high' : 'medium',
  });

  if (isRainy || isWindy) {
    insights.push({
      id: 'briefing-alert',
      type: 'alert',
      title: 'Alerta de planejamento',
      content: buildAlert(weatherData, { isRainy, isWindy }),
      icon: 'alert',
      priority: 'high',
    });
  }

  return insights;
}

export function buildFallbackChatResponse(
  weatherData: AIRequest['weatherData'],
  question: string
): string {
  const prompt = question.toLowerCase();

  if (prompt.includes('guarda-chuva') || prompt.includes('umbrella') || prompt.includes('chuva')) {
    const rainy =
      weatherData.condition.toLowerCase().includes('chuva') ||
      weatherData.description.toLowerCase().includes('chuva');

    return rainy
      ? `Sim. Há sinal de chuva em ${weatherData.city}, então levar guarda-chuva é a escolha mais segura para as próximas horas.`
      : `Provavelmente você não vai precisar de guarda-chuva agora em ${weatherData.city}. Mesmo assim, vale acompanhar a previsão se for ficar muito tempo fora.`;
  }

  if (prompt.includes('roupa') || prompt.includes('vestir') || prompt.includes('jaqueta')) {
    return buildOutfitRecommendation({
      isRainy: weatherData.condition.toLowerCase().includes('chuva'),
      isHot: weatherData.temperature >= 30 || weatherData.feelsLike >= 32,
      isCold: weatherData.temperature <= 12 || weatherData.feelsLike <= 10,
    });
  }

  if (prompt.includes('seguro') || prompt.includes('sair') || prompt.includes('go out')) {
    const risky =
      weatherData.condition.toLowerCase().includes('tempestade') || weatherData.windSpeed >= 28;

    return risky
      ? 'Eu evitaria deslocamentos desnecessários agora. As condições atuais indicam mais risco de exposição do que conforto.'
      : `É razoável sair agora. Só vale se planejar com base na temperatura atual de ${weatherData.temperature}°C e acompanhar mudanças rápidas no tempo.`;
  }

  return `Agora em ${weatherData.city} faz ${weatherData.temperature}°C, com sensação de ${weatherData.feelsLike}°C e condição de ${weatherData.condition.toLowerCase()}. Eu planejaría as próximas horas pensando em conforto, hidratação e risco de chuva.`;
}

function buildSummary(
  weatherData: AIRequest['weatherData'],
  flags: {
    isRainy: boolean;
    isHot: boolean;
    isCold: boolean;
    isWindy: boolean;
    isHumid: boolean;
  }
): string {
  const parts = [
    `Agora faz ${weatherData.temperature}°C em ${weatherData.city}, com sensação de ${weatherData.feelsLike}°C.`,
  ];

  if (flags.isRainy) {
    parts.push('A chuva é o principal fator de planejamento para as próximas horas.');
  } else if (flags.isHot) {
    parts.push('O calor deve influenciar seu ritmo, principalmente no período da tarde.');
  } else if (flags.isCold) {
    parts.push('O dia está mais frio, então camadas fazem diferença no conforto.');
  } else {
    parts.push('As condições estão equilibradas para deslocamentos e planos curtos ao ar livre.');
  }

  if (flags.isWindy) {
    parts.push('O vento está forte o bastante para reduzir o conforto em áreas abertas.');
  }

  if (flags.isHumid) {
    parts.push('A umidade alta pode deixar o ar mais pesado do que a temperatura sugere.');
  }

  return parts.join(' ');
}

function buildOutfitRecommendation(flags: {
  isRainy: boolean;
  isHot: boolean;
  isCold: boolean;
}): string {
  if (flags.isCold) {
    return 'Use camadas: camiseta, tricô ou moletom e uma jaqueta leve. Sapato fechado ajuda bastante no conforto.';
  }

  if (flags.isHot) {
    return flags.isRainy
      ? 'Prefira roupas leves e respiráveis, com uma camada impermeável compacta para não passar calor nem se molhar.'
      : 'Prefira tecidos leves, manga curta e calçado confortável. Proteção solar importa mais do que camadas pesadas.';
  }

  if (flags.isRainy) {
    return 'Uma jaqueta leve, calçado resistente à água e guarda-chuva resolvem a maior parte do risco sem te aquecer demais.';
  }

  return 'Uma roupa leve do dia a dia funciona bem: camiseta ou camisa, sobreposição fina opcional e tênis confortável.';
}

function buildActivityRecommendation(
  weatherData: AIRequest['weatherData'],
  flags: { isRainy: boolean; isHot: boolean; isCold: boolean; isWindy: boolean }
): string {
  if (flags.isRainy) {
    return 'Favoreça planos em locais cobertos ou deslocamentos curtos entre pontos protegidos. É um bom dia para café, coworking, academia ou tarefas rápidas.';
  }

  if (flags.isHot) {
    return 'Planos ao ar livre funcionam melhor cedo ou no fim do dia. No pico do calor, vale priorizar atividades internas e menos intensas.';
  }

  if (flags.isCold || flags.isWindy) {
    return 'Atividades curtas ao ar livre ainda funcionam, mas o conforto cai rápido em locais expostos. Tenha uma opção interna como plano B.';
  }

  return `É um bom dia em ${weatherData.city} para caminhada, pequenos deslocamentos a pé, exercício leve ou compromissos externos flexíveis.`;
}

function buildHealthRecommendation(flags: {
  isHot: boolean;
  isCold: boolean;
  isHumid: boolean;
  isWindy: boolean;
}): string {
  const tips: string[] = [];

  if (flags.isHot) {
    tips.push('Hidratação e sombra devem entrar no seu planejamento.');
  }

  if (flags.isCold) {
    tips.push('Usar camadas ajuda a evitar desconforto com quedas de temperatura.');
  }

  if (flags.isHumid) {
    tips.push('A umidade alta pode aumentar a sensação de cansaço ao longo do dia.');
  }

  if (flags.isWindy) {
    tips.push('O vento pode reduzir a sensação térmica, principalmente em ruas abertas.');
  }

  if (tips.length === 0) {
    return 'Não há grandes riscos de conforto agora. Hidratação normal e planejamento básico do dia já são suficientes.';
  }

  return tips.join(' ');
}

function buildAlert(
  weatherData: AIRequest['weatherData'],
  flags: { isRainy: boolean; isWindy: boolean }
): string {
  if (flags.isRainy && flags.isWindy) {
    return `Chuva e vento juntos podem atrapalhar deslocamentos curtos em ${weatherData.city}. Saia com antecedência e evite exposição desnecessária.`;
  }

  if (flags.isRainy) {
    return 'A chuva pode afetar mobilidade e conforto. Se precisar sair, proteja eletrônicos e conte com deslocamentos mais lentos.';
  }

  return 'As rajadas podem reduzir o conforto ao ar livre. Prenda itens soltos e evite trajetos longos em áreas expostas.';
}
