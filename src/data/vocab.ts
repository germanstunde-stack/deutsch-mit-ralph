// Vocabulário do A0 (portado do protótipo).
export type Article = "der" | "die" | "das";
export interface Noun { art: Article; de: string; pt: string; emo: string; }
export interface Word { de: string; pt: string; emo: string; }
export interface Color { de: string; pt: string; hex: string; }
export interface Pair { a: string; b: string; ptA: string; ptB: string; emoA: string; emoB: string; }
export interface Cognate { de: string; pt: string; emo: string; }
export interface FalseFriend { de: string; real: string; trap: string; emo: string; }

export const alphabet: [string, string][] = [["A","á"],["B","bê"],["C","tsê"],["D","dê"],["E","ê"],["F","éf"],["G","guê"],["H","rá"],["I","í"],["J","iót"],["K","cá"],["L","él"],["M","ém"],["N","én"],["O","ô"],["P","pê"],["Q","cú"],["R","ér"],["S","és"],["T","tê"],["U","ú"],["V","fau"],["W","vê"],["X","iks"],["Y","ípsilon"],["Z","tsét"],["Ä","é"],["Ö","œ"],["Ü","ü"],["ß","es-tsét"]];

export const colors: Color[] = [
  { de: "rot", pt: "vermelho", hex: "#FF5A5F" }, { de: "blau", pt: "azul", hex: "#3AA0FF" },
  { de: "gelb", pt: "amarelo", hex: "#FFC93C" }, { de: "grün", pt: "verde", hex: "#3FBF6F" },
  { de: "orange", pt: "laranja", hex: "#FF9F45" }, { de: "lila", pt: "roxo", hex: "#9B6DE0" },
  { de: "rosa", pt: "rosa", hex: "#FF8FC7" }, { de: "braun", pt: "marrom", hex: "#B07B4F" },
  { de: "grau", pt: "cinza", hex: "#9AA3AD" }, { de: "schwarz", pt: "preto", hex: "#2B2630" },
  { de: "weiß", pt: "branco", hex: "#FFFFFF" }, { de: "türkis", pt: "turquesa", hex: "#2BC8C8" },
  { de: "gold", pt: "dourado", hex: "#E5B23B" }, { de: "silber", pt: "prateado", hex: "#C7CCD1" },
];

function n(art: Article, de: string, pt: string, emo: string): Noun { return { art, de, pt, emo }; }

export const animals: Noun[] = [
  n("der","Hund","cachorro","🐶"), n("die","Katze","gato","🐱"), n("der","Vogel","pássaro","🐦"),
  n("das","Pferd","cavalo","🐴"), n("die","Kuh","vaca","🐮"), n("das","Schwein","porco","🐷"),
  n("das","Schaf","ovelha","🐑"), n("der","Fisch","peixe","🐟"), n("der","Hase","coelho","🐰"),
  n("der","Bär","urso","🐻"), n("die","Maus","rato","🐭"), n("der","Löwe","leão","🦁"),
  n("der","Elefant","elefante","🐘"), n("der","Affe","macaco","🐵"), n("die","Ente","pato","🦆"),
  n("der","Frosch","sapo","🐸"), n("das","Huhn","galinha","🐔"), n("die","Biene","abelha","🐝"),
  n("der","Pinguin","pinguim","🐧"), n("die","Schildkröte","tartaruga","🐢"), n("der","Tiger","tigre","🐯"), n("der","Wolf","lobo","🐺"),
];

export const food: Noun[] = [
  n("das","Brot","pão","🍞"), n("das","Wasser","água","💧"), n("der","Kaffee","café","☕"),
  n("die","Milch","leite","🥛"), n("der","Käse","queijo","🧀"), n("das","Ei","ovo","🥚"),
  n("der","Apfel","maçã","🍎"), n("die","Butter","manteiga","🧈"), n("das","Fleisch","carne","🥩"),
  n("das","Gemüse","legumes","🥦"), n("das","Salz","sal","🧂"), n("der","Zucker","açúcar","🍬"),
  n("der","Wein","vinho","🍷"), n("das","Bier","cerveja","🍺"), n("der","Reis","arroz","🍚"),
  n("die","Nudeln","macarrão","🍜"), n("die","Suppe","sopa","🍲"), n("der","Salat","salada","🥗"),
  n("das","Hähnchen","frango","🍗"), n("die","Kartoffel","batata","🥔"), n("die","Tomate","tomate","🍅"), n("die","Zwiebel","cebola","🧅"),
];

