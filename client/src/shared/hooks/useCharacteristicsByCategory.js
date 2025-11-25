import { useState, useEffect } from 'react';
import { apiService } from '../services/apiAxios';

export const useCharacteristicsByCategory = (categoryId) => {
  const [characteristics, setCharacteristics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!categoryId) {
      setCharacteristics([]);
      return;
    }

    const fetchCharacteristics = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.get(`/categories/characteristics/${categoryId}`);
        setCharacteristics(data || []);
      } catch (err) {
        console.error('Error fetching characteristics:', err);
        setError('No se pudieron cargar las características');
        setCharacteristics([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacteristics();
  }, [categoryId]);

  return {
    characteristics,
    loading,
    error,
  };
};
