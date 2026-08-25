import type { Lang } from "../../i18n/types";
import type { Profile } from "../../auth/AuthProvider";
import { CH_EU_VOCE_SEIN, CH_VERBOS_HABEN, CH_IMPERATIVO, CH_PERFEKT, CH_MODAIS, CH_GENERO_PLURAL, CH_CASOS, CH_PRONOMES, CH_ARTIGOS, CH_PREPOSICOES, CH_PERGUNTAS } from "./exercises";
import { pronouns, seinForms, regularVerbs, vowelChangeVerbs, habenForms, imperativeVerbs, separableVerbs, perfektHabenRegular, perfektHabenIrregular, perfektSein, modalVerbs, nounsPlural, caseNouns, personalPronouns, indefPronouns, possessives, prepositions, questionWords, connectors } from "./vocab";

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
  [CH_PRONOMES]: [
    ["Ich liebe dich.", "Eu te amo."],
    ["Kannst du mir helfen?", "Você pode me ajudar?"],
    ["Das gefällt mir sehr.", "Eu gosto muito disso."],
    ["Man spricht hier Deutsch.", "Fala-se alemão aqui."],
  ],
  [CH_ARTIGOS]: [
    ["Mein Vater ist Lehrer.", "Meu pai é professor."],
    ["Ihre Mutter ist nett.", "A mãe dela é legal."],
    ["Ist das dein Auto?", "Esse é o seu carro?"],
    ["Unsere Schwester wohnt in Berlin.", "Nossa irmã mora em Berlim."],
  ],
  [CH_PREPOSICOES]: [
    ["Ich komme aus Brasilien.", "Eu venho do Brasil."],
    ["Wir gehen ins Kino.", "Nós vamos ao cinema."],
    ["Ich fahre mit dem Auto.", "Eu vou de carro."],
    ["Am Wochenende schlafe ich lange.", "No fim de semana eu durmo até tarde."],
  ],
  [CH_PERGUNTAS]: [
    ["Wie heißt du?", "Como você se chama?"],
    ["Woher kommst du?", "De onde você vem?"],
    ["Ich komme nicht, denn ich bin krank.", "Eu não venho, porque estou doente."],
    ["Möchtest du Kaffee oder Tee?", "Você quer café ou chá?"],
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
  [CH_PRONOMES]: [
    ["Ich liebe dich.", "I love you."],
    ["Kannst du mir helfen?", "Can you help me?"],
    ["Das gefällt mir sehr.", "I like that a lot."],
    ["Man spricht hier Deutsch.", "German is spoken here."],
  ],
  [CH_ARTIGOS]: [
    ["Mein Vater ist Lehrer.", "My father is a teacher."],
    ["Ihre Mutter ist nett.", "Her mother is nice."],
    ["Ist das dein Auto?", "Is that your car?"],
    ["Unsere Schwester wohnt in Berlin.", "Our sister lives in Berlin."],
  ],
  [CH_PREPOSICOES]: [
    ["Ich komme aus Brasilien.", "I come from Brazil."],
    ["Wir gehen ins Kino.", "We're going to the cinema."],
    ["Ich fahre mit dem Auto.", "I go by car."],
    ["Am Wochenende schlafe ich lange.", "On the weekend I sleep in."],
  ],
  [CH_PERGUNTAS]: [
    ["Wie heißt du?", "What is your name?"],
    ["Woher kommst du?", "Where are you from?"],
    ["Ich komme nicht, denn ich bin krank.", "I am not coming, because I am sick."],
    ["Möchtest du Kaffee oder Tee?", "Do you want coffee or tea?"],
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
  if (id === CH_PRONOMES) {
    return [
      ...personalPronouns.map((p) => ({ de: `${p.nom} → ${p.akk} / ${p.dat}`, pt: p.meaning[lang], emo: "👤" })),
      ...indefPronouns.map((w) => ({ de: w.de, pt: w.meaning[lang], emo: "❓" })),
    ];
  }
  if (id === CH_ARTIGOS) {
    return possessives.map((p) => ({ de: `${p.stem} (${p.pronoun})`, pt: p.meaning[lang], emo: "🏷️" }));
  }
  if (id === CH_PREPOSICOES) {
    return prepositions.map((p) => ({ de: `${p.de} — ${p.example}`, pt: p.meaning[lang], emo: "🧭" }));
  }
  if (id === CH_PERGUNTAS) {
    return [
      ...questionWords.map((w) => ({ de: w.de, pt: w.meaning[lang], emo: "❓" })),
      ...connectors.map((c) => ({ de: c.de, pt: c.meaning[lang], emo: "🔗" })),
    ];
  }
  return [];
}
