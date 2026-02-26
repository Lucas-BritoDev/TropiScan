

# LeishCheck — Triagem de Leishmaniose Cutânea (PWA)

Aplicativo progressivo (PWA) de triagem de risco para Leishmaniose Cutânea, com questionário clínico, upload de imagem, conteúdo educativo e modo áudio. Interface acessível para pessoas com baixa escolaridade em regiões endêmicas do Brasil.

---

## Fase 1 — Fundação: Design System e Estrutura

### 1.1 Identidade Visual
- Paleta de cores personalizada: verde primário (#2E7D32), verde claro (#A5D6A7), azul confiança (#1565C0), amarelo alerta (#FBC02D), vermelho perigo (#C62828)
- Tipografia Poppins (Google Fonts) com escalas definidas (H1 28px bold, Body 16px, etc.)
- Componentes base: botões arredondados (16px radius, min-height 48px), cards com sombra verde sutil, inputs com borda verde

### 1.2 Estrutura de Rotas e Estado Global
- Páginas: Home, Consent, UserData, Questionnaire, ImageUpload, Result, Education
- Estado global com Zustand para gerenciar fluxo de triagem, respostas, modo áudio e preferências
- Tipos TypeScript: Session, QuestionAnswer, RiskResult, UserData

---

## Fase 2 — Telas do Fluxo Principal

### 2.1 Tela Inicial (Splash)
- Logo LeishCheck com ícone de saúde em verde
- Tagline: "Cuide da sua saúde. Simples, rápido e gratuito."
- Botão primário grande "🩺 Iniciar Triagem"
- Botão secundário "📚 Material Educativo"
- Ícone flutuante de áudio (🔊) no canto superior direito

### 2.2 Consentimento LGPD
- Ícone de escudo no topo, título "Sua privacidade é importante"
- Texto completo do termo de consentimento com scroll obrigatório
- Checkbox "Li e concordo" habilitado só após rolar até o final
- Botão "Aceitar e Continuar" (desabilitado até checkbox marcado)
- Botão "Não aceito" com mensagem respeitosa
- Aviso: "Esta ferramenta não substitui consulta médica presencial."

### 2.3 Dados Básicos
- Campos: Idade, Gênero (select), Cidade, Estado
- Todos opcionais exceto confirmação de localização
- Interface simples com labels grandes

### 2.4 Questionário de Triagem (10 perguntas)
- Uma pergunta por vez com ícone ilustrativo
- Botões grandes "✅ Sim" e "❌ Não" com alto contraste
- Barra de progresso visual ("Pergunta 3 de 10")
- Botão "Voltar" para corrigir resposta anterior
- Animação de transição suave entre perguntas
- 10 perguntas com pesos definidos (total máximo: 135 pontos)

### 2.5 Upload de Imagem
- Opções: Câmera ou Galeria
- Preview da imagem com "Usar esta foto" / "Tirar outra foto"
- Opção "Pular esta etapa" (campo opcional)
- Indicador de carregamento durante upload

### 2.6 Tela de Resultado
- Círculo grande central com porcentagem de risco
- Cores por nível: Verde (0-30%), Amarelo (31-60%), Vermelho (61-100%)
- Título do resultado (ex: "RISCO ELEVADO")
- Orientação em linguagem simples
- Botões: "📍 Ver UBS mais próxima", "📚 Saiba mais", "🔄 Refazer Triagem"
- Aviso fixo: "Apenas um profissional de saúde pode confirmar o diagnóstico."

---

## Fase 3 — Seção Educativa

### 3.1 Conteúdo sobre o Mosquito-Palha
- Imagens placeholder do vetor (Lutzomyia sp.) com texto explicativo simples
- Botão de áudio para narração

### 3.2 Galeria de Lesões
- Carrossel com 3 fases: Inicial (pápula), Ulcerada, Avançada
- Texto simples abaixo de cada imagem
- Botão de áudio por imagem
- Aviso obrigatório ao final

---

## Fase 4 — Modo Áudio e Acessibilidade

### 4.1 Modo Áudio Global
- Botão flutuante 🔊 visível em todas as telas (toggle global)
- Implementação via Web Speech API (SpeechSynthesis) em pt-BR
- Velocidade de fala lenta (rate: 0.8)
- Pausar/retomar áudio a qualquer momento
- Preferência salva no localStorage

### 4.2 Acessibilidade
- Contraste WCAG AA (mínimo 4.5:1)
- Áreas de toque mínimas 44x44px
- ARIA labels em todos os botões com ícones
- Alt text descritivo em todas as imagens
- Respeitar prefers-reduced-motion

---

## Fase 5 — Algoritmo de Risco e Persistência

### 5.1 Cálculo de Risco
- Pesos por pergunta (Q1: 10pts, Q3: 20pts, Q5: 20pts, etc.)
- Score normalizado: (pontos / 135) × 100
- Classificação: Baixo (0-30%), Médio (31-60%), Alto (61-100%)
- Orientações específicas por nível de risco

### 5.2 Armazenamento Local
- localStorage/IndexedDB para sessões, respostas, resultados e preferências
- Consentimento armazenado por 90 dias (não solicitar novamente dentro do período)

---

## Fase 6 — PWA e Offline

### 6.1 Configuração PWA
- Manifest com nome, ícones, cores tema (#2E7D32), orientação portrait
- Service Worker para cache de assets estáticos
- Prompt de instalação (Add to Home Screen) customizado
- Funcionamento 100% offline após primeira carga

