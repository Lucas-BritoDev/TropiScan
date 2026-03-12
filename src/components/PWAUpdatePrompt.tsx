import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, X } from 'lucide-react';

export function PWAUpdatePrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [updateSW, setUpdateSW] = useState<((reloadPage?: boolean) => Promise<void>) | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      import('virtual:pwa-register').then(({ registerSW }) => {
        const update = registerSW({
          onNeedRefresh() {
            setShowPrompt(true);
          },
          onOfflineReady() {
            console.log('App pronto para funcionar offline');
          }
        });
        setUpdateSW(() => update);
      }).catch((error) => {
        console.error('Erro ao registrar SW:', error);
      });
    }
  }, []);

  const handleUpdate = async () => {
    if (updateSW) {
      await updateSW(true);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 z-50"
        >
          <div className="bg-card border border-border rounded-xl shadow-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-primary" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground mb-1">
                  Nova versão disponível
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Atualize para obter as últimas melhorias e correções.
                </p>
                
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdate}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Atualizar
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="text-muted-foreground hover:text-foreground text-sm font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Depois
                  </button>
                </div>
              </div>

              <button
                onClick={handleDismiss}
                className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
