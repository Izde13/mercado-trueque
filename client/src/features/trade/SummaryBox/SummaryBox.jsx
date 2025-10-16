import "./SummaryBox.css";

export default function SummaryBox({ interest, selected = [], onSubmit }) {
  return (
    <div className="sum-box">
      <h3 className="sum-title">Resumen</h3>

      <div className="sum-sec">
        <h4>Producto de interés</h4>
        <div className="sum-row">
          <span>{interest?.title || "—"}</span>
          <strong>${interest?.estimatedValue || "—"}</strong>
        </div>
      </div>

      <div className="sum-sec">
        <h4>Tu propuesta</h4>
        {selected.length ? selected.map(s => (
          <div className="sum-row" key={s.id}>
            <span>{s.title}</span>
            <strong>${s.estimatedValue}</strong>
          </div>
        )) : <p className="sum-muted">Selecciona al menos un artículo.</p>}
      </div>

      <button className="sum-cta" type="button" onClick={onSubmit}>
        Proponer trueque
      </button>
    </div>
  );
}
