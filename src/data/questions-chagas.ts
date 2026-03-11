import { Question } from '@/types/tropiscan';

export const chagasQuestions: Question[] = [
  {
    text: 'Qual o tipo de construção da sua residência?',
    icon: '🏠',
    weight: 10,
    audioText: 'Pergunta 1. Qual o tipo de construção da sua residência? Barro, madeira, alvenaria ou outro?',
  },
  {
    text: 'Há frestas ou buracos nas paredes ou telhado da sua casa?',
    icon: '🕳️',
    weight: 15,
    audioText: 'Pergunta 2. Há frestas ou buracos nas paredes ou telhado da sua casa?',
  },
  {
    text: 'Já viu o inseto barbeiro (triatomíneo) dentro ou ao redor da casa?',
    icon: '🦗',
    weight: 20,
    audioText: 'Pergunta 3. Já viu o inseto barbeiro dentro ou ao redor da casa?',
  },
  {
    text: 'Tem histórico familiar de Doença de Chagas?',
    icon: '👨‍👩‍👧‍👦',
    weight: 15,
    audioText: 'Pergunta 4. Tem histórico familiar de Doença de Chagas?',
  },
  {
    text: 'Mora em região rural ou próxima a áreas silvestres?',
    icon: '🌿',
    weight: 10,
    audioText: 'Pergunta 5. Mora em região rural ou próxima a áreas silvestres?',
  },
  {
    text: 'Há animais domésticos ou silvestres perto de casa?',
    icon: '🐕',
    weight: 10,
    audioText: 'Pergunta 6. Há animais domésticos ou silvestres perto de casa?',
  },
  {
    text: 'Já recebeu transfusão de sangue ou transplante de órgão?',
    icon: '🩸',
    weight: 15,
    audioText: 'Pergunta 7. Já recebeu transfusão de sangue ou transplante de órgão?',
  },
  {
    text: 'Já realizou teste sorológico para Chagas?',
    icon: '🔬',
    weight: 5,
    audioText: 'Pergunta 8. Já realizou teste sorológico para Chagas?',
  },
  {
    text: 'Tem sintomas como fadiga intensa, palpitações ou inchaço abdominal?',
    icon: '💓',
    weight: 20,
    audioText: 'Pergunta 9. Tem sintomas como fadiga intensa, palpitações ou inchaço abdominal?',
  },
  {
    text: 'Familiares têm problemas cardíacos ou digestivos recentes?',
    icon: '❤️',
    weight: 10,
    audioText: 'Pergunta 10. Familiares têm problemas cardíacos ou digestivos recentes?',
  },
];

export const MAX_CHAGAS_SCORE = chagasQuestions.reduce((sum, q) => sum + q.weight, 0);