import { alphabet, animals, food, colors, greet, phrases, weekdays, months, opposites, measures, cognates, falseFriends } from "./vocab";
import { numDE } from "../lib/numbers";

export interface Flash { de: string; pt: string; emo: string; }

export const sentences: Record<string, [string, string][]> = {
  alfabeto: [["Ich heiße Ralph.", "Meu nome é Ralph."], ["Wie schreibt man das?", "Como se escreve isso?"], ["Buchstabiere bitte!", "Soletre, por favor!"]],
  numeros: [["Ich bin dreißig Jahre alt.", "Tenho trinta anos."], ["Es ist drei Uhr.", "São três horas."], ["Das kostet zehn Franken.", "Custa dez francos."], ["Ich möchte zwei Kaffee.", "Quero dois cafés."]],
  dias: [["Heute ist Montag.", "Hoje é segunda."], ["Im August ist es warm.", "Em agosto faz calor."], ["Mein Geburtstag ist im Mai.", "Meu aniversário é em maio."], ["Bis morgen!", "Até amanhã!"]],
  cores: [["Der Apfel ist rot.", "A maçã é vermelha."], ["Der Himmel ist blau.", "O céu é azul."], ["Das Gras ist grün.", "A grama é verde."], ["Die Katze ist schwarz.", "O gato é preto."]],
  animais: [["Der Hund ist groß.", "O cachorro é grande."], ["Die Katze ist klein.", "O gato é pequeno."], ["Das Pferd läuft schnell.", "O cavalo corre rápido."], ["Der Vogel singt.", "O pássaro canta."]],
  comidas: [["Das Brot ist frisch.", "O pão está fresco."], ["Der Kaffee ist heiß.", "O café está quente."], ["Ich esse einen Apfel.", "Eu como uma maçã."], ["Der Wein ist gut.", "O vinho é bom."]],
  cumprimentos: [["Guten Morgen! Wie geht's?", "Bom dia! Como vai?"], ["Danke, gut. Und dir?", "Bem, obrigado. E você?"], ["Ich hätte gern einen Kaffee.", "Eu gostaria de um café."], ["Tschüss, bis bald!", "Tchau, até breve!"]],
  tamanhos: [["Der Elefant ist groß.", "O elefante é grande."], ["Ich kaufe ein Kilo Tomaten.", "Compro um quilo de tomates."], ["Die Flasche hat einen Liter.", "A garrafa tem um litro."], ["Es sind zehn Kilometer.", "São dez quilômetros."]],
  similar: [["Ich habe ein Problem.", "Tenho um problema."], ["Die Musik ist gut.", "A música é boa."], ["Der Chef ist im Restaurant.", "O chefe está no restaurante."], ["Ich habe einen Termin.", "Tenho um compromisso."]],
};

export function deckForTopic(id: string): Flash[] {
  switch (id) {
    case "alfabeto": return alphabet.map(([l, n]) => ({ de: l, pt: "“" + n + "”", emo: "🔤" }));
    case "numeros": return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 20, 21, 30, 47, 100, 345, 1000].map((n) => ({ de: numDE(n), pt: String(n), emo: "🔢" }));
    case "dias": return [...weekdays.map((d) => ({ de: d.de, pt: d.pt + "-feira", emo: d.emo })), ...months.map(([de, pt]) => ({ de, pt, emo: "📅" }))];
    case "cores": return colors.map((c) => ({ de: c.de, pt: c.pt, emo: "🎨" }));
    case "animais": return animals.map((a) => ({ de: a.art + " " + a.de, pt: a.pt, emo: a.emo }));
    case "comidas": return food.map((a) => ({ de: a.art + " " + a.de, pt: a.pt, emo: a.emo }));
    case "cumprimentos": return [...greet.map((g) => ({ de: g.de.replace("…", ""), pt: g.pt, emo: g.emo })), ...phrases.map((p) => ({ de: p.de, pt: p.pt, emo: p.emo }))];
    case "tamanhos": return [...opposites.map((p) => ({ de: p.a + " ↔ " + p.b, pt: p.ptA + " / " + p.ptB, emo: p.emoA + p.emoB })), ...measures.map((m) => ({ de: m.art + " " + m.de, pt: m.pt, emo: m.emo }))];
    case "similar": return [...cognates.map((c) => ({ de: c.de, pt: c.pt, emo: c.emo })), ...falseFriends.map((f) => ({ de: f.de, pt: f.real + " (≠ " + f.trap + ")", emo: f.emo }))];
    default: return [];
  }
}
