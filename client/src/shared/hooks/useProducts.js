import { useState, useEffect } from 'react';
import { newProducts, trendingProducts } from '../mocks/products';

/**
 * Hook personalizado para obtener productos
 * Simula una llamada a API con un delay
 * @param {string} type - Tipo de productos: 'new' o 'trending'
 * @returns {Object} { products, loading, error }
 */
export const useProducts = (type = 'new') => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simular delay de red (300-800ms)
        await new Promise((resolve) => 
          setTimeout(resolve, Math.random() * 500 + 300)
        );

        // Seleccionar datos según el tipo
        const data = type === 'trending' ? trendingProducts : newProducts;
        
        setProducts(data);
      } catch (err) {
        setError(err.message || 'Error al cargar productos');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [type]);

  return { products, loading, error };
};

/**
 * Hook para obtener todos los productos de una vez
 * @returns {Object} { newProducts, trendingProducts, loading, error }
 */
export const useAllProducts = () => {
  const [data, setData] = useState({
    newProducts: [],
    trendingProducts: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simular delay de red
        await new Promise((resolve) => setTimeout(resolve, 400));

        setData({
          newProducts,
          trendingProducts,
        });
      } catch (err) {
        setError(err.message || 'Error al cargar productos');
        console.error('Error fetching all products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  return { ...data, loading, error };
};

// Función helper para cuando se conecte con el API real
export const fetchProductsFromAPI = async (endpoint) => {
  // Esta función se puede usar más adelante para conectar con el backend
  // import { apiService } from '../services/apiAxios';
  // return await apiService.get(endpoint);
  
  console.warn('fetchProductsFromAPI: Todavía no implementado, usando datos mock');
  return newProducts;
};
