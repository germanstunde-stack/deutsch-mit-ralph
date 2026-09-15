// Os 26 cantões da Suíça.
//
// Chaveado pelo CÓDIGO de duas letras, não pelo nome: é neutro de língua (o
// mesmo cantão é Genf/Genève/Ginevra) e é o que casa com os contornos em
// cantonPaths.ts. O validador confere que as duas listas têm exatamente as
// mesmas 26 chaves — é isso que pega um Appenzell faltando.
//
// Atenção ao erro clássico: AI/AR e BS/BL são QUATRO cantões separados. A
// Constituição (Art. 1) diz 26, não "23 com meios-cantões".
//
// Nome alemão, capital, ano de adesão e línguas oficiais conferidos em
// de.wikipedia.org/wiki/Kanton_(Schweiz) (tabela oficial dos 26), acessado em
// 2026-09-15. População e área entram depois, com a fonte do BFS e o ano de
// referência gravado junto — população sem data não é fato.
import type { Loc } from "../loc";

export type CantonLang = "de" | "fr" | "it" | "rm";

export interface Canton {
  /** código oficial de duas letras — a chave, e o id do contorno no mapa */
  code: string;
  /** nome alemão, guardado uma vez; é o que a voz fala */
  de: string;
  /** forma consagrada em português, quando existe */
  pt?: string;
  /** Hauptort, em alemão */
  capital: string;
  /** ano de entrada na Confederação */
  joined: number;
  /** línguas oficiais — é o que torna "quantas línguas?" uma pergunta honesta */
  langs: CantonLang[];
  nota?: Loc;
}

export const cantons: Canton[] = [
  { code: "ZH", de: "Zürich", pt: "Zurique", capital: "Zürich", joined: 1351, langs: ["de"] },
  { code: "BE", de: "Bern", pt: "Berna", capital: "Bern", joined: 1353, langs: ["de", "fr"] },
  { code: "LU", de: "Luzern", pt: "Lucerna", capital: "Luzern", joined: 1332, langs: ["de"] },
  { code: "UR", de: "Uri", capital: "Altdorf", joined: 1291, langs: ["de"] },
  { code: "SZ", de: "Schwyz", capital: "Schwyz", joined: 1291, langs: ["de"] },
  { code: "OW", de: "Obwalden", capital: "Sarnen", joined: 1291, langs: ["de"] },
  { code: "NW", de: "Nidwalden", capital: "Stans", joined: 1291, langs: ["de"] },
  { code: "GL", de: "Glarus", capital: "Glarus", joined: 1352, langs: ["de"] },
  { code: "ZG", de: "Zug", capital: "Zug", joined: 1352, langs: ["de"] },
  { code: "FR", de: "Freiburg", pt: "Friburgo", capital: "Freiburg", joined: 1481, langs: ["fr", "de"] },
  { code: "SO", de: "Solothurn", capital: "Solothurn", joined: 1481, langs: ["de"] },
  { code: "BS", de: "Basel-Stadt", pt: "Basileia-Cidade", capital: "Basel", joined: 1501, langs: ["de"] },
  { code: "BL", de: "Basel-Landschaft", pt: "Basileia-Campo", capital: "Liestal", joined: 1501, langs: ["de"] },
  { code: "SH", de: "Schaffhausen", capital: "Schaffhausen", joined: 1501, langs: ["de"] },
  { code: "AR", de: "Appenzell Ausserrhoden", capital: "Herisau", joined: 1513, langs: ["de"] },
  { code: "AI", de: "Appenzell Innerrhoden", capital: "Appenzell", joined: 1513, langs: ["de"] },
  { code: "SG", de: "St. Gallen", pt: "São Galo", capital: "St. Gallen", joined: 1803, langs: ["de"] },
  { code: "GR", de: "Graubünden", pt: "Grisões", capital: "Chur", joined: 1803, langs: ["de", "rm", "it"] },
  { code: "AG", de: "Aargau", capital: "Aarau", joined: 1803, langs: ["de"] },
  { code: "TG", de: "Thurgau", capital: "Frauenfeld", joined: 1803, langs: ["de"] },
  { code: "TI", de: "Tessin", pt: "Ticino", capital: "Bellinzona", joined: 1803, langs: ["it"] },
  { code: "VD", de: "Waadt", pt: "Vaud", capital: "Lausanne", joined: 1803, langs: ["fr"] },
  { code: "VS", de: "Wallis", pt: "Valais", capital: "Sitten", joined: 1815, langs: ["fr", "de"] },
  { code: "NE", de: "Neuenburg", pt: "Neuchâtel", capital: "Neuenburg", joined: 1815, langs: ["fr"] },
  { code: "GE", de: "Genf", pt: "Genebra", capital: "Genf", joined: 1815, langs: ["fr"] },
  { code: "JU", de: "Jura", capital: "Delsberg", joined: 1979, langs: ["fr"] },
];

export const cantonByCode: Record<string, Canton> = Object.fromEntries(cantons.map((c) => [c.code, c]));

/** nome em português quando há forma consagrada, senão o alemão mesmo */
export const cantonNome = (c: Canton) => c.pt ?? c.de;
