import { useState, useEffect } from 'react';
import reviewService from '../../shared/services/reviewService';
import PendingReviewsList from './components/PendingReviewsList';
import ReviewModal from './components/ReviewModal';
import './ReviewerPage.css';

/**
 * Página principal del revisor
 * Muestra los intercambios pendientes de revisión y permite revisar productos
 */
function ReviewerPage() {
  const [pendingReviews, setPendingReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Cargar intercambios pendientes de revisión
  useEffect(() => {
    const fetchPendingReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await reviewService.getPendingReviews();
        setPendingReviews(data || []);
      } catch (err) {
        console.error('Error al cargar reviews pendientes:', err);
        setError(
          'Error al cargar los intercambios pendientes de revisión. Por favor, intenta de nuevo.',
        );
        setPendingReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingReviews();
  }, [refreshTrigger]);

  const handleSelectTrade = (trade) => {
    setSelectedReview(trade);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReview(null);
    // Refrescar lista después de cerrar el modal
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleReviewComplete = () => {
    // Refrescar lista de reviews
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="reviewer-page">
      <div className="reviewer-container">
        {/* Header */}
        <div className="reviewer-header">
          <h1>Panel de Revisor</h1>
          <p className="reviewer-subtitle">
            Revisa y valida los productos en el centro de distribución
          </p>
        </div>

        {/* Estado de carga */}
        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Cargando intercambios pendientes de revisión...</p>
          </div>
        )}

        {/* Estado de error */}
        {error && !loading && (
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <p className="error-message">{error}</p>
            <button
              className="retry-button"
              onClick={() => setRefreshTrigger((prev) => prev + 1)}
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Lista de reviews pendientes */}
        {!loading && !error && (
          <>
            {pendingReviews.length > 0 ? (
              <>
                <div className="reviews-count">
                  <span className="count-badge">{pendingReviews.length}</span>
                  <span className="count-text">
                    intercambio{pendingReviews.length !== 1 ? 's' : ''}{' '}
                    pendiente{pendingReviews.length !== 1 ? 's' : ''} de revisar
                  </span>
                </div>
                <PendingReviewsList
                  reviews={pendingReviews}
                  onSelectTrade={handleSelectTrade}
                />
              </>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">✓</div>
                <h2>Sin intercambios pendientes</h2>
                <p>
                  No hay intercambios pendientes de revisión en este momento.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de revisión */}
      {isModalOpen && selectedReview && (
        <ReviewModal
          trade={selectedReview}
          onClose={handleCloseModal}
          onReviewComplete={handleReviewComplete}
        />
      )}
    </div>
  );
}

export default ReviewerPage;
