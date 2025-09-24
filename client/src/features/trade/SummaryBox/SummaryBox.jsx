import "./SummaryBox.css";

export default function SummaryBox({ interest, selected = [], onSubmit }) {
  return (
    <div className="sum-box">
      <h3 className="sum-title">Resumen</h3>

      <div className="sum-sec">
        <h4>Producto de interés</h4>
        <div className="sum-row">
          <span>{interest?.title?.replace("Graphic","T-shirt") || "—"}</span>
          <strong>{interest?.price || "—"}</strong>
        </div>
      </div>

      <div className="sum-sec">
        <h4>Tu propuesta</h4>
        {selected.length ? selected.map(s=>(
          <div className="sum-row" key={s.id}>
            <span>{s.title.replace("Graphic","T-shirt")}</span>
            <strong>{s.price}</strong>
          </div>
        )) : <p className="sum-muted">Selecciona al menos un artículo.</p>}
      </div>

      <button className="sum-cta" type="button" onClick={onSubmit}>
        Proponer trueque
      </button>
    </div>
  );
}
