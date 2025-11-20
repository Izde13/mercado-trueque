import './PendingReviewsList.css';

/**
 * Componente que muestra la lista de intercambios pendientes de revisión
 */
function PendingReviewsList({ reviews, onSelectTrade }) {
  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const getProductCount = (trade) => {
    // Contar el total de productos en el intercambio
    const oferenteProducts = trade.productosOfrecidos || [];
    const receptorProducts = trade.productosRecibidos || [];
    return oferenteProducts.length + receptorProducts.length;
  };

  const getInterchangeDate = (trade) => {
    // Obtener la fecha de creación del intercambio
    return trade.fecha_creacion || trade.fechaInicio || new Date().toISOString();
  };

  const getStatusBadge = (trade) => {
    // Determinar qué productos aún necesitan revisión
    let pendingCount = 0;
    let reviewedCount = 0;

    // Esta lógica dependerá de tu estructura de datos del backend
    // Ajusta según lo que devuelva tu API
    if (trade.revisiones) {
      reviewedCount = trade.revisiones.filter(
        (r) => r.estado_revision !== 'pendiente',
      ).length;
      pendingCount = getProductCount(trade) - reviewedCount;
    } else {
      pendingCount = getProductCount(trade);
    }

    return { pendingCount, reviewedCount, totalCount: getProductCount(trade) };
  };

  return (
    <div className="pending-reviews-list">
      <div className="reviews-grid">
        {reviews.map((trade) => {
          const { pendingCount, reviewedCount, totalCount } =
            getStatusBadge(trade);

          return (
            <div key={trade.id} className="review-card">
              <div className="card-header">
                <div className="card-title-section">
                  <h3 className="card-title">Intercambio #{trade.id.slice(0, 8)}</h3>
                  <span className="card-date">{formatDate(getInterchangeDate(trade))}</span>
                </div>
                <div className="card-status">
                  {pendingCount > 0 && (
                    <span className="status-badge pending">
                      {pendingCount} pendiente{pendingCount !== 1 ? 's' : ''}
                    </span>
                  )}
                  {reviewedCount > 0 && (
                    <span className="status-badge reviewed">
                      {reviewedCount}/{totalCount} revisado{reviewedCount !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>

              <div className="card-content">
                {(trade.usuarioOferta || trade.usuarioRecepcion) && (
                  <div className="participants-section">
                    <h4>Participantes</h4>
                    <div className="participants">
                      {trade.usuarioOferta && (
                        <div className="participant">
                          <span className="participant-label">Oferente:</span>
                          <span className="participant-name">
                            {trade.usuarioOferta.nombre}{' '}
                            {trade.usuarioOferta.apellido}
                          </span>
                        </div>
                      )}
                      {trade.usuarioRecepcion && (
                        <div className="participant">
                          <span className="participant-label">Receptor:</span>
                          <span className="participant-name">
                            {trade.usuarioRecepcion.nombre}{' '}
                            {trade.usuarioRecepcion.apellido}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="products-section">
                  <h4>Productos a revisar ({totalCount})</h4>
                  <div className="products-list">
                    {/* Productos del oferente */}
                    {trade.productosOfrecidos &&
                      trade.productosOfrecidos.map((product) => (
                        <div key={product.id} className="product-item">
                          <span className="product-icon">📦</span>
                          <div className="product-info">
                            <span className="product-name">{product.nombre}</span>
                            <span className="product-detail">
                              {product.descripcion}
                            </span>
                          </div>
                        </div>
                      ))}

                    {/* Productos del receptor */}
                    {trade.productosRecibidos &&
                      trade.productosRecibidos.map((product) => (
                        <div key={product.id} className="product-item">
                          <span className="product-icon">📦</span>
                          <div className="product-info">
                            <span className="product-name">{product.nombre}</span>
                            <span className="product-detail">
                              {product.descripcion}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="progress-section">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${(reviewedCount / totalCount) * 100}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">
                    {reviewedCount}/{totalCount} revisados
                  </span>
                </div>
              </div>

              <div className="card-footer">
                <button
                  className="review-button"
                  onClick={() => onSelectTrade(trade)}
                  disabled={pendingCount === 0 && reviewedCount === 0}
                >
                  {pendingCount > 0 ? 'Revisar Ahora' : 'Ver Detalles'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PendingReviewsList;
