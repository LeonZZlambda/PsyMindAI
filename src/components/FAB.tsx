import React from 'react';
import '../styles/fab.css';
import GlobalRipple from './GlobalRipple'; // We'll rely on global ripple matching .action-btn or .primary-btn, but let's just make sure FAB has the class that triggers it, or we add .md-fab to GlobalRipple

interface FABProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  variant?: 'surface' | 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'regular' | 'large';
  extendedText?: string;
  isExtended?: boolean;
}

export const FAB: React.FC<FABProps> = ({
  icon,
  variant = 'primary',
  size = 'regular',
  extendedText,
  isExtended = false,
  className = '',
  children,
  ...props
}) => {
  const classes = [
    'md-fab',
    `md-fab--${variant}`,
    `md-fab--${size}`,
    (isExtended || extendedText) ? 'md-fab--extended' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button className={classes} {...props}>
      <span className="material-symbols-outlined md-fab__icon">{icon}</span>
      {(isExtended || extendedText) && (
        <span className="md-fab__text">{extendedText || children}</span>
      )}
    </button>
  );
};

export default FAB;
