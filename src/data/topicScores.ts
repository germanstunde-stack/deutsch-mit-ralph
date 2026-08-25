// Última pontuação de prática por capítulo (20 pts cada). localStorage (sem login),
// mesmo padrão do Caderno/Prova — pronto pra alimentar um ranking futuro sem misturar
// com o treino do Caderno nem com a nota da Prova.
export interface TopicScore { correct: number; wrong: number; total: number; at: number; }
const KEY = "gs_topic_scores_v1";

export function loadTopicScores(): Record<string, TopicScore> {
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
}
export function saveTopicScore(id: string, s: TopicScore) {
  const all = loadTopicScores(); all[id] = s;
  try { localStorage.setItem(KEY, JSON.stringify(all)); } catch { /* ignore */ }
}
