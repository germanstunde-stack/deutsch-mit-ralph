// Explicações completas do A1, em pt e en (trilha bilíngue construída já a
// partir deste módulo). Conteúdo baseado nas regras de "Grammatik leicht A1"
// (Hueber Verlag) — cada capítulo do livro vira aqui um resumo direto, no
// mesmo estilo do A0 (regra curta + exemplo + erros comuns de quem já fala
// português/inglês).
import type { Lang } from "../../i18n/types";
import { CH_EU_VOCE_SEIN, CH_VERBOS_HABEN, CH_IMPERATIVO, CH_PERFEKT, CH_MODAIS, CH_GENERO_PLURAL, CH_CASOS, CH_PRONOMES } from "./exercises";

const explanationsPT: Record<string, string> = {
  [CH_EU_VOCE_SEIN]:
    '<h3>Pronomes pessoais</h3><table class="br">' +
    '<tr><td>ich</td><td>eu</td></tr><tr><td>du</td><td>você (informal)</td></tr>' +
    '<tr><td>er / es / sie</td><td>ele / isso / ela</td></tr><tr><td>wir</td><td>nós</td></tr>' +
    '<tr><td>ihr</td><td>vocês (informal)</td></tr><tr><td>sie / Sie</td><td>eles, elas / o(a) senhor(a) (formal)</td></tr></table>' +
    '<h3>O verbo <span class="de" data-say="sein">sein</span> (ser/estar)</h3>' +
    '<table class="br"><tr><td>ich</td><td><span class="de" data-say="bin">bin</span></td></tr>' +
    '<tr><td>du</td><td><span class="de" data-say="bist">bist</span></td></tr>' +
    '<tr><td>er/es/sie</td><td><span class="de" data-say="ist">ist</span></td></tr>' +
    '<tr><td>wir</td><td><span class="de" data-say="sind">sind</span></td></tr>' +
    '<tr><td>ihr</td><td><span class="de" data-say="seid">seid</span></td></tr>' +
    '<tr><td>sie/Sie</td><td><span class="de" data-say="sind">sind</span></td></tr></table>' +
    '<p><b class="de">sein</b> serve pra: informação pessoal (<span class="de" data-say="Ich bin 22 Jahre alt">Ich bin 22 Jahre alt</span> = tenho 22 anos), estado de espírito (<span class="de" data-say="Ich bin glücklich">Ich bin glücklich</span> = estou feliz) e lugar (<span class="de" data-say="Er ist aus Berlin">Er ist aus Berlin</span> = ele é de Berlim).</p>' +
    '<h3>📐 Ordem da frase</h3><p>Assim como em português, sujeito vem antes do verbo: <span class="de" data-say="Ich bin müde">Ich bin müde</span>. Mas em alemão o verbo <b>sempre</b> fica na 2ª posição da frase — mesmo quando outra coisa vem primeiro: <span class="de" data-say="Morgen bin ich in Berlin">Morgen bin ich in Berlin</span> (amanhã eu estou em Berlim — repare que "ich" pulou pra depois do verbo).</p>' +
    '<h3>⚠️ Cuidado</h3><ul>' +
    '<li><b class="de">sie</b> minúsculo = ela OU eles/elas (depende do contexto); <b class="de">Sie</b> maiúsculo = você/vocês formal — só a maiúscula muda tudo, sempre escreva com atenção!</li>' +
    '<li><b class="de">du</b> × <b class="de">ihr</b> × <b class="de">Sie</b>: du = 1 pessoa informal, ihr = várias pessoas informal, Sie = formal (1 ou várias, sempre maiúsculo).</li>' +
    '<li>Alemão não separa "ser" de "estar" como o português — os dois significados vão em <b class="de">sein</b>.</li></ul>',

  [CH_VERBOS_HABEN]:
    '<h3>Verbos regulares (Präsens)</h3><p>A maioria dos verbos segue o mesmo padrão de terminação — troque o <b>-en</b> do infinitivo pela terminação certa:</p>' +
    '<table class="br"><tr><td>ich</td><td>-e</td></tr><tr><td>du</td><td>-st</td></tr><tr><td>er/es/sie</td><td>-t</td></tr>' +
    '<tr><td>wir</td><td>-en</td></tr><tr><td>ihr</td><td>-t</td></tr><tr><td>sie/Sie</td><td>-en</td></tr></table>' +
    '<p>Exemplo: <span class="de" data-say="kommen">kommen</span> (vir) → <span class="de" data-say="ich komme">ich komme</span>, <span class="de" data-say="du kommst">du kommst</span>, <span class="de" data-say="er kommt">er kommt</span>…</p>' +
    '<h3>⚠️ Duas exceções de pronúncia</h3><ul>' +
    '<li><b class="de">arbeiten</b> (trabalhar): o radical termina em <b>-t</b>, então entra um <b>-e-</b> extra pra não travar a fala: <span class="de" data-say="du arbeitest">du arbeitest</span>, <span class="de" data-say="er arbeitet">er arbeitet</span> (não “arbeitst”/“arbeitt”).</li>' +
    '<li><b class="de">heißen</b> (chamar-se): o radical já termina no som de “s” (<b class="de">ß</b>), então du/er não dobram o -s: <span class="de" data-say="du heißt">du heißt</span>, <span class="de" data-say="er heißt">er heißt</span> (não “heißst”).</li></ul>' +
    '<h3>O verbo <span class="de" data-say="haben">haben</span> (ter)</h3>' +
    '<table class="br"><tr><td>ich</td><td><span class="de" data-say="habe">habe</span></td></tr>' +
    '<tr><td>du</td><td><span class="de" data-say="hast">hast</span></td></tr>' +
    '<tr><td>er/es/sie</td><td><span class="de" data-say="hat">hat</span></td></tr>' +
    '<tr><td>wir</td><td><span class="de" data-say="haben">haben</span></td></tr>' +
    '<tr><td>ihr</td><td><span class="de" data-say="habt">habt</span></td></tr>' +
    '<tr><td>sie/Sie</td><td><span class="de" data-say="haben">haben</span></td></tr></table>' +
    '<p>Igual ao <b class="de">sein</b>, <b class="de">haben</b> é irregular — decore <span class="de" data-say="du hast">du hast</span> e <span class="de" data-say="er hat">er hat</span> à parte, sem -e no final.</p>' +
    '<h3>Verbos com mudança de vogal</h3><p>Alguns verbos mudam a vogal do radical, mas <b>só</b> em <b class="de">du</b> e <b class="de">er/es/sie</b> — o resto da conjugação é normal:</p>' +
    '<table class="br"><tr><td>a → ä</td><td><span class="de" data-say="fahren">fahren</span> → <span class="de" data-say="du fährst">du fährst</span>, <span class="de" data-say="er fährt">er fährt</span></td></tr>' +
    '<tr><td>e → ie</td><td><span class="de" data-say="sehen">sehen</span> → <span class="de" data-say="du siehst">du siehst</span>, <span class="de" data-say="er sieht">er sieht</span></td></tr>' +
    '<tr><td>e → i</td><td><span class="de" data-say="essen">essen</span> → <span class="de" data-say="du isst">du isst</span>, <span class="de" data-say="er isst">er isst</span></td></tr></table>' +
    '<h3>⚠️ Cuidado</h3><ul>' +
    '<li>A mudança de vogal <b>nunca</b> acontece com <b class="de">ich</b>, <b class="de">wir</b>, <b class="de">ihr</b> ou <b class="de">sie/Sie</b> — só du e er/es/sie.</li>' +
    '<li>O verbo continua na <b>2ª posição</b> da frase, exatamente como no capítulo anterior com <b class="de">sein</b>.</li></ul>',

  [CH_IMPERATIVO]:
    '<h3>Imperativo (dar ordens/conselhos)</h3><p>3 formas, uma pra cada tratamento:</p>' +
    '<table class="br"><tr><td>du</td><td>tira o <b>-st</b> do presente: <span class="de" data-say="Komm">Komm!</span></td></tr>' +
    '<tr><td>ihr</td><td>igual ao presente: <span class="de" data-say="Kommt">Kommt!</span></td></tr>' +
    '<tr><td>Sie</td><td>verbo + Sie (como uma pergunta invertida): <span class="de" data-say="Kommen Sie">Kommen Sie!</span></td></tr></table>' +
    '<h3>⚠️ E os verbos com mudança de vogal?</h3><ul>' +
    '<li><b>e → i / e → ie</b> mantém a mudança no imperativo (du): <span class="de" data-say="Iss">Iss!</span> (comer), <span class="de" data-say="Sprich">Sprich!</span> (falar).</li>' +
    '<li><b>a → ä</b> NÃO aparece no imperativo (du): <span class="de" data-say="Fahr">Fahr!</span> (não “Führ”), <span class="de" data-say="Fahr vorsichtig">Fahr vorsichtig!</span> (dirija com cuidado).</li></ul>' +
    '<h3>Verbos separáveis (trennbare Verben)</h3><p>Um prefixo (auf-, ein-, an-, fern-...) se separa do verbo e vai pro <b>final da frase</b>:</p>' +
    '<p><span class="de" data-say="aufstehen">aufstehen</span> (levantar-se) → <span class="de" data-say="Ich stehe um sieben Uhr auf">Ich stehe um sieben Uhr auf.</span> (eu levanto às 7h)</p>' +
    '<p><span class="de" data-say="einkaufen">einkaufen</span> (fazer compras) → <span class="de" data-say="Er kauft Brot ein">Er kauft Brot ein.</span> (ele compra pão)</p>' +
    '<h3>⚠️ Cuidado</h3><ul>' +
    '<li>No infinitivo o prefixo fica junto (<b class="de">aufstehen</b>), mas conjugado ele <b>sempre</b> vai pro fim: <span class="de" data-say="ich stehe auf">ich stehe auf</span>, nunca “ich aufstehe”.</li>' +
    '<li>No imperativo o prefixo também vai pro final: <span class="de" data-say="Steh auf">Steh auf!</span> (levanta!).</li></ul>',

  [CH_PERFEKT]:
    '<h3>Perfekt = o passado do dia a dia</h3><p>Em vez de conjugar o verbo no passado, o alemão falado usa o <b>Perfekt</b>: <b class="de">haben</b> ou <b class="de">sein</b> conjugado (2ª posição) + <b>Partizip II</b> no fim da frase.</p>' +
    '<p><span class="de" data-say="Ich habe Deutsch gelernt">Ich habe Deutsch gelernt.</span> (eu aprendi alemão) — <span class="k">habe</span> na 2ª posição, <span class="k">gelernt</span> no fim.</p>' +
    '<h3>Partizip II regular</h3><p><b>ge-</b> + radical + <b>-t</b>: <span class="de" data-say="lernen">lernen</span> → <span class="de" data-say="gelernt">gelernt</span>, <span class="de" data-say="machen">machen</span> → <span class="de" data-say="gemacht">gemacht</span>.</p>' +
    '<h3>Partizip II irregular</h3><p><b>ge-</b> + radical (às vezes com vogal diferente) + <b>-en</b>: <span class="de" data-say="essen">essen</span> → <span class="de" data-say="gegessen">gegessen</span>, <span class="de" data-say="trinken">trinken</span> → <span class="de" data-say="getrunken">getrunken</span>, <span class="de" data-say="lesen">lesen</span> → <span class="de" data-say="gelesen">gelesen</span>. Não tem regra fixa — decore junto com o verbo.</p>' +
    '<h3>⚠️ haben ou sein?</h3><ul>' +
    '<li>A maioria dos verbos usa <b class="de">haben</b>.</li>' +
    '<li>Verbos de <b>movimento de A pra B</b> (ou mudança de estado) usam <b class="de">sein</b>: <span class="de" data-say="gehen">gehen</span> → <span class="de" data-say="ich bin gegangen">ich bin gegangen</span>, <span class="de" data-say="fahren">fahren</span> → <span class="de" data-say="du bist gefahren">du bist gefahren</span>, <span class="de" data-say="kommen">kommen</span> → <span class="de" data-say="er ist gekommen">er ist gekommen</span>.</li>' +
    '<li>O particípio (gelernt, gegessen...) é <b>igual pra todo mundo</b> — só o auxiliar (habe/hast/hat.../bin/bist/ist...) muda de acordo com quem fala.</li></ul>',

  [CH_MODAIS]:
    '<h3>Verbos modais</h3><p>Expressam capacidade, obrigação, vontade, permissão ou conselho. Uma coisa estranha: <b class="de">ich</b> e <b class="de">er/es/sie</b> têm a <b>mesma forma</b> (sem -e nem -t)!</p>' +
    '<table class="br"><tr><td>können (poder/conseguir)</td><td><span class="de" data-say="ich kann">kann</span> · <span class="de" data-say="du kannst">kannst</span> · <span class="de" data-say="er kann">kann</span></td></tr>' +
    '<tr><td>müssen (precisar)</td><td><span class="de" data-say="ich muss">muss</span> · <span class="de" data-say="du musst">musst</span> · <span class="de" data-say="er muss">muss</span></td></tr>' +
    '<tr><td>wollen (querer)</td><td><span class="de" data-say="ich will">will</span> · <span class="de" data-say="du willst">willst</span> · <span class="de" data-say="er will">will</span></td></tr>' +
    '<tr><td>dürfen (poder/permissão)</td><td><span class="de" data-say="ich darf">darf</span> · <span class="de" data-say="du darfst">darfst</span> · <span class="de" data-say="er darf">darf</span></td></tr>' +
    '<tr><td>sollen (dever)</td><td><span class="de" data-say="ich soll">soll</span> · <span class="de" data-say="du sollst">sollst</span> · <span class="de" data-say="er soll">soll</span></td></tr></table>' +
    '<h3>💡 möchten = a versão educada de wollen</h3><p><span class="de" data-say="Ich will einen Kaffee">Ich will einen Kaffee</span> soa meio ríspido (eu QUERO um café!). Prefira <span class="de" data-say="Ich möchte einen Kaffee">Ich möchte einen Kaffee</span> (eu gostaria de um café) — e esse conjuga normal, com -e no ich/er.</p>' +
    '<h3>📐 O infinitivo vai pro fim!</h3><p>O verbo modal fica na 2ª posição, e o verbo principal (no infinitivo, sem conjugar) vai pro <b>final</b> da frase — mesma Satzklammer do Perfekt e dos separáveis:</p>' +
    '<p><span class="de" data-say="Ich kann gut schwimmen">Ich kann gut schwimmen.</span> (eu sei nadar bem) — <span class="k">kann</span> na 2ª posição, <span class="k">schwimmen</span> no fim.</p>' +
    '<h3>⚠️ Cuidado com o significado</h3><ul>' +
    '<li><b class="de">müssen</b> (obrigação de verdade) ≠ <b class="de">sollen</b> (conselho ou ordem de outra pessoa).</li>' +
    '<li><b class="de">können</b> (capacidade: sei fazer) ≠ <b class="de">dürfen</b> (permissão: posso fazer).</li></ul>',

  [CH_GENERO_PLURAL]:
    '<h3>Gênero: der, die, das</h3><p>Revisão do A0: todo substantivo alemão tem um gênero gramatical fixo. <b>Não existe truque geral</b> — decore cada palavra junto com o artigo.</p>' +
    '<h3>Plural — sem regra única, mas com padrões comuns</h3>' +
    '<table class="br"><tr><td>+ -e</td><td><span class="de" data-say="der Tisch">der Tisch</span> → <span class="de" data-say="die Tische">die Tische</span></td></tr>' +
    '<tr><td>+ Umlaut + -e</td><td><span class="de" data-say="der Sohn">der Sohn</span> → <span class="de" data-say="die Söhne">die Söhne</span></td></tr>' +
    '<tr><td>Umlaut só</td><td><span class="de" data-say="der Apfel">der Apfel</span> → <span class="de" data-say="die Äpfel">die Äpfel</span>, <span class="de" data-say="die Mutter">die Mutter</span> → <span class="de" data-say="die Mütter">die Mütter</span></td></tr>' +
    '<tr><td>+ -er (+ Umlaut)</td><td><span class="de" data-say="das Buch">das Buch</span> → <span class="de" data-say="die Bücher">die Bücher</span>, <span class="de" data-say="das Kind">das Kind</span> → <span class="de" data-say="die Kinder">die Kinder</span></td></tr>' +
    '<tr><td>+ -(e)n</td><td><span class="de" data-say="die Frau">die Frau</span> → <span class="de" data-say="die Frauen">die Frauen</span>, <span class="de" data-say="die Tür">die Tür</span> → <span class="de" data-say="die Türen">die Türen</span></td></tr>' +
    '<tr><td>+ -s (palavras estrangeiras)</td><td><span class="de" data-say="das Auto">das Auto</span> → <span class="de" data-say="die Autos">die Autos</span></td></tr></table>' +
    '<h3>⚠️ A regra que NUNCA falha</h3><p>Não importa se era der/die/das no singular — <b>no plural o artigo é sempre <span class="de" data-say="die">die</span></b>.</p>' +
    '<h3>💡 Dica de estudo</h3><p>Sempre que aprender uma palavra nova, aprenda junto: <b>artigo + palavra + plural</b> — ex.: <span class="de" data-say="das Buch, die Bücher">das Buch, die Bücher</span>. Os dicionários bons sempre mostram o plural do lado.</p>',

  [CH_CASOS]:
    '<h3>3 casos, mesmo substantivo</h3><p>O <b>artigo</b> muda conforme a função da palavra na frase — a palavra em si não muda.</p>' +
    '<table class="br"><tr><td></td><td>Nominativ (sujeito)</td><td>Akkusativ (objeto direto)</td><td>Dativ (objeto indireto)</td></tr>' +
    '<tr><td>masculino</td><td><span class="de" data-say="der Mann">der Mann</span></td><td><span class="de" data-say="den Mann">den Mann</span></td><td><span class="de" data-say="dem Mann">dem Mann</span></td></tr>' +
    '<tr><td>feminino</td><td><span class="de" data-say="die Frau">die Frau</span></td><td><span class="de" data-say="die Frau">die Frau</span></td><td><span class="de" data-say="der Frau">der Frau</span></td></tr>' +
    '<tr><td>neutro</td><td><span class="de" data-say="das Kind">das Kind</span></td><td><span class="de" data-say="das Kind">das Kind</span></td><td><span class="de" data-say="dem Kind">dem Kind</span></td></tr></table>' +
    '<h3>⚠️ A única mudança do Akkusativ</h3><p>Só o <b class="de">der</b> masculino muda (→ <b class="de">den</b>); die e das ficam iguais ao Nominativ. Indefinido: <b class="de">ein</b> → <b class="de">einen</b>.</p>' +
    '<h3>Quem usa cada caso?</h3><ul>' +
    '<li><b>Nominativ</b>: o sujeito da frase (quem faz a ação).</li>' +
    '<li><b>Akkusativ</b>: o objeto direto — verbos como <span class="de" data-say="haben">haben</span>, <span class="de" data-say="nehmen">nehmen</span> (pegar), <span class="de" data-say="möchten">möchten</span>: <span class="de" data-say="Ich habe einen Hund">Ich habe einen Hund.</span></li>' +
    '<li><b>Dativ</b>: o objeto indireto — verbos como <span class="de" data-say="helfen">helfen</span> (ajudar), <span class="de" data-say="gehören">gehören</span> (pertencer), <span class="de" data-say="gefallen">gefallen</span> (agradar): <span class="de" data-say="Ich helfe dem Mann">Ich helfe dem Mann.</span></li></ul>' +
    '<h3>💡 Dica</h3><p>O Dativ do feminino (<b class="de">der</b> Frau) parece com o Nominativ masculino (<b class="de">der</b> Mann) — mas são coisas diferentes! Preste atenção no substantivo pra saber qual é.</p>',

  [CH_PRONOMES]:
    '<h3>Pronomes pessoais também têm caso</h3><p>Assim como os substantivos, os pronomes (eu, você, ele...) mudam de forma no Akkusativ e no Dativ:</p>' +
    '<table class="br"><tr><td>Nom</td><td>Akk</td><td>Dat</td></tr>' +
    '<tr><td><span class="de" data-say="ich">ich</span></td><td><span class="de" data-say="mich">mich</span></td><td><span class="de" data-say="mir">mir</span></td></tr>' +
    '<tr><td><span class="de" data-say="du">du</span></td><td><span class="de" data-say="dich">dich</span></td><td><span class="de" data-say="dir">dir</span></td></tr>' +
    '<tr><td><span class="de" data-say="er">er</span></td><td><span class="de" data-say="ihn">ihn</span></td><td><span class="de" data-say="ihm">ihm</span></td></tr>' +
    '<tr><td><span class="de" data-say="wir">wir</span></td><td><span class="de" data-say="uns">uns</span></td><td><span class="de" data-say="uns">uns</span></td></tr></table>' +
    '<p>Usados depois de verbos como <span class="de" data-say="lieben">lieben</span> (amar, Akk), <span class="de" data-say="helfen">helfen</span> (ajudar, Dat), <span class="de" data-say="gefallen">gefallen</span> (agradar, Dat): <span class="de" data-say="Ich liebe dich">Ich liebe dich.</span> (eu te amo)</p>' +
    '<h3>⚠️ Cuidado com "er" → "ihn"</h3><p>É a mudança mais surpreendente pra quem fala português: <span class="de" data-say="er">er</span> (ele) vira <span class="de" data-say="ihn">ihn</span> no Akkusativ — não existe uma palavra parecida com “ele” no objeto.</p>' +
    '<h3>Pronomes indefinidos</h3><table class="br">' +
    '<tr><td><span class="de" data-say="alles">alles</span></td><td>tudo</td></tr>' +
    '<tr><td><span class="de" data-say="etwas">etwas</span></td><td>algo</td></tr>' +
    '<tr><td><span class="de" data-say="nichts">nichts</span></td><td>nada</td></tr>' +
    '<tr><td><span class="de" data-say="man">man</span></td><td>a gente / se (impessoal)</td></tr></table>' +
    '<p><span class="de" data-say="man">man</span> é usado quando não se especifica quem faz a ação: <span class="de" data-say="Man spricht hier Deutsch">Man spricht hier Deutsch.</span> (fala-se alemão aqui / aqui a gente fala alemão)</p>',
};

