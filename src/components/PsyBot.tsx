import React, { useState, useEffect, useRef } from 'react';
import '../styles/psybot.css';

interface PsyBotProps {
  isAnalyzing?: boolean;
  isInputFocused?: boolean;
  isHappy?: boolean;
  isSmiling?: boolean;
  isWinking?: boolean;
  isDizzy?: boolean;
  eyePos?: { x: number; y: number };
  reducedMotion?: boolean;
  isOpen?: boolean;
  onClick?: () => void;
}

const PsyBot: React.FC<PsyBotProps> = ({
  isAnalyzing = false,
  isInputFocused = false,
  isHappy = false,
  isSmiling = false,
  isWinking = false,
  isDizzy = false,
  eyePos = { x: 0, y: 0 },
  reducedMotion = false,
  isOpen = true,
  onClick
}) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [isSleeping, setIsSleeping] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [internalWink, setInternalWink] = useState(false);
  const [internalDizzy, setInternalDizzy] = useState(false);
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const effectiveWink = isWinking || internalWink;
  const effectiveDizzy = isDizzy || internalDizzy;

  // Auto blinking logic
  useEffect(() => {
    if (reducedMotion || isSleeping) return;
    let timeoutId: NodeJS.Timeout;
    const intervalId = setInterval(() => {
      setIsBlinking(true);
      timeoutId = setTimeout(() => setIsBlinking(false), 150);
    }, 4000);
    return () => {
      clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [reducedMotion, isSleeping]);

  // Idle Timer Logic
  useEffect(() => {
    if (!isOpen) return;

    const resetIdleTimer = () => {
      setIsSleeping(false);
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      idleTimeoutRef.current = setTimeout(() => {
        setIsSleeping(true);
      }, 15000);
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetIdleTimer));

    resetIdleTimer();

    return () => {
      events.forEach(event => window.removeEventListener(event, resetIdleTimer));
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    };
  }, [isOpen]);

  const handleAvatarClick = () => {
    onClick?.();

    if (effectiveDizzy) return;

    setClickCount((previousValue) => {
      const nextValue = previousValue + 1;

      if (nextValue >= 5) {
        setInternalDizzy(true);
        setTimeout(() => {
          setInternalDizzy(false);
          setClickCount(0);
        }, 3000);
        return 0;
      }

      return nextValue;
    });

    if (!effectiveWink) {
      setInternalWink(true);
      setTimeout(() => setInternalWink(false), 800);
    }
  };

  const effectiveEyePos = isSleeping || effectiveDizzy ? { x: 0, y: 0 } : eyePos;

  return (
    <div 
      className={`psybot-avatar ${isSleeping ? 'sleeping' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleAvatarClick}
    >
      <svg viewBox="0 0 120 120" className="psybot-svg">
        <defs>
          <linearGradient id="botGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--primary-color, #0b57d0)" stopOpacity="0.1" />
            <stop offset="100%" stopColor="var(--primary-color, #0b57d0)" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="screenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e1f20" />
            <stop offset="100%" stopColor="#0a0a0a" />
          </linearGradient>
        </defs>

        <g className="bot-container" style={{ transform: isSleeping ? 'translateY(5px) rotate(2deg)' : 'none', transition: 'all 2s ease-in-out' }}>
          {/* Floating Zzz */}
          {isSleeping && (
            <g className="zzz-group">
              <text x="78" y="12" fill="#38BDF8" fontSize="12" fontWeight="bold" style={{ animation: 'floatZzz 3s infinite' }}>Z</text>
              <text x="85" y="0" fill="#38BDF8" fontSize="10" fontWeight="bold" style={{ animation: 'floatZzz 3s infinite 0.5s' }}>z</text>
              <text x="92" y="-10" fill="#38BDF8" fontSize="8" fontWeight="bold" style={{ animation: 'floatZzz 3s infinite 1s' }}>z</text>
            </g>
          )}

          {/* Antenna Base & Stick */}
          <path d="M 50 30 Q 60 22 70 30" fill="none" stroke="var(--primary-color, #0b57d0)" strokeWidth="4" strokeLinecap="round" />
          <line x1="60" y1="26" x2="60" y2="10" stroke="var(--primary-color, #0b57d0)" strokeWidth="4" strokeLinecap="round" />

          {/* Antenna Bulb */}
          <circle 
            cx="60" 
            cy="10" 
            r={isAnalyzing || isInputFocused || isHappy ? "7" : "5"} 
            fill={isSleeping ? "rgba(255,255,255,0.2)" : isHappy ? "#FDE047" : isAnalyzing ? "#F59E0B" : isInputFocused ? "#10B981" : "var(--primary-color, #0b57d0)"} 
            style={{ 
              transition: 'all 0.3s ease',
              filter: isSleeping 
                ? 'none'
                : isHappy 
                  ? 'drop-shadow(0 0 8px #FDE047)'
                  : isAnalyzing 
                    ? 'drop-shadow(0 0 6px #F59E0B)' 
                    : isInputFocused 
                      ? 'drop-shadow(0 0 6px #10B981)' 
                      : 'none'
            }}
          />

          {/* Main Body */}
          <rect 
            x="20" 
            y="30" 
            width="80" 
            height="75" 
            rx="35" 
            fill="url(#botGradient)" 
            stroke="var(--primary-color, #0b57d0)" 
            strokeWidth="4" 
          />

          {/* Glowing Core */}
          <circle 
            cx="60" 
            cy="92" 
            r="4" 
            fill="var(--primary-color, #0b57d0)" 
            style={{ animation: 'pulseGlow 2s ease-in-out infinite', transformOrigin: '60px 92px' }} 
          />
          <circle 
            cx="60" 
            cy="92" 
            r="1.5" 
            fill="#fff" 
            style={{ animation: 'pulseGlow 2s ease-in-out infinite', transformOrigin: '60px 92px' }} 
          />

          {/* Screen */}
          <rect 
            x="28" 
            y="40" 
            width="64" 
            height="46" 
            rx="20" 
            fill="url(#screenGradient)" 
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1.5"
          />
          
          {/* Screen Reflection */}
          <path 
            d="M 32 44 Q 60 38 88 44 Q 85 55 60 55 Q 35 55 32 44" 
            fill="rgba(255,255,255,0.06)" 
          />

          {/* Cheeks */}
          <circle cx="38" cy="68" r="5" fill="#EC4899" opacity={isSleeping ? "0" : (isSmiling || isHovered || effectiveDizzy || isHappy) ? "0.6" : "0"} style={{ transition: 'opacity 0.4s ease', filter: 'drop-shadow(0 0 4px #EC4899)' }} />
          <circle cx="82" cy="68" r="5" fill="#EC4899" opacity={isSleeping ? "0" : (isSmiling || isHovered || effectiveDizzy || isHappy) ? "0.6" : "0"} style={{ transition: 'opacity 0.4s ease', filter: 'drop-shadow(0 0 4px #EC4899)' }} />

          {/* Eyes Group */}
          <g style={{ transform: `translate(${effectiveEyePos.x}px, ${effectiveEyePos.y}px)`, transition: 'transform 0.05s linear' }}>
            {/* Left Eye */}
            {isSleeping ? (
              <path d="M 40 64 Q 45 60 50 64" fill="none" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 6px #38BDF8)' }} />
            ) : effectiveDizzy ? (
              <path d="M 40 58 L 50 68 M 40 68 L 50 58" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 6px #38BDF8)' }} />
            ) : (effectiveWink || isBlinking) ? (
              <path d="M 40 62 L 50 62" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 6px #38BDF8)' }} />
            ) : (isSmiling || isHappy) ? (
              <path d="M 40 64 Q 45 56 50 64" fill="none" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 6px #38BDF8)' }} />
            ) : (
              <circle cx="45" cy="62" r="5.5" fill="#38BDF8" style={{ filter: 'drop-shadow(0 0 6px #38BDF8)' }} />
            )}

            {/* Right Eye */}
            {isSleeping ? (
              <path d="M 70 64 Q 75 60 80 64" fill="none" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 6px #38BDF8)' }} />
            ) : effectiveDizzy ? (
              <path d="M 70 58 L 80 68 M 70 68 L 80 58" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 6px #38BDF8)' }} />
            ) : (isBlinking && !effectiveWink) ? (
              <path d="M 70 62 L 80 62" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 6px #38BDF8)' }} />
            ) : (isSmiling || isHappy) ? (
              <path d="M 70 64 Q 75 56 80 64" fill="none" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 6px #38BDF8)' }} />
            ) : (
              <circle cx="75" cy="62" r="5.5" fill="#38BDF8" style={{ filter: 'drop-shadow(0 0 6px #38BDF8)' }} />
            )}
          </g>
          
          {/* Mouth */}
          <path 
            d={effectiveDizzy ? "M 55 75 Q 60 70 65 75" : (isSmiling || isHappy) ? "M 56 74 Q 60 78 64 74" : "M 58 74 L 62 74"} 
            fill="none" 
            stroke="#38BDF8" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            opacity={isSleeping ? "0" : (isSmiling || isAnalyzing || effectiveDizzy || isHappy) ? "1" : "0.2"}
            style={{ transition: 'all 0.3s ease' }}
          />
        </g>
      </svg>
    </div>
  );
};

export default PsyBot;
