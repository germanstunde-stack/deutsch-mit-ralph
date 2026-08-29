// Service worker mínimo, só pra satisfazer o critério de "instalável" dos
// navegadores (beforeinstallprompt). Deliberadamente NÃO cacheia nada — o app
// publica seguido e um cache aqui serviria JS antigo pros usuários.
self.addEventListener("install", () => { self.skipWaiting(); });
self.addEventListener("activate", (event) => { event.waitUntil(self.clients.claim()); });
self.addEventListener("fetch", () => { /* passthrough — sempre busca da rede */ });
