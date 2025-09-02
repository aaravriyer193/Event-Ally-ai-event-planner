import React, { useRef } from 'react';
import anime from 'animejs/lib/anime.es.js';
import { LucideIcon } from 'lucide-react';

interface AnimatedButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
  className?: string;
  animation?: 'pulse' | 'bounce' | 'glow' | 'shake';
}

export default function AnimatedButton({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  animation = 'glow'
}: AnimatedButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 relative overflow-hidden';
  
  const variants = {
    primary: 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black shadow-lg shadow-orange-500/25',
    secondary: 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 hover:border-gray-600',
    ghost: 'text-gray-400 hover:text-white hover:bg-gray-800/50'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const disabledClasses = disabled 
    ? 'opacity-50 cursor-not-allowed' 
    : '';

  const handleClick = () => {
    if (disabled || !buttonRef.current) return;

    const button = buttonRef.current;

    // Button click animations
    switch (animation) {
      case 'pulse':
        anime({
          targets: button,
          scale: [1, 1.05, 1],
          duration: 300,
          easing: 'easeOutQuad'
        });
        break;
      
      case 'bounce':
        anime({
          targets: button,
          translateY: [0, -3, 0],
          duration: 400,
          easing: 'easeOutBounce'
        });
        break;
      
      case 'glow':
        anime({
          targets: button,
          boxShadow: [
            '0 4px 15px rgba(251, 146, 60, 0.25)',
            '0 8px 25px rgba(251, 146, 60, 0.4)',
            '0 4px 15px rgba(251, 146, 60, 0.25)'
          ],
          duration: 600,
          easing: 'easeInOutQuad'
        });
        break;
      
      case 'shake':
        anime({
          targets: button,
          translateX: [0, -2, 2, -2, 2, 0],
          duration: 400,
          easing: 'easeInOutQuad'
        });
        break;
    }

    // Ripple effect
    const ripple = document.createElement('span');
    ripple.className = 'absolute inset-0 bg-white/20 rounded-lg';
    ripple.style.transform = 'scale(0)';
    button.appendChild(ripple);

    anime({
      targets: ripple,
      scale: [0, 1],
      opacity: [0.5, 0],
      duration: 600,
      easing: 'easeOutQuad',
      complete: () => {
        ripple.remove();
      }
    });

    onClick?.();
  };

  return (
    <button
      ref={buttonRef}
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
    </button>
  );
}