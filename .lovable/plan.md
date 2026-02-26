

# Plano: Analise de Imagem com IA (Gemini) via Lovable AI Gateway

## Resumo

Integrar o Gemini 2.5 Pro para analisar a foto da lesao junto com as respostas do questionario, gerando um diagnostico combinado mais preciso. A IA recebera a imagem em base64 + contexto clinico (respostas, dados do paciente) e retornara uma analise estruturada que sera combinada com o score do questionario.

## Arquitetura

```text
┌─────────────┐     ┌──────────────────────┐     ┌─────────────────────┐
│  Frontend   │────▶│  Edge Function        │────▶│  Lovable AI Gateway │
│ ImageUpload │     │  analyze-lesion       │     │  Gemini 2.5 Pro     │
│ + answers   │     │  (prompt + image)     │     │  (multimodal)       │
└─────────────┘     └──────────────────────┘     └─────────────────────┘
                              │
                              ▼
                    Retorna JSON estruturado:
                    - riskAdjustment (-20 a +30)
                    - confidence (0-100)
                    - aiAnalysis (texto)
                    - characteristics []
```

## Como funciona

1. O usuario faz o questionario normalmente (score base calculado localmente)
2. Na tela de imagem, se o usuario enviar uma foto e estiver online, ao clicar "Usar esta foto":
   - A imagem + respostas sao enviadas para a edge function
   - A edge function chama Gemini 2.5 Pro com um prompt medico especializado
   - O Gemini analisa a imagem e retorna um JSON estruturado via tool calling
   - O score final combina: score do questionario + ajuste da IA
3. Se o usuario estiver offline ou pular a foto, funciona como antes (apenas questionario)

## Fluxo do usuario atualizado

- **Com imagem + online**: Mostra loading "Analisando imagem com IA...", calcula resultado combinado, mostra na Result page um card extra "Analise da IA" com os achados visuais
- **Com imagem + offline**: Usa apenas o questionario, mostra aviso que analise de IA nao esta disponivel offline
- **Sem imagem**: Funciona igual ao atual, apenas questionario

## Arquivos novos e editados

| Arquivo | Mudanca |
|---------|---------|
| `supabase/functions/analyze-lesion/index.ts` | **Novo** — Edge function que envia imagem + contexto para Gemini |
| `supabase/config.toml` | **Novo** — Config com verify_jwt = false para a function |
| `src/lib/analyzeImage.ts` | **Novo** — Funcao frontend para chamar a edge function |
| `src/types/leishcheck.ts` | Adicionar `AIAnalysis` interface e campo no `RiskResult` |
| `src/store/useLeishCheckStore.ts` | Alterar `calculateResult` para aceitar analise da IA opcional |
| `src/pages/ImageUpload.tsx` | Adicionar estado de loading, chamar analise antes de navegar |
| `src/pages/Result.tsx` | Mostrar card com analise da IA quando disponivel |
| `src/lib/generatePDF.ts` | Incluir analise da IA no PDF |
| `src/locales/pt-BR/translation.json` | Chaves para loading e card da IA |
| `src/locales/en-US/translation.json` | Idem |
| `src/locales/es-419/translation.json` | Idem |

## Detalhes tecnicos

### Edge Function `analyze-lesion/index.ts`

- Recebe: `{ imageBase64, answers, userData }` via POST
- Usa `LOVABLE_API_KEY` (ja configurado automaticamente)
- Modelo: `google/gemini-2.5-pro` (melhor para analise visual + raciocinio)
- Prompt de sistema: especialista em dermatologia tropical, focado em leishmaniose tegumentar
- Usa tool calling para extrair JSON estruturado com campos:
  - `riskAdjustment` (numero de -20 a +30 — ajuste no percentual)
  - `confidence` (0-100 — confianca da IA na analise)
  - `characteristics` (array de strings — achados visuais: "bordas elevadas", "ulceracao central", etc.)
  - `analysis` (texto curto — resumo da analise visual)
- Trata erros 429 (rate limit) e 402 (creditos) com mensagens amigaveis
- Nao faz streaming — resposta unica, rapida

### `src/lib/analyzeImage.ts`

- Funcao `analyzeImage(imageBase64, answers, userData)` que chama a edge function
- Retorna `AIAnalysis | null`
- Trata offline (`navigator.onLine`), timeout (30s), e erros de rede graciosamente

### Tipo `AIAnalysis`

```typescript
interface AIAnalysis {
  riskAdjustment: number;  // -20 a +30
  confidence: number;      // 0-100
  characteristics: string[];
  analysis: string;
}
```

### Calculo combinado no store

O `calculateResult` sera modificado para aceitar `aiAnalysis?: AIAnalysis`:
- `finalPercentage = clamp(questionnairePercentage + riskAdjustment, 0, 100)`
- O nivel (low/medium/high) e recalculado com base no percentual ajustado
- O `RiskResult` ganha campo opcional `aiAnalysis`

### ImageUpload.tsx — Fluxo atualizado

Ao clicar "Usar esta foto":
1. Se online: mostra spinner "Analisando imagem com IA..."
2. Chama `analyzeImage()`, aguarda resultado (max 30s)
3. Se sucesso: passa o `aiAnalysis` para `calculateResult(aiAnalysis)`
4. Se falha/timeout: calcula sem IA, mostra toast informando
5. Navega para `/resultado`

### Result.tsx — Card da IA

Quando `result.aiAnalysis` existe, mostra um card extra entre o circulo e a orientacao:
- Icone de IA (Sparkles ou Brain)
- "Analise por Inteligencia Artificial"
- Lista de caracteristicas encontradas na imagem
- Texto da analise
- Badge de confianca (ex: "Confianca: 85%")
- Disclaimer: "Analise assistida por IA — nao substitui diagnostico medico"

### Prompt do Gemini (resumo)

O prompt instrui o modelo a agir como dermatologista tropical e analisar a imagem buscando:
- Bordas elevadas/irregulares tipicas de leishmaniose cutanea
- Ulceracao central com fundo granuloso
- Ausencia de dor (inferida pelo questionario)
- Localizacao (areas expostas)
- Tempo de evolucao (inferido pelo questionario)
- Diagnósticos diferenciais (impetigo, carcinoma, ulcera vascular)

O modelo retorna um ajuste de risco (-20 a +30) que modifica o score do questionario, nunca substituindo-o completamente.

### Seguranca e privacidade

- A imagem e enviada via HTTPS para a edge function e nao e armazenada no servidor
- O Gemini processa e descarta — nao treina com os dados
- O consentimento LGPD ja existente cobre o uso da imagem para triagem
- Se offline, nenhum dado sai do dispositivo

