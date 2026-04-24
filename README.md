# AtmosIQ

AtmosIQ é uma plataforma de inteligência climática com IA pensada para parecer produto real, não tutorial. O app combina clima ao vivo, previsão de chuva, interpretações acionáveis e uma base pronta para evoluir com um backend de IA seguro.

## O que diferencia o projeto

- Trata clima como apoio à decisão, não só como exibição de dados.
- Separa estado remoto e estado local com TanStack Query + Zustand.
- Funciona sem chave de clima no frontend, usando Open-Meteo.
- Continua útil mesmo sem gateway de IA por meio de um motor local de insights.
- Traz uma camada dedicada de chuva com probabilidade horária e tendência para 5 dias.

## Posicionamento do produto

AtmosIQ foi desenhado como um assistente pessoal de operação climática para deslocamentos, rotina urbana, viagens e planejamento do dia.

Em vez de só mostrar temperatura e ícones, o sistema responde:

- O que vestir?
- Vale sair agora?
- Existe risco relevante de chuva nas próximas horas?
- Como organizar melhor o restante do dia?

## Stack atual

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- TanStack Query
- Zustand
- Lucide React

## Arquitetura

### Frontend

- SPA com Vite + React
- TanStack Query para clima, chuva e fluxos assíncronos de IA
- Zustand com persistência para local selecionado, buscas recentes e estado do chat
- Separação entre camadas de apresentação, domínio e dados

### Backend recomendado

- API/BFF em TypeScript
- Rotas como `POST /api/ai/insights` e `POST /api/ai/chat`
- Integração com OpenAI apenas no servidor
- Validação, rate limiting, logs e normalização de resposta

### Serviços externos

- Open-Meteo Forecast API para clima atual, previsão e chuva
- Open-Meteo Geocoding API para busca de locais
- OpenAI Responses API por trás de um gateway seguro

## Estrutura do projeto

```text
src/
  app/
    providers/
  core/
    config/
    constants/
    errors/
    types/
  data/
    api/
    repositories/
  domain/
    entities/
    services/
    usecases/
  infrastructure/
    utils/
  presentation/
    components/
    hooks/
    pages/
    stores/
```

## Como rodar

1. Instale as dependências:

```bash
npm install
```

2. Crie o arquivo local de ambiente:

```bash
cp .env.example .env
```

3. Se quiser usar um backend de IA, configure:

```env
VITE_AI_GATEWAY_URL=http://localhost:8787/api/ai
```

4. Rode o projeto:

```bash
npm run dev
```

## Scripts

- `npm run dev`
- `npm run build`
- `npm run typecheck`
- `npm run preview`

## Observação importante

O frontend não precisa mais de chave de clima. A aplicação foi ajustada para consumir Open-Meteo diretamente, o que elimina o erro de chave inválida ou ausente no navegador.

Se `VITE_AI_GATEWAY_URL` não estiver configurada, o AtmosIQ usa uma camada local de interpretação para continuar demonstrável sem expor segredos.

## Documentação

- Blueprint do produto e da arquitetura: [SPEC.md](./SPEC.md)

## Próximos passos sugeridos

- Criar um BFF real com Hono ou Fastify
- Validar payloads externos com Zod
- Adicionar testes unitários e de integração
- Incluir alertas climáticos e locais favoritos
- Publicar com pipeline em Vercel ou Cloudflare
