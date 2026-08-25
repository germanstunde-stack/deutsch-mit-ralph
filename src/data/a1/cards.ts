import type { Lang } from "../../i18n/types";
import type { CardItem } from "../../components/Cards";
import { CH_EU_VOCE_SEIN, CH_VERBOS_HABEN, CH_IMPERATIVO, CH_PERFEKT } from "./exercises";
import { pronouns, seinForms, regularVerbs, vowelChangeVerbs, habenForms, imperativeVerbs, separableVerbs, perfektHabenRegular, perfektHabenIrregular, perfektSein, type Verb, type PerfektVerb } from "./vocab";

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

function imperativeCards(lang: Lang): CardItem[] {
  return imperativeVerbs.map((v) => ({
    deHTML: `<b>${v.du}!</b><br><small>ihr ${v.ihr}! · Sie ${v.sie}!</small>`,
    pt: v.meaning[lang], speak: v.du,
  }));
}
function separableCards(lang: Lang): CardItem[] {
  return separableVerbs.map((v) => ({
    deHTML: `<b>${v.inf}</b><br><small>ich ${v.forms.ich} · er ${v.forms.er}</small>`,
    pt: v.meaning[lang], speak: v.inf,
  }));
}
function perfektCards(pool: PerfektVerb[], lang: Lang): CardItem[] {
  return pool.map((v) => ({
    deHTML: `${v.inf} → <b>${v.partizip}</b><br><small>${v.auxiliary}</small>`,
    pt: v.meaning[lang], speak: v.partizip,
  }));
}

export function cardsForTopic(id: string, lang: Lang): CardsData {
  if (id === CH_EU_VOCE_SEIN) {
    return { gridClass: "grid", items: [...pronounCards(lang), ...seinCards(lang)] };
  }
  if (id === CH_VERBOS_HABEN) {
    return { gridClass: "grid", items: [...verbCards(regularVerbs, lang), ...habenCards(lang), ...verbCards(vowelChangeVerbs, lang)] };
  }
  if (id === CH_IMPERATIVO) {
    return { gridClass: "grid", items: [...imperativeCards(lang), ...separableCards(lang)] };
  }
  if (id === CH_PERFEKT) {
    return { gridClass: "grid", items: [...perfektCards(perfektHabenRegular, lang), ...perfektCards(perfektHabenIrregular, lang), ...perfektCards(perfektSein, lang)] };
  }
  return { gridClass: "grid", items: [] };
}
