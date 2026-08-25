import type { Lang } from "../../i18n/types";
import type { Profile } from "../../auth/AuthProvider";
import { CH_EU_VOCE_SEIN, CH_VERBOS_HABEN } from "./exercises";
import { pronouns, seinForms, regularVerbs, vowelChangeVerbs, habenForms } from "./vocab";

export interface Flash { de: string; pt: string; emo: string; }

const sentencesPT: Record<string, [string, string][]> = {
  [CH_EU_VOCE_SEIN]: [
    ["Ich bin Ralph.", "Eu sou o Ralph."],
    ["Wir sind Freunde.", "Nós somos amigos."],
    ["Bist du glücklich?", "Você está feliz?"],
    ["Er ist aus Berlin.", "Ele é de Berlim."],
  ],
  [CH_VERBOS_HABEN]: [
    ["Ich komme aus Brasilien.", "Eu venho do Brasil."],
    ["Wir wohnen in Berlin.", "Nós moramos em Berlim."],
    ["Er hat einen Hund.", "Ele tem um cachorro."],
    ["Sprichst du Deutsch?", "Você fala alemão?"],
    ["Sie isst gern Pizza.", "Ela come pizza com gosto."],
  ],
};
const sentencesEN: Record<string, [string, string][]> = {
  [CH_EU_VOCE_SEIN]: [
    ["Ich bin Ralph.", "I am Ralph."],
    ["Wir sind Freunde.", "We are friends."],
    ["Bist du glücklich?", "Are you happy?"],
    ["Er ist aus Berlin.", "He is from Berlin."],
  ],
  [CH_VERBOS_HABEN]: [
    ["Ich komme aus Brasilien.", "I come from Brazil."],
    ["Wir wohnen in Berlin.", "We live in Berlin."],
    ["Er hat einen Hund.", "He has a dog."],
    ["Sprichst du Deutsch?", "Do you speak German?"],
    ["Sie isst gern Pizza.", "She likes eating pizza."],
  ],
};

// Personaliza a 1ª frase do capítulo com o apelido do usuário logado, igual
// ao padrão do A0 (sentencesForTopic em src/data/extras.ts).
export function sentencesForTopic(id: string, profile: Profile | null, lang: Lang): [string, string][] {
  const base = (lang === "pt" ? sentencesPT : sentencesEN)[id] ?? [];
  if (id === CH_EU_VOCE_SEIN && profile?.display_name) {
    const nome = profile.display_name;
    const first: [string, string] = lang === "pt" ? [`Ich bin ${nome}.`, `Eu sou o(a) ${nome}.`] : [`Ich bin ${nome}.`, `I am ${nome}.`];
    return [first, ...base.slice(1)];
  }
  return base;
}

export function deckForTopic(id: string, lang: Lang): Flash[] {
  if (id === CH_EU_VOCE_SEIN) {
    return [
      ...pronouns.map((p) => ({ de: p.de, pt: p.meaning[lang], emo: "🙋" })),
      ...seinForms.map((s) => ({ de: `${s.pron} ${s.form}`, pt: s.meaning[lang], emo: "🧑‍🤝‍🧑" })),
    ];
  }
  if (id === CH_VERBOS_HABEN) {
    return [
      ...regularVerbs.map((v) => ({ de: v.inf, pt: v.meaning[lang], emo: "🔤" })),
      ...vowelChangeVerbs.map((v) => ({ de: v.inf, pt: v.meaning[lang], emo: "🔀" })),
      ...habenForms.map((h) => ({ de: `${h.pron} ${h.form}`, pt: h.meaning[lang], emo: "🎒" })),
    ];
  }
  return [];
}
