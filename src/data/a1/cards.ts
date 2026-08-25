import type { Lang } from "../../i18n/types";
import type { CardItem } from "../../components/Cards";
import { CH_EU_VOCE_SEIN, CH_VERBOS_HABEN, CH_IMPERATIVO, CH_PERFEKT, CH_MODAIS, CH_GENERO_PLURAL, CH_CASOS, CH_PRONOMES, CH_ARTIGOS, CH_PREPOSICOES, CH_PERGUNTAS } from "./exercises";
import { pronouns, seinForms, regularVerbs, vowelChangeVerbs, habenForms, imperativeVerbs, separableVerbs, perfektHabenRegular, perfektHabenIrregular, perfektSein, modalVerbs, nounsPlural, caseNouns, personalPronouns, indefPronouns, possessives, possessiveNouns, prepositions, questionWords, connectors, type Verb, type PerfektVerb } from "./vocab";

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
function nounPluralCards(lang: Lang): CardItem[] {
  return nounsPlural.map((n) => ({
    deHTML: `<span class="art ${n.art}">${n.art}</span> ${n.de}<br><small>die ${n.plural}</small>`,
    pt: n.meaning[lang], speak: `${n.art} ${n.de}`,
  }));
}
function caseCards(lang: Lang): CardItem[] {
  return caseNouns.map((n) => ({
    deHTML: `<small>Nom</small> ${n.nom}<br><small>Akk</small> ${n.akk}<br><small>Dat</small> ${n.dat}`,
    pt: n.meaning[lang], speak: n.nom,
  }));
}
function pronCards(lang: Lang): CardItem[] {
  return [
    ...personalPronouns.map((p) => ({ deHTML: `${p.nom}<br><small>${p.akk} · ${p.dat}</small>`, pt: p.meaning[lang], speak: p.nom })),
    ...indefPronouns.map((w) => ({ deHTML: w.de, pt: w.meaning[lang], speak: w.de })),
  ];
}
function possForm(stem: string, art: "der" | "die" | "das"): string {
  if (art !== "die") return stem;
  if (stem === "euer") return "eure";
  return stem + "e";
}
function possCards(lang: Lang): CardItem[] {
  const sample = possessiveNouns[0]; // der Vater — mostra as 3 formas de gênero num exemplo fixo
  const dieSample = possessiveNouns.find((n) => n.art === "die")!;
  const dasSample = possessiveNouns.find((n) => n.art === "das")!;
  return possessives.map((p) => ({
    deHTML: `<b>${p.stem}</b><br><small>${possForm(p.stem, sample.art)} ${sample.de} · ${possForm(p.stem, dieSample.art)} ${dieSample.de} · ${possForm(p.stem, dasSample.art)} ${dasSample.de}</small>`,
    pt: p.meaning[lang], speak: p.stem,
  }));
}
function prepCards(lang: Lang): CardItem[] {
  return prepositions.map((p) => ({
    deHTML: `<b>${p.de}</b><br><small>${p.example}</small>`,
    pt: `${p.meaning[lang]} — ${p.exampleMeaning[lang]}`, speak: p.example,
  }));
}
function questionCards(lang: Lang): CardItem[] {
  return [
    ...questionWords.map((w) => ({ deHTML: `<b>${w.de}</b><br><small>${w.example}</small>`, pt: w.meaning[lang], speak: w.example })),
    ...connectors.map((c) => ({ deHTML: `<b>${c.de}</b><br><small>${c.example}</small>`, pt: c.meaning[lang], speak: c.example })),
  ];
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
  if (id === CH_MODAIS) {
    return { gridClass: "grid", items: verbCards(modalVerbs, lang) };
  }
  if (id === CH_GENERO_PLURAL) {
    return { gridClass: "grid", legend: true, items: nounPluralCards(lang) };
  }
  if (id === CH_CASOS) {
    return { gridClass: "grid", items: caseCards(lang) };
  }
  if (id === CH_PRONOMES) {
    return { gridClass: "grid", items: pronCards(lang) };
  }
  if (id === CH_ARTIGOS) {
    return { gridClass: "grid", items: possCards(lang) };
  }
  if (id === CH_PREPOSICOES) {
    return { gridClass: "grid", items: prepCards(lang) };
  }
  if (id === CH_PERGUNTAS) {
    return { gridClass: "grid", items: questionCards(lang) };
  }
  return { gridClass: "grid", items: [] };
}
