import type { Lang } from "../../i18n/types";
import type { Profile } from "../../auth/AuthProvider";
import { CH_EU_VOCE_SEIN, CH_VERBOS_HABEN, CH_IMPERATIVO, CH_PERFEKT, CH_MODAIS, CH_GENERO_PLURAL, CH_CASOS } from "./exercises";
import { pronouns, seinForms, regularVerbs, vowelChangeVerbs, habenForms, imperativeVerbs, separableVerbs, perfektHabenRegular, perfektHabenIrregular, perfektSein, modalVerbs, nounsPlural, caseNouns } from "./vocab";

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
  [CH_IMPERATIVO]: [
    ["Komm bitte her!", "Vem cá, por favor!"],
    ["Ich stehe um sieben Uhr auf.", "Eu levanto às sete horas."],
    ["Kaufst du bitte Milch ein?", "Você compra leite, por favor?"],
    ["Rufen Sie mich bitte an!", "Me ligue, por favor! (formal)"],
  ],
  [CH_PERFEKT]: [
    ["Ich habe Deutsch gelernt.", "Eu aprendi alemão."],
    ["Wir haben Pizza gegessen.", "Nós comemos pizza."],
    ["Er ist nach Hause gegangen.", "Ele foi pra casa."],
    ["Hast du das Buch gelesen?", "Você leu o livro?"],
  ],
  [CH_MODAIS]: [
    ["Ich kann gut schwimmen.", "Eu sei nadar bem."],
    ["Ich möchte einen Kaffee, bitte.", "Eu gostaria de um café, por favor."],
    ["Du musst das nicht machen.", "Você não precisa fazer isso."],
    ["Darf ich hier rauchen?", "Posso fumar aqui?"],
  ],
  [CH_GENERO_PLURAL]: [
    ["Ich habe zwei Bücher.", "Eu tenho dois livros."],
    ["Die Äpfel sind frisch.", "As maçãs estão frescas."],
    ["Sie hat drei Kinder.", "Ela tem três filhos."],
    ["Die Türen sind offen.", "As portas estão abertas."],
  ],
  [CH_CASOS]: [
    ["Ich habe einen Hund.", "Eu tenho um cachorro."],
    ["Ich helfe dem Mann.", "Eu ajudo o homem."],
    ["Das Buch gehört der Frau.", "O livro pertence à mulher."],
    ["Ich nehme die Tasche.", "Eu pego a bolsa."],
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
  [CH_IMPERATIVO]: [
    ["Komm bitte her!", "Come here, please!"],
    ["Ich stehe um sieben Uhr auf.", "I get up at seven."],
    ["Kaufst du bitte Milch ein?", "Can you buy milk, please?"],
    ["Rufen Sie mich bitte an!", "Please call me! (formal)"],
  ],
  [CH_PERFEKT]: [
    ["Ich habe Deutsch gelernt.", "I learned German."],
    ["Wir haben Pizza gegessen.", "We ate pizza."],
    ["Er ist nach Hause gegangen.", "He went home."],
    ["Hast du das Buch gelesen?", "Did you read the book?"],
  ],
  [CH_MODAIS]: [
    ["Ich kann gut schwimmen.", "I can swim well."],
    ["Ich möchte einen Kaffee, bitte.", "I would like a coffee, please."],
    ["Du musst das nicht machen.", "You don't have to do that."],
    ["Darf ich hier rauchen?", "May I smoke here?"],
  ],
  [CH_GENERO_PLURAL]: [
    ["Ich habe zwei Bücher.", "I have two books."],
    ["Die Äpfel sind frisch.", "The apples are fresh."],
    ["Sie hat drei Kinder.", "She has three children."],
    ["Die Türen sind offen.", "The doors are open."],
  ],
  [CH_CASOS]: [
    ["Ich habe einen Hund.", "I have a dog."],
    ["Ich helfe dem Mann.", "I help the man."],
    ["Das Buch gehört der Frau.", "The book belongs to the woman."],
    ["Ich nehme die Tasche.", "I take the bag."],
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
  if (id === CH_IMPERATIVO) {
    return [
      ...imperativeVerbs.map((v) => ({ de: `${v.du}!`, pt: v.meaning[lang], emo: "❗" })),
      ...separableVerbs.map((v) => ({ de: v.inf, pt: v.meaning[lang], emo: "🧩" })),
    ];
  }
  if (id === CH_PERFEKT) {
    return [
      ...perfektHabenRegular.map((v) => ({ de: `${v.inf} → ${v.partizip}`, pt: v.meaning[lang], emo: "✅" })),
      ...perfektHabenIrregular.map((v) => ({ de: `${v.inf} → ${v.partizip}`, pt: v.meaning[lang], emo: "🔀" })),
      ...perfektSein.map((v) => ({ de: `${v.inf} → ${v.partizip}`, pt: v.meaning[lang], emo: "🚶" })),
    ];
  }
  if (id === CH_MODAIS) {
    return modalVerbs.map((v) => ({ de: `${v.inf} (${v.forms.ich})`, pt: v.meaning[lang], emo: "🧠" }));
  }
  if (id === CH_GENERO_PLURAL) {
    return nounsPlural.map((n) => ({ de: `${n.art} ${n.de} → die ${n.plural}`, pt: n.meaning[lang], emo: "🔢" }));
  }
  if (id === CH_CASOS) {
    return caseNouns.map((n) => ({ de: `${n.nom} / ${n.akk} / ${n.dat}`, pt: n.meaning[lang], emo: "📐" }));
  }
  return [];
}
