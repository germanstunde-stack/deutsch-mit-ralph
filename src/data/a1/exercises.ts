import { shuffle } from "../generators";
import type { ExSpec } from "../exercises";
import type { Lang } from "../../i18n/types";
import {
  gPronounMeaning, gSeinForm, gTypeSein, gOrderSein,
  gVerbMeaning, gVerbFormMC, gTypeVerbForm, gHabenForm, gTypeHaben, gOrderVerb,
  gImperativeMeaning, gImperativeMC, gTypeImperative, gSeparableMeaning, gSeparableFormMC, gTypeSeparableForm, gOrderSeparable,
} from "./generators";

export const CH_EU_VOCE_SEIN = "eu-voce-sein";
export const CH_VERBOS_HABEN = "verbos-regulares-haben";
export const CH_IMPERATIVO = "imperativo-separaveis";

// Ordem oficial das unidades do "Grammatik leicht A1": cada id aqui vira um
// capítulo (20 pts na prática, igual ao A0). Os outros entram nas próximas
// entregas.
export const CHAPTER_IDS = [CH_EU_VOCE_SEIN, CH_VERBOS_HABEN, CH_IMPERATIVO];

function specsForChapter(id: string, lang: Lang): ExSpec[] {
  switch (id) {
    case CH_EU_VOCE_SEIN:
      return [
        { kind: "mc", gen: () => gPronounMeaning(lang) },
        { kind: "mc", gen: () => gSeinForm(lang) },
        { kind: "typed", gen: () => gTypeSein(lang) },
        { kind: "order", gen: () => gOrderSein(lang) },
      ];
    case CH_VERBOS_HABEN:
      return [
        { kind: "mc", gen: () => gVerbMeaning(lang) },
        { kind: "mc", gen: () => gVerbFormMC(lang) },
        { kind: "typed", gen: () => gTypeVerbForm(lang) },
        { kind: "mc", gen: () => gHabenForm(lang) },
        { kind: "typed", gen: () => gTypeHaben(lang) },
        { kind: "order", gen: () => gOrderVerb(lang) },
      ];
    case CH_IMPERATIVO:
      return [
        { kind: "mc", gen: () => gImperativeMeaning(lang) },
        { kind: "mc", gen: () => gImperativeMC(lang) },
        { kind: "typed", gen: () => gTypeImperative(lang) },
        { kind: "mc", gen: () => gSeparableMeaning(lang) },
        { kind: "mc", gen: () => gSeparableFormMC(lang) },
        { kind: "typed", gen: () => gTypeSeparableForm(lang) },
        { kind: "order", gen: () => gOrderSeparable(lang) },
      ];
    default:
      return [{ kind: "mc", gen: () => gPronounMeaning(lang) }];
  }
}

export function exSpecsForTopic(id: string, lang: Lang, count = 20): ExSpec[] {
  const base = specsForChapter(id, lang);
  const out: ExSpec[] = [];
  for (let i = 0; i < count; i++) out.push(base[i % base.length]);
  return shuffle(out);
}

// ---- Prova A1: mesmo formato 50 pts / 3 partes do A0 ----
export function examSpecsFor(lang: Lang): ExSpec[] {
  const all = CHAPTER_IDS.flatMap((id) => specsForChapter(id, lang));
  const mc = all.filter((s) => s.kind === "mc");
  const typedDict = all.filter((s) => s.kind === "typed" || s.kind === "dict");
  const interactive = all.filter((s) => s.kind === "connect" || s.kind === "ws" || s.kind === "enum" || s.kind === "order");

  const part1: ExSpec[] = shuffle(Array.from({ length: 20 }, (_, i) => mc[i % mc.length]));
  const pool2 = typedDict.length ? typedDict : mc;
  const part2: ExSpec[] = Array.from({ length: 10 }, (_, i) => pool2[i % pool2.length]);
  const pool3 = interactive.length ? interactive : mc;
  const part3: ExSpec[] = shuffle(Array.from({ length: 20 }, (_, i) => pool3[i % pool3.length]));
  return [...part1, ...part2, ...part3];
}

export function examPartsFor(lang: Lang): { label: string; count: number }[] {
  return lang === "pt"
    ? [
        { label: "Parte 1 · Múltipla escolha (20 pts)", count: 20 },
        { label: "Parte 2 · Escreva / ditado (10 pts)", count: 10 },
        { label: "Parte 3 · Interativas (20 pts)", count: 20 },
      ]
    : [
        { label: "Part 1 · Multiple choice (20 pts)", count: 20 },
        { label: "Part 2 · Write / dictation (10 pts)", count: 10 },
        { label: "Part 3 · Interactive (20 pts)", count: 20 },
      ];
}

export const EXAM_TOTAL = 50;
