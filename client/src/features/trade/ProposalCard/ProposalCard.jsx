import "./ProposalCard.css";

export default function ProposalCard({
  proposal,
  onViewDetails,
  onAccept,
  onReject,
  loading = false
}) {
  const {
    id,
    usuarioOferenteNombre,
    usuarioOferenteRating,
    productoSolicitado,
    mensaje,
    fechaPropuesta,
    productosOfrecidos = [],
    totalValorOfrecido,
    totalValorSolicitado
  } = proposal || {};

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('es-ES');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="proposal-card">
      <div className="proposal-header">
        <div className="proposal-user">
          <h3 className="proposal-username">{usuarioOferenteNombre}</h3>
          <div className="proposal-rating">
            ⭐ {(typeof usuarioOferenteRating === 'number' ? usuarioOferenteRating.toFixed(1) : usuarioOferenteRating) || "Sin calificación"}
          </div>
        </div>
        <span className="proposal-date">{formatDate(fechaPropuesta)}</span>
      </div>

      <div className="proposal-content">
        <div className="proposal-section">
          <h4>Producto que solicita</h4>
          <p className="proposal-product-name">{productoSolicitado?.title || "—"}</p>
          {productoSolicitado?.description && (
            <p className="proposal-product-desc">{productoSolicitado.description}</p>
          )}
          <p className="proposal-price">
            Valor: <strong>${totalValorSolicitado || productoSolicitado?.estimatedValue || "—"}</strong>
          </p>
        </div>

        <div className="proposal-section">
          <h4>Productos que ofrece ({productosOfrecidos.length})</h4>
          <ul className="proposal-offers-list">
            {productosOfrecidos.length > 0 ? (
              productosOfrecidos.map(product => (
                <li key={product.id} className="proposal-offer-item">
                  <span className="offer-title">{product.title}</span>
                  <span className="offer-value">${product.estimatedValue}</span>
                </li>
              ))
            ) : (
              <li className="proposal-empty">Sin productos específicos</li>
            )}
          </ul>
          <p className="proposal-total">
            Total propuesta: <strong>${totalValorOfrecido || "—"}</strong>
          </p>
        </div>

        {mensaje && (
          <div className="proposal-section proposal-message">
            <h4>Mensaje</h4>
            <p>{mensaje}</p>
          </div>
        )}
      </div>

      <div className="proposal-actions">
        <button
          className="proposal-btn proposal-btn-accept"
          onClick={() => onAccept && onAccept(id)}
          disabled={loading}
        >
          {loading ? "Procesando..." : "✓ Aceptar"}
        </button>
        <button
          className="proposal-btn proposal-btn-reject"
          onClick={() => onReject && onReject(id)}
          disabled={loading}
        >
          {loading ? "Procesando..." : "✗ Rechazar"}
        </button>
        {onViewDetails && (
          <button
            className="proposal-btn proposal-btn-details"
            onClick={() => onViewDetails && onViewDetails(id)}
            disabled={loading}
          >
            Ver detalles
          </button>
        )}
      </div>
    </div>
  );
}
