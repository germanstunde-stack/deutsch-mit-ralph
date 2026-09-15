# SwissStunde — briefing

Documento de passagem: o que o app é, por que foi construído assim, o que está
pronto e o que falta. Escrito para ser a primeira leitura de quem pegar o
projeto (inclusive um Claude novo).

---

## 1. O que é

App web para **falantes de português aprenderem o alemão da Suíça**, do zero.
Gratuito por princípio — a tela de boas-vindas diz que o objetivo é o oposto de
monetização. Feito pelo próprio autor enquanto ele aprende, e cresce no ritmo
desse aprendizado.

- **No ar:** https://swissstunde.germanstunde.workers.dev
- **Código:** `C:\Users\cruz_\germanstunde` (a fonte viva é `src/`)
- **Pilha:** React + TypeScript + Vite · Cloudflare Workers (estático) ·
  Supabase (login, ranking, notas de prova)

### A decisão que define o app

O autor mora na Suíça. Em 2026-09-15 o app deixou de ser "GermanStunde" e virou
**SwissStunde**, e isso **não foi cosmético**.

A Suíça alemã é **diglóssica** — duas variedades com funções separadas:

| | **Schweizer Hochdeutsch** | **Schwiizerdütsch (Mundart)** |
|---|---|---|
| Onde vive | Tudo que é **escrito**: leis, jornal, escola, contrato, Migros, SBB | Tudo que é **falado** |
| Padronizado? | Sim | **Não existe ortografia oficial** |
| Diferenças | **Nunca usa ß** (Strasse, gross, dreissig) · Velo, Billett, Trottoir, Spital, parkieren, Poulet, Glace, Gipfeli · *das* Tram | Outra língua na prática: Chind, Grüezi, sem Präteritum |
| Varia por cantão | Não | **Radicalmente** (Grüezi ZH ≠ Grüessech BE ≠ Salü BS) |

**Regra vigente, vale para todo conteúdo novo:**

- **Base ensinada e cobrada = Schweizer Hochdeutsch.**
- **Mundart = só reconhecimento auditivo.** Nunca digitado — não há grafia certa
  para cobrar, e não existe voz TTS de dialeto em navegador nenhum.
- **Explicações em português; termos gramaticais em Hochdeutsch** (Akkusativ,
  Perfekt), porque é o que todo livro e exame usa.

Razões, para não serem re-litigadas: dialeto não tem gabarito possível; a Web
Speech API não fala Mundart (`speech.ts` prefere `de-CH` e cai para `de-DE`);
certificação e naturalização são em Standard German.

---

## 2. Regras invioláveis

Quebrar qualquer uma destas é regressão, não escolha de estilo.

1. **Nunca cobrar palavra que não foi ensinada.** Palavra nova entra nos **cards
   do capítulo** antes de virar exercício. Hoje isso é verificado por máquina
   (ver §4), derivando "ensinado" dos próprios cards.
2. **Zero `ß` no currículo.** Exceção: as lições que *ensinam* a regra suíça,
   reconhecidas por citarem "Alemanha".
3. **Mundart nunca é resposta escrita.** Vale para `typed`, `dict`, `order` e
   `cloze`.
4. **Não renomear os ids de `MODULES` (A0/A1).** `exam_results.module` grava
   `mod.id` literal; renomear órfã toda prova feita e re-trava quem já passou.
5. **Não mexer nas chaves `gs_` do localStorage** — apagaria o progresso salvo.
6. **Pronúncia não se corrige.** Não há microfone nem reconhecimento de fala.
   Trava-língua é ferramenta de treino, marcada como não avaliada. Prometer nota
   ali seria mentira.
7. **Migrações do Supabase são rodadas à mão pelo usuário**, no SQL Editor. O
   agente tem só a chave anon — não roda DDL nem apaga linha de outra pessoa.

---

## 3. Arquitetura

### Níveis, módulos e seções

Duas famílias, e a distinção é **dado**, não convenção (`src/data/levels.ts`):

- `kind: "course"` — os níveis CEFR (A0…C2). Entram na progressão dos 96% e na
  escolha de nível inicial do cadastro. Hoje **A0 e A1 têm conteúdo**; A2–C2 são
  placeholders (`builtYet: false`).
- `kind: "section"` — trilhas paralelas (Geografia, História). **Sempre
  abertas, sem Prova**, fora do cálculo de desbloqueio. `SECTION_LEVELS` ainda
  está vazio; o andaime está pronto.

