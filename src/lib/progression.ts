import { supabase } from "./supabase";
import { COURSE_LEVELS, lastBuiltLevelId } from "../data/levels";

const MASTERY_THRESHOLD = 0.96;

// Melhor % de acerto na Prova de cada módulo (qualquer modo, com ou sem
// consulta) — única nota hoje salva no servidor (funciona entre aparelhos).
export async function fetchMastery(userId: string): Promise<Record<string, boolean>> {
  const { data, error } = await supabase.from("exam_results").select("module,score,total").eq("user_id", userId);
  if (error || !data) return {};
  const best: Record<string, number> = {};
  (data as { module: string; score: number; total: number }[]).forEach((r) => {
    const pct = r.total > 0 ? r.score / r.total : 0;
    if (best[r.module] === undefined || pct > best[r.module]) best[r.module] = pct;
  });
  const mastery: Record<string, boolean> = {};
  Object.keys(best).forEach((m) => { mastery[m] = best[m] >= MASTERY_THRESHOLD; });
  return mastery;
}

// Índice (em COURSE_LEVELS, NÃO no trilho visível) até onde o usuário pode
// acessar: começa no nível de
// início escolhido no cadastro, e avança um por um enquanto cada módulo
// estiver com >=96% na Prova. Pode sempre "descer" pra qualquer nível <=
// esse índice — só não pode pular pra frente sem completar o anterior.
export function computeUnlockedMax(startingLevelId: string | null, mastery: Record<string, boolean>): number {
  // perfis antigos (de antes dessa funcionalidade) não escolheram nível —
  // ficam com acesso total ao que já existe, em vez de trancados de volta no A0.
  const effectiveStart = startingLevelId ?? lastBuiltLevelId();
  const startIdx = Math.max(0, COURSE_LEVELS.findIndex((l) => l.id === effectiveStart));
  let idx = startIdx;
  while (idx + 1 < COURSE_LEVELS.length && mastery[COURSE_LEVELS[idx].id]) idx++;
  return idx;
}
