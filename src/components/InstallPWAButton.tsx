import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { useInstallApp } from '@/hooks/useInstallApp';

export function InstallPWAButton() {
  const { isInstallable, showModal, setShowModal, handleInstallClick, triggerNativeInstall, deferredPrompt, setDeferredPrompt } = useInstallApp();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Sempre mostrar o botão após 2 segundos, independente de estar instalado
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []); // Removido isInstallable da dependência

  const handleDismiss = () => {
    setIsVisible(false);
    // Reaparecer após 30 segundos
    setTimeout(() => {
      setIsVisible(true);
    }, 30000);
  };

  const handleInstall = async () => {
    // Tentar instalação direta quando clicar no botão flutuante
    if (deferredPrompt) {
      try {
        // Chamar o prompt nativo diretamente
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
          console.log('PWA instalado com sucesso!');
          setIsVisible(false);
          setDeferredPrompt(null);
        } else {
          console.log('Usuário recusou a instalação');
          // Se recusou, mostrar modal com instruções
          setShowModal(true);
        }
      } catch (error) {
        console.error('Erro ao instalar:', error);
        // Se der erro, mostrar modal com instruções
        setShowModal(true);
      }
    } else {
      // Se não tem prompt nativo, mostrar modal com instruções
      handleInstallClick();
    }
  };

  // Sempre renderizar, não verificar isInstallable
  return (
    <>
      {/* Botão flutuante */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 20 }}
            transition={{ 
              type: 'spring', 
              damping: 25, 
              stiffness: 300,
              delay: 0.2 
            }}
            className="fixed bottom-6 right-6 z-50 group"
          >
            {/* Texto "Instale nosso aplicativo" */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-full right-0 mb-4 pointer-events-none"
            >
              <motion.div
                animate={{ 
                  opacity: [1, 0.6, 1],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap shadow-lg"
              >
                📱 Instale nosso aplicativo
                <div className="absolute top-full right-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-primary"></div>
              </motion.div>
            </motion.div>

            {/* Botão principal com animação piscante */}
            <motion.button
              onClick={handleInstall}
              className="relative w-16 h-16 bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
              animate={{ 
                scale: [1, 1.1, 1],
                boxShadow: [
                  "0 10px 25px rgba(0,0,0,0.15)",
                  "0 15px 35px rgba(34, 197, 94, 0.4)",
                  "0 10px 25px rgba(0,0,0,0.15)"
                ]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Instalar aplicativo"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Download className="w-7 h-7" />
              </motion.div>
              
              {/* Múltiplos anéis de pulse */}
              <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20"></div>
              <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-10" style={{ animationDelay: '0.5s' }}></div>
            </motion.button>

            {/* Botão de fechar */}
            <motion.button
              onClick={handleDismiss}
              className="absolute -top-2 -right-2 w-6 h-6 bg-gray-600 hover:bg-gray-700 text-white rounded-full shadow-md flex items-center justify-center transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Dispensar"
            >
              <X className="w-3 h-3" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de instalação */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[60] bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
            />
            
            {/* Modal */}
            <motion.div
              className="fixed top-1/2 left-1/2 z-[70] w-[calc(100%-2rem)] max-w-md rounded-3xl border border-border/50 p-6"
              style={{
                background: 'hsl(var(--card))',
                x: '-50%',
                y: '-50%',
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="w-8 h-8 text-primary" />
                </div>
                
                <h2 className="text-xl font-bold text-foreground mb-2">
                  Como Instalar TropiScan
                </h2>
                
                <p className="text-muted-foreground mb-6">
                  Siga as instruções abaixo para instalar o aplicativo no seu dispositivo.
                </p>

                {/* Instruções manuais */}
                <div className="mb-6 p-4 bg-muted/50 rounded-lg text-left">
                  <h3 className="font-semibold mb-3 text-foreground">Instruções de instalação:</h3>
                  <ol className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-foreground">1.</span>
                      <span>Toque no menu do navegador (três pontos ⋮ ou ⋯)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-foreground">2.</span>
                      <span>Selecione "Adicionar à tela inicial" ou "Instalar app"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-foreground">3.</span>
                      <span>Confirme a instalação tocando em "Adicionar" ou "Instalar"</span>
                    </li>
                  </ol>
                  
                  <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                    <p className="text-xs text-foreground">
                      <strong>💡 Dica:</strong> No iPhone, use o botão Compartilhar (□↑) e selecione "Adicionar à Tela de Início"
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Entendi
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}