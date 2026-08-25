import type { Lang } from "../../i18n/types";
import type { Profile } from "../../auth/AuthProvider";
import { CH_EU_VOCE_SEIN } from "./exercises";
import { pronouns, seinForms } from "./vocab";

export interface Flash { de: string; pt: string; emo: string; }

const sentencesPT: Record<string, [string, string][]> = {
  [CH_EU_VOCE_SEIN]: [
    ["Ich bin Ralph.", "Eu sou o Ralph."],
    ["Wir sind Freunde.", "Nós somos amigos."],
    ["Bist du glücklich?", "Você está feliz?"],
    ["Er ist aus Berlin.", "Ele é de Berlim."],
  ],
};
const sentencesEN: Record<string, [string, string][]> = {
  [CH_EU_VOCE_SEIN]: [
    ["Ich bin Ralph.", "I am Ralph."],
    ["Wir sind Freunde.", "We are friends."],
    ["Bist du glücklich?", "Are you happy?"],
    ["Er ist aus Berlin.", "He is from Berlin."],
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
  return [];
}
