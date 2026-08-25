// Explicações completas do A1, em pt e en (trilha bilíngue construída já a
// partir deste módulo). Conteúdo baseado nas regras de "Grammatik leicht A1"
// (Hueber Verlag) — cada capítulo do livro vira aqui um resumo direto, no
// mesmo estilo do A0 (regra curta + exemplo + erros comuns de quem já fala
// português/inglês).
import type { Lang } from "../../i18n/types";
import { CH_EU_VOCE_SEIN, CH_VERBOS_HABEN } from "./exercises";

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
};

export function explanationsFor(lang: Lang): Record<string, string> {
  return lang === "pt" ? explanationsPT : explanationsEN;
}
