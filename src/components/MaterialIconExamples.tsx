/**
 * Example: Protected Material Icons Usage
 * 
 * This file demonstrates best practices for using MaterialIcon
 * with full protection against translation and font failures.
 */

import MaterialIcon from './MaterialIcon';

/**
 * Example 1: Decorative Icon (hidden from screen readers)
 * Use when the icon is purely visual and context is clear from text
 */
export function DecorativeIconExample() {
  return (
    <button>
      <MaterialIcon name="menu" />
      Menu
    </button>
  );
}

/**
 * Example 2: Icon with Semantic Meaning (exposed to screen readers)
 * Use when the icon conveys important information
 */
export function SemanticIconExample() {
  return (
    <button
      aria-label="Open psychology insights"
      title="Psychology Insights"
    >
      <MaterialIcon 
        name="psychology" 
        aria-label="Psychology"
        aria-hidden={false}
      />
    </button>
  );
}

/**
 * Example 3: Icon with Custom Size
 * Demonstrates size customization with protection
 */
export function CustomSizeIconExample() {
  return (
    <div>
      <MaterialIcon name="settings" size={16} />
      <MaterialIcon name="settings" size={24} />
      <MaterialIcon name="settings" size={32} />
      <MaterialIcon name="settings" size={48} />
    </div>
  );
}

/**
 * Example 4: Icon in a Card Component
 * Real-world usage pattern
 */
export function CardWithIconExample() {
  return (
    <div className="card">
      <div className="card-header">
        <MaterialIcon 
          name="favorite" 
          className="card-icon"
          aria-hidden={true}
        />
        <h3>Emotional Support</h3>
      </div>
      <p>Get personalized guidance for emotional well-being.</p>
    </div>
  );
}

/**
 * Example 5: Icon Button with Tooltip
 * Accessible icon button pattern
 */
export function IconButtonExample() {
  return (
    <button
      className="icon-button"
      aria-label="Close dialog"
      title="Close (Esc)"
    >
      <MaterialIcon 
        name="close" 
        aria-hidden={true}
      />
    </button>
  );
}

/**
 * Example 6: Icon List
 * Multiple icons with protection
 */
export function IconListExample() {
  const features = [
    { icon: 'psychology', label: 'Psychology-based' },
    { icon: 'security', label: 'Privacy-first' },
    { icon: 'speed', label: 'Fast & responsive' },
  ];

  return (
    <ul className="feature-list">
      {features.map((feature) => (
        <li key={feature.icon}>
          <MaterialIcon 
            name={feature.icon}
            aria-hidden={true}
          />
          <span>{feature.label}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Example 7: Status Icon with Color
 * Icon with inline styling
 */
export function StatusIconExample() {
  return (
    <div className="status">
      <MaterialIcon 
        name="check_circle" 
        style={{ color: '#4caf50' }}
        aria-label="Success"
        aria-hidden={false}
      />
      <span>Operation completed successfully</span>
    </div>
  );
}

/**
 * Example 8: Loading State with Icon
 * Icon with animation class
 */
export function LoadingIconExample() {
  return (
    <div className="loading">
      <MaterialIcon 
        name="hourglass_empty" 
        className="spin"
        aria-label="Loading"
        aria-hidden={false}
      />
      <span>Processing...</span>
    </div>
  );
}

/**
 * CSS for animations (add to your stylesheet)
 * 
 * .spin {
 *   animation: spin 1s linear infinite;
 * }
 * 
 * @keyframes spin {
 *   from { transform: rotate(0deg); }
 *   to { transform: rotate(360deg); }
 * }
 */
