# 🎨 Atualizar Ícones do TropiScan

## ✅ Arquivos Já Configurados

Os seguintes arquivos já estão prontos para usar os ícones do TropiScan:
- ✅ `index.html` - Configurado com favicon e apple-touch-icon
- ✅ `vite.config.ts` - Manifest PWA configurado
- ✅ `public/tropiscan.jpeg` - Imagem fonte disponível

## 🚀 Método Rápido (Recomendado)

### Passo 1: Abra o Gerador de Ícones

Com o servidor rodando (`npm run dev`), abra no navegador:

```
http://localhost:8080/generate-tropiscan-icons.html
```

### Passo 2: Gere os Ícones

1. Clique em **"Escolher Imagem"**
2. Selecione o arquivo: `public/tropiscan.jpeg` (ou `src/assets/tropiscan.jpeg`)
3. Os ícones serão gerados automaticamente

### Passo 3: Baixe e Substitua

Baixe cada ícone e salve na pasta `public/`, substituindo os existentes:

- `favicon.ico` (32x32) → `public/favicon.ico`
- `icon-192.png` (192x192) → `public/icon-192.png`
- `icon-512.png` (512x512) → `public/icon-512.png`

### Passo 4: Recarregue

1. Limpe o cache do navegador (Ctrl+Shift+Delete)
2. Recarregue a página (Ctrl+F5)
3. Verifique o ícone na aba do navegador

## 🎯 Resultado Esperado

Após seguir os passos:

✅ **Aba do navegador** mostrará o ícone do TropiScan
✅ **Favoritos** usarão o ícone do TropiScan
✅ **PWA instalado** terá o ícone do TropiScan
✅ **Tela inicial** (mobile) mostrará o ícone do TropiScan

## 🔍 Verificação

Para verificar se funcionou:

1. Olhe a aba do navegador - deve mostrar o ícone do TropiScan
2. Abra DevTools (F12) → Application → Manifest
3. Verifique a seção "Icons" - deve mostrar os 3 ícones
4. Instale o PWA e veja o ícone na tela inicial

## 📝 Notas

- O gerador web funciona em qualquer navegador moderno
- Não precisa instalar nenhuma biblioteca adicional
- Os ícones são gerados com fundo verde (#1a4d3a) do TropiScan
- A imagem é centralizada e redimensionada automaticamente

## ❓ Problemas?

### O ícone não aparece
- Limpe o cache do navegador completamente
- Force reload com Ctrl+F5 (Windows) ou Cmd+Shift+R (Mac)
- Feche e abra o navegador novamente

### O gerador não abre
- Verifique se o servidor está rodando (`npm run dev`)
- Acesse: `http://localhost:8080/generate-tropiscan-icons.html`
- Verifique se a porta 8080 está correta

### Os ícones estão distorcidos
- Use a imagem `tropiscan.jpeg` que está quadrada
- O gerador mantém a proporção automaticamente
- Se necessário, edite a imagem para ser perfeitamente quadrada

## 🎨 Cores do TropiScan

Para referência, as cores oficiais são:
- Verde principal: `#1a4d3a`
- Verde claro: `#2d7a5f`
- Fundo: `#F5F2EC`
