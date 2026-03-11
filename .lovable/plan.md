

# Plano: Landing Page Editorial + Fix Build + Teste IA

## 1. Fix Build Error (Dexie)

O erro `TS1540` vem do arquivo `.d.ts` do Dexie usando `module` em vez de `namespace`. O `skipLibCheck: true` ja esta configurado no `tsconfig.app.json`, mas o typecheck pode estar usando `tsconfig.json` raiz. Solucao: garantir `skipLibCheck: true` no tsconfig raiz, ou excluir `node_modules` do include.

## 2. Teste E2E da IA

A edge function `analyze-lesion` esta deployada e respondendo (retornou erro 500 para imagem de teste invalida — comportamento esperado). O fluxo frontend `ImageUpload → analyzeImage → calculateResult → Result` esta implementado. Para teste real, o usuario precisa abrir o preview no celular e tirar/enviar uma foto real de lesao. O fluxo nao pode ser testado automaticamente pois requer upload de imagem real.

## 3. Landing Page — Visao Geral

Criar uma landing page editorial elegante na rota `/` (atual Home vira `/app`). Design inspirado na referencia enviada (LN Marketing) combinado com as especificacoes detalhadas do PRD secao 15.

### Reestruturacao de Rotas

| Rota Atual | Nova Rota | Descricao |
|------------|-----------|-----------|
| `/` (Home) | `/app` | Tela inicial do PWA |
| — | `/` | Landing Page nova |
| `/consentimento` | `/app/consentimento` | Manter (sem mudanca de path por ora, o `/app` apenas aponta para Home) |

**Abordagem simplificada:** A landing page fica em `/` e o botao CTA navega para `/app`. A rota `/app` renderiza o `Home.tsx` atual. Demais rotas permanecem iguais.

### 8 Secoes da Landing Page (PRD 15.3)

```text
┌─────────────────────────────────────┐
│  SECAO 1 — HERO (100vh)            │
│  Fundo: foto natureza + overlay    │
│  Navbar fixa translucida           │
│  H1: "Onde a Saude / Chega Primeiro"│
│  CTA: "INICIAR TRIAGEM GRATUITA"   │
│  Scroll indicator: "EXPLORAR"      │
├─────────────────────────────────────┤
│  SECAO 2 — A MISSAO (fundo creme)  │
│  "A leishmaniose tem cura.         │
│   O diagnostico tardio, nao."      │
│  Texto explicativo                 │
├─────────────────────────────────────┤
│  SECAO 3 — COMO FUNCIONA           │
│  3 cards: Responda / Mostre /      │
│  Descubra (fundo escuro)           │
├─────────────────────────────────────┤
│  SECAO 4 — POR QUE IMPORTA        │
│  Estatisticas animadas (counter)   │
│  20.000+ | 70% | 3 min             │
├─────────────────────────────────────┤
│  SECAO 5 — ACESSIBILIDADE          │
│  4 cards: Audio, VLibras,          │
│  Multilingue, Offline              │
├─────────────────────────────────────┤
│  SECAO 6 — DEPOIMENTO              │
│  Citacao com aspas grandes         │
├─────────────────────────────────────┤
│  SECAO 7 — FAQ (Accordion)         │
│  5 perguntas frequentes            │
├─────────────────────────────────────┤
│  SECAO 8 — FOOTER CTA + RODAPE    │
│  "Cuide da sua saude.              │
│   Onde voce estiver."              │
│  CTA + copyright                   │
└─────────────────────────────────────┘
```

### Identidade Visual (PRD + Referencia)

- **Tipografia:** Playfair Display (serif, elegante) para headlines + Poppins (sans) para corpo
- **Paleta:** Fundo creme `#F5F2EC` alternando com verde escuro `#1C2B1E`, acento verde claro `#A5D6A7`
- **Botoes:** Outline, sem border-radius (estilo editorial reto)
- **Animacoes:** Scroll reveal com Intersection Observer (fade-up 40px, 0.6s), counter-up nas estatisticas
- **Espacamento:** Muito espaco negativo, estilo editorial premium

### Navbar

- Fixa no topo, transparente → blur escuro ao scrollar (>50px)
- Logo "TropiScan" (Playfair Display)
- Links: "Como Funciona", "Por que Importa", "FAQ", "Acessar App"
- Mobile: hamburguer menu com drawer

### Efeito "UAU"

Inspirado na referencia LN Marketing:
- Hero com parallax sutil na imagem de fundo
- Reveal animations suaves ao scroll (framer-motion `whileInView`)
- Numeros das estatisticas com counter animado
- Transicao elegante entre secoes claras e escuras
- Citacao com aspas tipograficas grandes estilizadas
- Hover suave nos cards com elevacao

## Arquivos

| Arquivo | Mudanca |
|---------|---------|
| `src/pages/LandingPage.tsx` | **Novo** — Pagina completa com 8 secoes |
| `src/App.tsx` | Adicionar rota `/` para LandingPage, mover Home para `/app` |
| `src/index.css` | Adicionar font import Playfair Display + estilos landing |
| `src/locales/pt-BR/translation.json` | Chaves `landing.*` |
| `src/locales/en-US/translation.json` | Idem |
| `src/locales/es-419/translation.json` | Idem |
| `tsconfig.json` | Fix `skipLibCheck` se necessario |

## Detalhes Tecnicos

### Componente LandingPage.tsx

Um unico componente grande (ou com sub-componentes inline) que renderiza as 8 secoes. Usa:
- `framer-motion` `whileInView` para animacoes de scroll reveal
- `useRef` + `IntersectionObserver` para counter-up das estatisticas
- `useState` para navbar scroll state (transparent → solid)
- `useEffect` com scroll listener para navbar
- Smooth scroll para links ancora
- Nao mostra os toggles flutuantes (DarkMode, Audio, Language) — sao do PWA, nao da landing
- A landing page tem seu proprio footer e navbar

### Counter Animation

Os numeros (20.000+, 70%, 3 min) animam de 0 ao valor final em 1.5s com easing quando entram na viewport.

### Imagem Hero

Usar uma foto de natureza brasileira (mata/cerrado) como background com overlay gradiente escuro. Como nao temos imagem real, usar um gradiente sofisticado com texturas CSS como fallback elegante, ou gerar via IA.

### Mobile Responsivo

- Desktop: grid 2-3 colunas, headlines 64-72px
- Tablet: 2 colunas, headlines 48px
- Mobile: coluna unica, headlines 36-40px, navbar hamburguer

