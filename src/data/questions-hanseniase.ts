import { Question } from '@/types/tropiscan';

export const hanseniaseQuestions: Question[] = [
  {
    text: 'Possui manchas claras ou avermelhadas na pele persistentes?',
    icon: '🔴',
    weight: 20,
    audioText: 'Pergunta 1. Possui manchas claras ou avermelhadas na pele persistentes?',
  },
  {
    text: 'Há alteração de sensibilidade nas manchas (dormência, formigamento)?',
    icon: '🤚',
    weight: 25,
    audioText: 'Pergunta 2. Há alteração de sensibilidade nas manchas, como dormência ou formigamento?',
  },
  {
    text: 'Sente dor ou queimação nas áreas afetadas?',
    icon: '🔥',
    weight: 15,
    audioText: 'Pergunta 3. Sente dor ou queimação nas áreas afetadas?',
  },
  {
    text: 'Tem histórico familiar de hanseníase?',
    icon: '👨‍👩‍👧‍👦',
    weight: 15,
    audioText: 'Pergunta 4. Tem histórico familiar de hanseníase?',
  },
  {
    text: 'Teve contato próximo com pacientes diagnosticados?',
    icon: '🤝',
    weight: 15,
    audioText: 'Pergunta 5. Teve contato próximo com pacientes diagnosticados?',
  },
  {
    text: 'Já recebeu tratamento dermatológico para manchas suspeitas?',
    icon: '💊',
    weight: 10,
    audioText: 'Pergunta 6. Já recebeu tratamento dermatológico para manchas suspeitas?',
  },
  {
    text: 'As manchas estão crescendo ou novas manchas surgindo?',
    icon: '📈',
    weight: 20,
    audioText: 'Pergunta 7. As manchas estão crescendo ou novas manchas surgindo?',
  },
  {
    text: 'Possui nódulos ou espessamento da pele?',
    icon: '🔍',
    weight: 15,
    audioText: 'Pergunta 8. Possui nódulos ou espessamento da pele?',
  },
  {
    text: 'Tem histórico de neuropatia periférica?',
    icon: '🧠',
    weight: 10,
    audioText: 'Pergunta 9. Tem histórico de neuropatia periférica?',
  },
  {
    text: 'Apresenta deformidades ou perda de força muscular?',
    icon: '💪',
    weight: 15,
    audioText: 'Pergunta 10. Apresenta deformidades ou perda de força muscular?',
  },
];

export const MAX_HANSENIASE_SCORE = hanseniaseQuestions.reduce((sum, q) => sum + q.weight, 0);