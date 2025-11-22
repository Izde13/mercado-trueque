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

    // Flag para evitar race conditions cuando se navega rápidamente entre productos
    let isCurrent = true;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        setProduct(null); // Resetear producto anterior para evitar mostrar datos obsoletos

        const data = await apiService.get(`/products/${productId}`);

        // Solo actualizar el estado si esta petición sigue siendo relevante
        if (!isCurrent) return;

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
          images: data.imagenes
        };

        setProduct(mappedProduct);
      } catch (err) {
        // Solo actualizar error si esta petición sigue siendo relevante
        if (!isCurrent) return;

        setError(err.message || 'Error al cargar el producto');
        console.error('Error fetching product detail:', err);
      } finally {
        // Solo actualizar loading si esta petición sigue siendo relevante
        if (isCurrent) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    // Cleanup: marcar esta petición como obsoleta cuando el componente se desmonte
    // o cuando cambie el productId
    return () => {
      isCurrent = false;
    };
  }, [productId]);

  return { product, loading, error };
};