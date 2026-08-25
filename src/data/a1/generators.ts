import { rand, sample, shuffle, type Question } from "../generators";
import type { TypedQ, OrderData } from "../exercises";
import type { Lang } from "../../i18n/types";
import { pronouns, seinForms, seinSentences, regularVerbs, vowelChangeVerbs, habenForms, verbSentences, type Verb, type OrderSentence } from "./vocab";

let uid = 0;
function q(x: Omit<Question, "key">): Question { return { key: "a1q" + uid++, ...x }; }

/* ---------- helpers genéricos (reaproveitados por vários capítulos) ---------- */
interface FormEntry { pron: string; form: string; speak: string; }

function gFormMC(lang: Lang, label: string, forms: FormEntry[]): Question {
  const s = rand(forms);
  const uniqueForms = forms.map((f) => f.form).filter((f, i, a) => a.indexOf(f) === i);
  const wrong = sample(uniqueForms, 3, s.form);
  const opts = wrong.map((f) => ({ label: f, correct: false }));
  opts.push({ label: s.form, correct: true });
  const prompt = lang === "pt"
    ? `Qual forma de <span class="k">${label}</span> vai com <span class="big">${s.pron}</span>?`
    : `Which form of <span class="k">${label}</span> goes with <span class="big">${s.pron}</span>?`;
  return q({ promptHTML: prompt, speak: s.speak, options: shuffle(opts), word: s.form, wordpt: s.pron });
}

function gTypeForm(lang: Lang, label: string, forms: FormEntry[]): TypedQ {
  const s = rand(forms);
  const prompt = lang === "pt"
    ? `Complete com a forma certa de <span class="k">${label}</span>: <span class="big">${s.pron} ___</span>`
    : `Complete with the right form of <span class="k">${label}</span>: <span class="big">${s.pron} ___</span>`;
  return { promptHTML: prompt, answer: s.form, speak: s.speak, word: s.form, wordpt: s.pron };
}

function gOrder(lang: Lang, pool: OrderSentence[]): OrderData {
  const s = rand(pool);
  const title = lang === "pt" ? `Monte a frase: “${s.meaning.pt}”` : `Build the sentence: “${s.meaning.en}”`;
  return { title, chunks: shuffle(s.chunks), answer: s.answer, single: true };
}

/* ---------- capítulo 1: eu, você & sein ---------- */
export function gPronounMeaning(lang: Lang): Question {
  const p = rand(pronouns);
  const opts = sample(pronouns, 3, p).map((o) => ({ label: o.meaning[lang], correct: false }));
  opts.push({ label: p.meaning[lang], correct: true });
  const prompt = lang === "pt" ? `O que significa <span class="big">${p.de}</span>?` : `What does <span class="big">${p.de}</span> mean?`;
  return q({ promptHTML: prompt, speak: p.de, options: shuffle(opts), word: p.de, wordpt: p.meaning.pt });
}

export const gSeinForm = (lang: Lang): Question => gFormMC(lang, "sein", seinForms);
export const gTypeSein = (lang: Lang): TypedQ => gTypeForm(lang, "sein", seinForms);
export const gOrderSein = (lang: Lang): OrderData => gOrder(lang, seinSentences);

/* ---------- capítulo 2: verbos regulares, haben, mudança de vogal ---------- */
const CH2_VERBS: Verb[] = [...regularVerbs, ...vowelChangeVerbs];
type PronounKey = "ich" | "du" | "er" | "wir" | "ihr" | "sie";
const PRONOUN_KEYS: PronounKey[] = ["ich", "du", "er", "wir", "ihr", "sie"];
const PRONOUN_LABEL: Record<PronounKey, string> = { ich: "ich", du: "du", er: "er / es / sie", wir: "wir", ihr: "ihr", sie: "sie / Sie" };

export function gVerbMeaning(lang: Lang): Question {
  const v = rand(CH2_VERBS);
  const opts = sample(CH2_VERBS, 3, v).map((o) => ({ label: o.meaning[lang], correct: false }));
  opts.push({ label: v.meaning[lang], correct: true });
  const prompt = lang === "pt" ? `O que significa <span class="big">${v.inf}</span>?` : `What does <span class="big">${v.inf}</span> mean?`;
  return q({ promptHTML: prompt, speak: v.inf, options: shuffle(opts), word: v.inf, wordpt: v.meaning.pt });
}

export function gVerbFormMC(lang: Lang): Question {
  const v = rand(CH2_VERBS);
  const key = rand(PRONOUN_KEYS);
  const correct = v.forms[key];
  const wrongPool = PRONOUN_KEYS.filter((k) => k !== key).map((k) => v.forms[k]);
  const wrong = sample([...new Set(wrongPool)], 3, correct);
  const opts = wrong.map((f) => ({ label: f, correct: false }));
  opts.push({ label: correct, correct: true });
  const prompt = lang === "pt"
    ? `Qual forma de <span class="k">${v.inf}</span> vai com <span class="big">${PRONOUN_LABEL[key]}</span>?`
    : `Which form of <span class="k">${v.inf}</span> goes with <span class="big">${PRONOUN_LABEL[key]}</span>?`;
  return q({ promptHTML: prompt, speak: `${PRONOUN_LABEL[key]} ${correct}`, options: shuffle(opts), word: correct, wordpt: v.inf });
}

export function gTypeVerbForm(lang: Lang): TypedQ {
  const v = rand(CH2_VERBS);
  const key = rand(PRONOUN_KEYS);
  const correct = v.forms[key];
  const prompt = lang === "pt"
    ? `Complete: <span class="big">${PRONOUN_LABEL[key]} ___</span> (${v.inf})`
    : `Complete: <span class="big">${PRONOUN_LABEL[key]} ___</span> (${v.inf})`;
  return { promptHTML: prompt, answer: correct, speak: `${PRONOUN_LABEL[key]} ${correct}`, word: correct, wordpt: v.inf };
}

export const gHabenForm = (lang: Lang): Question => gFormMC(lang, "haben", habenForms);
export const gTypeHaben = (lang: Lang): TypedQ => gTypeForm(lang, "haben", habenForms);
export const gOrderVerb = (lang: Lang): OrderData => gOrder(lang, verbSentences);
