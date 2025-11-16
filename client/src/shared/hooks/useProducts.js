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
 * Hook personalizado para obtener productos desde la API con filtros
 * @param {Object} filters - Filtros a aplicar: { categoria: [], estado: [], precioMin, precioMax }
 * @returns {Object} { products, loading, error, refetch }
 */
export const useProducts = (filters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async (appliedFilters = filters) => {
    try {
      setLoading(true);
      setError(null);

      // Construir query params desde filtros
      const queryParams = new URLSearchParams();

      // Nombre (búsqueda)
      if (appliedFilters.nombre) {
        queryParams.set('nombre', appliedFilters.nombre);
      }

      // Categorías (múltiples)
      if (appliedFilters.categoria && appliedFilters.categoria.length > 0) {
        appliedFilters.categoria.forEach(cat => queryParams.append('categoria', cat));
      }

      // Estados (múltiples)
      if (appliedFilters.estado && appliedFilters.estado.length > 0) {
        appliedFilters.estado.forEach(estado => queryParams.append('estado', estado));
      }

      // Precio mínimo
      if (appliedFilters.precioMin) {
        queryParams.set('precioMin', appliedFilters.precioMin);
      }

      // Precio máximo
      if (appliedFilters.precioMax) {
        queryParams.set('precioMax', appliedFilters.precioMax);
      }

      // Llamada a la API con query params
      const queryString = queryParams.toString();
      const url = `/products${queryString ? `?${queryString}` : ''}`;
      const data = await apiService.get(url);

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

  useEffect(() => {
    fetchProducts(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.nombre,
    filters.categoria?.join(','),
    filters.estado?.join(','),
    filters.precioMin,
    filters.precioMax,
  ]);

  // Función para refrescar productos con nuevos filtros
  const refetch = (newFilters = filters) => {
    fetchProducts(newFilters);
  };

  return { products, loading, error, refetch };
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
        const apiData = await apiService.get('/products');

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