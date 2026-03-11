import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Settings, Moon, Sun, Volume2, VolumeX, Globe, Check, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTropiScanStore } from '@/store/useTropiScanStore';

const LANGUAGES = [
  { code: 'pt-BR', flag: '🇧🇷', label: 'Português (Brasil)' },
  { code: 'en-US', flag: '🇺🇸', label: 'English (United States)' },
  { code: 'es-419', flag: '🇪🇸', label: 'Español (América Latina)' },
];

export function ResponsiveControls() {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode, audioEnabled, toggleAudio } = useTropiScanStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);

  const handleLanguageSelect = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem('tropiscan-language', code);
    setShowLanguages(false);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <>
      {/* Botão "Voltar ao início" - canto superior esquerdo */}
      <div className="fixed top-4 left-4 z-50">
        <motion.button
          onClick={handleBackToHome}
          className="flex items-center gap-2 rounded-full border border-border/20 px-4 py-3 shadow-lg transition-all hover:scale-105 active:scale-95"
          style={{
            background: 'hsl(var(--card) / 0.95)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">
            {t('common.backToHome', 'Voltar ao início')}
          </span>
        </motion.button>
      </div>

      {/* Controles de configuração - canto superior direito */}
      <div className="fixed top-4 right-4 z-50">
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Botão principal de configurações */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-border/20 shadow-lg transition-all hover:scale-110 active:scale-95"
            style={{
              background: 'hsl(var(--card) / 0.95)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
            aria-label="Configurações"
          >
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Settings className="h-5 w-5 text-muted-foreground" />
            </motion.div>
          </button>

          {/* Menu expandido */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-[4rem] right-0 flex flex-col gap-2 rounded-2xl border border-border/20 p-3 shadow-xl"
                style={{
                  background: 'hsl(var(--card) / 0.95)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                }}
              >
                {/* Dark Mode Toggle */}
                <motion.button
                  onClick={() => {
                    toggleDarkMode();
                    setIsExpanded(false);
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:scale-105 active:scale-95 hover:bg-muted/20"
                  aria-label={darkMode ? 'Light mode' : 'Dark mode'}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {darkMode ? (
                    <Sun className="h-4 w-4 text-warning" />
                  ) : (
                    <Moon className="h-4 w-4 text-muted-foreground" />
                  )}
                </motion.button>

                {/* Audio Toggle */}
                <motion.button
                  onClick={() => {
                    toggleAudio();
                    setIsExpanded(false);
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:scale-105 active:scale-95 hover:bg-muted/20"
                  aria-label={audioEnabled ? 'Desativar modo áudio' : 'Ativar modo áudio'}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {audioEnabled ? (
                    <Volume2 className="h-4 w-4 text-primary" />
                  ) : (
                    <VolumeX className="h-4 w-4 text-muted-foreground" />
                  )}
                </motion.button>

                {/* Language Selector */}
                <motion.button
                  onClick={() => {
                    setShowLanguages(true);
                    setIsExpanded(false);
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:scale-105 active:scale-95 hover:bg-muted/20"
                  aria-label="Idioma / Language / Idioma"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Globe className="h-4 w-4 text-primary" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Language Modal */}
      <AnimatePresence>
        {showLanguages && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[60] bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLanguages(false)}
            />
            {/* Centered modal */}
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
              <h2 className="text-center text-lg font-bold text-foreground mb-5">
                🌐 Idioma / Language / Idioma
              </h2>
              <div className="flex flex-col gap-2">
                {LANGUAGES.map((lang) => {
                  const isActive = i18n.language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageSelect(lang.code)}
                      className={`flex items-center gap-4 rounded-2xl p-4 text-left transition-colors ${
                        isActive
                          ? 'bg-primary/10 border-2 border-primary/30'
                          : 'hover:bg-muted/50 border-2 border-transparent'
                      }`}
                    >
                      <span className="text-2xl">{lang.flag}</span>
                      <span className="flex-1 text-base font-medium text-foreground">{lang.label}</span>
                      {isActive && <Check className="h-5 w-5 text-primary" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}