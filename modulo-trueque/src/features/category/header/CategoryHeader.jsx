import "./CategoryHeader.css";

export default function CategoryHeader({
  title = "Artículos para Trueque.",
  from = 1,
  to = 10,
  total = 0,
  sort = "popular",
  onSortChange,
}) {
  const fmt = new Intl.NumberFormat("es-CO");

  const safeTotal = Math.max(0, total || 0);
  const safeFrom = Math.min(Math.max(1, from || 1), safeTotal || 1);
  const safeTo = Math.min(Math.max(safeFrom, to || safeFrom), safeTotal || safeFrom);

  return (
    <header className="cat-header">
      <h2 className="cat-title">{title}</h2>

      <div className="cat-tools">
        <span className="cat-count" aria-live="polite">
          Mostrando {fmt.format(safeFrom)}–{fmt.format(safeTo)} de {fmt.format(safeTotal)} Productos
        </span>

        <label className="cat-sort">
          Ordenar por:
          <select
            value={sort ?? "popular"}
            onChange={(e) => onSortChange?.(e.target.value)}
            aria-label="Ordenar por"
          >
            <option value="popular">Más popular</option>
            <option value="new">Nuevos</option>
            <option value="price-asc">Precio: bajo a alto</option>
            <option value="price-desc">Precio: alto a bajo</option>
          </select>
        </label>
      </div>
    </header>
  );
}
