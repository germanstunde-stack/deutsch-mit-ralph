export interface TopicMeta { id: string; icon: string; name: string; cardTitle: string; explanationHTML: string; }

// Explicações curtas na Fase 1. As explicações completas (vogais, consoantes, der/die/das,
// du×Sie, padrões de cognatos etc.) do protótipo entram na Fase 2.
export const topics: TopicMeta[] = [
  { id: "alfabeto", icon: "🔤", name: "Alfabeto", cardTitle: "📖 Das Alphabet",
    explanationHTML: "<p>26 letras + <b class='de'>ä ö ü</b> (Umlaut) e o <b class='de'>ß</b> (som de “ss”). Nos exercícios, ouça a palavra e ache a letra que falta.</p>" },
  { id: "numeros", icon: "🔢", name: "Números", cardTitle: "📖 Die Zahlen 0–1000",
    explanationHTML: "<p>De 21 pra cima a unidade vem primeiro: <b class='de'>einundzwanzig</b> (21). Contas, relógio e mais exercícios chegam na Fase 2.</p>" },
  { id: "dias", icon: "📅", name: "Dias & Meses", cardTitle: "📖 Wochentage & Monate",
    explanationHTML: "<p>Dias terminam em <b class='de'>-tag</b>; meses quase iguais ao português. Calendário navegável na Fase 2.</p>" },
  { id: "cores", icon: "🎨", name: "Cores", cardTitle: "📖 Die Farben",
    explanationHTML: "<p>“<b class='de'>Das ist rot</b>” = isto é vermelho. Claro/escuro: hell-/dunkel-.</p>" },
  { id: "animais", icon: "🐾", name: "Animais", cardTitle: "📖 Die Tiere",
    explanationHTML: "<p>Todo substantivo tem artigo <b class='art der'>der</b>/<b class='art die'>die</b>/<b class='art das'>das</b> — aprenda junto com a palavra (a cor ajuda).</p>" },
  { id: "comidas", icon: "🍞", name: "Comidas", cardTitle: "📖 Das Essen",
    explanationHTML: "<p>Vocabulário de cozinha e mercado. Também com der/die/das.</p>" },
  { id: "cumprimentos", icon: "👋", name: "Cumprimentos", cardTitle: "📖 Grüße & Alltag",
    explanationHTML: "<p>Saudações e frases do dia a dia. Cuidado com <b class='de'>du</b> (informal) × <b class='de'>Sie</b> (formal).</p>" },
  { id: "tamanhos", icon: "📏", name: "Tamanhos", cardTitle: "📖 Gegenteile & Maße",
    explanationHTML: "<p>Opostos em par (groß/klein…) e medidas (kg, g, m, km, l, ml).</p>" },
  { id: "similar", icon: "🤝", name: "Similares", cardTitle: "📖 Cognatos & falsos amigos",
    explanationHTML: "<p>Milhares de palavras quase iguais! Padrões: -tion→-ção, -tät→-dade, -ie→-ia. Mas cuidado com os falsos amigos (Chef = chefe, não cozinheiro).</p>" },
];
