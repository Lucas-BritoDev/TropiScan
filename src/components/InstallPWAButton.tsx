import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { useInstallPWA } from '@/hooks/useInstallPWA';

export function InstallPWAButton() {
  const { isInstallable, isInstalled, promptInstall, canPrompt } = useInstallPWA();
  const [isDismissed, setIsDismissed] = useState(false);

  // Não mostrar se já está instalado, foi dispensado, ou não pode mostrar prompt nativo
  if (isInstalled || isDismissed || !isInstallable || !canPrompt) {
    return null;
  }

  const handleInstallClick = async () => {
    // Apenas chamar o prompt nativo
    await promptInstall();
  };

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  return (
    <>
      {/* Botão flutuante persistente */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 20 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <div className="relative">
          {/* Balão de texto acima do botão */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-full right-0 mb-4 pointer-events-none"
          >
            <div className="relative bg-primary text-primary-foreground px-6 py-3 rounded-2xl shadow-lg whitespace-nowrap font-medium">
              Instale nosso aplicativo
              {/* Seta do balão */}
              <div className="absolute top-full right-8 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-primary"></div>
            </div>
          </motion.div>

          {/* Botão principal - maior e mais destacado */}
          <motion.button
            onClick={handleInstallClick}
            className="relative w-20 h-20 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Instalar aplicativo"
          >
            <Download className="w-10 h-10" strokeWidth={2.5} />
            
            {/* Efeito de pulse */}
            <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20"></span>
          </motion.button>

          {/* Botão de fechar - reposicionado */}
          <motion.button
            onClick={handleDismiss}
            className="absolute -top-2 -right-2 w-8 h-8 bg-gray-700 hover:bg-gray-800 text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Dispensar"
          >
            <X className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}
