import React from 'react';
import './FormField.css';

/**
 * Reusable select field component with built-in error handling
 */
const SelectField = React.memo(({
  id,
  label,
  placeholder = 'Selecciona una opción...',
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  required = false,
  loading = false,
  options = [],
  className = '',
  ...props
}) => {
  const hasError = Boolean(error);
  const fieldClassName = `form-input form-select ${hasError ? 'is-error' : ''} ${className}`.trim();

  return (
    <div className="form-field">
      <label className="form-label" htmlFor={id}>
        {label}
        {required && <span className="form-required">*</span>}
      </label>

      <select
        id={id}
        className={fieldClassName}
        value={value || ''}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled || loading}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${id}-error` : undefined}
        {...props}
      >
        <option value="">
          {loading ? 'Cargando opciones...' : placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

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

SelectField.displayName = 'SelectField';

export default SelectField;