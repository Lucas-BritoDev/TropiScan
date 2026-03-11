import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useMouseParallax } from '@/hooks/useAdvancedParallax';

interface InteractiveButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  cursorText?: string;
  glowEffect?: boolean;
}

export function InteractiveButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  cursorText,
  glowEffect = false
}: InteractiveButtonProps) {
  const { ref, style } = useMouseParallax(0.05);

  const baseClasses = 'relative overflow-hidden font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary/50',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary/50',
    ghost: 'bg-transparent hover:bg-muted text-foreground focus:ring-muted'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-base rounded-lg',
    lg: 'px-6 py-3 text-lg rounded-xl'
  };

  return (
    <motion.button
      ref={ref}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      data-cursor-text={cursorText}
      style={style}
      whileHover={{ 
        scale: 1.05,
        transition: { type: "spring", stiffness: 400, damping: 10 }
      }}
      whileTap={{ 
        scale: 0.95,
        transition: { type: "spring", stiffness: 400, damping: 10 }
      }}
    >
      {/* Glow effect */}
      {glowEffect && (
        <motion.div
          className="absolute inset-0 rounded-inherit bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20"
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ 
            opacity: 1, 
            scale: 1.1,
            transition: { duration: 0.3 }
          }}
        />
      )}

      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 rounded-inherit"
        whileTap={{
          background: [
            "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)",
            "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
            "radial-gradient(circle, transparent 0%, transparent 70%)"
          ],
          transition: { duration: 0.6 }
        }}
      />

      {/* Content */}
      <span className="relative z-10">
        {children}
      </span>
    </motion.button>
  );
}

// Componente para cards interativos
interface InteractiveCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverScale?: number;
  glowOnHover?: boolean;
}

export function InteractiveCard({
  children,
  className = '',
  onClick,
  hoverScale = 1.02,
  glowOnHover = false
}: InteractiveCardProps) {
  const { ref, style } = useMouseParallax(0.02);

  return (
    <motion.div
      ref={ref}
      className={`relative cursor-pointer ${className}`}
      onClick={onClick}
      style={style}
      whileHover={{ 
        scale: hoverScale,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
      whileTap={{ 
        scale: 0.98,
        transition: { type: "spring", stiffness: 400, damping: 10 }
      }}
    >
      {/* Glow effect */}
      {glowOnHover && (
        <motion.div
          className="absolute -inset-1 rounded-lg bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 blur-sm"
          initial={{ opacity: 0 }}
          whileHover={{ 
            opacity: 1,
            transition: { duration: 0.3 }
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}