`LEVELS` é o **trilho visível**; `COURSE_LEVELS` é o que a progressão usa. São
listas diferentes de propósito — ver as armadilhas em §6.

Um módulo é um `ModuleDef` (`src/data/modules.ts`): 10 campos, 8 deles funções
(tópicos, exercícios, prova, cards, explicações, frases, flashcards).

### Progressão

Melhor nota na Prova ≥ **96%** libera o próximo módulo
(`src/lib/progression.ts`). A Prova tem 50 pontos em 3 partes (20 múltipla
escolha / 10 escrita+ditado / 20 interativas).

### Motor de exercícios

`ExSpec` é uma união discriminada em `src/data/exercises.ts`; o despachante está
no fim de `src/components/Engines.tsx`. **11 tipos** hoje:

| Tipo | O que é |
|---|---|
| `mc` | múltipla escolha |
| `typed` / `dict` | escrever / ditado |
| `connect` | ligar duas colunas |
| `ws` | caça-palavras |
| `enum` | numerar figuras |
| `order` | montar frase |
| `tf` | **verdadeiro/falso em lote** |
| `cloze` | **lacunas com banco de palavras** |
| `chrono` | **linha do tempo** |
| `map` | **clique no cantão** |

**Contrato de um motor novo** — seis lugares, e três deles são erro de
compilação se esquecidos:

1. interface + braço da união em `src/data/exercises.ts`
2. `ExItem` e um `case` em `itemKey` (`src/data/exSampler.ts`) ← *compila-erro*
3. componente + `case` no despachante (`Engines.tsx`) ← *compila-erro*
4. classificação na tabela `BUCKET` (`src/data/a1/exercises.ts`) ← *compila-erro*
5. extrator em `ESCRITOS` (`vocabRules.ts`) **se o tipo pede escrita**
6. CSS no fim de `src/styles/global.css`

O componente é `forwardRef<ExamHandle, {data, num, onResolve, mode}>` expondo
`{getScore, reveal}`. Em modo `exam` **não pode revelar nada** antes do
`reveal()`. Vale exatamente 1 ponto (`single: true`) se entrar em Prova — a
Prova soma só os acertos e divide por um total fixo.

### Anti-repetição

`buildRound` (`exSampler.ts`) gera o conteúdo na hora de montar a rodada e
re-sorteia quando repete, com memória por vaga e épocas. `itemKey` tem que ser
**invariante a embaralhamento e a distratores** — sempre pela resposta canônica.

### Fábrica de frases (A1)

As frases de "montar frase" são **geradas por combinação**
(`src/data/a1/sentenceFactory.ts`): um começo já traduzido × complementos
compatíveis. 49 → 629 frases.

**Armadilhas já mordidas, todas de semântica:** W-Wort não pode pedir o que o
complemento responde (`wo wohnst du in Berlin`) · objeto ≠ sujeito (`ich liebe
uns`) · cidade como destino pede `nach`, não `in` · verbo tem que aceitar o tipo
do complemento (`ich kaufe zwei Söhne`, `ich kenne die Tasche`) · em português o
pronome de 1ª pessoa objeto é clítico (`ele me ama`, nunca `ele ama mim`) ·
`a` + `o` contrai em `ao`.

### Formato do conteúdo

**O alemão é um campo, guardado UMA vez, e o renderizador é
`(dado, lang) => string`.** Nada de `Record<Lang,string>` com alemão dentro.

Motivo concreto: `src/data/a1/explanations.ts` guarda o alemão duas vezes (bloco
PT e bloco EN), nada verifica se batem, e a regra do ß só varre o lado PT. Num
capítulo de gramática são 3 palavras por linha; num capítulo de contos seria a
passagem inteira duplicada.

`src/data/loc.ts` tem `Loc { pt: string; en?: string }` — o `en` é **opcional
com fallback**, então acrescentar inglês depois é preencher campo. A0 e o
conteúdo novo são só português; **A1 é bilíngue** em todos os 12 capítulos.

---

## 4. O validador de conteúdo

`src/data/validate/vocabRules.ts`. Roda sozinho a cada `npm run dev`
(`import.meta.env.DEV`, então o bundler o descarta da produção). Vive dentro de
`src/` de propósito: o `npm run typecheck` o compila junto, então ele **não
apodrece** quando um formato de dado muda — que foi como a versão anterior
morreu (vivia num diretório temporário).

