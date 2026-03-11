import { useEffect, useRef } from 'react';
import { useMotionValue, useSpring, useTransform } from 'framer-motion';

interface ParallaxOptions {
  speed?: number;
  rotate?: boolean;
  scale?: boolean;
  opacity?: boolean;
}

export function useAdvancedParallax(options: ParallaxOptions = {}) {
  const { speed = 0.5, rotate = false, scale = false, opacity = false } = options;
  
  const ref = useRef<HTMLElement>(null);
  const scrollY = useMotionValue(0);
  const scrollYSpring = useSpring(scrollY, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      const scrolled = window.scrollY;
      const elementTop = rect.top + scrolled;
      const elementHeight = rect.height;
      const windowHeight = window.innerHeight;
      
      // Calcular progresso do scroll para este elemento
      const progress = (scrolled - elementTop + windowHeight) / (windowHeight + elementHeight);
      const clampedProgress = Math.max(0, Math.min(1, progress));
      
      scrollY.set(clampedProgress);
    };

    const throttledScroll = throttle(handleScroll, 16);
    window.addEventListener('scroll', throttledScroll, { passive: true });
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [scrollY]);

  // Transformações baseadas no scroll
  const y = useTransform(scrollYSpring, [0, 1], [0, speed * -100]);
  const rotateX = rotate ? useTransform(scrollYSpring, [0, 1], [0, 360]) : 0;
  const scaleValue = scale ? useTransform(scrollYSpring, [0, 0.5, 1], [1, 1.1, 1]) : 1;
  const opacityValue = opacity ? useTransform(scrollYSpring, [0, 0.5, 1], [1, 0.8, 0.6]) : 1;

  return {
    ref,
    style: {
      y,
      rotate: rotateX,
      scale: scaleValue,
      opacity: opacityValue,
    },
    progress: scrollYSpring
  };
}

export function useMouseParallax(strength: number = 0.1) {
  const ref = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const mouseXSpring = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(mouseY, { stiffness: 300, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;
      
      mouseX.set(deltaX);
      mouseY.set(deltaY);
    };

    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    if (ref.current) {
      ref.current.addEventListener('mousemove', handleMouseMove);
      ref.current.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (ref.current) {
        ref.current.removeEventListener('mousemove', handleMouseMove);
        ref.current.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [mouseX, mouseY, strength]);

  return {
    ref,
    style: {
      x: mouseXSpring,
      y: mouseYSpring,
    }
  };
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