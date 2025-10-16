/**
 * Reusable validation rules for forms
 * Each rule is a function that returns an error message or null
 */

// Required field validation
export const required = (fieldName = 'Este campo') => (value) => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} es obligatorio.`;
  }
  return null;
};

// Minimum length validation
export const minLength = (min, fieldName = 'Este campo') => (value) => {
  if (value && value.length < min) {
    return `${fieldName} debe tener al menos ${min} caracteres.`;
  }
  return null;
};

// Maximum length validation
export const maxLength = (max, fieldName = 'Este campo') => (value) => {
  if (value && value.length > max) {
    return `${fieldName} no puede tener más de ${max} caracteres.`;
  }
  return null;
};

// Positive number validation
export const positiveNumber = (fieldName = 'Este valor') => (value) => {
  const numValue = Number(value);
  if (isNaN(numValue) || numValue <= 0) {
    return `${fieldName} debe ser un número positivo.`;
  }
  return null;
};

// Minimum value validation
export const minValue = (min, fieldName = 'Este valor') => (value) => {
  const numValue = Number(value);
  if (!isNaN(numValue) && numValue < min) {
    return `${fieldName} debe ser mayor a ${min}.`;
  }
  return null;
};

// Maximum value validation
export const maxValue = (max, fieldName = 'Este valor') => (value) => {
  const numValue = Number(value);
  if (!isNaN(numValue) && numValue > max) {
    return `${fieldName} debe ser menor a ${max}.`;
  }
  return null;
};

// Email validation
export const email = (fieldName = 'El email') => (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (value && !emailRegex.test(value)) {
    return `${fieldName} no tiene un formato válido.`;
  }
  return null;
};

// Custom validation for arrays (like file uploads)
export const minArrayLength = (min, fieldName = 'Los elementos') => (array) => {
  if (!Array.isArray(array) || array.length < min) {
    return `${fieldName} debe tener al menos ${min} elemento(s).`;
  }
  return null;
};

// Validation rules specifically for PublishProduct form
export const productValidationRules = {
  categoriaId: [
    required('La categoría')
  ],
  estadoProductoId: [
    required('El estado del producto')
  ],
  titulo: [
    required('El título'),
    minLength(3, 'El título'),
    maxLength(100, 'El título')
  ],
  valorEstimado: [
    required('El valor estimado'),
    positiveNumber('El valor estimado'),
    minValue(1000, 'El valor estimado')
  ],
  descripcion: [
    required('La descripción'),
    minLength(10, 'La descripción'),
    maxLength(500, 'La descripción')
  ]
};

// Additional validation for product images (to be used separately)
export const validateProductImages = (images) => {
  if (!Array.isArray(images) || images.length === 0) {
    return 'Adjunta al menos una imagen.';
  }
  return null;
};