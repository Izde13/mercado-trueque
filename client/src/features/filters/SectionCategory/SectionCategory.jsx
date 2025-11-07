import { useState } from 'react';
import { useCategories } from '../../../shared/hooks/useCategories';
import './SectionCategory.css';

export default function SectionCategory({ selectedCategories = [], onCategoryChange }) {
  const { categories, loading, error } = useCategories();
  const [isOpen, setIsOpen] = useState(true);

  const handleCategoryToggle = (categoryName) => {
    const isSelected = selectedCategories.includes(categoryName);
    let newSelected;

    if (isSelected) {
      // Remover categoría
      newSelected = selectedCategories.filter(c => c !== categoryName);
    } else {
      // Agregar categoría
      newSelected = [...selectedCategories, categoryName];
    }

    if (onCategoryChange) {
      onCategoryChange(newSelected);
    }
  };

  const handleSelectAll = () => {
    if (onCategoryChange) {
      onCategoryChange(categories.map(cat => cat.nombre));
    }
  };

  const handleClearAll = () => {
    if (onCategoryChange) {
      onCategoryChange([]);
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
        Categorías
        <span className="filter-count">
          {selectedCategories.length > 0 && ` (${selectedCategories.length})`}
        </span>
      </summary>

      <div className="filter-section-content">
        {loading ? (
          <div className="filter-loading">Cargando categorías...</div>
        ) : error ? (
          <div className="filter-error">Error al cargar categorías</div>
        ) : (
          <>
            {/* Botones de selección rápida */}
            <div className="filter-actions">
              <button
                type="button"
                className="filter-action-btn"
                onClick={handleSelectAll}
                disabled={selectedCategories.length === categories.length}
              >
                Seleccionar todas
              </button>
              <button
                type="button"
                className="filter-action-btn"
                onClick={handleClearAll}
                disabled={selectedCategories.length === 0}
              >
                Limpiar
              </button>
            </div>

            {/* Lista de categorías */}
            <div className="categories-list">
              {categories.map(category => (
                <label key={category.id} className="category-item">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.nombre)}
                    onChange={() => handleCategoryToggle(category.nombre)}
                    className="category-checkbox"
                  />
                  <span className="category-label">{category.nombre}</span>
                </label>
              ))}
            </div>
          </>
        )}
      </div>
    </details>
  );
}
