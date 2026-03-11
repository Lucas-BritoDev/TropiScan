import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface ScrollAnimationOptions {
  threshold?: number;
  margin?: string;
  triggerOnce?: boolean;
  delay?: number;
  duration?: number;
}

export function useScrollAnimation(options: ScrollAnimationOptions = {}) {
  const {
    threshold = 0.1,
    margin = '0px 0px -100px 0px',
    triggerOnce = true,
    delay = 0,
    duration = 0.6
  } = options;

  const ref = useRef<HTMLElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  
  const isInView = useInView(ref, {
    threshold,
    margin,
    once: triggerOnce
  });

  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    // Respeitar prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      setShouldAnimate(true);
      return;
    }

    if (isInView && !hasAnimated) {
      const timer = setTimeout(() => {
        setShouldAnimate(true);
        if (triggerOnce) {
          setHasAnimated(true);
        }
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [isInView, hasAnimated, delay, triggerOnce]);

  return {
    ref,
    isInView,
    shouldAnimate,
    animationProps: {
      initial: { opacity: 0, y: 40 },
      animate: shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 },
      transition: { duration, ease: [0.22, 1, 0.36, 1] }
    }
  };
}

export function useParallaxScroll(strength: number = 0.5) {
  const [scrollY, setScrollY] = useState(0);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const scrolled = window.scrollY;
        const rate = scrolled * -strength;
        
        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
          setScrollY(rate);
        }
      }
    };

    const throttledScroll = throttle(handleScroll, 16); // ~60fps
    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [strength]);

  return { ref, scrollY };
}

// Utility function for throttling
function throttle<T extends (...args: any[]) => any>(func: T, limit: number): T {
  let inThrottle: boolean;
  return ((...args: any[]) => {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }) as T;
}