import React from 'react';
import './FormField.css';

/**
 * Reusable textarea field component with built-in error handling
 */
const TextAreaField = React.memo(({
  id,
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  required = false,
  rows = 4,
  maxLength,
  className = '',
  showCharacterCount = false,
  ...props
}) => {
  const hasError = Boolean(error);
  const fieldClassName = `form-textarea ${hasError ? 'is-error' : ''} ${className}`.trim();
  const currentLength = value ? value.length : 0;

  return (
    <div className="form-field">
      <label className="form-label" htmlFor={id}>
        {label}
        {required && <span className="form-required">*</span>}
      </label>

      <textarea
        id={id}
        className={fieldClassName}
        placeholder={placeholder}
        value={value || ''}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${id}-error` : undefined}
        {...props}
      />

      {showCharacterCount && maxLength && (
        <div className="form-character-count">
          {currentLength}/{maxLength}
        </div>
      )}

      {error && (
        <p
          id={`${id}-error`}
          className="form-error"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
});

TextAreaField.displayName = 'TextAreaField';

export default TextAreaField;