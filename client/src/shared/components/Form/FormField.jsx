import React from 'react';
import './FormField.css';

/**
 * Reusable form field component with built-in error handling
 */
const FormField = React.memo(({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  const hasError = Boolean(error);
  const fieldClassName = `form-input ${hasError ? 'is-error' : ''} ${className}`.trim();

  return (
    <div className="form-field">
      <label className="form-label" htmlFor={id}>
        {label}
        {required && <span className="form-required">*</span>}
      </label>

      <input
        id={id}
        className={fieldClassName}
        type={type}
        placeholder={placeholder}
        value={value || ''}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${id}-error` : undefined}
        {...props}
      />

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

FormField.displayName = 'FormField';

export default FormField;