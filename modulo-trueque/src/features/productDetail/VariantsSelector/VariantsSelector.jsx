import "./VariantsSelector.css";

export default function VariantsSelector() {
  return (
    <div className="vs">
      {/* Color */}
      <div className="vs-block">
        <label className="vs-label">Color</label>
        <div className="vs-swatches">
          {["#4b4b33"].map((c, i) => (
            <button
              key={i}
              type="button"
              className="swatch is-selected"
              style={{ "--c": c }}
              aria-label="Color seleccionado"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="M7 12.5l3 3 7-7" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <hr className="vs-hr" />

      {/* Talla */}
      <div className="vs-block">
        <label className="vs-label">Talla</label>
        <div className="vs-sizes">
          <button type="button" className="size is-selected">Large</button>
        </div>
      </div>
    </div>
  );
}
