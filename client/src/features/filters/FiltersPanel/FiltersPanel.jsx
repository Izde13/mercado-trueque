import SectionCategory from '../SectionCategory/SectionCategory';
import SectionEstado from '../SectionEstado/SectionEstado';
import SectionPriceRange from '../SectionPriceRange/SectionPriceRange';
import ChipsPanel from '../ChipsPanel/ChipsPanel';
import './FiltersPanel.css';

export default function FiltersPanel({ 
  filters, 
  onFilterChange, 
  onRemoveFilter,
  onClearFilters 
}) {
  return (
    <div className="filters-panel">
      <div className="filters-header">
        <h2>Filtros</h2>
        {(filters.categorias?.length > 0 || 
          filters.estados?.length > 0 || 
          filters.precioMin || 
          filters.precioMax) && (
          <button 
            type="button" 
            className="clear-all-btn"
            onClick={onClearFilters}
          >
            Limpiar todo
          </button>
        )}
      </div>

      <div className="filters-sections">
        <SectionCategory
          selectedCategories={filters.categorias || []}
          onCategoryChange={onFilterChange.categoria}
        />

        <SectionEstado
          selectedEstados={filters.estados || []}
          onEstadoChange={onFilterChange.estado}
        />

        <SectionPriceRange
          precioMin={filters.precioMin}
          precioMax={filters.precioMax}
          onPriceChange={onFilterChange.precio}
        />
      </div>

      <ChipsPanel 
        filters={filters} 
        onRemoveFilter={onRemoveFilter} 
      />
    </div>
  );
}