Regras hoje:

1. **Vocabulário não ensinado** — toda palavra de `OrderSentence.answer` está
   nos cards do capítulo ou dos anteriores. "Ensinado" é **derivado dos cards**.
2. **Nenhum `ß`** em card, explicação ou frase de exemplo.
3. **Mundart nunca escrito** — nenhuma grafia dialetal aparece como resposta de
   `typed`/`dict`/`order`/`cloze`, sorteando 6 rodadas de cada capítulo.
4. **Índice de Mundart sem colisão.**

Ele **achou defeitos de verdade** (as frases que ainda diziam Berlim, o
`Italien` não declarado). Quando reprovar, o erro provavelmente é seu.

---

## 5. Estado atual

### Módulos

- **A0** — 10 capítulos: alfabeto, números, dias & meses, cores, animais,
  comidas, cumprimentos, tamanhos, similares, **suíço × alemão**.
- **A1** — 12 capítulos (11 de gramática + dicionário de ~90 verbos).
- **Seções** (Geografia, História) — andaime pronto, `SECTION_LEVELS` vazio.

### Feito nesta sessão, em ordem

1. **Áudio em todos os exercícios** + dicionário de verbos do A1.
2. **Variedade** — três causas medidas: pools minúsculos, sorteio com reposição
   sem dedup, e um bug no A0 que deixava 6 tipos de exercício mortos na prática.
   Resultado: 14 rodadas do cap. 1 dão 229 enunciados distintos (o teto era 6).
3. **Correção do texto vazando das opções** — e o bug por trás: "qual vem depois
   de quarenta?" oferecia "quatrocentos e vinte e sete". Áudio dos números passa
   a dar a sequência na prática, não na prova.
4. **Virada suíça** — sweep do ß (34 ocorrências), vocabulário suíço, cidades
   suíças na fábrica, capítulo "Suíço × alemão" com 16 helvetismos, camada
   Mundart com 20 entradas, rebrand + worker novo.
5. **Guardas** — tipo de exercício novo passa a falhar alto, não calado.
6. **`useExerciseRound`** extraído do `TopicView`.
7. **Split níveis/seções** — matou dois bugs antes de existirem (§6).
8. **Os quatro motores novos** — `tf`, `cloze`, `chrono`, `map`, cada um
   estreando com conteúdo real no A0, não slot de teste.

### O mapa dos cantões

`src/data/ch/cantonPaths.ts` (42,8 KB) + `src/components/SwissMap.tsx`.

**Licença conferida por arquivo, não por categoria:** vem de "Kantone der
Schweiz.svg" (KarzA, 2008, Wikimedia), **domínio público**. A mesma categoria
mistura PD com CC BY-SA. Foram **recusadas** as fontes derivadas do BFS/GEOSTAT
(pacote `swiss-maps` e afins) — são de licença **não-comercial**, e o app tem
contas e ranking.

Os scripts de extração estão em `scripts/` e são reproduzíveis. Duas armadilhas
documentadas lá: comando SVG em minúscula é **relativo** (tratar como absoluto
quebra tudo), e casar contorno com sigla tem que ser por **contenção**, não por
distância (distância elegia fragmentos; Graubünden saía com 12 pontos).

---

## 6. Armadilhas do código

Coisas que falham **em silêncio**. Várias já foram fechadas; a lista serve para
não reabrir.

- **`App.tsx`: `MODULES[id]` é tipado como não-opcional** porque
  `noUncheckedIndexedAccess` está desligado. Um id de seção ali é TypeError em
  runtime **sem aviso do compilador**. O branch tem que vir antes.
- **Progressão por índice**: `computeUnlockedMax` devolve um índice em
  `COURSE_LEVELS`. Comparar com o índice do trilho visível deixaria as seções
  trancadas até o C1 — o oposto do pretendido.
- **`lastBuiltLevelId`** tem que varrer `COURSE_LEVELS`: um perfil antigo sem
  nível salvo resolveria para uma seção e o cálculo viraria lixo.
- **`Cadastro.tsx`** tem que listar `COURSE_LEVELS`: uma seção gravada em
  `profiles.starting_level` não seria achada depois e jogaria o aluno de volta
  ao A0 — corrupção que o segue entre aparelhos.
