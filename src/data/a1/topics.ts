import type { Lang } from "../../i18n/types";
import type { TopicMeta } from "../topics";
import { CH_EU_VOCE_SEIN, CH_VERBOS_HABEN, CH_IMPERATIVO, CH_PERFEKT, CH_MODAIS } from "./exercises";

interface TopicMetaI18n { id: string; icon: string; name: Record<Lang, string>; cardTitle: Record<Lang, string>; explanationHTML: Record<Lang, string>; }

// Trilha do A1 seguindo a ordem oficial das 6 unidades do "Grammatik leicht A1"
// (A Verben & mehr, B Nomen & mehr, C Pronomen, D Artikelwörter, E Präpositionen,
// F Satz) — só o 1º capítulo está pronto; os outros 10 entram nas próximas
// entregas (ver plano aprovado / memória do projeto).
const TOPICS_I18N: TopicMetaI18n[] = [
  {
    id: CH_EU_VOCE_SEIN, icon: "🙋",
    name: { pt: "Eu, você & sein", en: "I, you & sein" },
    cardTitle: { pt: "📖 Ich, du und das Verb sein", en: "📖 Ich, du and the verb sein" },
    explanationHTML: {
      pt: "<p>Pronomes pessoais (ich, du, er...) e a conjugação do verbo <b class='de'>sein</b> (ser/estar) — a base de qualquer frase em alemão.</p>",
      en: "<p>Personal pronouns (ich, du, er...) and the conjugation of the verb <b class='de'>sein</b> (to be) — the foundation of every German sentence.</p>",
    },
  },
  {
    id: CH_VERBOS_HABEN, icon: "🗣️",
    name: { pt: "Verbos regulares & haben", en: "Regular verbs & haben" },
    cardTitle: { pt: "📖 Verben im Präsens", en: "📖 Verbs in the present tense" },
    explanationHTML: {
      pt: "<p>Conjugação regular no presente, o verbo <b class='de'>haben</b> (ter) e verbos que mudam de vogal (fahren, sehen, essen...).</p>",
      en: "<p>Regular present-tense conjugation, the verb <b class='de'>haben</b> (to have), and vowel-changing verbs (fahren, sehen, essen...).</p>",
    },
  },
  {
    id: CH_IMPERATIVO, icon: "❗",
    name: { pt: "Imperativo & separáveis", en: "Imperative & separable verbs" },
    cardTitle: { pt: "📖 Der Imperativ & trennbare Verben", en: "📖 The imperative & separable verbs" },
    explanationHTML: {
      pt: "<p>Como dar ordens/pedidos (du/ihr/Sie) e verbos com prefixo separável (aufstehen, einkaufen...) que manda o prefixo pro fim da frase.</p>",
      en: "<p>How to give orders/requests (du/ihr/Sie) and separable-prefix verbs (aufstehen, einkaufen...) that send the prefix to the end of the sentence.</p>",
    },
  },
  {
    id: CH_PERFEKT, icon: "⏪",
    name: { pt: "Perfekt — o passado", en: "Perfekt — the past" },
    cardTitle: { pt: "📖 Das Perfekt", en: "📖 The Perfekt tense" },
    explanationHTML: {
      pt: "<p>O passado do dia a dia: <b class='de'>haben</b>/<b class='de'>sein</b> conjugado + Partizip II no final da frase.</p>",
      en: "<p>The everyday past tense: conjugated <b class='de'>haben</b>/<b class='de'>sein</b> + Partizip II at the end of the sentence.</p>",
    },
  },
  {
    id: CH_MODAIS, icon: "🧠",
    name: { pt: "Verbos modais", en: "Modal verbs" },
    cardTitle: { pt: "📖 Die Modalverben", en: "📖 Modal verbs" },
    explanationHTML: {
      pt: "<p>können, müssen, wollen/möchten, dürfen, sollen — o infinitivo do verbo principal vai pro final da frase.</p>",
      en: "<p>können, müssen, wollen/möchten, dürfen, sollen — the main verb's infinitive moves to the end of the sentence.</p>",
    },
  },
];

export function topicsFor(lang: Lang): TopicMeta[] {
  return TOPICS_I18N.map((t) => ({ id: t.id, icon: t.icon, name: t.name[lang], cardTitle: t.cardTitle[lang], explanationHTML: t.explanationHTML[lang] }));
}
