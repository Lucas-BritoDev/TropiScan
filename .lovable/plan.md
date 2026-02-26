

# Redesign Visual Completo - LeishCheck

Vou transformar o visual de todas as telas aplicando princípios modernos de UI/UX: glassmorphism sutil, gradientes refinados, micro-interações, tipografia com hierarquia clara, espaçamentos generosos e um visual premium de app de saúde.

## Filosofia do Redesign

- **Gradientes sutis** no background em vez de cor chapada
- **Glassmorphism** nos cards (backdrop-blur + transparência)
- **Sombras suaves e coloridas** em vez de shadow-sm genérico
- **Ícones dentro de círculos com gradiente** em vez de emojis crus nos botões
- **Tipografia mais expressiva** com tamanhos maiores nos títulos e pesos variados
- **Espaçamento mais generoso** e ritmo visual consistente
- **Botões com gradiente e hover elevado** para o CTA principal
- **Badges de status coloridos** com bordas arredondadas
- **Remover emojis dos botões** (usar apenas lucide-react icons para visual limpo)

---

## 1. CSS Global e Design Tokens (`src/index.css`)

Adicionar classes utilitárias globais:
- `.glass-card` — backdrop-blur, bg branco/10%, borda translúcida
- `.gradient-bg` — gradiente sutil de fundo (verde claro → branco)
- `.gradient-btn` — botão primário com gradiente
- `.icon-circle` — círculo para ícones com gradiente suave
- Ajustar variáveis de cor para tons mais sofisticados (verde esmeralda mais rico)

## 2. Home (`src/pages/Home.tsx`)

- Background com gradiente radial sutil verde→branco
- Logo com sombra glow verde suave
- Título com gradiente de texto (text-gradient)
- Subtítulo com opacidade e tracking mais amplo
- Botão primário com gradiente verde + sombra colorida + hover lift
- Botões secundários com estilo glass
- Badge "v1.0" discreto sob o título
- Footer disclaimer com ícone de escudo

## 3. Consent (`src/pages/Consent.tsx`)

- Header com ícone Shield em círculo gradiente azul
- Área de scroll do termo com glass-card e borda sutil
- Indicador de scroll animado (seta pulsante)
- Checkbox estilizado com label mais destaque
- Tela de recusa com ilustração/ícone maior e visual empático

## 4. UserDataPage (`src/pages/UserDataPage.tsx`)

- Campos de input com foco animado (ring gradiente)
- Labels com ícones inline pequenos
- Card glass envolvendo o formulário
- Stepper visual discreto no topo (passo 1 de 4)

## 5. Questionnaire (`src/pages/Questionnaire.tsx`)

- Progress bar com gradiente e glow
- Card da pergunta com glass-card maior e ícone em círculo colorido
- Botões Sim/Não com cores distintas (verde/vermelho suave) e ícones
- Número da pergunta em badge arredondado
- Transição mais suave entre perguntas

## 6. ImageUpload (`src/pages/ImageUpload.tsx`)

- Área de upload com borda dashed estilizada e ícone central grande
- Preview da imagem com overlay e bordas arredondadas
- Botões com ícones mais proeminentes

## 7. Result (`src/pages/Result.tsx`)

- Círculo SVG com glow colorido por trás (drop-shadow)
- Card de resultado com glass-card
- Alerta de emergência com ícone pulsante e borda mais dramática
- Botões de ação com ícones em círculos coloridos à esquerda
- Disclaimer final com design mais integrado

## 8. History (`src/pages/History.tsx`)

- Cards de sessão com hover lift e sombra colorida baseada no nível
- Badge de porcentagem com gradiente por nível
- Estado vazio com ilustração/ícone mais elaborado

## 9. HistoryDetail (`src/pages/HistoryDetail.tsx`)

- Header com badge de risco colorido
- Lista de respostas com alternância de fundo (zebra sutil)
- Ícones Sim/Não com check/x em círculos coloridos

## 10. Education (`src/pages/Education.tsx`)

- Cards com borda lateral colorida (accent bar)
- Seção de prevenção com ícone de escudo em destaque
- Cards das fases com numeração estilizada

## 11. AudioToggle (`src/components/AudioToggle.tsx`)

- Botão com glass-effect e backdrop-blur
- Transição suave entre estados com scale

## 12. NotFound (`src/pages/NotFound.tsx`)

- Visual mais amigável com ícone grande e texto em português

---

## Detalhes Técnicos

**Arquivos editados (12):**
- `src/index.css` — novas classes utilitárias, gradientes, glassmorphism
- `src/pages/Home.tsx` — redesign completo
- `src/pages/Consent.tsx` — glassmorphism, scroll indicator
- `src/pages/UserDataPage.tsx` — formulário estilizado
- `src/pages/Questionnaire.tsx` — progress bar gradiente, botões coloridos
- `src/pages/ImageUpload.tsx` — upload area redesign
- `src/pages/Result.tsx` — circle glow, glass cards
- `src/pages/History.tsx` — cards com hover lift
- `src/pages/HistoryDetail.tsx` — zebra rows, badges
- `src/pages/Education.tsx` — accent bars, numbered cards
- `src/components/AudioToggle.tsx` — glass button
- `src/pages/NotFound.tsx` — visual amigável em português

**Nenhuma dependência nova.** Tudo feito com Tailwind CSS + classes utilitárias customizadas.

**Princípios mantidos:**
- Acessibilidade (contraste WCAG AA, áreas de toque 44px+)
- prefers-reduced-motion respeitado
- Funcionalidade 100% preservada
- Responsividade mobile-first

