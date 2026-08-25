import type { Lang } from "../../i18n/types";
import type { TopicMeta } from "../topics";
import { CH_EU_VOCE_SEIN } from "./exercises";

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
];

export function topicsFor(lang: Lang): TopicMeta[] {
  return TOPICS_I18N.map((t) => ({ id: t.id, icon: t.icon, name: t.name[lang], cardTitle: t.cardTitle[lang], explanationHTML: t.explanationHTML[lang] }));
}
