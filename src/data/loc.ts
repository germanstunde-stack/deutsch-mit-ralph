// Texto de apoio traduzível.
//
// `en` é OPCIONAL de propósito: o conteúdo novo (Geografia, História, os textos
// do A1) nasce só em português, e o que ainda não foi traduzido cai no
// português em vez de sumir. Assim acrescentar inglês depois é preencher campo,
// sem refatorar nada nem mudar uma assinatura.
//
// Regra que anda junto: ALEMÃO NUNCA ENTRA AQUI. O alemão é um campo próprio,
// guardado uma vez, e o renderizador é (dado, lang) => string. O jeito antigo
// (Record<Lang,string> com o alemão dentro) guarda a mesma frase alemã duas
// vezes, nada verifica se as duas batem, e a regra do ß só varre uma delas.
import type { Lang } from "../i18n/types";

export interface Loc { pt: string; en?: string }

export const loc = (l: Loc, lang: Lang): string => (lang === "en" ? l.en ?? l.pt : l.pt);
