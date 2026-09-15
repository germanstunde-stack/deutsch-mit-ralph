import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { ThemeProvider } from "./theme";
import "./styles/global.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);

// Confere as regras do conteúdo (nunca cobrar palavra não ensinada, nenhum ß)
// a cada `npm run dev`. O import dinâmico sob DEV faz o bundler descartar o
// validador inteiro do build de produção.
if (import.meta.env.DEV) {
  import("./data/validate/vocabRules").then((m) => m.reportVocabChecks());
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => { navigator.serviceWorker.register("/sw.js").catch(() => { /* instalação como PWA é best-effort */ }); });
}
