import React, { useState, useEffect } from 'react';

/* ==========================================================================
   MaterialIcon — Wrapper with FOUT protection, translation blocking, and fallback
   
   Features:
   - Detects font loading via Document.fonts API
   - Blocks Google Translate via translate="no" attribute
   - Hides text if font fails to load (prevents broken text display)
   - Provides accessible aria-label for screen readers
   ========================================================================== */

let fontLoaded = false;
let fontFailed = false;
const listeners = new Set<() => void>();

function notifyListeners() {
  fontLoaded = true;
  listeners.forEach((cb) => cb());
  listeners.clear();
}

if (typeof document !== 'undefined' && typeof document.fonts !== 'undefined') {
  if (document.fonts.check('24px "Material Symbols Outlined"')) {
    fontLoaded = true;
  } else {
    document.fonts.ready
      .then(() => {
        notifyListeners();
      })
      .catch(() => {
        fontFailed = true;
        notifyListeners();
      });
  }
}

interface MaterialIconProps {
  name: string;
  className?: string;
  style?: React.CSSProperties;
  size?: number;
  'aria-hidden'?: boolean;
  'aria-label'?: string;
}

const MaterialIcon: React.FC<MaterialIconProps> = ({
  name,
  className = '',
  style,
  size,
  'aria-hidden': ariaHidden = true,
  'aria-label': ariaLabel,
}) => {
  const [isReady, setIsReady] = useState(fontLoaded);
  const [hasFailed, setHasFailed] = useState(fontFailed);

  useEffect(() => {
    if (fontLoaded) {
      setIsReady(true);
      return;
    }

    const onReady = () => {
      setIsReady(true);
      setHasFailed(fontFailed);
    };
    listeners.add(onReady);

    return () => {
      listeners.delete(onReady);
    };
  }, []);

  const mergedStyle: React.CSSProperties = {
    ...style,
    visibility: isReady ? 'visible' : 'hidden',
    ...(size ? { fontSize: `${size}px` } : {}),
    ...(hasFailed ? { color: 'transparent', fontSize: '0' } : {}),
  };

  return (
    <span
      className={`material-symbols-outlined ${className}`.trim()}
      style={mergedStyle}
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
      translate="no"
    >
      {name}
    </span>
  );
};

export default MaterialIcon;
