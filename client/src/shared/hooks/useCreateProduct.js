import { useState } from 'react';
import { apiService } from '../services/apiAxios';

export const useCreateProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createProduct = async (productData) => {
    try {
      setLoading(true);
      setError(null);

      // Hardcoded user ID (UUID) y fake image URL
      const FAKE_USER_ID = "df14ad4a-67df-488d-8f91-8ea2949f16e1";
      const FAKE_IMAGE_URL = "https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=Producto";

      const payload = {
        usuarioId: FAKE_USER_ID,
        categoriaId: productData.categoriaId,
        titulo: productData.titulo.trim(),
        descripcion: productData.descripcion.trim(),
        valorEstimado: parseFloat(productData.valorEstimado),
        imagenPrincipal: FAKE_IMAGE_URL
      };

      const result = await apiService.post('/api/v1/products', payload);

      // Handle the new API response structure
      return {
        success: result.success,
        message: result.message,
        data: result.data,
        requestId: result.requestId
      };
    } catch (err) {
      console.error('Error creating product:', err);
      const errorMessage = err.response?.data?.message || 'Error al crear el producto';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    createProduct,
    loading,
    error,
    clearError: () => setError(null)
  };
};