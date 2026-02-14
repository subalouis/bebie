
import React, { useEffect, useRef } from 'react';

export const HeartBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createHeart = () => {
      const heart = document.createElement('div');
      heart.innerHTML = '❤';
      heart.classList.add('heart-particle');
      
      const size = Math.random() * 20 + 10;
      const left = Math.random() * 100;
      const duration = Math.random() * 3 + 3;
      const opacity = Math.random() * 0.5 + 0.3;

      heart.style.fontSize = `${size}px`;
      heart.style.left = `${left}%`;
      heart.style.animationDuration = `${duration}s`;
      heart.style.opacity = opacity.toString();
      heart.style.color = '#fb7185'; // Rose-400

      container.appendChild(heart);

      setTimeout(() => {
        heart.remove();
      }, duration * 1000);
    };

    const interval = setInterval(createHeart, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 overflow-hidden pointer-events-none" 
      aria-hidden="true" 
    />
  );
};
