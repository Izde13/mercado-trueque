import { useState, useEffect } from 'react';
import reviewService from '../../../shared/services/reviewService';
import './ReviewModal.css';

/**
 * Modal para revisar productos de un intercambio
 * Permite al revisor calificar cada producto, agregar observaciones y fotos
 */
function ReviewModal({ trade, onClose, onReviewComplete }) {
  // Estado para mantener track de qué producto se está revisando
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [reviews, setReviews] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [reviewCompleted, setReviewCompleted] = useState(false);
  const [isApprovingReview, setIsApprovingReview] = useState(false);

  // Inicializar lista de todos los productos
  useEffect(() => {
    const products = [
      ...(trade.productosOfrecidos || []),
      ...(trade.productosRecibidos || []),
    ];
    setAllProducts(products);

    // Inicializar objeto de reviews
    const initialReviews = {};
    products.forEach((product) => {
      initialReviews[product.id] = {
        condition_rating: 3,
        observations: '',
        photos: [],
      };
    });
    setReviews(initialReviews);
  }, [trade]);

  const currentProduct = allProducts[currentProductIndex];
  const currentReview = currentProduct ? reviews[currentProduct.id] : null;
  const isLastProduct = currentProductIndex === allProducts.length - 1;

  // Actualizar rating
  const handleRatingChange = (rating) => {
    if (currentProduct) {
      setReviews((prev) => ({
        ...prev,
        [currentProduct.id]: {
          ...prev[currentProduct.id],
          condition_rating: rating,
        },
      }));
    }
  };

  // Actualizar observaciones
  const handleObservationsChange = (text) => {
    if (currentProduct) {
      setReviews((prev) => ({
        ...prev,
        [currentProduct.id]: {
          ...prev[currentProduct.id],
          observations: text,
        },
      }));
    }
  };

  // Manejar carga de fotos (URLs)
  const handlePhotosChange = (photoUrl) => {
    if (currentProduct && photoUrl.trim()) {
      setReviews((prev) => {
        const currentPhotos = prev[currentProduct.id].photos || [];
        if (currentPhotos.includes(photoUrl)) return prev; // Evitar duplicados

        return {
          ...prev,
          [currentProduct.id]: {
            ...prev[currentProduct.id],
            photos: [...currentPhotos, photoUrl],
          },
        };
      });
    }
  };

  // Eliminar foto
  const handleRemovePhoto = (photoUrl) => {
    if (currentProduct) {
      setReviews((prev) => ({
        ...prev,
        [currentProduct.id]: {
          ...prev[currentProduct.id],
          photos: prev[currentProduct.id].photos.filter((p) => p !== photoUrl),
        },
      }));
    }
  };

  // Navegar a siguiente producto
  const handleNextProduct = () => {
    if (currentProductIndex < allProducts.length - 1) {
      setError(null);
      setCurrentProductIndex(currentProductIndex + 1);
    }
  };

  // Navegar a producto anterior
  const handlePreviousProduct = () => {
    if (currentProductIndex > 0) {
      setError(null);
      setCurrentProductIndex(currentProductIndex - 1);
    }
  };

  // Aprobar revisión completamente y hacer deliver automático
  const handleApproveAndDeliver = async () => {
    setIsApprovingReview(true);
    setError(null);

    try {
      const result = await reviewService.approveReviewAndDeliver(trade.id, trade);

      setSuccessMessage(
        `✓ ${result.message} Los usuarios recibirán notificaciones.`
      );

      // Esperar 2 segundos y luego cerrar modal
      setTimeout(() => {
        setSuccessMessage(null);
        onReviewComplete();
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Error approving review and delivering:', err);
      setError(
        err.message ||
          err.response?.data?.message ||
          'Error al autorizar la entrega. Intenta de nuevo.'
      );
      setIsApprovingReview(false);
    }
  };

  // Validar formulario actual
  const validateCurrentReview = () => {
    if (!currentReview) return false;

    if (currentReview.condition_rating < 1 || currentReview.condition_rating > 5) {
      setError('La calificación debe estar entre 1 y 5');
      return false;
    }

    // Si la calificación es menor a 4, se requieren observaciones
    if (currentReview.condition_rating < 4) {
      if (!currentReview.observations || currentReview.observations.trim().length < 20) {
        setError(
          'Debes documentar los daños/problemas observados (mínimo 20 caracteres)',
        );
        return false;
      }
    }

    setError(null);
    return true;
  };

  // Enviar revisión
  const handleSubmitReview = async () => {
    if (!validateCurrentReview()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const reviewData = reviews[currentProduct.id];

      // Llamar al servicio para enviar la revisión
      await reviewService.reviewProduct(trade.id, currentProduct.id, {
        condition_rating: reviewData.condition_rating,
        observations: reviewData.observations || undefined,
        photos: reviewData.photos && reviewData.photos.length > 0 ? reviewData.photos : undefined,
      });

      setSuccessMessage(
        `✓ Producto revisado correctamente - ${currentProduct.nombre}`,
      );

      // Esperar 1.5 segundos y luego continuar
      setTimeout(() => {
        setSuccessMessage(null);
        setIsSubmitting(false); // Resetear estado de envío

        if (!isLastProduct) {
          handleNextProduct();
        } else {
          // Si fue el último producto, marcar como completado (no cerrar aún)
          setReviewCompleted(true);
          setTimeout(() => {
            // Mostrar estado de completado
          }, 800);
        }
      }, 1500);
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(
        err.response?.data?.message ||
          'Error al enviar la revisión. Intenta de nuevo.',
      );
      setIsSubmitting(false);
    }
  };

  if (!currentProduct || allProducts.length === 0) {
    return (
      <div className="review-modal-overlay">
        <div className="review-modal">
          <div className="modal-loading">
            <div className="spinner"></div>
            <p>Cargando productos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="review-modal-overlay" onClick={onClose}>
      <div className="review-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2>Revisar Productos</h2>
          <button className="close-button" onClick={onClose} title="Cerrar">
            ✕
          </button>
        </div>

        {/* Progress */}
        <div className="modal-progress">
          <div className="progress-info">
            <span className="progress-text">
              Producto {currentProductIndex + 1} de {allProducts.length}
            </span>
            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${((currentProductIndex + 1) / allProducts.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="modal-content">
          {/* Mensaje de éxito */}
          {successMessage && (
            <div className="success-message">
              {successMessage}
            </div>
          )}

          {/* Mensaje de error */}
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Información del producto */}
          <div className="product-review-section">
            <div className="product-header">
              <div className="product-icon">📦</div>
              <div className="product-details">
                <h3>{currentProduct.nombre}</h3>
                <p className="product-description">{currentProduct.descripcion}</p>
                {currentProduct.categoria && (
                  <span className="product-category">
                    Categoría: {currentProduct.categoria}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Formulario de revisión */}
          <div className="review-form">
            {/* Calificación */}
            <div className="form-group">
              <label className="form-label">
                Calificación de Condición *
                <span className="required-asterisk">*</span>
              </label>
              <p className="form-description">
                Evalúa el estado del producto (1 = muy dañado, 5 = como nuevo)
              </p>
              <div className="rating-selector">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    className={`rating-button ${
                      currentReview.condition_rating === rating ? 'active' : ''
                    } rating-${rating}`}
                    onClick={() => handleRatingChange(rating)}
                    title={
                      {
                        1: 'Muy dañado',
                        2: 'Dañado',
                        3: 'Aceptable',
                        4: 'Muy bueno',
                        5: 'Como nuevo',
                      }[rating]
                    }
                  >
                    <span className="rating-star">★</span>
                    <span className="rating-value">{rating}</span>
                  </button>
                ))}
              </div>
              <div className="rating-labels">
                <span>Muy dañado</span>
                <span>Como nuevo</span>
              </div>
            </div>

            {/* Observaciones */}
            <div className="form-group">
              <label className="form-label">
                Observaciones
                {currentReview.condition_rating < 4 && (
                  <span className="required-asterisk">*</span>
                )}
              </label>
              {currentReview.condition_rating < 4 && (
                <p className="form-description">
                  Requiere descripción de daños/problemas (mínimo 20 caracteres)
                </p>
              )}
              <textarea
                className="form-textarea"
                placeholder="Describe el estado del producto, daños observados, o cualquier problema..."
                value={currentReview.observations}
                onChange={(e) => handleObservationsChange(e.target.value)}
                rows={4}
                maxLength={500}
              />
              <span className="char-count">
                {currentReview.observations.length}/500
              </span>
            </div>

            {/* Fotos */}
            <div className="form-group">
              <label className="form-label">Fotos (URLs)</label>
              <p className="form-description">
                Agrega URLs de fotos para documentar el estado del producto
              </p>
              <div className="photo-input-group">
                <input
                  type="url"
                  className="form-input"
                  placeholder="Ingresa URL de foto (ej: https://...)"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handlePhotosChange(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  id="photo-input"
                />
                <button
                  className="add-photo-button"
                  onClick={() => {
                    const input = document.getElementById('photo-input');
                    handlePhotosChange(input.value);
                    input.value = '';
                  }}
                >
                  Agregar Foto
                </button>
              </div>

              {currentReview.photos && currentReview.photos.length > 0 && (
                <div className="photos-list">
                  <h4>Fotos agregadas ({currentReview.photos.length})</h4>
                  <div className="photos-grid">
                    {currentReview.photos.map((photo, index) => (
                      <div key={index} className="photo-item">
                        <img src={photo} alt={`Foto ${index + 1}`} />
                        <button
                          className="remove-photo-button"
                          onClick={() => handleRemovePhoto(photo)}
                          title="Eliminar foto"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          {!reviewCompleted ? (
            <>
              <button
                className="nav-button prev-button"
                onClick={handlePreviousProduct}
                disabled={currentProductIndex === 0}
              >
                ← Anterior
              </button>

              <button
                className="submit-button"
                onClick={handleSubmitReview}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-small"></span>
                    Enviando...
                  </>
                ) : isLastProduct ? (
                  'Completar Revisión'
                ) : (
                  'Guardar y Siguiente'
                )}
              </button>

              <button
                className="nav-button next-button"
                onClick={handleNextProduct}
                disabled={isLastProduct}
              >
                Siguiente →
              </button>
            </>
          ) : (
            <>
              <div className="review-completed-message">
                <span className="check-icon">✓</span>
                <p>Todos los productos han sido revisados</p>
              </div>
              <button
                className="submit-button approve-button"
                onClick={handleApproveAndDeliver}
                disabled={isApprovingReview}
                title="Autoriza la entrega automática a ambos usuarios con fecha estimada de 5 días"
              >
                {isApprovingReview ? (
                  <>
                    <span className="spinner-small"></span>
                    Autorizando...
                  </>
                ) : (
                  '✓ Autorizado para Enviar'
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReviewModal;
