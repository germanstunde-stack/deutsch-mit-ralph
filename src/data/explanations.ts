// Explicações completas do A0 (portadas do protótipo HTML v10).
// Palavras com data-say são faladas ao clicar (delegação no TopicView).
export const explanations: Record<string, string> = {
  alfabeto:
    '<p>O alemão usa as mesmas 26 letras + <b class="de">ä ö ü</b> (Umlaut) e o <b class="de">ß</b> (“eszett”, som de “ss”).</p>' +
    '<h3>Vogais (Vokale)</h3><p><span class="de" data-say="a e i o u">a e i o u</span> podem ser <b>curtas ou longas</b>. As Umlaut mudam o som:</p>' +
    '<table class="br"><tr><td>ä</td><td>como “é” de <i>pé</i> — <span class="de" data-say="Käse">Käse</span> (queijo)</td></tr><tr><td>ö</td><td>“ê” com boca de “ô” — <span class="de" data-say="schön">schön</span> (bonito)</td></tr><tr><td>ü</td><td>“i” com bico de “u” — <span class="de" data-say="fünf">fünf</span> (cinco)</td></tr></table>' +
    '<h3>Consoantes que mudam</h3><table class="br"><tr><td>W</td><td>som de “V” — <span class="de" data-say="Wasser">Wasser</span> (água)</td></tr><tr><td>V</td><td>som de “F” — <span class="de" data-say="Vogel">Vogel</span> (pássaro)</td></tr><tr><td>Z</td><td>som de “TS” — <span class="de" data-say="zwei">zwei</span> (dois)</td></tr><tr><td>S</td><td>“Z” antes de vogal — <span class="de" data-say="sieben">sieben</span> (sete)</td></tr><tr><td>J</td><td>som de “I” — <span class="de" data-say="ja">ja</span> (sim)</td></tr><tr><td>Sch</td><td>som de “X” — <span class="de" data-say="Schaf">Schaf</span> (ovelha)</td></tr><tr><td>ß</td><td>som de “SS” — <span class="de" data-say="weiß">weiß</span> (branco)</td></tr></table>' +
    '<h3>⚠️ Erros comuns de brasileiro</h3><ul>' +
    '<li><b>H sopra!</b> Não é mudo: <span class="de" data-say="Hallo">Hallo</span> (olá) ≈ “Rálo” com ar.</li>' +
    '<li><b>R na garganta</b>, não o “r” de <i>caro</i>: <span class="de" data-say="rot">rot</span> (vermelho).</li>' +
    '<li><b>Não nasalize:</b> <span class="de" data-say="ein">ein</span> (um) = “áin”, não “ãin”.</li>' +
    '<li><b>eu = “ói”:</b> <span class="de" data-say="Deutsch">Deutsch</span> (alemão) = “dóitch”.</li>' +
    '<li><b>V ≠ W:</b> V soa “f”, W soa “v”. Não troque.</li>' +
    '<li><b>-e final é fraco</b> (schwa): <span class="de" data-say="Katze">Katze</span> (gato) ≈ “cátse”.</li></ul>' +
    '<h3>📐 Primeiras regras de gramática</h3><ul>' +
    '<li><b>Todo substantivo com MAIÚSCULA:</b> <span class="de">Hund, Katze, Brot</span> — sempre!</li>' +
    '<li><b>Cada substantivo tem gênero:</b> <b class="art der">der</b>/<b class="art die">die</b>/<b class="art das">das</b>.</li>' +
    '<li><b>Verbo “ser/estar” (sein):</b> <span class="de" data-say="ich bin">ich bin</span> (eu sou), <span class="de" data-say="du bist">du bist</span> (você é), <span class="de" data-say="er ist">er/sie ist</span> (ele/ela é).</li>' +
    '<li><b>Negação:</b> <span class="de" data-say="nicht">nicht</span> (não) e <span class="de" data-say="kein">kein</span> (nenhum).</li></ul>',

  numeros:
    '<p>Os números são a base de tudo — horas, preços, idade.</p><h3>Blocos pra decorar</h3><p><span class="de" data-say="null">0–12</span> são únicos: <span class="de" data-say="null">null</span> (0), <span class="de" data-say="eins">eins</span> (1)… <span class="de" data-say="zwölf">zwölf</span> (12).</p>' +
    '<h3>13 a 19 = unidade + zehn</h3><p><span class="de" data-say="dreizehn">dreizehn</span> (13). ⚠️ <span class="de" data-say="sechzehn">sechzehn</span> (16, sem o “s”) e <span class="de" data-say="siebzehn">siebzehn</span> (17, sem o “en”).</p>' +
    '<h3>⚠️ O “und” invertido</h3><p>De 21 pra cima, a <b>unidade primeiro</b> + <span class="k">und</span> + dezena: <span class="de" data-say="einundzwanzig">einundzwanzig</span> (21 = “um-e-vinte”), <span class="de" data-say="siebenundvierzig">siebenundvierzig</span> (47). Erro nº 1 de brasileiro.</p>' +
    '<h3>Centenas & mil</h3><p><span class="de" data-say="hundert">hundert</span> (100), <span class="de" data-say="tausend">tausend</span> (1000). E <span class="de" data-say="eins">eins</span> vira <span class="de" data-say="ein">ein</span> nos compostos.</p>' +
    '<h3>No dia a dia</h3><p>Idade: <span class="de" data-say="Ich bin dreißig Jahre alt">Ich bin dreißig Jahre alt</span> (tenho 30 anos). Preço: <span class="de" data-say="Das kostet zehn Franken">Das kostet zehn Franken</span> (custa 10 francos).</p>' +
    '<div class="note">🔧 Contas faladas, relógio e calendário chegam na Fase 2b.</div>',

  dias:
    '<p>Dias e meses são <b>substantivos</b> — vêm sempre com <b>maiúscula</b>.</p><h3>Os dias (Wochentage)</h3><p>Terminam em <span class="k">-tag</span> (=dia): <span class="de" data-say="Montag">Montag</span> (segunda), <span class="de" data-say="Dienstag">Dienstag</span> (terça), <span class="de" data-say="Mittwoch">Mittwoch</span> (quarta)… Na Europa a semana <b>começa na segunda</b>.</p>' +
    '<h3>“na segunda”, “em maio”</h3><p>Dia usa <span class="k">am</span>: <span class="de" data-say="am Montag">am Montag</span> (na segunda). Mês usa <span class="k">im</span>: <span class="de" data-say="im Mai">im Mai</span> (em maio).</p>' +
    '<h3>Hoje, amanhã, ontem</h3><p><span class="de" data-say="heute">heute</span> (hoje), <span class="de" data-say="morgen">morgen</span> (amanhã), <span class="de" data-say="gestern">gestern</span> (ontem).</p>' +
    '<h3>Os meses (Monate)</h3><p>Quase iguais ao português — <span class="de" data-say="Januar">Januar</span>, <span class="de" data-say="Februar">Februar</span>, <span class="de" data-say="März">März</span>…</p>' +
    '<div class="note">📅 Calendário navegável chega na Fase 2b.</div>',

  cores:
    '<p>Cor é <span class="de" data-say="die Farbe">die Farbe</span>. Pergunta: <span class="de" data-say="Welche Farbe ist das?">Welche Farbe ist das?</span> (que cor é essa?).</p>' +
    '<h3>Dizer a cor</h3><p><span class="k">Das ist</span> + cor — <span class="de" data-say="Das ist rot">Das ist rot</span> (isto é vermelho), <span class="de" data-say="Das ist blau">Das ist blau</span> (isto é azul).</p>' +
    '<h3>Claro & escuro</h3><p><span class="k">hell-</span> (claro) / <span class="k">dunkel-</span> (escuro): <span class="de" data-say="hellblau">hellblau</span> (azul claro), <span class="de" data-say="dunkelgrün">dunkelgrün</span> (verde escuro).</p>' +
    '<h3>💡 Dica</h3><p>Três cores <b>nunca mudam</b>: <span class="de" data-say="rosa">rosa</span>, <span class="de" data-say="lila">lila</span>, <span class="de" data-say="orange">orange</span>.</p>',

  animais:
    '<p>Aqui entra o coração do alemão: os <b>artigos</b>. Todo substantivo tem um <b>gênero gramatical</b>.</p>' +
    '<h3>Os três artigos (= “o/a”)</h3><p><b class="art der">der</b> (masculino), <b class="art die">die</b> (feminino), <b class="art das">das</b> (neutro). O que muda é o gênero da <i>palavra</i>, não do bicho.</p>' +
    '<h3>⚠️ Não é o sexo do animal!</h3><p>Por isso <span class="de" data-say="das Mädchen">das Mädchen</span> (a menina) é <b class="art das">das</b> (neutro!) e <span class="de" data-say="das Pferd">das Pferd</span> (o cavalo) também. Adivinhar pelo “macho/fêmea” não funciona.</p>' +
    '<h3>Por que importa</h3><p>O artigo muda outras palavras da frase. Regra de ouro: <b>aprenda a palavra JUNTO com o artigo</b> — nunca “Hund”, sempre “<b class="art der">der</b> Hund”.</p>' +
    '<h3>“um/uma”</h3><p><span class="de" data-say="ein Hund">ein Hund</span> (um cachorro) e <span class="de" data-say="eine Katze">eine Katze</span> (uma gata).</p>' +
    '<h3>Plural</h3><p>No plural quase tudo vira <b class="art die">die</b>: <span class="de" data-say="die Hunde">die Hunde</span>, <span class="de" data-say="die Katzen">die Katzen</span>.</p>',

  comidas:
    '<p>Seu terreno, chef 🧑‍🍳.</p><h3>Artigos de novo</h3><p><span class="de" data-say="der Käse">der Käse</span> (o queijo), <span class="de" data-say="die Milch">die Milch</span> (o leite), <span class="de" data-say="das Brot">das Brot</span> (o pão).</p>' +
    '<h3>Pedir & elogiar</h3><p><span class="de" data-say="Ich möchte einen Kaffee">Ich möchte einen Kaffee</span> (quero um café), <span class="de" data-say="Das ist lecker">Das ist lecker</span> (está gostoso), <span class="de" data-say="Guten Appetit">Guten Appetit!</span> (bom apetite).</p>' +
    '<h3>Na mesa</h3><p><span class="de" data-say="Ich habe Hunger">Ich habe Hunger</span> (estou com fome), <span class="de" data-say="Die Rechnung, bitte">Die Rechnung, bitte</span> (a conta, por favor).</p>',

  cumprimentos:
    '<p>As fórmulas do dia a dia — e uma regra cultural importante.</p><h3>⚠️ du × Sie</h3><p>Com amigos: <span class="de" data-say="du">du</span> (você, informal). Com estranhos, clientes, no trabalho: <span class="de" data-say="Sie">Sie</span> (formal). Importa muito na Suíça!</p>' +
    '<p>Informal: <span class="de" data-say="Wie geht es dir?">Wie geht es dir?</span> (como vai?). Formal: <span class="de" data-say="Wie geht es Ihnen?">Wie geht es Ihnen?</span> (como o senhor está?).</p>' +
    '<h3>Bom dia por horário</h3><p><span class="de" data-say="Guten Morgen">Guten Morgen</span> (de manhã), <span class="de" data-say="Guten Tag">Guten Tag</span> (dia/tarde), <span class="de" data-say="Guten Abend">Guten Abend</span> (ao chegar à noite), <span class="de" data-say="Gute Nacht">Gute Nacht</span> (ao dormir).</p>' +
    '<h3>Se apresentar</h3><p><span class="de" data-say="Ich heiße Ralph">Ich heiße Ralph</span> ou <span class="de" data-say="Ich bin Ralph">Ich bin Ralph</span>.</p>' +
    '<div class="dialog">— <b>Hallo! Wie geht\'s?</b> (Oi! Como vai?)<br>— <b>Gut, danke! Und dir?</b> (Bem! E você?)</div>',

  tamanhos:
    '<p>Adjetivos que descrevem as coisas — em pares de opostos.</p><h3>Descrever</h3><p><span class="k">ist</span> (é/está): <span class="de" data-say="Das Haus ist groß">Das Haus ist groß</span> (a casa é grande), <span class="de" data-say="Die Suppe ist warm">Die Suppe ist warm</span> (a sopa está quente).</p>' +
    '<h3>Opostos</h3><p><span class="de" data-say="groß">groß</span> (grande) / <span class="de" data-say="klein">klein</span> (pequeno), <span class="de" data-say="lang">lang</span> (longo) / <span class="de" data-say="kurz">kurz</span> (curto)…</p>' +
    '<h3>“muito” e “mais”</h3><p><span class="de" data-say="sehr">sehr</span> (muito), <span class="de" data-say="mehr">mehr</span> (mais) / <span class="de" data-say="weniger">weniger</span> (menos).</p>' +
    '<h3>📏 Medidas</h3><p>Peso: <span class="de" data-say="Kilogramm">Kilogramm</span> (kg), <span class="de" data-say="Gramm">Gramm</span> (g). Distância: <span class="de" data-say="Meter">Meter</span> (m), <span class="de" data-say="Kilometer">Kilometer</span> (km). Volume: <span class="de" data-say="Liter">Liter</span> (l), <span class="de" data-say="Milliliter">Milliliter</span> (ml).</p>',

  similar:
    '<p>Boa notícia: <b>milhares</b> de palavras alemãs são quase iguais ao português! Elas te fazem comunicar já no A0.</p>' +
    '<h3>Padrões de terminação (o ouro 🪙)</h3><table class="br"><tr><td>-tion → -ção</td><td><span class="de" data-say="Funktion">Funktion</span> → função</td></tr><tr><td>-sion → -são</td><td><span class="de" data-say="Diskussion">Diskussion</span> → discussão</td></tr><tr><td>-tät → -dade</td><td><span class="de" data-say="Universität">Universität</span> → universidade</td></tr><tr><td>-ie → -ia</td><td><span class="de" data-say="Fotografie">Fotografie</span> → fotografia</td></tr><tr><td>-ik → -ica</td><td><span class="de" data-say="Musik">Musik</span> → música</td></tr><tr><td>-ur → -ura</td><td><span class="de" data-say="Kultur">Kultur</span> → cultura</td></tr><tr><td>-iv → -ivo</td><td><span class="de" data-say="effektiv">effektiv</span> → efetivo</td></tr></table>' +
    '<h3>⚠️ Falsos amigos</h3><ul>' +
    '<li><span class="de" data-say="der Chef">der Chef</span> = chefe/patrão (❌ não “chef de cozinha” = <span class="de" data-say="der Koch">der Koch</span>).</li>' +
    '<li><span class="de" data-say="die Tasse">die Tasse</span> = xícara (❌ não “taça”).</li>' +
    '<li><span class="de" data-say="der Termin">der Termin</span> = compromisso (❌ não “término”).</li>' +
    '<li><span class="de" data-say="die Rente">die Rente</span> = aposentadoria (❌ não “renda”).</li>' +
    '<li><span class="de" data-say="das Gymnasium">das Gymnasium</span> = colégio (❌ não ginásio).</li></ul>',
};
