import React, { useEffect, useRef } from 'react';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  animation?: 'fadeInUp' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn' | 'slideInUp';
  hover?: boolean;
}

export default function AnimatedCard({ 
  children, 
  className = '', 
  delay = 0, 
  animation = 'fadeInUp',
  hover = true 
}: AnimatedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    const element = cardRef.current;

    // CSS-based animations using classes
    element.style.opacity = '0';
    element.style.transform = getInitialTransform(animation);
    element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

    const timer = setTimeout(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateX(0) translateY(0) scale(1)';
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, animation]);

  const getInitialTransform = (animationType: string) => {
    switch (animationType) {
      case 'fadeInUp':
      case 'slideInUp':
        return 'translateY(30px)';
      case 'fadeInLeft':
        return 'translateX(-30px)';
      case 'fadeInRight':
        return 'translateX(30px)';
      case 'scaleIn':
        return 'scale(0.9)';
      default:
        return 'translateY(30px)';
    }
  };

  const hoverClasses = hover 
    ? 'hover:scale-105 hover:-translate-y-1 transition-transform duration-200' 
    : '';

  return (
    <div ref={cardRef} className={`${className} ${hoverClasses}`}>
      {children}
    </div>
  );
}