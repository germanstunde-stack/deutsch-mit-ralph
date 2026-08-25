import { rand, sample, shuffle, type Question } from "../generators";
import type { TypedQ, OrderData } from "../exercises";
import type { Lang } from "../../i18n/types";
import { pronouns, seinForms, seinSentences } from "./vocab";

let uid = 0;
function q(x: Omit<Question, "key">): Question { return { key: "a1q" + uid++, ...x }; }

const T = {
  pt: {
    pronounMeaning: (de: string) => `O que significa <span class="big">${de}</span>?`,
    seinForm: (pron: string) => `Qual forma de <span class="k">sein</span> vai com <span class="big">${pron}</span>?`,
    typeSein: (pron: string) => `Complete com a forma certa de <span class="k">sein</span>: <span class="big">${pron} ___</span>`,
    order: (meaning: string) => `Monte a frase: “${meaning}”`,
  },
  en: {
    pronounMeaning: (de: string) => `What does <span class="big">${de}</span> mean?`,
    seinForm: (pron: string) => `Which form of <span class="k">sein</span> goes with <span class="big">${pron}</span>?`,
    typeSein: (pron: string) => `Complete with the right form of <span class="k">sein</span>: <span class="big">${pron} ___</span>`,
    order: (meaning: string) => `Build the sentence: “${meaning}”`,
  },
} as const;

export function gPronounMeaning(lang: Lang): Question {
  const p = rand(pronouns);
  const opts = sample(pronouns, 3, p).map((o) => ({ label: o.meaning[lang], correct: false }));
  opts.push({ label: p.meaning[lang], correct: true });
  return q({ promptHTML: T[lang].pronounMeaning(p.de), speak: p.de, options: shuffle(opts), word: p.de, wordpt: p.meaning.pt });
}

export function gSeinForm(lang: Lang): Question {
  const s = rand(seinForms);
  const uniqueForms = seinForms.map((f) => f.form).filter((f, i, a) => a.indexOf(f) === i);
  const wrong = sample(uniqueForms, 3, s.form);
  const opts = wrong.map((f) => ({ label: f, correct: false }));
  opts.push({ label: s.form, correct: true });
  return q({ promptHTML: T[lang].seinForm(s.pron), speak: `${s.pron} ${s.form}`, options: shuffle(opts), word: s.form, wordpt: s.pron });
}

export function gTypeSein(lang: Lang): TypedQ {
  const s = rand(seinForms);
  return { promptHTML: T[lang].typeSein(s.pron), answer: s.form, speak: `${s.pron} ${s.form}`, word: s.form, wordpt: s.pron };
}

export function gOrderSein(lang: Lang): OrderData {
  const s = rand(seinSentences);
  return { title: T[lang].order(s.meaning[lang]), chunks: shuffle(s.chunks), answer: s.answer, single: true };
}

export function allA1Gens(lang: Lang): Array<() => Question> {
  return [() => gPronounMeaning(lang), () => gSeinForm(lang)];
}
