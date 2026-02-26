

# Redesign de Headers + Dark Mode Global + Visual de Impacto

## Problemas Identificados

1. **Dark mode toggle** existe apenas na Home (`src/pages/Home.tsx` linha 37). Ao navegar para qualquer outra tela, o botão desaparece.
2. **Headers com botão voltar** usam o padrão genérico `flex items-center gap-3` + círculo cinza + título simples — visual sem personalidade.
3. **AudioToggle** e **LanguageSelector** já são globais (renderizados em `App.tsx`), mas o dark mode toggle não.

## Solução

### 1. Dark Mode Toggle Global
- Extrair o toggle de dark mode de `Home.tsx` e criar um componente `DarkModeToggle.tsx`
- Renderizá-lo em `App.tsx` junto com AudioToggle e LanguageSelector
- Posicioná-lo como botão flutuante fixo (top-left, ao lado do LanguageSelector)
- Remover o toggle duplicado de `Home.tsx`
- Reposicionar os 3 botões flutuantes: Dark mode (top-left pos 1), Language (top-left pos 2), Audio (top-right)

### 2. Redesign dos Headers — Visual "UAU"
Substituir o padrão atual por um header mais sofisticado em todas as páginas:
- Botão voltar com glass-card style (backdrop-blur) em vez de `bg-muted/80`
- Título centralizado com subtítulo descritivo em texto menor
- Linha decorativa gradiente abaixo do título
- Ícone temático da página ao lado do título (não mais separado)

Páginas afetadas:
- `Consent.tsx` — header com ícone Shield integrado
- `UserDataPage.tsx` — header com ícone User integrado  
- `Questionnaire.tsx` — header com progress integrado elegantemente
- `ImageUpload.tsx` — header com ícone Camera
- `Result.tsx` — sem back button (é tela final), mas título estilizado
- `History.tsx` — header com ícone History
- `HistoryDetail.tsx` — header com badge de risco
- `Education.tsx` — header com ícone BookOpen

### 3. Padrão Visual dos Novos Headers

```text
┌─────────────────────────────────┐
│  [←]     Título da Página       │
│          Subtítulo descritivo    │
│  ═══════════════════════════    │ ← linha gradiente decorativa
└─────────────────────────────────┘
```

- Botão voltar: glass-card com border sutil, ícone com cor primary
- Título: `text-2xl font-bold text-gradient`  
- Subtítulo: `text-sm text-muted-foreground`
- Linha decorativa: `h-0.5 w-16 bg-gradient-to-r from-primary to-primary-light rounded-full`

### 4. Detalhes Técnicos

**Arquivos novos (1):**
- `src/components/DarkModeToggle.tsx` — componente do toggle de tema

**Arquivos editados (10):**
- `src/App.tsx` — adicionar DarkModeToggle global, reposicionar botões flutuantes
- `src/components/LanguageSelector.tsx` — ajustar posição (`left-[7.5rem]` para dar espaço ao dark mode)
- `src/pages/Home.tsx` — remover toggle de dark mode local, manter visual existente
- `src/pages/Consent.tsx` — novo header elegante
- `src/pages/UserDataPage.tsx` — novo header elegante
- `src/pages/Questionnaire.tsx` — header redesenhado com progress bar integrada
- `src/pages/ImageUpload.tsx` — novo header elegante
- `src/pages/History.tsx` — novo header elegante
- `src/pages/HistoryDetail.tsx` — novo header com badge de risco integrado
- `src/pages/Education.tsx` — novo header elegante

**Nenhuma dependência nova.** Usando os mesmos utilitários CSS existentes (glass-card, text-gradient, hover-lift).

