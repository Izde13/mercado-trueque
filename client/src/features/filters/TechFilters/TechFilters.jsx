import "./TechFilters.css";

export default function TechFilters() {
  return (
    <aside className="fx" aria-label="Filtros de Tecnología">
      <div className="fx-head">
        <h3>Filtros</h3>
        <button type="button" className="fx-reset">
          Restablecer
        </button>
      </div>

      {/* Precio */}
      <details open className="fx-group">
        <summary>Precio</summary>
        <div className="fx-content">
          <div className="fx-range">
            {/* Slider doble (visual) */}
            <input type="range" min="0" max="500" defaultValue="50" />
            <input type="range" min="0" max="500" defaultValue="200" />
          </div>
          <div className="fx-range-values">
            <span>$50</span>
            <span>$200</span>
          </div>
        </div>
      </details>

      {/* Marca */}
      <details open className="fx-group">
        <summary>Marca</summary>
        <div className="fx-content">
          <ul className="fx-checks">
            {["Apple", "Samsung", "Xiaomi", "Lenovo", "HP", "Sony"].map((m) => (
              <li key={m}>
                <label>
                  <input type="checkbox" /> {m}
                </label>
              </li>
            ))}
          </ul>
        </div>
      </details>

      {/* Condición */}
      <details open className="fx-group">
        <summary>Condición</summary>
        <div className="fx-content fx-radio">
          <label>
            <input type="radio" name="cond" defaultChecked /> Nuevo
          </label>
          <label>
            <input type="radio" name="cond" /> Usado
          </label>
          <label>
            <input type="radio" name="cond" /> Reacondicionado
          </label>
        </div>
      </details>

      {/* Almacenamiento */}
      <details className="fx-group" open>
        <summary>Almacenamiento</summary>
        <div className="fx-content">
          <div className="fx-chips">
            {["64 GB", "128 GB", "256 GB", "512 GB", "1 TB"].map((s) => (
              <button type="button" className="chip" key={s}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </details>

      {/* Color */}
      <details className="fx-group" open>
        <summary>Color</summary>
        <div className="fx-content fx-swatches">
          {[
            "#111",
            "#ffffff",
            "#2563eb",
            "#16a34a",
            "#f59e0b",
            "#ef4444",
            "#9333ea",
            "#06b6d4",
          ].map((c, i) => (
            <button
              key={i}
              type="button"
              className={`swatch ${i === 0 ? "is-selected" : ""}`}
              style={{ "--c": c }}
              aria-label={`Color ${c}`}
            />
          ))}
        </div>
      </details>

      {/* Entrega */}
      <details className="fx-group" open>
        <summary>Entrega</summary>
        <div className="fx-content fx-radio">
          <label>
            <input type="checkbox" /> Retiro en persona
          </label>
          <label>
            <input type="checkbox" /> Envío a domicilio
          </label>
          <label>
            <input type="checkbox" /> Envío gratis
          </label>
        </div>
      </details>

      <div className="fx-footer">
        <button type="button" className="fx-apply">
          Aplicar filtros
        </button>
      </div>
    </aside>
  );
}
