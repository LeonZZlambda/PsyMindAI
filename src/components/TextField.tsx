import React, { useState, useRef, useEffect } from 'react';
import '../styles/text-field.css';

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  variant?: 'filled' | 'outlined';
  leadingIcon?: string;
  trailingIcon?: string;
  onTrailingIconClick?: () => void;
  error?: string;
  multiline?: boolean;
  rows?: number;
}

export const TextField = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, TextFieldProps>(({
  label,
  variant = 'filled',
  leadingIcon,
  trailingIcon,
  onTrailingIconClick,
  error,
  multiline,
  className = '',
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  // Internal ref to check value if uncontrolled
  const internalRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Expose both the passed ref and internal ref
  const setRefs = (node: HTMLInputElement | HTMLTextAreaElement | null) => {
    internalRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node as any;
    }
  };

  const checkValue = (val: any) => {
    if (val !== undefined && val !== null && val !== '') {
      setHasValue(true);
    } else {
      setHasValue(false);
    }
  };

  useEffect(() => {
    if (value !== undefined) {
      checkValue(value);
    } else if (internalRef.current) {
      checkValue(internalRef.current.value);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<any>) => {
    checkValue(e.target.value);
    if (onChange) onChange(e);
  };

  const handleFocus = (e: React.FocusEvent<any>) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: React.FocusEvent<any>) => {
    setIsFocused(false);
    if (internalRef.current) {
      checkValue(internalRef.current.value);
    }
    if (onBlur) onBlur(e);
  };

  const isFloating = isFocused || hasValue;

  const containerClasses = [
    'md-text-field',
    `md-text-field--${variant}`,
    isFocused ? 'md-text-field--focused' : '',
    isFloating ? 'md-text-field--floating' : '',
    error ? 'md-text-field--error' : '',
    leadingIcon ? 'md-text-field--with-leading-icon' : '',
    trailingIcon ? 'md-text-field--with-trailing-icon' : '',
    multiline ? 'md-text-field--multiline' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      <div className="md-text-field__container">
        {leadingIcon && (
          <span className="material-symbols-outlined md-text-field__icon md-text-field__leading-icon">
            {leadingIcon}
          </span>
        )}

        <div className="md-text-field__wrapper">
          {multiline ? (
            <textarea
              className="md-text-field__input"
              ref={setRefs as any}
              value={value}
              defaultValue={defaultValue}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              {...(props as any)}
            />
          ) : (
            <input
              className="md-text-field__input"
              ref={setRefs as any}
              value={value}
              defaultValue={defaultValue}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              {...props}
            />
          )}

          <label className="md-text-field__label">
            {label}
          </label>
        </div>

        {trailingIcon && (
          <span 
            className={`material-symbols-outlined md-text-field__icon md-text-field__trailing-icon ${onTrailingIconClick ? 'md-text-field__icon--clickable' : ''}`}
            onClick={onTrailingIconClick}
          >
            {trailingIcon}
          </span>
        )}

        {variant === 'filled' && <div className="md-text-field__active-indicator" />}
        
        {variant === 'outlined' && (
          <div className="md-text-field__outline">
            <div className="md-text-field__outline-leading" />
            <div className="md-text-field__outline-notch">
              <span className="md-text-field__label-spacer">{label}</span>
            </div>
            <div className="md-text-field__outline-trailing" />
          </div>
        )}
      </div>

      {error && (
        <div className="md-text-field__supporting-text md-text-field__error-text">
          {error}
        </div>
      )}
    </div>
  );
});

export default TextField;
