import { useState, useEffect } from 'react';
import { apiService } from '../services/apiAxios';

/**
 * Hook para obtener todas las notificaciones del usuario
 * @param {string} userId - ID del usuario
 * @returns {Object} { notifications, loading, error, refetch }
 */
export const useNotifications = (userId) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!userId) {
        setNotifications([]);
        return;
      }

      // Obtener todas las notificaciones del usuario
      const response = await apiService.get(`/notifications/user/${userId}`);
      setNotifications(response || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Error al obtener notificaciones';
      setError(errorMessage);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [userId]);

  return {
    notifications,
    loading,
    error,
    refetch: fetchNotifications
  };
};