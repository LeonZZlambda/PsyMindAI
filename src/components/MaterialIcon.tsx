import React, { useState, useEffect } from 'react';

/* ==========================================================================
   MaterialIcon — Wrapper to prevent Flash of Unstyled Text (FOUT)
   
   Uses the Document.fonts API to detect when 'Material Symbols Outlined'
   is loaded. Until then, the icon text is hidden (visibility: hidden) to
   prevent raw text like "menu" or "settings" from flashing on screen.
   
   A module-level variable + listeners pattern ensures a single check
   is shared across all instances, avoiding redundant font-load checks.
   ========================================================================== */

/** Module-level font readiness state */
let fontLoaded = false;
const listeners = new Set<() => void>();

function notifyListeners() {
  fontLoaded = true;
  listeners.forEach((cb) => cb());
  listeners.clear();
}

// Kick off the font check once (browser only)
if (typeof document !== 'undefined' && typeof document.fonts !== 'undefined') {
  // Immediate check — font may already be cached
  if (document.fonts.check('24px "Material Symbols Outlined"')) {
    fontLoaded = true;
  } else {
    // Wait for font to finish loading
    document.fonts.ready
      .then(() => {
        notifyListeners();
      })
      .catch(() => {
        // Even on error, reveal icons (better to flash than stay invisible)
        notifyListeners();
      });
  }
}

/* -------------------------------------------------------------------------- */

interface MaterialIconProps {
  /** Icon name (e.g. "menu", "settings", "psychology") */
  name: string;
  /** Additional CSS class(es) */
  className?: string;
  /** Inline style overrides */
  style?: React.CSSProperties;
  /** Icon font-size in px (default: 24) */
  size?: number;
  /** Whether the icon is decorative (hidden from screen readers) */
  'aria-hidden'?: boolean;
}

/**
 * Renders a Material Symbols Outlined icon with FOUT protection.
 *
 * @example
 * <MaterialIcon name="menu" />
 * <MaterialIcon name="psychology" size={32} className="my-icon" />
 */
const MaterialIcon: React.FC<MaterialIconProps> = ({
  name,
  className = '',
  style,
  size,
  'aria-hidden': ariaHidden = true,
}) => {
  const [isReady, setIsReady] = useState(fontLoaded);

  useEffect(() => {
    if (fontLoaded) {
      setIsReady(true);
      return;
    }

    const onReady = () => setIsReady(true);
    listeners.add(onReady);

    return () => {
      listeners.delete(onReady);
    };
  }, []);

  const mergedStyle: React.CSSProperties = {
    ...style,
    visibility: isReady ? 'visible' : 'hidden',
    ...(size ? { fontSize: `${size}px` } : {}),
  };

  return (
    <span
      className={`material-symbols-outlined ${className}`.trim()}
      style={mergedStyle}
      aria-hidden={ariaHidden}
    >
      {name}
    </span>
  );
};

export default MaterialIcon;
