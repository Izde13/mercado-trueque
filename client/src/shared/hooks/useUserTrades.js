import { useState, useEffect } from 'react';
import { apiService } from '../services/apiAxios';

/**
 * Hook para obtener todos los intercambios del usuario
 * @param {string} userId - ID del usuario
 * @returns {Object} { trades, loading, error, refetch }
 */
export const useUserTrades = (userId) => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTrades = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!userId) {
        setTrades([]);
        return;
      }

      // Obtener todos los intercambios del usuario
      const response = await apiService.get(`/trades/user/${userId}`);
      setTrades(response || []);
    } catch (err) {
      console.error('Error fetching user trades:', err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Error al obtener intercambios';
      setError(errorMessage);
      setTrades([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, [userId]);

  return {
    trades,
    loading,
    error,
    refetch: fetchTrades
  };
};