import { ReactNode } from 'react';
import { motion, Variants } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface ScrollAnimationWrapperProps {
  children: ReactNode;
  variant?: 'fadeUp' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn' | 'slideUp' | 'rotateIn';
  delay?: number;
  duration?: number;
  threshold?: number;
  margin?: string;
  className?: string;
  triggerOnce?: boolean;
}

const animationVariants: Record<string, Variants> = {
  fadeUp: {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 }
  },
  fadeInLeft: {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0 }
  },
  fadeInRight: {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0 }
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  },
  slideUp: {
    hidden: { opacity: 0, y: 100 },
    visible: { opacity: 1, y: 0 }
  },
  rotateIn: {
    hidden: { opacity: 0, rotate: -10, scale: 0.9 },
    visible: { opacity: 1, rotate: 0, scale: 1 }
  }
};

export function ScrollAnimationWrapper({
  children,
  variant = 'fadeUp',
  delay = 0,
  duration = 0.6,
  threshold = 0.1,
  margin = '0px 0px -100px 0px',
  className = '',
  triggerOnce = true
}: ScrollAnimationWrapperProps) {
  const { ref, shouldAnimate } = useScrollAnimation({
    threshold,
    margin,
    triggerOnce,
    delay,
    duration
  });

  const variants = animationVariants[variant];

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={shouldAnimate ? "visible" : "hidden"}
      variants={variants}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}
    >
      {children}
    </motion.div>
  );
}

// Componente para animações em stagger (sequenciais)
interface StaggerWrapperProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}

export function StaggerWrapper({ 
  children, 
  staggerDelay = 0.1, 
  className = '' 
}: StaggerWrapperProps) {
  const { ref, shouldAnimate } = useScrollAnimation();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={shouldAnimate ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
}