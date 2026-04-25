import React from 'react';
import './skeleton.css';

/* ==========================================================================
   Skeleton Primitives — Base building blocks
   ========================================================================== */

type SkeletonVariant = 'rect' | 'circle' | 'text' | 'title' | 'button' | 'icon' | 'icon-lg';

interface SkeletonProps {
  /** Shape variant */
  variant?: SkeletonVariant;
  /** Custom width (CSS value) */
  width?: string;
  /** Custom height (CSS value) */
  height?: string;
  /** Additional CSS class */
  className?: string;
  /** Accessible label for screen readers */
  'aria-label'?: string;
}

const variantClassMap: Record<SkeletonVariant, string> = {
  rect: '',
  circle: 'skeleton--circle',
  text: 'skeleton--text',
  title: 'skeleton--title',
  button: 'skeleton--button',
  icon: 'skeleton--icon',
  'icon-lg': 'skeleton--icon-lg',
};

/**
 * Base skeleton primitive.
 * Renders a single animated placeholder element.
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rect',
  width,
  height,
  className = '',
  'aria-label': ariaLabel,
}) => {
  const variantClass = variantClassMap[variant];
  const style: React.CSSProperties = {};
  if (width) style.width = width;
  if (height) style.height = height;

  return (
    <div
      className={`skeleton ${variantClass} ${className}`.trim()}
      style={Object.keys(style).length > 0 ? style : undefined}
      aria-hidden={!ariaLabel}
      aria-label={ariaLabel}
      role={ariaLabel ? 'status' : undefined}
    />
  );
};

/* ==========================================================================
   Composite Skeletons — Mirror real card layouts
   ========================================================================== */

/**
 * Skeleton for `.feature-card` on the Landing Page.
 * Icon (56×56) + title + 2 text lines.
 */
export const SkeletonFeatureCard: React.FC = () => (
  <div className="skeleton-feature-card" aria-hidden="true">
    <Skeleton variant="icon-lg" />
    <Skeleton variant="title" />
    <div className="skeleton-feature-card__lines">
      <Skeleton variant="text" />
      <Skeleton variant="text" />
    </div>
  </div>
);

/**
 * Skeleton for `.suggestion` card on the Chat welcome screen.
 * Icon + title header, then 3 text lines.
 */
export const SkeletonSuggestionCard: React.FC = () => (
  <div className="skeleton-suggestion-card" aria-hidden="true">
    <div className="skeleton-suggestion-card__header">
      <Skeleton variant="icon" />
      <Skeleton variant="title" />
    </div>
    <div className="skeleton-suggestion-card__body">
      <Skeleton variant="text" />
      <Skeleton variant="text" />
      <Skeleton variant="text" />
    </div>
  </div>
);

/**
 * Skeleton for `.message` in the chat.
 * Avatar circle + content lines.
 */
interface SkeletonChatMessageProps {
  /** Whether this represents a user message (right-aligned) */
  isUser?: boolean;
}

export const SkeletonChatMessage: React.FC<SkeletonChatMessageProps> = ({ isUser = false }) => (
  <div
    className={`skeleton-chat-message ${isUser ? 'skeleton-chat-message--user' : ''}`}
    aria-hidden="true"
  >
    {!isUser && (
      <Skeleton variant="circle" className="skeleton-chat-message__avatar" />
    )}
    <div className="skeleton-chat-message__content">
      <Skeleton variant="text" />
      <Skeleton variant="text" />
      {!isUser && <Skeleton variant="text" />}
    </div>
  </div>
);

/**
 * Skeleton for `.modal-card` / `.modal-hero`.
 * Icon + title header, then 3 text lines.
 */
export const SkeletonModalCard: React.FC = () => (
  <div className="skeleton-modal-card" aria-hidden="true">
    <div className="skeleton-modal-card__header">
      <Skeleton variant="icon" />
      <Skeleton variant="title" width="40%" />
    </div>
    <div className="skeleton-modal-card__lines">
      <Skeleton variant="text" />
      <Skeleton variant="text" />
      <Skeleton variant="text" />
    </div>
  </div>
);

/* ==========================================================================
   Page-level Skeletons — Used as Suspense fallback
   ========================================================================== */

/**
 * Full-page skeleton for the Landing Page.
 * Hero section (title + subtitle + CTA + visual card) + 3 feature cards.
 */
export const SkeletonLandingPage: React.FC = () => (
  <div className="skeleton-landing-page" role="status" aria-label="Carregando página...">
    <div className="skeleton-landing-hero">
      <div className="skeleton-landing-hero__text">
        <Skeleton variant="title" />
        <Skeleton variant="title" />
        <div className="skeleton-landing-hero__subtitle">
          <Skeleton variant="text" />
          <Skeleton variant="text" />
        </div>
        <div className="skeleton-landing-hero__actions">
          <Skeleton variant="button" width="180px" height="48px" />
          <Skeleton variant="button" width="150px" height="48px" />
        </div>
      </div>
      <Skeleton className="skeleton-landing-hero__visual" />
    </div>
    <div className="skeleton-landing-features">
      <SkeletonFeatureCard />
      <SkeletonFeatureCard />
      <SkeletonFeatureCard />
    </div>
  </div>
);

/**
 * Full-page skeleton for the Chat Page.
 * Welcome title + 4 suggestion cards + input bar.
 */
export const SkeletonChatPage: React.FC = () => (
  <div className="skeleton-chat-page" role="status" aria-label="Carregando chat...">
    <div className="skeleton-chat-welcome">
      <Skeleton variant="title" />
      <Skeleton variant="title" />
    </div>
    <div className="skeleton-chat-suggestions">
      <SkeletonSuggestionCard />
      <SkeletonSuggestionCard />
      <SkeletonSuggestionCard />
      <SkeletonSuggestionCard />
    </div>
    <Skeleton className="skeleton-chat-input" />
  </div>
);

/* ==========================================================================
   Default export (backward compatibility)
   ========================================================================== */

export default Skeleton;