import './ChipsPanel.css';

export default function ChipsPanel({ filters, onRemoveFilter }) {
  const chips = [];

  if (filters.nombre) {
    chips.push({
      id: 'nombre',
      label: `Búsqueda: "${filters.nombre}"`,
      type: 'nombre',
      value: filters.nombre,
    });
  }

  if (filters.categorias && filters.categorias.length > 0) {
    filters.categorias.forEach(categoria => {
      chips.push({
        id: `cat-${categoria}`,
        label: categoria,
        type: 'categoria',
        value: categoria,
      });
    });
  }

  if (filters.estados && filters.estados.length > 0) {
    filters.estados.forEach(estado => {
      chips.push({
        id: `estado-${estado}`,
        label: estado,
        type: 'estado',
        value: estado,
      });
    });
  }

  if (filters.precioMin) {
    chips.push({
      id: 'precio-min',
      label: `Desde $${filters.precioMin}`,
      type: 'precioMin',
      value: filters.precioMin,
    });
  }

  if (filters.precioMax) {
    chips.push({
      id: 'precio-max',
      label: `Hasta $${filters.precioMax}`,
      type: 'precioMax',
      value: filters.precioMax,
    });
  }

  if (chips.length === 0) {
    return null;
  }

  return (
    <div className="chips-panel">
      <span className="chips-label">Filtros aplicados:</span>
      <div className="chips-container">
        {chips.map(chip => (
          <div key={chip.id} className="chip">
            <span className="chip-label">{chip.label}</span>
            <button
              type="button"
              className="chip-remove"
              onClick={() => onRemoveFilter(chip.type, chip.value)}
              aria-label={`Remover filtro: ${chip.label}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
