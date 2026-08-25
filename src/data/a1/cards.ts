import type { Lang } from "../../i18n/types";
import type { CardItem } from "../../components/Cards";
import { CH_EU_VOCE_SEIN, CH_VERBOS_HABEN } from "./exercises";
import { pronouns, seinForms, regularVerbs, vowelChangeVerbs, habenForms, type Verb } from "./vocab";

export interface CardsData { items: CardItem[]; gridClass: string; legend?: boolean; }

function pronounCards(lang: Lang): CardItem[] {
  return pronouns.map((p) => ({ deHTML: p.de, pt: p.meaning[lang], speak: p.de }));
}
function seinCards(lang: Lang): CardItem[] {
  return seinForms.map((s) => ({ deHTML: `${s.pron} <b>${s.form}</b>`, pt: s.meaning[lang], speak: s.speak }));
}
function habenCards(lang: Lang): CardItem[] {
  return habenForms.map((h) => ({ deHTML: `${h.pron} <b>${h.form}</b>`, pt: h.meaning[lang], speak: h.speak }));
}
// 1 card por verbo, com a conjugação inteira na tabela (igual à explicação) —
// clicar fala o infinitivo.
function verbCards(pool: Verb[], lang: Lang): CardItem[] {
  return pool.map((v) => ({
    deHTML: `<b>${v.inf}</b><br><small>ich ${v.forms.ich} · du ${v.forms.du} · er ${v.forms.er}</small>`,
    pt: v.meaning[lang], speak: v.inf,
  }));
}

export function cardsForTopic(id: string, lang: Lang): CardsData {
  if (id === CH_EU_VOCE_SEIN) {
    return { gridClass: "grid", items: [...pronounCards(lang), ...seinCards(lang)] };
  }
  if (id === CH_VERBOS_HABEN) {
    return { gridClass: "grid", items: [...verbCards(regularVerbs, lang), ...habenCards(lang), ...verbCards(vowelChangeVerbs, lang)] };
  }
  return { gridClass: "grid", items: [] };
}