- **`specsForChapter` tem um `default:`** que devolve múltipla escolha de
  pronome. Capítulo registrado em `topics.ts` mas esquecido no switch mostra 20
  perguntas do capítulo 1, sem erro nenhum.
- **`CHAPTER_IDS` tem um único consumidor**: `examSpecsFor`. É literalmente "a
  piscina da prova", não a lista de capítulos (essa é `TOPICS_I18N`).
- **`buildRound` engole exceção de gerador** e cai no spec preguiçoso.
- **Cantão côncavo**: o centro da caixa de BL cai fora da própria forma. Isso
  afeta clique automatizado em teste (uma pessoa clica onde vê), não o produto.

---

## 7. Como trabalhar nele

```
npm run typecheck     # tsc -b
npm run dev           # porta 5173; roda o validador no boot
npm run build
npx wrangler deploy   # publica
```

- **Sempre parar o `npm run dev` ao terminar.**
- **Deploy:** `git add <arquivos específicos>`. Nunca versionar
  `deutsch-mit-ralph.zip`, `tsconfig.app.tsbuildinfo` nem `v10/`.
- **`v10/`** é uma cópia morta de agosto e é onde o terminal abre por padrão.
  Sempre usar caminho absoluto para `C:\Users\cruz_\germanstunde`.
- **Testes:** Playwright + Chrome real contra o dev server, no scratchpad da
  sessão (`.../scratchpad/pw/`). Eles **medem o que o usuário reclamou** —
  contam repetição, conferem pontuação, checam que a prova não vaza resposta.
  Os principais: `test_regressao`, `test_validador`, `test_progressao`,
  `test_variedade`, `test_tf`, `test_cloze`, `test_chrono`, `test_mapa`.
  Se `playwright-core` sumir, reinstalar com `npm install playwright-core` no
  diretório do scratchpad.

---

## 8. O que falta

Plano completo em `C:\Users\cruz_\.claude\plans\rippling-singing-fog.md`.

1. **Dados dos cantões** — população e área do **BFS** com o ano de referência
   gravado (população sem data não é fato); regra de validador que a soma bate
   com o total nacional (±0,5%) e as áreas com ~41 291 km². Nome, capital, ano
   de adesão e línguas **já estão** em `src/data/ch/cantons.ts`, verificados.
   Cuidado: AI/AR e BS/BL são **quatro** cantões; a Constituição diz 26.
2. **Cronologia da Suíça** — do Historisches Lexikon der Schweiz e `admin.ch`;
   **citar, nunca copiar**, com as URLs abertas gravadas por evento. Conferir
   1291 (é a fundação *tradicional*), 1848, **1971 sufrágio feminino federal e
   1990 em Appenzell Innerrhoden por decisão judicial**.
3. **Seções Geografia e História** — `SECTIONS` + `SectionView`, reusando
   `useExerciseRound`. História usa clique-por-frase com `[data-say]`, que já
   existe (`src/lib/sayDelegation.ts`, com `escapeAttr` obrigatório para texto
   gerado).
4. **Capítulo de textos do A1** — frases curtas, trava-línguas, rimas, contos e
   provérbios sobre costumes suíços, com áudio e tradução. **Só os itens curtos
   entram na Prova** (`specsForChapter(id, lang, "exam")` já existe para isso).
   Texto folclórico: recusar canção suíça e autor do século XX — **Mani Matter
   segue protegido**. Padrão é texto original nosso.
5. **Interface** (levantado, não feito):
   - a coluna de exercícios tem ~446px de 1080 — causa-raiz do texto espremido;
   - **no celular você perde o que mais gosta**: a 820px as colunas empilham e a
     consulta-enquanto-pratica some. Proposta: gaveta "consultar cards";
   - `.index button.active` está estilizado e **nunca é aplicado** — não dá para
     saber onde você está em 11 capítulos;
   - três números mágicos discordam sobre a altura do cabeçalho grudado;
   - `--radius` é definido uma vez e usado uma vez; há 10 raios cravados na unha.
6. **Jogos** — memória, forca, palavras cruzadas, bingo de números, troco em
   Franken, ditado de frases. Decidido: entram **nos capítulos e** numa aba
   "Jogos" por módulo.

### Pendência do usuário

Limpar as contas de teste `germanstunde+claudetestNNN@gmail.com` no Supabase
(Authentication → Users). Esta sessão criou várias.
