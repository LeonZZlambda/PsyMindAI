import React from 'react';
import '../../styles/skeleton.css';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  variant = 'text',
  className = '',
  style,
}) => {
  const baseStyle: React.CSSProperties = {
    width,
    height,
    ...style,
  };

  return (
    <div
      className={`skeleton skeleton-${variant} ${className}`}
      style={baseStyle}
      aria-busy="true"
      aria-label="Carregando conteúdo"
      role="progressbar"
    />
  );
};

export default Skeleton;
