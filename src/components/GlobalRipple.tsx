import React, { useEffect } from 'react';
import '../styles/ripple.css';

export const GlobalRipple: React.FC = () => {
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      // Check if the target is a button or has a button-like class
      const target = (e.target as HTMLElement).closest(
        '.primary-btn, .secondary-btn, .danger-btn, .action-btn, .sidebar-item, .toggle-switch'
      ) as HTMLElement;

      if (!target) return;

      // Ensure the target has relative positioning and hidden overflow
      const style = window.getComputedStyle(target);
      if (style.position === 'static') {
        target.style.position = 'relative';
      }
      target.style.overflow = 'hidden';

      // Create the ripple container if it doesn't exist
      let container = target.querySelector('.ripple-container') as HTMLElement;
      if (!container) {
        container = document.createElement('div');
        container.className = 'ripple-container';
        // pointer-events: none ensures it doesn't block clicks
        container.style.pointerEvents = 'none';
        container.style.position = 'absolute';
        container.style.inset = '0';
        container.style.overflow = 'hidden';
        container.style.borderRadius = 'inherit';
        container.style.zIndex = '0';
        target.appendChild(container);
      }

      // Calculate size and position
      const rect = target.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      // Create the ripple span
      const ripple = document.createElement('span');
      ripple.className = 'ripple-span';
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      container.appendChild(ripple);

      // Cleanup after animation
      ripple.addEventListener('animationend', () => {
        ripple.remove();
        // Optional: remove container if empty
        if (container.children.length === 0) {
          container.remove();
        }
      });
    };

    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, []);

  return null; // This component only manages the global event listener
};

export default GlobalRipple;
