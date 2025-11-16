import { useState, useEffect } from 'react';
import { useNotifications } from '../../shared/hooks/useNotifications';
import './NotificationsSection.css';

/**
 * Componente para mostrar las notificaciones del usuario
 * @param {string} userId - ID del usuario autenticado
 */
export const NotificationsSection = ({ userId }) => {
  const { notifications, loading, error, refetch } = useNotifications(userId);
  const [isOpen, setIsOpen] = useState(false);

  const handleReload = () => {
    refetch();
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  // Formatear fecha para mostrar
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Hace un momento';
    if (diffMins < 60) return `Hace ${diffMins}m`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;

    return date.toLocaleDateString('es-ES');
  };

  // Obtener el icono según el tipo de notificación
  const getNotificationIcon = (tipo) => {
    const icons = {
      'propuesta': '💬',
      'pregunta': '❓',
      'envio': '📦',
      'revision': '👀',
      'intercambio_completado': '✅',
      'alerta': '🔔',
      'mensaje': '💌',
    };
    return icons[tipo] || '📬';
  };

  return (
    <div className="notifications-section">
      <button
        className="notifications-button"
        onClick={toggleOpen}
        aria-label="Notificaciones"
      >
        <span className="notification-icon">🔔</span>
        {notifications.length > 0 && (
          <span className="notification-badge">{notifications.length}</span>
        )}
      </button>

      {isOpen && (
        <div className="notifications-panel">
          <div className="notifications-header">
            <h3>Notificaciones</h3>
            <div className="notifications-controls">
              <button
                className="reload-button"
                onClick={handleReload}
                disabled={loading}
                title="Recargar notificaciones"
              >
                🔄
              </button>
              <button
                className="close-button"
                onClick={toggleOpen}
                title="Cerrar"
              >
                ✕
              </button>
            </div>
          </div>

          {loading && (
            <div className="notifications-content">
              <div className="loading-state">Cargando notificaciones...</div>
            </div>
          )}

          {error && (
            <div className="notifications-content">
              <div className="error-state">
                {error}
                <button
                  className="retry-button"
                  onClick={handleReload}
                >
                  Reintentar
                </button>
              </div>
            </div>
          )}

          {!loading && !error && notifications.length === 0 && (
            <div className="notifications-content">
              <div className="empty-state">
                <span className="empty-icon">📭</span>
                <p>No tienes notificaciones</p>
              </div>
            </div>
          )}

          {!loading && !error && notifications.length > 0 && (
            <div className="notifications-content">
              <ul className="notifications-list">
                {notifications.map((notification) => (
                  <li
                    key={notification.id}
                    className={`notification-item ${
                      notification.leida ? 'read' : 'unread'
                    }`}
                  >
                    <span className="notification-type-icon">
                      {getNotificationIcon(notification.tipo)}
                    </span>
                    <div className="notification-content">
                      <div className="notification-title">
                        {notification.titulo}
                      </div>
                      <div className="notification-message">
                        {notification.mensaje}
                      </div>
                      <div className="notification-time">
                        {formatDate(notification.fechaCreacion)}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
