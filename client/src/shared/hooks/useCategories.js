import { useState, useEffect } from 'react';
import { apiService } from '../services/apiAxios';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.get('/api/v1/categories');
        setCategories(data || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('No se pudieron cargar las categorías');
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: () => {
      const fetchCategories = async () => {
        try {
          setLoading(true);
          setError(null);
          const data = await apiService.get('/api/v1/categories');
          setCategories(data || []);
        } catch (err) {
          console.error('Error fetching categories:', err);
          setError('No se pudieron cargar las categorías');
          setCategories([]);
        } finally {
          setLoading(false);
        }
      };
      fetchCategories();
    }
  };
};