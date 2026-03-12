import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n";

// Register PWA service worker
if ('serviceWorker' in navigator) {
  import('virtual:pwa-register').then(({ registerSW }) => {
    const updateSW = registerSW({
      immediate: true,
      onNeedRefresh() {
        console.log('Nova versão disponível! Atualizando...');
      },
      onOfflineReady() {
        console.log('App pronto para funcionar offline!');
      },
      onRegistered(registration) {
        console.log('Service Worker registrado:', registration);
      },
      onRegisterError(error) {
        console.error('Erro ao registrar Service Worker:', error);
      }
    });
  }).catch((error) => {
    console.error('Falha ao carregar PWA register:', error);
  });
}

createRoot(document.getElementById("root")!).render(<App />);
