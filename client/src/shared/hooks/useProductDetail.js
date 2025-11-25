import { useState, useEffect } from 'react';
import { apiService } from '../services/apiAxios';

/**
 * Hook para obtener un producto específico por ID
 * @param {string} productId - ID del producto
 * @returns {Object} { product, loading, error }
 */
export const useProductDetail = (productId) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await apiService.get(`/products/${productId}`);

        // Mapear datos de la API al formato del frontend
        const mappedProduct = {
          id: data.id,
          userId: data.usuarioId,
          categoryId: data.categoriaId,
          title: data.titulo,
          description: data.descripcion,
          estimatedValue: data.valorEstimado,
          publicationDate: data.fechaPublicacion,
          publicationStatus: data.estadoPublicacion,
          mainImage: data.imagenPrincipal,
          views: data.vistas || 0,
          popularity: data.popularidad || 0,
          productStatusId: data.estadoProductoId,
          images: data.imagenes,
          characteristics: data.caracteristicas || []
        };

        setProduct(mappedProduct);
      } catch (err) {
        setError(err.message || 'Error al cargar el producto');
        console.error('Error fetching product detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return { product, loading, error };
};