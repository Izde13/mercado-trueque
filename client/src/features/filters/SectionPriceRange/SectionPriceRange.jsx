import { useState } from 'react';
import './SectionPriceRange.css';

export default function SectionPriceRange({ precioMin = '', precioMax = '', onPriceChange }) {
  const [isOpen, setIsOpen] = useState(true);
  const [localMin, setLocalMin] = useState(precioMin);
  const [localMax, setLocalMax] = useState(precioMax);

  const handleMinChange = (e) => {
    setLocalMin(e.target.value);
  };

  const handleMaxChange = (e) => {
    setLocalMax(e.target.value);
  };

  const handleApply = () => {
    if (onPriceChange) {
      onPriceChange(localMin, localMax);
    }
  };

  const handleClear = () => {
    setLocalMin('');
    setLocalMax('');
    if (onPriceChange) {
      onPriceChange('', '');
    }
  };

  const hasValues = precioMin !== '' || precioMax !== '';

  return (
    <details open={isOpen} className="filter-section">
      <summary
        className="filter-section-summary"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
      >
        Rango de precio
        {hasValues && <span className="filter-count"> ✓</span>}
      </summary>

      <div className="filter-section-content">
        <div className="price-inputs">
          <div className="price-input-group">
            <label htmlFor="precioMin">Mínimo</label>
            <input
              id="precioMin"
              type="number"
              min="0"
              step="1"
              placeholder="$ Min"
              value={localMin}
              onChange={handleMinChange}
              className="price-input"
            />
          </div>

          <div className="price-input-group">
            <label htmlFor="precioMax">Máximo</label>
            <input
              id="precioMax"
              type="number"
              min="0"
              step="1"
              placeholder="$ Max"
              value={localMax}
              onChange={handleMaxChange}
              className="price-input"
            />
          </div>
        </div>

        <div className="price-actions">
          <button
            type="button"
            className="price-apply-btn"
            onClick={handleApply}
          >
            Aplicar
          </button>
          <button
            type="button"
            className="price-clear-btn"
            onClick={handleClear}
            disabled={!hasValues}
          >
            Limpiar
          </button>
        </div>
      </div>
    </details>
  );
}
