import { Question } from '@/types/tropiscan';

export const esquistossomoseQuestions: Question[] = [
  {
    text: 'Tem contato frequente com rios, lagos ou canais de irrigação?',
    icon: '🏊',
    weight: 20,
    audioText: 'Pergunta 1. Tem contato frequente com rios, lagos ou canais de irrigação?',
  },
  {
    text: 'Sua residência possui saneamento básico adequado?',
    icon: '🚿',
    weight: 15,
    audioText: 'Pergunta 2. Sua residência possui saneamento básico adequado?',
  },
  {
    text: 'Já participou de campanhas de tratamento preventivo?',
    icon: '💊',
    weight: 10,
    audioText: 'Pergunta 3. Já participou de campanhas de tratamento preventivo?',
  },
  {
    text: 'Tem diarreia persistente ou recorrente?',
    icon: '🚽',
    weight: 20,
    audioText: 'Pergunta 4. Tem diarreia persistente ou recorrente?',
  },
  {
    text: 'Sente dor abdominal frequente?',
    icon: '🤰',
    weight: 15,
    audioText: 'Pergunta 5. Sente dor abdominal frequente?',
  },
  {
    text: 'Já notou presença de sangue nas fezes?',
    icon: '🩸',
    weight: 25,
    audioText: 'Pergunta 6. Já notou presença de sangue nas fezes?',
  },
  {
    text: 'Mora próximo a áreas endêmicas conhecidas?',
    icon: '🗺️',
    weight: 15,
    audioText: 'Pergunta 7. Mora próximo a áreas endêmicas conhecidas?',
  },
  {
    text: 'Familiares ou vizinhos já foram diagnosticados?',
    icon: '👨‍👩‍👧‍👦',
    weight: 10,
    audioText: 'Pergunta 8. Familiares ou vizinhos já foram diagnosticados?',
  },
  {
    text: 'Pratica lazer em água doce (rios, lagoas)?',
    icon: '🏖️',
    weight: 15,
    audioText: 'Pergunta 9. Pratica lazer em água doce?',
  },
  {
    text: 'Sente cansaço ou anemia frequente?',
    icon: '😴',
    weight: 15,
    audioText: 'Pergunta 10. Sente cansaço ou anemia frequente?',
  },
];

export const MAX_ESQUISTOSSOMOSE_SCORE = esquistossomoseQuestions.reduce((sum, q) => sum + q.weight, 0);