# Deutsch mit Ralph 🇩🇪

App de auto-estudo de alemão. React + Vite + TypeScript + TanStack + Supabase, deploy no Cloudflare Pages.

## Rodar localmente (VS Code)

```bash
npm install
npm run dev
```

Abre em http://localhost:5173. O `.env` já vem com as chaves do seu Supabase (a `anon` é pública; protegida por RLS).

## Configurar o Supabase (uma vez)

1. **Banco:** no painel do Supabase → **SQL Editor**, cole e rode o arquivo `supabase/migrations/0001_init.sql`. Ele cria as tabelas (profiles, exercise_stats, exam_results, progress), o RLS e a view `leaderboard` (ranking).
2. **Login por código (OTP):** em **Authentication → Email Templates → Magic Link**, garanta que o texto inclui o código:
   ```
   Seu código de acesso: {{ .Token }}
   ```
   (Sem isso, o e-mail manda só o link e o campo de 6 dígitos não funciona.)
3. **Site URL:** em **Authentication → URL Configuration**, adicione `http://localhost:5173` (dev) e depois a URL do Cloudflare Pages.

## GitHub

```bash
git init
git add -A
git commit -m "Deutsch mit Ralph — Fase 1 (auth + A0 + ranking)"
git branch -M main
git remote add origin https://github.com/<sua-conta>/deutsch-mit-ralph.git
git push -u origin main
```

## Cloudflare Pages

- Conecte o repositório do GitHub.
- Build command: `npm run build` · Output dir: `dist`
- Em **Settings → Environment variables**, adicione `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` (mesmos valores do `.env`).

## O que já tem (Fase 1)
- Login **sem senha** (código por e-mail via Supabase Auth) + nome de exibição.
- Todo o vocabulário do A0 (9 temas) com apostila e áudio (Web Speech API de-DE).
- Exercícios de múltipla escolha por tema; **cada acerto/erro conta no ranking** (salvo no Supabase, sincronizado entre dispositivos).
- **Ranking** global por acertos.
- Tema claro/escuro, controle de velocidade do áudio.

## Próximo (Fase 2)
- Explicações completas (vogais, consoantes, der/die/das, du×Sie, padrões de cognatos).
- Engines completos: ditado, ligar, caça-palavras, enumerar, calculadora, relógio, calendário, flashcards, caderno de difíceis.
- Regra de pontuação completa (não-preenchidos ao trocar = erro; ditado errado conta mesmo corrigindo).
- Prova: camada fosca + escolha Com/Sem Consulta + relógio + registro no desempenho.
- Grupos privados de ranking (ex.: "Família").
