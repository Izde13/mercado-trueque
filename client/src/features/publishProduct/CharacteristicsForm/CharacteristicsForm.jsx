import React, { useMemo } from "react";
import { FormField, SelectField, TextAreaField } from "../../../shared/components/Form";
import "./CharacteristicsForm.css";

/**
 * CharacteristicsForm - Renderiza campos dinámicos según las características de la categoría
 * con validaciones y mejor UI/UX
 */
const CharacteristicsForm = React.memo(({
  characteristics = [],
  characteristicValues = {},
  handleCharacteristicChange,
  loading = false,
  error = null,
  validationErrors = {} // Para mostrar errores de validación
}) => {
  // Si no hay características, no renderizar nada
  if (!characteristics || characteristics.length === 0) {
    return null;
  }

  // Contar características requeridas y completadas
  const requiredCount = characteristics.filter(c => c.requerido).length;
  const completedCount = characteristics.filter(
    c => c.requerido && characteristicValues[c.id] && characteristicValues[c.id].trim()
  ).length;

  // Renderizar etiqueta con asterisco si es requerido
  const renderLabel = (nombre, requerido) => (
    <>
      {nombre}
      {requerido && <span className="cf-required">*</span>}
    </>
  );

  // Renderizar un campo según el tipo de dato
  const renderCharacteristicField = (characteristic) => {
    const { id, nombre, tipoDato, requerido, opciones } = characteristic;
    const value = characteristicValues[id] || '';
    const fieldError = validationErrors[id];

    const commonProps = {
      id: `char_${id}`,
      label: renderLabel(nombre, requerido),
      value: value,
      onChange: handleCharacteristicChange(id),
      error: fieldError,
      required: requerido
    };

    switch (tipoDato) {
      case 'text':
        return (
          <FormField
            key={id}
            {...commonProps}
            type="text"
            placeholder={`Ingresa ${nombre.toLowerCase()}`}
          />
        );

      case 'number':
        return (
          <FormField
            key={id}
            {...commonProps}
            type="number"
            placeholder={`Ingresa ${nombre.toLowerCase()}`}
          />
        );

      case 'select':
        const selectOptions = opciones ? opciones.map(opt => ({
          value: opt,
          label: opt
        })) : [];

        return (
          <SelectField
            key={id}
            {...commonProps}
            options={selectOptions}
            placeholder={`Selecciona ${nombre.toLowerCase()}`}
          />
        );

      case 'date':
        return (
          <FormField
            key={id}
            {...commonProps}
            type="date"
          />
        );

      case 'boolean':
        const booleanOptions = [
          { value: 'true', label: 'Sí' },
          { value: 'false', label: 'No' }
        ];

        return (
          <SelectField
            key={id}
            {...commonProps}
            options={booleanOptions}
            placeholder={`Selecciona una opción`}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="cf-container">
      <div className="cf-header">
        <h3 className="cf-title">Características específicas</h3>
        {requiredCount > 0 && (
          <p className="cf-progress">
            {completedCount} de {requiredCount} campos requeridos completados
          </p>
        )}
      </div>

      {error && (
        <p className="cf-error" role="alert">
          {error}
        </p>
      )}

      {loading && (
        <p className="cf-loading">
          <span className="cf-spinner"></span>
          Cargando características...
        </p>
      )}

      {!loading && characteristics.length > 0 && (
        <div className="cf-fields">
          {characteristics.map(characteristic => (
            <div key={characteristic.id} className="cf-field-wrapper">
              {renderCharacteristicField(characteristic)}
            </div>
          ))}
        </div>
      )}

      {!loading && requiredCount > 0 && completedCount < requiredCount && (
        <p className="cf-hint">
          Los campos marcados con <span className="cf-required">*</span> son obligatorios
        </p>
      )}
    </div>
  );
});

CharacteristicsForm.displayName = 'CharacteristicsForm';

export default CharacteristicsForm;
