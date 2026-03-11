import { Disease } from '@/types/tropiscan';

export const diseases: Disease[] = [
  {
    id: 'chagas',
    name: 'Doença de Chagas',
    description: 'Causada pelo Trypanosoma cruzi, transmitida pelo inseto barbeiro',
    icon: '🦗',
    color: '#DC2626'
  },
  {
    id: 'hanseniase',
    name: 'Hanseníase',
    description: 'Doença infecciosa que afeta pele e nervos periféricos',
    icon: '🩹',
    color: '#7C3AED'
  },
  {
    id: 'esquistossomose',
    name: 'Esquistossomose',
    description: 'Causada pelo Schistosoma mansoni, transmitida por água contaminada',
    icon: '💧',
    color: '#0891B2'
  }
];