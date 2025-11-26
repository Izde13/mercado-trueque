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
 * Hook personalizado para obtener productos del usuario autenticado
 * Filtra solo productos activos disponibles para ofrecerse en un trueque
 * @param {string} userId - ID del usuario actual
 * @returns {Object} { products, loading, error, refetch }
 */
export const useUserProducts = (userId) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserProducts = async () => {
    try {
      if (!userId) {
        setError('Usuario no identificado');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      // Llamada a la API para obtener productos del usuario específico
      // Pasamos el usuario como parámetro de filtro
      const data = await apiService.get('/products', {
        params: {
          usuario: userId,
          estadoPublicacion: 'disponible'
        }
      });

      // Mapear productos del usuario
      const userProducts = data
        .map(mapProductFromAPI);

      setProducts(userProducts);
    } catch (err) {
      setError(err.message || 'Error al cargar productos');
      console.error('Error fetching user products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserProducts();
    }
  }, [userId]);

  const refetch = () => {
    fetchUserProducts();
  };

  return { products, loading, error, refetch };
};