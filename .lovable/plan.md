

# Centralizar Modal de Idioma + Corrigir Sobreposicao dos Botoes Flutuantes

## Problemas Identificados

1. **Modal de idioma descentralizado** — No mobile, o bottom sheet do seletor de idioma aparece cortado no lado direito (visivel na screenshot image-7). Precisa ser um modal verdadeiramente centralizado.

2. **Botoes flutuantes sobrepondo conteudo** — Os 3 botoes fixos no bottom (dark mode em `bottom-4 left-4`, idioma em `bottom-4 left-[4.5rem]`, audio em `bottom-4 right-4`) cobrem o conteudo final das paginas Result e HistoryDetail (visivel nas screenshots image-6 e image-7).

3. **Erros de console (CORS/postMessage)** — Esses erros vem da infraestrutura do Lovable preview (`lovable.js`, `auth-bridge`, `manifest.webmanifest`). Sao erros do ambiente de preview e **nao podem ser corrigidos no codigo do app**. Eles desaparecem quando o app e publicado/deployado em producao.

## Solucao

### 1. Centralizar o modal de idioma (`LanguageSelector.tsx`)
- Mudar de bottom sheet para um modal centralizado na tela (vertical e horizontalmente)
- Usar `top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2` em vez de `bottom-0 left-1/2`
- Trocar `rounded-t-3xl` por `rounded-3xl` para bordas arredondadas em todos os lados
- Remover a barra de arraste (drag handle) pois nao e mais bottom sheet

### 2. Adicionar padding inferior nas paginas (`Result.tsx`, `HistoryDetail.tsx`)
- Adicionar `pb-24` (padding-bottom de 6rem) no container principal dessas paginas para que o conteudo final nao fique escondido atras dos botoes flutuantes
- Tambem verificar outras paginas que possam ter o mesmo problema

### 3. Erros de console
- Nao ha correcao possivel no codigo do app — sao erros do ambiente de preview do Lovable
- Serao informados ao usuario que desaparecem em producao

## Arquivos Editados

| Arquivo | Mudanca |
|---------|---------|
| `src/components/LanguageSelector.tsx` | Modal centralizado em vez de bottom sheet |
| `src/pages/Result.tsx` | Adicionar `pb-24` no container |
| `src/pages/HistoryDetail.tsx` | Adicionar `pb-24` no container |

## Detalhes Tecnicos

**LanguageSelector.tsx** — Linha 49-51: mudar classes do modal:
- De: `fixed bottom-0 left-1/2 ... rounded-t-3xl border-t`
- Para: `fixed top-1/2 left-1/2 ... -translate-y-1/2 rounded-3xl border`

**Result.tsx** — Linha 57: mudar `py-8` para `pt-8 pb-24`

**HistoryDetail.tsx** — Linha 30: mudar `py-8` para `pt-8 pb-24`