export const measures: Noun[] = [
  n("das","Kilogramm","quilograma (kg)","⚖️"), n("das","Gramm","grama (g)","🪶"), n("der","Meter","metro (m)","📏"),
  n("der","Kilometer","quilômetro (km)","🛣️"), n("der","Liter","litro (l)","🧴"), n("der","Milliliter","mililitro (ml)","💧"), n("der","Zentimeter","centímetro (cm)","📐"),
];

export const greet: Word[] = [
  { de: "Hallo", pt: "oi / olá", emo: "👋" }, { de: "Guten Morgen", pt: "bom dia", emo: "🌅" },
  { de: "Guten Tag", pt: "boa tarde / olá", emo: "🌞" }, { de: "Guten Abend", pt: "boa noite (chegando)", emo: "🌆" },
  { de: "Gute Nacht", pt: "boa noite (dormir)", emo: "🌙" }, { de: "Tschüss", pt: "tchau", emo: "👋" },
  { de: "Auf Wiedersehen", pt: "até logo", emo: "🤝" }, { de: "Danke", pt: "obrigado", emo: "🙏" },
  { de: "Bitte", pt: "por favor / de nada", emo: "😊" }, { de: "Ja", pt: "sim", emo: "✅" },
  { de: "Nein", pt: "não", emo: "❌" }, { de: "Entschuldigung", pt: "desculpa / licença", emo: "🙇" },
  { de: "Ich heiße…", pt: "meu nome é…", emo: "🧑‍🍳" }, { de: "Wie geht's?", pt: "como vai?", emo: "🙂" },
  { de: "Gut, danke", pt: "bem, obrigado", emo: "👍" }, { de: "Bis bald", pt: "até breve", emo: "👋" },
];

export const phrases: Word[] = [
  { de: "Wie spät ist es?", pt: "que horas são?", emo: "🕐" }, { de: "Wollen wir einen Kaffee trinken?", pt: "vamos tomar um café?", emo: "☕" },
  { de: "Wollen wir frühstücken?", pt: "vamos tomar café da manhã?", emo: "🥐" }, { de: "Wollen wir zu Mittag essen?", pt: "vamos almoçar?", emo: "🍽️" },
  { de: "Wollen wir einen Snack essen?", pt: "vamos lanchar?", emo: "🥪" }, { de: "Wollen wir zu Abend essen?", pt: "vamos jantar?", emo: "🍲" },
  { de: "Wie viel kostet das?", pt: "quanto custa?", emo: "💶" }, { de: "Ich verstehe nicht", pt: "não entendo", emo: "🤔" },
  { de: "Sprechen Sie Englisch?", pt: "você fala inglês?", emo: "🗣️" }, { de: "Wo ist die Toilette?", pt: "onde é o banheiro?", emo: "🚻" },
];

export const weekdays: Word[] = [
  { de: "Montag", pt: "segunda", emo: "🌙" }, { de: "Dienstag", pt: "terça", emo: "🔥" }, { de: "Mittwoch", pt: "quarta", emo: "🐫" },
  { de: "Donnerstag", pt: "quinta", emo: "⚡" }, { de: "Freitag", pt: "sexta", emo: "🎉" }, { de: "Samstag", pt: "sábado", emo: "🛌" }, { de: "Sonntag", pt: "domingo", emo: "☀️" },
];

export const daywords: Word[] = [
  { de: "heute", pt: "hoje", emo: "📍" }, { de: "morgen", pt: "amanhã", emo: "➡️" }, { de: "gestern", pt: "ontem", emo: "⬅️" }, { de: "das Wochenende", pt: "o fim de semana", emo: "🎈" },
];

export const months: [string, string][] = [["Januar","janeiro"],["Februar","fevereiro"],["März","março"],["April","abril"],["Mai","maio"],["Juni","junho"],["Juli","julho"],["August","agosto"],["September","setembro"],["Oktober","outubro"],["November","novembro"],["Dezember","dezembro"]];

