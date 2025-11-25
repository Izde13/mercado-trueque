import React, { useMemo } from "react";
import "./ProductCharacteristics.css";

/**
 * ProductCharacteristics - Muestra características dinámicas del producto
 * con mejor UI y organización
 */
function ProductCharacteristics({ characteristics = [] }) {
  // Si no hay características, no renderizar nada
  if (!characteristics || characteristics.length === 0) {
    return null;
  }

  // Función para obtener icono según el tipo de dato
  const getIcon = (nombre) => {
    const lower = nombre.toLowerCase();
    if (lower.includes('talla') || lower.includes('tamaño')) return '📏';
    if (lower.includes('color')) return '🎨';
    if (lower.includes('material')) return '🧵';
    if (lower.includes('marca')) return '🏷️';
    if (lower.includes('genero')) return '👥';
    if (lower.includes('condición') || lower.includes('estado')) return '✨';
    if (lower.includes('año')) return '📅';
    if (lower.includes('garantía')) return '🛡️';
    return '✓';
  };

  // Renderizar item individual
  const renderCharacteristicItem = (char) => (
    <div key={char.id} className="pc-item">
      <div className="pc-item-content">
        <span className="pc-icon">{getIcon(char.nombre)}</span>
        <div className="pc-text">
          <span className="pc-label">{char.nombre}</span>
          <span className="pc-value">{char.valor}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pc-container">
      <div className="pc-header">
        <h3 className="pc-title">📋 Características del producto</h3>
        <span className="pc-count">{characteristics.length}</span>
      </div>

      <div className="pc-grid">
        {characteristics.map(char => renderCharacteristicItem(char))}
      </div>
    </div>
  );
}

ProductCharacteristics.displayName = 'ProductCharacteristics';

export default ProductCharacteristics;
