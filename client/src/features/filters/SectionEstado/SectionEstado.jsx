import { useState } from 'react';
import './SectionEstado.css';

// Estados de producto disponibles
const ESTADOS_DISPONIBLES = [
  { id: 'nuevo', nombre: 'Nuevo' },
  { id: 'usado-como-nuevo', nombre: 'Usado - Como nuevo' },
  { id: 'usado-bueno', nombre: 'Usado - Bueno' },
  { id: 'usado-aceptable', nombre: 'Usado - Aceptable' },
];

export default function SectionEstado({ selectedEstados = [], onEstadoChange }) {
  const [isOpen, setIsOpen] = useState(true);

  const handleEstadoToggle = (estadoNombre) => {
    const isSelected = selectedEstados.includes(estadoNombre);
    let newSelected;

    if (isSelected) {
      // Remover estado
      newSelected = selectedEstados.filter(e => e !== estadoNombre);
    } else {
      // Agregar estado
      newSelected = [...selectedEstados, estadoNombre];
    }

    if (onEstadoChange) {
      onEstadoChange(newSelected);
    }
  };

  const handleSelectAll = () => {
    if (onEstadoChange) {
      onEstadoChange(ESTADOS_DISPONIBLES.map(e => e.nombre));
    }
  };

  const handleClearAll = () => {
    if (onEstadoChange) {
      onEstadoChange([]);
    }
  };

  return (
    <details open={isOpen} className="filter-section">
      <summary
        className="filter-section-summary"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
      >
        Estado del producto
        <span className="filter-count">
          {selectedEstados.length > 0 && ` (${selectedEstados.length})`}
        </span>
      </summary>

      <div className="filter-section-content">
        {/* Botones de selección rápida */}
        <div className="filter-actions">
          <button
            type="button"
            className="filter-action-btn"
            onClick={handleSelectAll}
            disabled={selectedEstados.length === ESTADOS_DISPONIBLES.length}
          >
            Seleccionar todos
          </button>
          <button
            type="button"
            className="filter-action-btn"
            onClick={handleClearAll}
            disabled={selectedEstados.length === 0}
          >
            Limpiar
          </button>
        </div>

        {/* Lista de estados */}
        <div className="estados-list">
          {ESTADOS_DISPONIBLES.map(estado => (
            <label key={estado.id} className="estado-item">
              <input
                type="checkbox"
                checked={selectedEstados.includes(estado.nombre)}
                onChange={() => handleEstadoToggle(estado.nombre)}
                className="estado-checkbox"
              />
              <span className="estado-label">{estado.nombre}</span>
            </label>
          ))}
        </div>
      </div>
    </details>
  );
}
