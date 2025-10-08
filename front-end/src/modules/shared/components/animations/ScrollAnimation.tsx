'use client';
import { useEffect, useRef, useState } from 'react';

interface ScrollAnimationProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
  delay?: number;
}

export function ScrollAnimation({ 
  children, 
  direction = 'up', 
  duration = 800, 
  delay = 0 
}: ScrollAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay]);

  const getAnimationStyles = () => {
    if (!isVisible) {
      switch (direction) {
        case 'up': return 'translateY(30px)';
        case 'down': return 'translateY(-30px)';
        case 'left': return 'translateX(30px)';
        case 'right': return 'translateX(-30px)';
        default: return 'translateY(30px)';
      }
    }
    return 'translateY(0) translateX(0)';
  };

  return (
    <div 
      ref={ref}
      style={{ 
        transform: getAnimationStyles(),
        opacity: isVisible ? 1 : 0,
        transition: `all ${duration}ms ease-out`,
        transitionDelay: `${delay}ms`,
        width: '100%',
        height: 'auto'
      }}
    >
      {children}
    </div>
  );
}