const explanationsEN: Record<string, string> = {
  [CH_EU_VOCE_SEIN]:
    '<h3>Personal pronouns</h3><table class="br">' +
    '<tr><td>ich</td><td>I</td></tr><tr><td>du</td><td>you (informal, singular)</td></tr>' +
    '<tr><td>er / es / sie</td><td>he / it / she</td></tr><tr><td>wir</td><td>we</td></tr>' +
    '<tr><td>ihr</td><td>you all (informal)</td></tr><tr><td>sie / Sie</td><td>they / you (formal)</td></tr></table>' +
    '<h3>The verb <span class="de" data-say="sein">sein</span> (to be)</h3>' +
    '<table class="br"><tr><td>ich</td><td><span class="de" data-say="bin">bin</span></td></tr>' +
    '<tr><td>du</td><td><span class="de" data-say="bist">bist</span></td></tr>' +
    '<tr><td>er/es/sie</td><td><span class="de" data-say="ist">ist</span></td></tr>' +
    '<tr><td>wir</td><td><span class="de" data-say="sind">sind</span></td></tr>' +
    '<tr><td>ihr</td><td><span class="de" data-say="seid">seid</span></td></tr>' +
    '<tr><td>sie/Sie</td><td><span class="de" data-say="sind">sind</span></td></tr></table>' +
    '<p><b class="de">sein</b> is used for: personal information (<span class="de" data-say="Ich bin 22 Jahre alt">Ich bin 22 Jahre alt</span> = I am 22 years old), a state of mind (<span class="de" data-say="Ich bin glücklich">Ich bin glücklich</span> = I am happy), and place (<span class="de" data-say="Er ist aus Berlin">Er ist aus Berlin</span> = he is from Berlin).</p>' +
    '<h3>📐 Sentence order</h3><p>Just like in English, the subject comes before the verb: <span class="de" data-say="Ich bin müde">Ich bin müde</span>. But in German the verb is <b>always</b> in 2nd position — even when something else comes first: <span class="de" data-say="Morgen bin ich in Berlin">Morgen bin ich in Berlin</span> (tomorrow I am in Berlin — notice "ich" jumped after the verb).</p>' +
    '<h3>⚠️ Watch out</h3><ul>' +
    '<li>lowercase <b class="de">sie</b> = she OR they (context decides); capital <b class="de">Sie</b> = formal you — only the capital letter changes everything, always write it carefully!</li>' +
    '<li><b class="de">du</b> vs <b class="de">ihr</b> vs <b class="de">Sie</b>: du = 1 person informal, ihr = several people informal, Sie = formal (1 or several, always capitalized).</li>' +
    '<li>German has just one verb for both senses of "to be" that some languages split — everything goes through <b class="de">sein</b>.</li></ul>',

  [CH_VERBOS_HABEN]:
    '<h3>Regular verbs (present tense)</h3><p>Most verbs follow the same ending pattern — swap the infinitive\'s <b>-en</b> for the right ending:</p>' +
    '<table class="br"><tr><td>ich</td><td>-e</td></tr><tr><td>du</td><td>-st</td></tr><tr><td>er/es/sie</td><td>-t</td></tr>' +
    '<tr><td>wir</td><td>-en</td></tr><tr><td>ihr</td><td>-t</td></tr><tr><td>sie/Sie</td><td>-en</td></tr></table>' +
    '<p>Example: <span class="de" data-say="kommen">kommen</span> (to come) → <span class="de" data-say="ich komme">ich komme</span>, <span class="de" data-say="du kommst">du kommst</span>, <span class="de" data-say="er kommt">er kommt</span>…</p>' +
    '<h3>⚠️ Two pronunciation exceptions</h3><ul>' +
    '<li><b class="de">arbeiten</b> (to work): the stem ends in <b>-t</b>, so an extra <b>-e-</b> is inserted so it doesn\'t trip on itself: <span class="de" data-say="du arbeitest">du arbeitest</span>, <span class="de" data-say="er arbeitet">er arbeitet</span> (not "arbeitst"/"arbeitt").</li>' +
    '<li><b class="de">heißen</b> (to be called): the stem already ends in an "s" sound (<b class="de">ß</b>), so du/er don\'t double the -s: <span class="de" data-say="du heißt">du heißt</span>, <span class="de" data-say="er heißt">er heißt</span> (not "heißst").</li></ul>' +
    '<h3>The verb <span class="de" data-say="haben">haben</span> (to have)</h3>' +
    '<table class="br"><tr><td>ich</td><td><span class="de" data-say="habe">habe</span></td></tr>' +
    '<tr><td>du</td><td><span class="de" data-say="hast">hast</span></td></tr>' +
    '<tr><td>er/es/sie</td><td><span class="de" data-say="hat">hat</span></td></tr>' +
    '<tr><td>wir</td><td><span class="de" data-say="haben">haben</span></td></tr>' +
    '<tr><td>ihr</td><td><span class="de" data-say="habt">habt</span></td></tr>' +
    '<tr><td>sie/Sie</td><td><span class="de" data-say="haben">haben</span></td></tr></table>' +
    '<p>Just like <b class="de">sein</b>, <b class="de">haben</b> is irregular — memorize <span class="de" data-say="du hast">du hast</span> and <span class="de" data-say="er hat">er hat</span> separately, no final -e.</p>' +
    '<h3>Vowel-changing verbs</h3><p>Some verbs change their stem vowel, but <b>only</b> for <b class="de">du</b> and <b class="de">er/es/sie</b> — the rest of the conjugation is regular:</p>' +
    '<table class="br"><tr><td>a → ä</td><td><span class="de" data-say="fahren">fahren</span> → <span class="de" data-say="du fährst">du fährst</span>, <span class="de" data-say="er fährt">er fährt</span></td></tr>' +
    '<tr><td>e → ie</td><td><span class="de" data-say="sehen">sehen</span> → <span class="de" data-say="du siehst">du siehst</span>, <span class="de" data-say="er sieht">er sieht</span></td></tr>' +
    '<tr><td>e → i</td><td><span class="de" data-say="essen">essen</span> → <span class="de" data-say="du isst">du isst</span>, <span class="de" data-say="er isst">er isst</span></td></tr></table>' +
    '<h3>⚠️ Watch out</h3><ul>' +
    '<li>The vowel change <b>never</b> happens with <b class="de">ich</b>, <b class="de">wir</b>, <b class="de">ihr</b> or <b class="de">sie/Sie</b> — only du and er/es/sie.</li>' +
    '<li>The verb still stays in <b>2nd position</b> in the sentence, exactly like in the previous chapter with <b class="de">sein</b>.</li></ul>',

  [CH_IMPERATIVO]:
    '<h3>Imperative (giving orders/advice)</h3><p>3 forms, one for each way of addressing people:</p>' +
    '<table class="br"><tr><td>du</td><td>drop the <b>-st</b> from the present tense: <span class="de" data-say="Komm">Komm!</span></td></tr>' +
    '<tr><td>ihr</td><td>same as the present tense: <span class="de" data-say="Kommt">Kommt!</span></td></tr>' +
    '<tr><td>Sie</td><td>verb + Sie (like an inverted question): <span class="de" data-say="Kommen Sie">Kommen Sie!</span></td></tr></table>' +
    '<h3>⚠️ What about vowel-changing verbs?</h3><ul>' +
    '<li><b>e → i / e → ie</b> keeps the change in the (du) imperative: <span class="de" data-say="Iss">Iss!</span> (eat), <span class="de" data-say="Sprich">Sprich!</span> (speak).</li>' +
    '<li><b>a → ä</b> does NOT show up in the (du) imperative: <span class="de" data-say="Fahr">Fahr!</span> (not "Führ"), <span class="de" data-say="Fahr vorsichtig">Fahr vorsichtig!</span> (drive carefully).</li></ul>' +
    '<h3>Separable verbs (trennbare Verben)</h3><p>A prefix (auf-, ein-, an-, fern-...) splits off the verb and moves to the <b>end of the sentence</b>:</p>' +
    '<p><span class="de" data-say="aufstehen">aufstehen</span> (to get up) → <span class="de" data-say="Ich stehe um sieben Uhr auf">Ich stehe um sieben Uhr auf.</span> (I get up at 7)</p>' +
    '<p><span class="de" data-say="einkaufen">einkaufen</span> (to go shopping) → <span class="de" data-say="Er kauft Brot ein">Er kauft Brot ein.</span> (he buys bread)</p>' +
    '<h3>⚠️ Watch out</h3><ul>' +
    '<li>In the infinitive the prefix stays attached (<b class="de">aufstehen</b>), but once conjugated it <b>always</b> moves to the end: <span class="de" data-say="ich stehe auf">ich stehe auf</span>, never "ich aufstehe".</li>' +
    '<li>In the imperative the prefix also moves to the end: <span class="de" data-say="Steh auf">Steh auf!</span> (get up!).</li></ul>',

  [CH_PERFEKT]:
    '<h3>Perfekt = everyday past tense</h3><p>Instead of conjugating the verb in the past, spoken German uses the <b>Perfekt</b>: <b class="de">haben</b> or <b class="de">sein</b> conjugated (2nd position) + <b>Partizip II</b> (past participle) at the end of the sentence.</p>' +
    '<p><span class="de" data-say="Ich habe Deutsch gelernt">Ich habe Deutsch gelernt.</span> (I learned German) — <span class="k">habe</span> in 2nd position, <span class="k">gelernt</span> at the end.</p>' +
    '<h3>Regular Partizip II</h3><p><b>ge-</b> + stem + <b>-t</b>: <span class="de" data-say="lernen">lernen</span> → <span class="de" data-say="gelernt">gelernt</span>, <span class="de" data-say="machen">machen</span> → <span class="de" data-say="gemacht">gemacht</span>.</p>' +
    '<h3>Irregular Partizip II</h3><p><b>ge-</b> + stem (sometimes with a different vowel) + <b>-en</b>: <span class="de" data-say="essen">essen</span> → <span class="de" data-say="gegessen">gegessen</span>, <span class="de" data-say="trinken">trinken</span> → <span class="de" data-say="getrunken">getrunken</span>, <span class="de" data-say="lesen">lesen</span> → <span class="de" data-say="gelesen">gelesen</span>. There is no fixed rule — memorize it together with the verb.</p>' +
    '<h3>⚠️ haben or sein?</h3><ul>' +
    '<li>Most verbs use <b class="de">haben</b>.</li>' +
    '<li>Verbs of <b>movement from A to B</b> (or a change of state) use <b class="de">sein</b>: <span class="de" data-say="gehen">gehen</span> → <span class="de" data-say="ich bin gegangen">ich bin gegangen</span>, <span class="de" data-say="fahren">fahren</span> → <span class="de" data-say="du bist gefahren">du bist gefahren</span>, <span class="de" data-say="kommen">kommen</span> → <span class="de" data-say="er ist gekommen">er ist gekommen</span>.</li>' +
    '<li>The participle (gelernt, gegessen...) is <b>the same for everyone</b> — only the auxiliary (habe/hast/hat.../bin/bist/ist...) changes depending on who is speaking.</li></ul>',

  [CH_MODAIS]:
    '<h3>Modal verbs</h3><p>They express ability, obligation, wish, permission or advice. A strange quirk: <b class="de">ich</b> and <b class="de">er/es/sie</b> have the <b>same form</b> (no -e or -t)!</p>' +
    '<table class="br"><tr><td>können (can / to be able to)</td><td><span class="de" data-say="ich kann">kann</span> · <span class="de" data-say="du kannst">kannst</span> · <span class="de" data-say="er kann">kann</span></td></tr>' +
    '<tr><td>müssen (must)</td><td><span class="de" data-say="ich muss">muss</span> · <span class="de" data-say="du musst">musst</span> · <span class="de" data-say="er muss">muss</span></td></tr>' +
    '<tr><td>wollen (to want)</td><td><span class="de" data-say="ich will">will</span> · <span class="de" data-say="du willst">willst</span> · <span class="de" data-say="er will">will</span></td></tr>' +
    '<tr><td>dürfen (may / permission)</td><td><span class="de" data-say="ich darf">darf</span> · <span class="de" data-say="du darfst">darfst</span> · <span class="de" data-say="er darf">darf</span></td></tr>' +
    '<tr><td>sollen (should)</td><td><span class="de" data-say="ich soll">soll</span> · <span class="de" data-say="du sollst">sollst</span> · <span class="de" data-say="er soll">soll</span></td></tr></table>' +
    '<h3>💡 möchten = the polite version of wollen</h3><p><span class="de" data-say="Ich will einen Kaffee">Ich will einen Kaffee</span> sounds a bit blunt (I WANT a coffee!). Prefer <span class="de" data-say="Ich möchte einen Kaffee">Ich möchte einen Kaffee</span> (I would like a coffee) — and this one conjugates regularly, with -e in ich/er.</p>' +
    '<h3>📐 The infinitive goes to the end!</h3><p>The modal verb stays in 2nd position, and the main verb (in the infinitive, not conjugated) moves to the <b>end</b> of the sentence — the same Satzklammer pattern as Perfekt and separable verbs:</p>' +
    '<p><span class="de" data-say="Ich kann gut schwimmen">Ich kann gut schwimmen.</span> (I can swim well) — <span class="k">kann</span> in 2nd position, <span class="k">schwimmen</span> at the end.</p>' +
    '<h3>⚠️ Watch the meaning</h3><ul>' +
    '<li><b class="de">müssen</b> (a real obligation) ≠ <b class="de">sollen</b> (advice or someone else’s instruction).</li>' +
    '<li><b class="de">können</b> (ability: I know how) ≠ <b class="de">dürfen</b> (permission: I am allowed to).</li></ul>',

  [CH_GENERO_PLURAL]:
    '<h3>Gender: der, die, das</h3><p>A0 review: every German noun has a fixed grammatical gender. <b>There is no general trick</b> — memorize each word together with its article.</p>' +
    '<h3>Plural — no single rule, but common patterns</h3>' +
    '<table class="br"><tr><td>+ -e</td><td><span class="de" data-say="der Tisch">der Tisch</span> → <span class="de" data-say="die Tische">die Tische</span></td></tr>' +
    '<tr><td>+ umlaut + -e</td><td><span class="de" data-say="der Sohn">der Sohn</span> → <span class="de" data-say="die Söhne">die Söhne</span></td></tr>' +
    '<tr><td>umlaut only</td><td><span class="de" data-say="der Apfel">der Apfel</span> → <span class="de" data-say="die Äpfel">die Äpfel</span>, <span class="de" data-say="die Mutter">die Mutter</span> → <span class="de" data-say="die Mütter">die Mütter</span></td></tr>' +
    '<tr><td>+ -er (+ umlaut)</td><td><span class="de" data-say="das Buch">das Buch</span> → <span class="de" data-say="die Bücher">die Bücher</span>, <span class="de" data-say="das Kind">das Kind</span> → <span class="de" data-say="die Kinder">die Kinder</span></td></tr>' +
    '<tr><td>+ -(e)n</td><td><span class="de" data-say="die Frau">die Frau</span> → <span class="de" data-say="die Frauen">die Frauen</span>, <span class="de" data-say="die Tür">die Tür</span> → <span class="de" data-say="die Türen">die Türen</span></td></tr>' +
    '<tr><td>+ -s (foreign words)</td><td><span class="de" data-say="das Auto">das Auto</span> → <span class="de" data-say="die Autos">die Autos</span></td></tr></table>' +
    '<h3>⚠️ The rule that never fails</h3><p>No matter if it was der/die/das in the singular — <b>the plural article is always <span class="de" data-say="die">die</span></b>.</p>' +
    '<h3>💡 Study tip</h3><p>Whenever you learn a new word, learn it together with: <b>article + word + plural</b> — e.g., <span class="de" data-say="das Buch, die Bücher">das Buch, die Bücher</span>. Good dictionaries always show the plural right next to it.</p>',

  [CH_CASOS]:
    '<h3>3 cases, same noun</h3><p>The <b>article</b> changes depending on the word’s role in the sentence — the word itself does not change.</p>' +
    '<table class="br"><tr><td></td><td>Nominative (subject)</td><td>Accusative (direct object)</td><td>Dative (indirect object)</td></tr>' +
    '<tr><td>masculine</td><td><span class="de" data-say="der Mann">der Mann</span></td><td><span class="de" data-say="den Mann">den Mann</span></td><td><span class="de" data-say="dem Mann">dem Mann</span></td></tr>' +
    '<tr><td>feminine</td><td><span class="de" data-say="die Frau">die Frau</span></td><td><span class="de" data-say="die Frau">die Frau</span></td><td><span class="de" data-say="der Frau">der Frau</span></td></tr>' +
    '<tr><td>neuter</td><td><span class="de" data-say="das Kind">das Kind</span></td><td><span class="de" data-say="das Kind">das Kind</span></td><td><span class="de" data-say="dem Kind">dem Kind</span></td></tr></table>' +
    '<h3>⚠️ The only Accusative change</h3><p>Only masculine <b class="de">der</b> changes (→ <b class="de">den</b>); die and das stay the same as the Nominative. Indefinite: <b class="de">ein</b> → <b class="de">einen</b>.</p>' +
    '<h3>Who uses each case?</h3><ul>' +
    '<li><b>Nominative</b>: the subject of the sentence (who does the action).</li>' +
    '<li><b>Accusative</b>: the direct object — verbs like <span class="de" data-say="haben">haben</span>, <span class="de" data-say="nehmen">nehmen</span> (to take), <span class="de" data-say="möchten">möchten</span>: <span class="de" data-say="Ich habe einen Hund">Ich habe einen Hund.</span></li>' +
    '<li><b>Dative</b>: the indirect object — verbs like <span class="de" data-say="helfen">helfen</span> (to help), <span class="de" data-say="gehören">gehören</span> (to belong to), <span class="de" data-say="gefallen">gefallen</span> (to please): <span class="de" data-say="Ich helfe dem Mann">Ich helfe dem Mann.</span></li></ul>' +
    '<h3>💡 Tip</h3><p>The feminine Dative (<b class="de">der</b> Frau) looks like the masculine Nominative (<b class="de">der</b> Mann) — but they are different things! Pay attention to the noun itself to know which one it is.</p>',

  [CH_PRONOMES]:
    '<h3>Personal pronouns have cases too</h3><p>Just like nouns, pronouns (I, you, he...) change form in the Accusative and Dative:</p>' +
    '<table class="br"><tr><td>Nom</td><td>Akk</td><td>Dat</td></tr>' +
    '<tr><td><span class="de" data-say="ich">ich</span></td><td><span class="de" data-say="mich">mich</span></td><td><span class="de" data-say="mir">mir</span></td></tr>' +
    '<tr><td><span class="de" data-say="du">du</span></td><td><span class="de" data-say="dich">dich</span></td><td><span class="de" data-say="dir">dir</span></td></tr>' +
    '<tr><td><span class="de" data-say="er">er</span></td><td><span class="de" data-say="ihn">ihn</span></td><td><span class="de" data-say="ihm">ihm</span></td></tr>' +
    '<tr><td><span class="de" data-say="wir">wir</span></td><td><span class="de" data-say="uns">uns</span></td><td><span class="de" data-say="uns">uns</span></td></tr></table>' +
    '<p>Used after verbs like <span class="de" data-say="lieben">lieben</span> (to love, Akk), <span class="de" data-say="helfen">helfen</span> (to help, Dat), <span class="de" data-say="gefallen">gefallen</span> (to please, Dat): <span class="de" data-say="Ich liebe dich">Ich liebe dich.</span> (I love you)</p>' +
    '<h3>⚠️ Watch out: "er" → "ihn"</h3><p>This is the most surprising change for English speakers: <span class="de" data-say="er">er</span> (he) becomes <span class="de" data-say="ihn">ihn</span> in the Accusative — nothing like "he" survives in the object form.</p>' +
    '<h3>Indefinite pronouns</h3><table class="br">' +
    '<tr><td><span class="de" data-say="alles">alles</span></td><td>everything</td></tr>' +
    '<tr><td><span class="de" data-say="etwas">etwas</span></td><td>something</td></tr>' +
    '<tr><td><span class="de" data-say="nichts">nichts</span></td><td>nothing</td></tr>' +
    '<tr><td><span class="de" data-say="man">man</span></td><td>one / people (impersonal)</td></tr></table>' +
    '<p><span class="de" data-say="man">man</span> is used when you don’t specify who does the action: <span class="de" data-say="Man spricht hier Deutsch">Man spricht hier Deutsch.</span> (German is spoken here / people speak German here)</p>',
};

export function explanationsFor(lang: Lang): Record<string, string> {
  return lang === "pt" ? explanationsPT : explanationsEN;
}
