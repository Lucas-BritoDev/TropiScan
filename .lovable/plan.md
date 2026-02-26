

# Plano: Prompt Customizado de Instalacao PWA (A2HS)

## O que sera feito

Criar um banner/modal elegante que aparece na Home incentivando o usuario a instalar o app na tela inicial do celular. Usa a API `beforeinstallprompt` do browser para interceptar o prompt nativo e mostrar uma UI customizada.

## Como funciona

O browser dispara o evento `beforeinstallprompt` quando o app atende aos criterios de instalacao PWA. Vamos capturar esse evento, impedir o prompt nativo, e mostrar um banner customizado com design coerente com o app.

## Arquivos

| Arquivo | Mudanca |
|---------|---------|
| `src/components/InstallPrompt.tsx` | **Novo** — Componente do banner A2HS |
| `src/App.tsx` | Adicionar `<InstallPrompt />` dentro do BrowserRouter |
| `src/locales/pt-BR/translation.json` | Adicionar chaves `install.*` |
| `src/locales/en-US/translation.json` | Adicionar chaves `install.*` |
| `src/locales/es-419/translation.json` | Adicionar chaves `install.*` |

## Detalhes do Componente `InstallPrompt.tsx`

**Logica:**
- Escuta o evento `beforeinstallprompt` no `window` e armazena o evento em um `useState`
- Verifica `localStorage` para uma chave `leishcheck-install-dismissed` — se o usuario ja dispensou, nao mostra novamente por 7 dias
- Verifica `window.matchMedia('(display-mode: standalone)')` — se ja esta instalado, nao mostra
- Ao clicar "Instalar", chama `deferredPrompt.prompt()` e aguarda `userChoice`
- Ao clicar "Agora nao", salva timestamp no localStorage e esconde

**Visual:**
- Banner fixo na parte inferior da tela (acima dos botoes flutuantes), com `framer-motion` animacao de slide-up
- Fundo glass-card com blur, borda sutil, sombra
- Icone do app (logo pequeno), texto "Instale o LeishCheck" + subtexto "Acesse rapidamente pela tela inicial"
- Dois botoes: "Instalar" (primary) e "X" (dismiss)
- Aparece apenas na Home page (ou em todas, mas so apos 3 segundos de delay para nao ser intrusivo)

**Textos i18n:**
```json
"install": {
  "title": "Instale o LeishCheck",
  "description": "Acesse rapidamente pela tela inicial do seu celular",
  "button": "Instalar",
  "dismiss": "Agora não"
}
```

## Comportamento

- Aparece apenas quando o browser suporta A2HS (Chrome Android, Edge, Samsung Internet)
- Nao aparece no iOS Safari (que usa "Add to Home Screen" manual — podemos mostrar instrucoes especificas para iOS detectando `navigator.userAgent`)
- Respeita o dismiss do usuario por 7 dias via localStorage
- Desaparece automaticamente apos instalacao

