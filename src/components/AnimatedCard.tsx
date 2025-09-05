import React, { useEffect, useRef } from 'react';
import * as anime from 'animejs';

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

    // Initial animation based on type
    const animations = {
      fadeInUp: {
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 800,
        easing: 'easeOutCubic'
      },
      fadeInLeft: {
        opacity: [0, 1],
        translateX: [-30, 0],
        duration: 800,
        easing: 'easeOutCubic'
      },
      fadeInRight: {
        opacity: [0, 1],
        translateX: [30, 0],
        duration: 800,
        easing: 'easeOutCubic'
      },
      scaleIn: {
        opacity: [0, 1],
        scale: [0.9, 1],
        duration: 600,
        easing: 'easeOutBack'
      },
      slideInUp: {
        opacity: [0, 1],
        translateY: [50, 0],
        duration: 1000,
        easing: 'easeOutExpo'
      }
    };

    // Set initial state
    anime.set(element, {
      opacity: 0,
      ...(animation === 'fadeInUp' || animation === 'slideInUp' ? { translateY: animation === 'slideInUp' ? 50 : 30 } : {}),
      ...(animation === 'fadeInLeft' ? { translateX: -30 } : {}),
      ...(animation === 'fadeInRight' ? { translateX: 30 } : {}),
      ...(animation === 'scaleIn' ? { scale: 0.9 } : {})
    });

    // Animate in
    const timeline = anime.timeline();
    timeline.add({
      targets: element,
      ...animations[animation],
      delay
    });

    // Hover animations
    if (hover) {
      const handleMouseEnter = () => {
        anime({
          targets: element,
          scale: 1.02,
          translateY: -2,
          duration: 200,
          easing: 'easeOutQuad'
        });
      };

      const handleMouseLeave = () => {
        anime({
          targets: element,
          scale: 1,
          translateY: 0,
          duration: 200,
          easing: 'easeOutQuad'
        });
      };

      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [delay, animation, hover]);

  return (
    <div ref={cardRef} className={className}>
      {children}
    </div>
  );
}