export const opposites: Pair[] = [
  { a:"groß", b:"klein", ptA:"grande", ptB:"pequeno", emoA:"🐘", emoB:"🐭" },
  { a:"lang", b:"kurz", ptA:"longo", ptB:"curto", emoA:"📏", emoB:"✂️" },
  { a:"hoch", b:"niedrig", ptA:"alto", ptB:"baixo", emoA:"🏔️", emoB:"🕳️" },
  { a:"schnell", b:"langsam", ptA:"rápido", ptB:"devagar", emoA:"🐆", emoB:"🐌" },
  { a:"warm", b:"kalt", ptA:"quente", ptB:"frio", emoA:"🔥", emoB:"❄️" },
  { a:"dick", b:"dünn", ptA:"grosso", ptB:"fino", emoA:"🐷", emoB:"🐍" },
  { a:"voll", b:"leer", ptA:"cheio", ptB:"vazio", emoA:"🍺", emoB:"🥛" },
  { a:"schwer", b:"leicht", ptA:"pesado", ptB:"leve", emoA:"🪨", emoB:"🪶" },
  { a:"alt", b:"neu", ptA:"velho", ptB:"novo", emoA:"👴", emoB:"🐣" },
  { a:"laut", b:"leise", ptA:"alto (som)", ptB:"baixo (som)", emoA:"📢", emoB:"🤫" },
  { a:"gut", b:"schlecht", ptA:"bom", ptB:"ruim", emoA:"😀", emoB:"🙁" },
  { a:"hell", b:"dunkel", ptA:"claro", ptB:"escuro", emoA:"☀️", emoB:"🌑" },
];

export const cognates: Cognate[] = [
  {de:"Ventilator",pt:"ventilador",emo:"🌀"},{de:"Musik",pt:"música",emo:"🎵"},{de:"Kaktus",pt:"cacto",emo:"🌵"},
  {de:"Zirkulation",pt:"circulação",emo:"🔄"},{de:"Tragödie",pt:"tragédia",emo:"🎭"},{de:"relativ",pt:"relativo",emo:"⚖️"},
  {de:"effektiv",pt:"efetivo",emo:"✅"},{de:"Muskulatur",pt:"musculatura",emo:"💪"},{de:"Immunsystem",pt:"sistema imunológico",emo:"🛡️"},
  {de:"Etikette",pt:"etiqueta / boas maneiras",emo:"🎀"},{de:"Duell",pt:"duelo",emo:"⚔️"},{de:"stabil",pt:"estável",emo:"🧱"},
  {de:"Diskussion",pt:"discussão",emo:"💬"},{de:"kompetent",pt:"competente",emo:"🎯"},{de:"prekär",pt:"precário",emo:"⚠️"},
  {de:"Hypothese",pt:"hipótese",emo:"🔬"},{de:"Funktion",pt:"função",emo:"⚙️"},{de:"Dialog",pt:"diálogo",emo:"🗨️"},
  {de:"Telefon",pt:"telefone",emo:"📞"},{de:"Familie",pt:"família",emo:"👨‍👩‍👧"},{de:"Restaurant",pt:"restaurante",emo:"🍽️"},
  {de:"Problem",pt:"problema",emo:"❓"},{de:"Universität",pt:"universidade",emo:"🎓"},{de:"Information",pt:"informação",emo:"ℹ️"},
  {de:"Situation",pt:"situação",emo:"📍"},{de:"Moment",pt:"momento",emo:"⏱️"},
];

export const falseFriends: FalseFriend[] = [
  {de:"Tasse",real:"xícara",trap:"taça",emo:"☕"},{de:"Chef",real:"chefe / patrão",trap:"chef de cozinha",emo:"👔"},
  {de:"Termin",real:"compromisso / hora marcada",trap:"término (fim)",emo:"📅"},{de:"Rente",real:"aposentadoria",trap:"renda",emo:"👵"},
  {de:"Kostüm",real:"fantasia / traje",trap:"costume (hábito)",emo:"🎭"},{de:"Karton",real:"caixa de papelão",trap:"cartão",emo:"📦"},
  {de:"Mappe",real:"pasta / capa",trap:"mapa",emo:"📁"},{de:"Gymnasium",real:"colégio (escola)",trap:"ginásio de esportes",emo:"🏫"},
  {de:"Rat",real:"conselho",trap:"rato",emo:"💡"},{de:"eventuell",real:"possivelmente / talvez",trap:"eventualmente",emo:"🤔"},
  {de:"Novelle",real:"conto / novela literária",trap:"novela de TV",emo:"📖"},{de:"Kompromiss",real:"acordo / meio-termo",trap:"compromisso (dever)",emo:"🤝"},
];
