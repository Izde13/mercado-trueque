import { useState, useCallback } from 'react';

/**
 * Custom hook for form management
 * Provides form state, field updates, validation, and reset functionality
 */
export const useForm = (initialValues = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Update a specific field
  const setField = useCallback((fieldName, value) => {
    setValues(prev => ({
      ...prev,
      [fieldName]: value
    }));

    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: undefined
      }));
    }
  }, [errors]);

  // Mark field as touched (for showing validation errors)
  const setFieldTouched = useCallback((fieldName) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }));
  }, []);

  // Validate a specific field
  const validateField = useCallback((fieldName, value) => {
    const rules = validationRules[fieldName];
    if (!rules) return null;

    for (const rule of rules) {
      const error = rule(value, values);
      if (error) return error;
    }
    return null;
  }, [validationRules, values]);

  // Validate all fields
  const validate = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(fieldName => {
      const error = validateField(fieldName, values[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched(
      Object.keys(validationRules).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {})
    );

    return isValid;
  }, [validationRules, values, validateField]);

  // Reset form to initial state
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  // Handle field change with validation
  const handleChange = useCallback((fieldName) => (event) => {
    const value = event.target.value;
    setField(fieldName, value);
  }, [setField]);

  // Handle field blur for validation
  const handleBlur = useCallback((fieldName) => () => {
    setFieldTouched(fieldName);
    const error = validateField(fieldName, values[fieldName]);
    if (error) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: error
      }));
    }
  }, [setFieldTouched, validateField, values]);

  return {
    values,
    errors,
    touched,
    setField,
    setFieldTouched,
    validate,
    reset,
    handleChange,
    handleBlur,
    isFieldInvalid: (fieldName) => Boolean(errors[fieldName] && touched[fieldName]),
    hasErrors: Object.keys(errors).length > 0
  };
};