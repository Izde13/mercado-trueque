import { useState, useEffect } from 'react';
import { apiService } from '../services/apiAxios';

/**
 * Mapea los datos de la API al formato esperado por el frontend
 * @param {Object} apiProduct - Producto desde la API
 * @returns {Object} Producto formateado
 */
const mapProductFromAPI = (apiProduct) => {
  return {
    id: apiProduct.id,
    userId: apiProduct.usuarioId,
    categoryId: apiProduct.categoriaId,
    title: apiProduct.titulo,
    description: apiProduct.descripcion,
    estimatedValue: apiProduct.valorEstimado,
    publicationDate: apiProduct.fechaPublicacion,
    publicationStatus: apiProduct.estadoPublicacion,
    mainImage: apiProduct.imagenPrincipal,
    views: apiProduct.vistas || 0,
    popularity: apiProduct.popularidad || 0,
    productStatusId: apiProduct.estadoProductoId,
    images: apiProduct.imagenes
  };
};

/**
 * Hook personalizado para obtener productos desde la API
 * @param {string} type - Tipo de productos: 'new' o 'trending' (actualmente retorna los mismos)
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

        // Llamada a la API
        const data = await apiService.get('/api/v1/products');

        // Mapear los productos al formato del frontend
        const mappedProducts = data.map(mapProductFromAPI);

        setProducts(mappedProducts);
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
 * Retorna los mismos productos para ambas secciones (nuevos y tendencia)
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

        // Llamada a la API
        const apiData = await apiService.get('/api/v1/products');

        // Mapear los productos al formato del frontend
        const mappedProducts = apiData.map(mapProductFromAPI);

        // Usar los mismos productos para ambas secciones
        setData({
          newProducts: mappedProducts,
          trendingProducts: mappedProducts,
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
