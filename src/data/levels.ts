// Metadados do trilho de níveis. `builtYet` = já tem conteúdo (pode ser
// escolhido/acessado); o desbloqueio de progressão (nota >=96% na Prova do
// módulo anterior) é calculado à parte em src/lib/progression.ts.
//
// Duas famílias, e a distinção é carregada como DADO em vez de convenção:
//
//   "course"  — os níveis CEFR (A0…C2). Entram na progressão dos 96% e na
//               escolha de nível inicial do cadastro.
//   "section" — trilhas paralelas (Geografia, História). Sempre abertas, sem
//               Prova, fora do cálculo de desbloqueio. Não são nível de língua:
//               travar o B1 porque o aluno não sabe a população de Uri seria
//               absurdo.
export type LevelKind = "course" | "section";

export interface LevelDef {
  id: string;
  sub: string;
  builtYet: boolean;
  kind: LevelKind;
  /** só as seções mostram ícone no lugar da sigla */
  icon?: string;
}

export const COURSE_LEVELS: LevelDef[] = [
  { id: "A0", sub: "do zero", builtYet: true, kind: "course" },
  { id: "A1", sub: "frases", builtYet: true, kind: "course" },
  { id: "A2", sub: "dia a dia", builtYet: false, kind: "course" },
  { id: "B1", sub: "independente", builtYet: false, kind: "course" },
  { id: "B2", sub: "fluência", builtYet: false, kind: "course" },
  { id: "C1", sub: "avançado", builtYet: false, kind: "course" },
  { id: "C2", sub: "executivo", builtYet: false, kind: "course" },
];

export const SECTION_LEVELS: LevelDef[] = [];

/** o trilho VISÍVEL — não serve pra calcular progressão (ver isLevelUnlocked) */
export const LEVELS: LevelDef[] = [...COURSE_LEVELS, ...SECTION_LEVELS];

export const isSection = (id: string) => SECTION_LEVELS.some((l) => l.id === id);

// Só entre os níveis do curso: um perfil antigo (sem nível inicial salvo) que
// caísse numa seção faria o cálculo de desbloqueio virar lixo, porque
// computeUnlockedMax procura o índice dele em COURSE_LEVELS e não acharia.
export function lastBuiltLevelId(): string {
  for (let i = COURSE_LEVELS.length - 1; i >= 0; i--) if (COURSE_LEVELS[i].builtYet) return COURSE_LEVELS[i].id;
  return COURSE_LEVELS[0].id;
}

/** Regra única de "pode entrar". Seção nunca tranca; nível do curso compara o
 *  índice DENTRO de COURSE_LEVELS — usar o índice do trilho visível deixaria a
 *  Geografia trancada até o C1, que é o oposto do que ela é. */
export function isLevelUnlocked(lv: LevelDef, unlockedMax: number): boolean {
  if (lv.kind === "section") return true;
  return COURSE_LEVELS.findIndex((l) => l.id === lv.id) <= unlockedMax;
}
