// Dicionário de verbos: catálogo com TODOS os verbos já vistos em algum
// capítulo do A1 (reaproveita as listas existentes — nenhuma tradução é
// duplicada/reescrita aqui, só reunida) + um punhado de verbos comuns de A1
// que ainda não apareceram em nenhuma gramática específica. É uma seção de
// memorização (infinitivo ↔ tradução), não de conjugação — a conjugação de
// cada verbo já foi ensinada no capítulo de gramática correspondente.
import type { Lang } from "../../i18n/types";
import {
  regularVerbs, vowelChangeVerbs, modalVerbs,
  imperativeVerbs, separableVerbs,
  perfektHabenRegular, perfektHabenIrregular, perfektSein,
} from "./vocab";

export interface DictVerb { inf: string; meaning: Record<Lang, string>; }

// sein/haben não estão guardados como {inf, meaning} em nenhum lugar (só como
// tabela de conjugação) — entram aqui manualmente, no topo da lista.
const coreVerbs: DictVerb[] = [
  { inf: "sein", meaning: { pt: "ser / estar", en: "to be" } },
  { inf: "haben", meaning: { pt: "ter", en: "to have" } },
];

// Verbos comuns de A1 que não têm capítulo de gramática próprio — só entram
// aqui, no catálogo, pra memorização de vocabulário.
const extraVerbs: DictVerb[] = [
  { inf: "wissen", meaning: { pt: "saber (um fato)", en: "to know (a fact)" } },
  { inf: "kennen", meaning: { pt: "conhecer", en: "to know (be familiar with)" } },
  { inf: "brauchen", meaning: { pt: "precisar (de algo)", en: "to need" } },
  { inf: "bekommen", meaning: { pt: "receber / ganhar", en: "to receive / get" } },
  { inf: "bringen", meaning: { pt: "trazer", en: "to bring" } },
  { inf: "denken", meaning: { pt: "pensar", en: "to think" } },
  { inf: "glauben", meaning: { pt: "acreditar", en: "to believe" } },
  { inf: "hören", meaning: { pt: "ouvir / escutar", en: "to hear / listen" } },
  { inf: "sagen", meaning: { pt: "dizer", en: "to say" } },
  { inf: "sitzen", meaning: { pt: "sentar / estar sentado", en: "to sit" } },
  { inf: "stehen", meaning: { pt: "estar de pé / ficar", en: "to stand" } },
  { inf: "gehören", meaning: { pt: "pertencer", en: "to belong to" } },
  { inf: "verstehen", meaning: { pt: "entender", en: "to understand" } },
  { inf: "suchen", meaning: { pt: "procurar", en: "to look for" } },
  { inf: "zeigen", meaning: { pt: "mostrar", en: "to show" } },
  { inf: "öffnen", meaning: { pt: "abrir", en: "to open" } },
  { inf: "schliessen", meaning: { pt: "fechar", en: "to close" } },
  { inf: "beginnen", meaning: { pt: "começar", en: "to begin" } },
  { inf: "bleiben", meaning: { pt: "ficar / permanecer", en: "to stay" } },
  { inf: "waschen", meaning: { pt: "lavar", en: "to wash" } },
  { inf: "kochen", meaning: { pt: "cozinhar", en: "to cook" } },
  { inf: "tanzen", meaning: { pt: "dançar", en: "to dance" } },
  { inf: "singen", meaning: { pt: "cantar", en: "to sing" } },
  { inf: "helfen", meaning: { pt: "ajudar", en: "to help" } },
  { inf: "treffen", meaning: { pt: "encontrar (uma pessoa)", en: "to meet" } },
];

function dedupe(pool: { inf: string; meaning: Record<Lang, string> }[]): DictVerb[] {
  const seen = new Set<string>();
  const out: DictVerb[] = [];
  pool.forEach((v) => { if (!seen.has(v.inf)) { seen.add(v.inf); out.push({ inf: v.inf, meaning: v.meaning }); } });
  return out;
}

// Ordem alfabética alemã (ä/ö/ü ordenam junto de a/o/u) — é um
// dicionário de consulta, então tem que dar pra achar o verbo pela letra.
export const allVerbs: DictVerb[] = dedupe([
  ...coreVerbs,
  ...regularVerbs, ...vowelChangeVerbs, ...modalVerbs,
  ...imperativeVerbs, ...separableVerbs,
  ...perfektHabenRegular, ...perfektHabenIrregular, ...perfektSein,
  ...extraVerbs,
]).sort((a, b) => a.inf.localeCompare(b.inf, "de"));
