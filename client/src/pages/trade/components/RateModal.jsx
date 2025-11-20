import { useState, useEffect } from 'react';
import { apiService } from '../../../shared/services/apiAxios';
import reviewService from '../../../shared/services/reviewService';
import './RateModal.css';

/**
 * Modal para calificar un intercambio completado
 * Permite al usuario calificar al otro usuario y el producto recibido
 */
function RateModal({ trade, currentUserId, onClose, onRateComplete }) {
  const [calificacionUsuario, setCalificacionUsuario] = useState(5);
  const [calificacionProducto, setCalificacionProducto] = useState(5);
  const [comentario, setComentario] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [usuarioNombreCargado, setUsuarioNombreCargado] = useState(
    trade.rol_usuario === 'oferente'
      ? trade.usuario_solicitante_nombre || null
      : trade.usuario_oferente_nombre || null
  );

  // Determinar quién es el usuario a calificar
  // Basado en la estructura del endpoint /trades/user/{userId}
  const usuarioACalificar = {
    id: trade.rol_usuario === 'oferente'
      ? trade.usuario_solicitante_id
      : trade.usuario_oferente_id,
    nombre: usuarioNombreCargado || (
      trade.rol_usuario === 'oferente'
        ? 'Usuario'
        : trade.usuario_oferente_nombre || 'Usuario'
    )
  };

  // Obtener el nombre del usuario si no está disponible
  useEffect(() => {
    const cargarNombreUsuario = async () => {
      // Si ya tenemos el nombre, no hacer fetch
      if (usuarioNombreCargado) return;

      try {
        const usuarioId = trade.rol_usuario === 'oferente'
          ? trade.usuario_solicitante_id
          : trade.usuario_oferente_id;

        if (!usuarioId) return;

        // Intentar obtener el usuario
        const response = await apiService.get(`/users/${usuarioId}`);
        if (response?.nombre) {
          setUsuarioNombreCargado(response.nombre);
        }
      } catch (err) {
        // No hacer nada si no podemos obtener el nombre
        console.warn('No se pudo cargar el nombre del usuario:', err);
      }
    };

    cargarNombreUsuario();
  }, [trade, usuarioNombreCargado]);

  const handleSubmit = async () => {
    // Validaciones
    if (!calificacionUsuario || calificacionUsuario < 1 || calificacionUsuario > 5) {
      setError('La calificación del usuario debe estar entre 1 y 5');
      return;
    }
    if (!calificacionProducto || calificacionProducto < 1 || calificacionProducto > 5) {
      setError('La calificación del producto debe estar entre 1 y 5');
      return;
    }
    if (!usuarioACalificar?.id) {
      setError('No se pudo identificar el usuario a calificar. Por favor, intenta de nuevo.');
      console.error('Error: usuario a calificar no identificado', {
        usuarioACalificar,
        trade,
        currentUserId,
      });
      return;
    }
    if (!trade?.id) {
      setError('No se pudo identificar el intercambio. Intenta de nuevo.');
      return;
    }
    if (!currentUserId) {
      setError('No se pudo identificar tu usuario. Intenta de nuevo.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await reviewService.rateTrade(
        trade.id,
        currentUserId,
        usuarioACalificar.id,
        calificacionUsuario,
        calificacionProducto,
        comentario
      );

      setSuccessMessage('✓ Calificación registrada correctamente');

      // Esperar 2 segundos y luego cerrar modal
      setTimeout(() => {
        setSuccessMessage(null);
        onRateComplete();
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Error rating trade:', err);
      setError(
        err.response?.data?.message ||
          err.message ||
          'Error al registrar la calificación. Intenta de nuevo.'
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rate-modal-overlay" onClick={onClose}>
      <div className="rate-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2>Calificar Intercambio</h2>
          <button className="close-button" onClick={onClose} title="Cerrar">
            ✕
          </button>
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

          {/* Información del usuario a calificar */}
          <div className="user-section">
            <p className="user-label">Calificando a:</p>
            <div className="user-header">
              <div className="user-icon">👤</div>
              <div className="user-details">
                <h3>{usuarioACalificar?.nombre || 'Usuario'}</h3>
                <p className="user-rating">
                  {usuarioACalificar?.promedio_calificacion
                    ? `${usuarioACalificar.promedio_calificacion} ⭐`
                    : 'Sin calificaciones aún'}
                </p>
              </div>
            </div>
          </div>

          {/* Formulario de calificación */}
          <div className="rate-form">
            {/* Calificación del usuario */}
            <div className="form-group">
              <label className="form-label">
                Calificación del Usuario *
              </label>
              <p className="form-description">
                ¿Qué tal fue tu experiencia?
              </p>
              <div className="rating-selector">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={`user-${rating}`}
                    className={`rating-button ${
                      calificacionUsuario === rating ? 'active' : ''
                    } rating-${rating}`}
                    onClick={() => setCalificacionUsuario(rating)}
                    title={
                      {
                        1: 'Muy mala',
                        2: 'Mala',
                        3: 'Aceptable',
                        4: 'Buena',
                        5: 'Excelente',
                      }[rating]
                    }
                  >
                    <span className="rating-star">★</span>
                    <span className="rating-value">{rating}</span>
                  </button>
                ))}
              </div>
              <div className="rating-labels">
                <span>Muy mala</span>
                <span>Excelente</span>
              </div>
            </div>

            {/* Calificación del producto */}
            <div className="form-group">
              <label className="form-label">
                Calificación del Producto *
              </label>
              <p className="form-description">
                ¿En qué estado llegó?
              </p>
              <div className="rating-selector">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={`product-${rating}`}
                    className={`rating-button ${
                      calificacionProducto === rating ? 'active' : ''
                    } rating-${rating}`}
                    onClick={() => setCalificacionProducto(rating)}
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

            {/* Comentario */}
            <div className="form-group">
              <label className="form-label">
                Comentario (Opcional)
              </label>
              <p className="form-description">
                Comparte un comentario sobre el intercambio
              </p>
              <textarea
                className="form-textarea"
                placeholder="Ejemplo: Excelente comunicación y producto en perfecto estado..."
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                rows={3}
                maxLength={500}
              />
              <span className="char-count">
                {comentario.length}/500
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button
            className="cancel-button"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            className="submit-button"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-small"></span>
                Enviando...
              </>
            ) : (
              '⭐ Enviar Calificación'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RateModal;
