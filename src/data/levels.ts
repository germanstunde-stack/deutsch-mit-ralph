// Metadados dos níveis CEFR. `builtYet` = módulo já tem conteúdo (pode ser
// escolhido/acessado); o desbloqueio de progressão (nota >=96% na Prova do
// módulo anterior) é calculado à parte em src/lib/progression.ts.
export interface LevelDef { id: string; sub: string; builtYet: boolean; }

export const LEVELS: LevelDef[] = [
  { id: "A0", sub: "do zero", builtYet: true },
  { id: "A1", sub: "frases", builtYet: true },
  { id: "A2", sub: "dia a dia", builtYet: false },
  { id: "B1", sub: "independente", builtYet: false },
  { id: "B2", sub: "fluência", builtYet: false },
  { id: "C1", sub: "avançado", builtYet: false },
  { id: "C2", sub: "executivo", builtYet: false },
];

export function lastBuiltLevelId(): string {
  for (let i = LEVELS.length - 1; i >= 0; i--) if (LEVELS[i].builtYet) return LEVELS[i].id;
  return LEVELS[0].id;
}
