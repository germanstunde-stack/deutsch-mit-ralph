// Registro de módulos: camada fina que deixa App.tsx/TopicView.tsx/Prova.tsx
// genéricos em relação a qual nível está ativo. Nenhum arquivo do A0 é
// modificado — moduleA0 só re-exporta o que já existe.
import type { Lang } from "../i18n/types";
import type { Profile } from "../auth/AuthProvider";
import type { ExSpec } from "./exercises";
import type { TopicMeta } from "./topics";
import type { Flash } from "./extras";
import type { CardsData } from "./a1/cards";

import { topics as topicsA0 } from "./topics";
import { exSpecsForTopic as exSpecsForTopicA0, examSpecsA0, EXAM_PARTS as EXAM_PARTS_A0, EXAM_TOTAL as EXAM_TOTAL_A0 } from "./exercises";
import { explanations as explanationsA0 } from "./explanations";
import { sentencesForTopic as sentencesForTopicA0, deckForTopic as deckForTopicA0 } from "./extras";
import { cardsForTopicA0 } from "../components/Cards";

import { topicsFor as topicsForA1 } from "./a1/topics";
import { exSpecsForTopic as exSpecsForTopicA1, examSpecsFor as examSpecsForA1, examPartsFor as examPartsForA1, EXAM_TOTAL as EXAM_TOTAL_A1 } from "./a1/exercises";
import { explanationsFor as explanationsForA1 } from "./a1/explanations";
import { sentencesForTopic as sentencesForTopicA1, deckForTopic as deckForTopicA1 } from "./a1/extras";
import { cardsForTopic as cardsForTopicA1 } from "./a1/cards";

export interface ModuleDef {
  id: string;
  topicsFor: (lang: Lang) => TopicMeta[];
  exSpecsForTopic: (id: string, lang: Lang, count?: number) => ExSpec[];
  examSpecsFor: (lang: Lang) => ExSpec[];
  examPartsFor: (lang: Lang) => { label: string; count: number }[];
  examTotal: number;
  explanationsFor: (lang: Lang) => Record<string, string>;
  sentencesForTopic: (id: string, profile: Profile | null, lang: Lang) => [string, string][];
  deckForTopic: (id: string, lang: Lang) => Flash[];
  cardsForTopic: (id: string, lang: Lang) => CardsData;
}

const moduleA0: ModuleDef = {
  id: "A0",
  topicsFor: () => topicsA0,
  exSpecsForTopic: (id, _lang, count) => exSpecsForTopicA0(id, count),
  examSpecsFor: () => examSpecsA0(),
  examPartsFor: () => EXAM_PARTS_A0,
  examTotal: EXAM_TOTAL_A0,
  explanationsFor: () => explanationsA0,
  sentencesForTopic: (id, profile) => sentencesForTopicA0(id, profile),
  deckForTopic: (id) => deckForTopicA0(id),
  cardsForTopic: (id) => cardsForTopicA0(id),
};

const moduleA1: ModuleDef = {
  id: "A1",
  topicsFor: topicsForA1,
  exSpecsForTopic: exSpecsForTopicA1,
  examSpecsFor: examSpecsForA1,
  examPartsFor: examPartsForA1,
  examTotal: EXAM_TOTAL_A1,
  explanationsFor: explanationsForA1,
  sentencesForTopic: sentencesForTopicA1,
  deckForTopic: deckForTopicA1,
  cardsForTopic: cardsForTopicA1,
};

export const MODULES: Record<string, ModuleDef> = { A0: moduleA0, A1: moduleA1 };
