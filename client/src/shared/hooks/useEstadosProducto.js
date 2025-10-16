import { useState, useEffect } from 'react';
import { apiService } from '../services/apiAxios';

/**
 * Custom hook para obtener los estados de producto desde la API
 * @returns {Object} { estados, loading, error }
 */
export const useEstadosProducto = () => {
  const [estados, setEstados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEstados = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiService.get('/api/v1/estados-producto');
        setEstados(response || []);
      } catch (err) {
        console.error('Error fetching estados de producto:', err);
        setError(err.message || 'Error al cargar los estados del producto');
      } finally {
        setLoading(false);
      }
    };

    fetchEstados();
  }, []);

  return { estados, loading, error };
};
