import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserData, QuestionAnswer, RiskResult, RiskLevel, AIAnalysis, DiseaseType } from '@/types/tropiscan';
import { questions, MAX_SCORE } from '@/data/questions';
import { chagasQuestions, MAX_CHAGAS_SCORE } from '@/data/questions-chagas';
import { hanseniaseQuestions, MAX_HANSENIASE_SCORE } from '@/data/questions-hanseniase';
import { esquistossomoseQuestions, MAX_ESQUISTOSSOMOSE_SCORE } from '@/data/questions-esquistossomose';
import { saveSession } from '@/lib/db';

interface TropiScanState {
  // Audio
  audioEnabled: boolean;
  toggleAudio: () => void;

  // Dark mode
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Disease selection
  selectedDisease: DiseaseType | null;
  setSelectedDisease: (disease: DiseaseType) => void;

  // Consent
  consentGiven: boolean;
  consentDate: string | null;
  setConsent: (given: boolean) => void;
  checkConsentValid: () => boolean;

  // User data
  userData: UserData;
  setUserData: (data: UserData) => void;

  // Questionnaire
  currentQuestion: number;
  answers: QuestionAnswer[];
  setAnswer: (questionIndex: number, answer: boolean) => void;
  goToQuestion: (index: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;

  // Image
  imageBase64: string | null;
  setImage: (base64: string | null) => void;

  // Result
  result: RiskResult | null;
  calculateResult: (aiAnalysis?: AIAnalysis) => RiskResult;

  // Reset
  resetTriagem: () => void;

  // Helper methods
  getCurrentQuestions: () => typeof questions;
  getMaxScore: () => number;
}

function getCurrentQuestionsForDisease(disease: DiseaseType | null) {
  switch (disease) {
    case 'chagas':
      return chagasQuestions;
    case 'hanseniase':
      return hanseniaseQuestions;
    case 'esquistossomose':
      return esquistossomoseQuestions;
    default:
      return questions; // leishmaniasis as default
  }
}

function getMaxScoreForDisease(disease: DiseaseType | null) {
  switch (disease) {
    case 'chagas':
      return MAX_CHAGAS_SCORE;
    case 'hanseniase':
      return MAX_HANSENIASE_SCORE;
    case 'esquistossomose':
      return MAX_ESQUISTOSSOMOSE_SCORE;
    default:
      return MAX_SCORE; // leishmaniasis as default
  }
}

function calculateRisk(answers: QuestionAnswer[], selectedDisease: DiseaseType | null, aiAnalysis?: AIAnalysis): RiskResult {
  const currentQuestions = getCurrentQuestionsForDisease(selectedDisease);
  const maxScore = getMaxScoreForDisease(selectedDisease);
  
  const score = answers.reduce((sum, a) => {
    if (a.answer) return sum + currentQuestions[a.questionIndex].weight;
    return sum;
  }, 0);

  let percentage = Math.round((score / maxScore) * 100);

  // Apply AI adjustment if available
  if (aiAnalysis) {
    percentage = Math.max(0, Math.min(100, percentage + aiAnalysis.riskAdjustment));
  }

  let level: RiskLevel;
  let title: string;
  let description: string;
  let orientation: string;

  const diseaseNames = {
    chagas: 'Doença de Chagas',
    hanseniase: 'Hanseníase', 
    esquistossomose: 'Esquistossomose',
    default: 'Leishmaniose'
  };

  const diseaseName = selectedDisease ? diseaseNames[selectedDisease] : diseaseNames.default;

  if (percentage <= 30) {
    level = 'low';
    title = 'RISCO BAIXO';
    description = `Sinais pouco sugestivos de ${diseaseName.toLowerCase()}.`;
    orientation = 'Sinais pouco sugestivos. Monitorar. Procurar UBS se piorar.';
  } else if (percentage <= 60) {
    level = 'medium';
    title = 'RISCO MODERADO';
    description = `Sinais moderados para ${diseaseName.toLowerCase()}.`;
    orientation = 'Sinais moderados. Recomendado consulta médica breve.';
  } else {
    level = 'high';
    title = 'RISCO ELEVADO';
    description = `Sinais fortemente sugestivos de ${diseaseName.toLowerCase()}.`;
    orientation = 'Sinais fortemente sugestivos. Procure UBS urgentemente.';
  }

  return { score, percentage, level, title, description, orientation, aiAnalysis };
}

function applyDarkClass(dark: boolean) {
  if (dark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

export const useTropiScanStore = create<TropiScanState>()(
  persist(
    (set, get) => ({
      audioEnabled: false,
      toggleAudio: () => set((s) => ({ audioEnabled: !s.audioEnabled })),

      darkMode: false,
      toggleDarkMode: () =>
        set((s) => {
          const next = !s.darkMode;
          applyDarkClass(next);
          return { darkMode: next };
        }),

      selectedDisease: null,
      setSelectedDisease: (disease) => set({ selectedDisease: disease }),

      consentGiven: false,
      consentDate: null,
      setConsent: (given) =>
        set({ consentGiven: given, consentDate: given ? new Date().toISOString() : null }),
      checkConsentValid: () => {
        const { consentGiven, consentDate } = get();
        if (!consentGiven || !consentDate) return false;
        const diff = Date.now() - new Date(consentDate).getTime();
        return diff < 90 * 24 * 60 * 60 * 1000;
      },

      userData: {},
      setUserData: (data) => set({ userData: data }),

      currentQuestion: 0,
      answers: [],
      setAnswer: (questionIndex, answer) =>
        set((s) => {
          const filtered = s.answers.filter((a) => a.questionIndex !== questionIndex);
          return { answers: [...filtered, { questionIndex, answer }] };
        }),
      goToQuestion: (index) => set({ currentQuestion: index }),
      nextQuestion: () => {
        const { selectedDisease } = get();
        const currentQuestions = getCurrentQuestionsForDisease(selectedDisease);
        set((s) => ({ currentQuestion: Math.min(s.currentQuestion + 1, currentQuestions.length - 1) }));
      },
      prevQuestion: () => set((s) => ({ currentQuestion: Math.max(s.currentQuestion - 1, 0) })),

      getCurrentQuestions: () => {
        const { selectedDisease } = get();
        return getCurrentQuestionsForDisease(selectedDisease);
      },
      getMaxScore: () => {
        const { selectedDisease } = get();
        return getMaxScoreForDisease(selectedDisease);
      },

      imageBase64: null,
      setImage: (base64) => set({ imageBase64: base64 }),

      result: null,
      calculateResult: (aiAnalysis?: AIAnalysis) => {
        const state = get();
        const result = calculateRisk(state.answers, state.selectedDisease, aiAnalysis);
        set({ result });

        saveSession({
          date: new Date().toISOString(),
          userData: state.userData,
          answers: state.answers,
          result,
          hasImage: !!state.imageBase64,
          diseaseType: state.selectedDisease,
        }).catch(console.error);

        return result;
      },

      resetTriagem: () =>
        set({
          userData: {},
          currentQuestion: 0,
          answers: [],
          imageBase64: null,
          result: null,
          selectedDisease: null,
        }),
    }),
    {
      name: 'tropiscan-storage',
      partialize: (state) => ({
        audioEnabled: state.audioEnabled,
        consentGiven: state.consentGiven,
        consentDate: state.consentDate,
        darkMode: state.darkMode,
        selectedDisease: state.selectedDisease,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.darkMode) {
          applyDarkClass(state.darkMode);
        }
      },
    }
  )
);
