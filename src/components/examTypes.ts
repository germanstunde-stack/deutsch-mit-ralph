// Modo compartilhado pelos componentes de exercício (Engines.tsx / MultipleChoice.tsx):
// "practice" (padrão): revela certo/errado na hora, soma via onResolve, igual hoje.
// "exam": não revela nada ao interagir — só guarda a resposta atual e expõe
// getScore()/reveal() por ref, pra Prova.tsx corrigir tudo de uma vez no final.
export type ExMode = "practice" | "exam";

export interface ExamHandle {
  getScore: () => { correct: number; wrong: number };
  reveal: () => void;
}
