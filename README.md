# AtmosIQ

> Inteligência climática em React/TypeScript para transformar previsão do tempo em informação útil para decisões do dia a dia.

![CI](https://img.shields.io/github/actions/workflow/status/Vinicius-Calegari/AtmosIQ/ci.yml?label=build)
[![Demo](https://img.shields.io/badge/demo-GitHub_Pages-238636?logo=github)](https://vinicius-calegari.github.io/AtmosIQ/)

**Demo:** https://vinicius-calegari.github.io/AtmosIQ/

## O problema

Aplicativos de clima normalmente entregam números e ícones. O AtmosIQ explora uma camada acima: organizar dados meteorológicos e chuva para responder perguntas práticas sobre deslocamento, rotina e planejamento.

## Arquitetura

```text
UI / Pages
    │
    ├── Hooks / Stores ──────► Zustand (estado local persistente)
    │
    └── TanStack Query ──────► Data APIs
                                ├── Open-Meteo Forecast
                                ├── Open-Meteo Geocoding
                                └── AI Gateway opcional
```

```text
src/
├── app/             # providers e composição
├── core/            # config, constantes, erros e tipos
├── data/            # clientes HTTP e repositories
├── domain/          # entidades, serviços e casos de uso
├── infrastructure/  # utilidades concretas
└── presentation/    # componentes, hooks, páginas e stores
```

## Decisões técnicas

- **TypeScript:** contratos explícitos para dados meteorológicos e estados da interface.
- **TanStack Query:** cache e ciclo de vida do estado remoto.
- **Zustand:** estado local pequeno e persistente sem transformar tudo em estado global.
- **Open-Meteo:** clima demonstrável sem colocar segredo no navegador.
- **Fallback local:** a experiência continua útil sem um gateway de IA configurado.
- **Separação em camadas:** reduz acoplamento entre componentes visuais e acesso a dados.

## Stack

React 18 · TypeScript · Vite · Tailwind CSS · TanStack Query · Zustand · Framer Motion

## Executar

```bash
git clone https://github.com/Vinicius-Calegari/AtmosIQ.git
cd AtmosIQ
npm ci
cp .env.example .env
npm run dev
```

Para gateway de IA opcional:

```env
VITE_AI_GATEWAY_URL=http://localhost:8787/api/ai
```

Nenhuma chave privada de IA deve ser colocada em variável `VITE_*`, porque essas variáveis fazem parte do bundle entregue ao navegador.

## Qualidade

```bash
npm run typecheck
npm run build
```

O GitHub Actions executa validações em push/PR e o projeto possui pipeline de publicação no GitHub Pages.

## Funcionalidades

- clima atual e previsão;
- busca geográfica;
- probabilidade/tendência de chuva;
- estado persistido para experiência do usuário;
- insights locais mesmo sem IA remota;
- suporte arquitetural para gateway seguro de IA.

## Limitações conhecidas

- previsões dependem da disponibilidade e precisão do provedor meteorológico;
- IA remota exige backend/gateway próprio para proteger credenciais;
- cobertura automatizada de testes ainda precisa crescer.

## Roadmap

- [ ] testes unitários para domínio e transformação de dados
- [ ] testes de componentes críticos
- [ ] validação de payloads externos
- [ ] alertas meteorológicos
- [ ] favoritos e comparação de localidades
- [ ] BFF de IA com rate limiting e observabilidade

Documentação adicional: [SPEC.md](./SPEC.md)

---

Desenvolvido por [Vinícius Calegari](https://github.com/Vinicius-Calegari).
