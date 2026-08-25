// Explicações completas do A1, em pt e en (trilha bilíngue construída já a
// partir deste módulo). Conteúdo baseado nas regras de "Grammatik leicht A1"
// (Hueber Verlag) — cada capítulo do livro vira aqui um resumo direto, no
// mesmo estilo do A0 (regra curta + exemplo + erros comuns de quem já fala
// português/inglês).
import type { Lang } from "../../i18n/types";
import { CH_EU_VOCE_SEIN } from "./exercises";

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
};

export function explanationsFor(lang: Lang): Record<string, string> {
  return lang === "pt" ? explanationsPT : explanationsEN;
}
