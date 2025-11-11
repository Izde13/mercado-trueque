import "./SummaryBox.css";

export default function SummaryBox({
  interest,
  selected = [],
  onSubmit,
  loading = false,
  error = null,
  success = false,
  message = "",
  onMessageChange = () => {}
}) {
  const totalInterestValue = interest?.estimatedValue || 0;
  const totalSelectedValue = selected.reduce((sum, item) => sum + (item.estimatedValue || 0), 0);
  const difference = totalInterestValue - totalSelectedValue;
  const isBalanced = difference >= -100 && difference <= 100;

  return (
    <div className="sum-box">
      <h3 className="sum-title">Resumen</h3>

      <div className="sum-sec">
        <h4>Producto de interés</h4>
        <div className="sum-row">
          <span>{interest?.title || "—"}</span>
          <strong>${totalInterestValue}</strong>
        </div>
      </div>

      <div className="sum-sec">
        <h4>Tu propuesta</h4>
        {selected.length ? (
          <>
            {selected.map(s => (
              <div className="sum-row" key={s.id}>
                <span>{s.title}</span>
                <strong>${s.estimatedValue}</strong>
              </div>
            ))}
            <div className="sum-row sum-total">
              <span>Total propuesta:</span>
              <strong>${totalSelectedValue}</strong>
            </div>
          </>
        ) : (
          <p className="sum-muted">Selecciona al menos un artículo.</p>
        )}
      </div>

      {selected.length > 0 && (
        <div className="sum-sec sum-balance">
          <h4>Balance de valor</h4>
          <p className={isBalanced ? "sum-balanced" : "sum-unbalanced"}>
            {isBalanced ? "✓ Valores equilibrados" : `⚠ Diferencia: $${Math.abs(difference)}`}
          </p>
        </div>
      )}

      {error && (
        <div className="sum-error">
          {error}
        </div>
      )}

      {success && (
        <div className="sum-success">
          ✓ Propuesta enviada correctamente
        </div>
      )}

      <div className="sum-sec">
        <h4>Mensaje (opcional)</h4>
        <textarea
          className="sum-textarea"
          placeholder="Agrega un mensaje a tu propuesta..."
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          maxLength={500}
          rows={4}
        />
        <small className="sum-char-count">{message.length}/500</small>
      </div>

      <button
        className="sum-cta"
        type="button"
        onClick={onSubmit}
        disabled={loading || selected.length === 0}
      >
        {loading ? "Enviando..." : "Proponer trueque"}
      </button>
    </div>
  );
}
