import { useState } from 'react';
import { apiService } from '../services/apiAxios';
import { getCurrentUserId } from '../constants/auth';

export const useCreateProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createProduct = async (productData, images = []) => {
    try {
      setLoading(true);
      setError(null);

      // Obtener user ID del archivo de constantes (mock de autenticación)
      const userId = getCurrentUserId();
      // TODO: Obtener estadoProductoId real del formulario
      const DEFAULT_ESTADO_ID = "76b22db8-726b-4fdf-b8ed-067493605e8e"; // Deberás obtener esto de la BD

      // Convertir imágenes al formato esperado por el backend
      // Si son archivos File, crear URLs temporales (TODO: Implementar subida real)
      const imagenesFormateadas = images.map((img, index) => {
        let url;

        if (img instanceof File) {
          // Es un archivo File del componente UploadMedia
          url = URL.createObjectURL(img);
          // TODO: Aquí deberías subir la imagen a un servidor (AWS S3, Cloudinary, etc.)
          console.warn('⚠️ Usando URL temporal. Implementar subida de imágenes a servidor.');
        } else if (typeof img === 'string') {
          // Es una URL directa
          url = img;
        } else {
          // Es un objeto con propiedades url/preview
          url = img.url || img.preview || "https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=Producto";
        }

        return {
          url,
          orden: index + 1,
          esPrincipal: index === 0
        };
      });

      // Si no hay imágenes, usar una por defecto
      if (imagenesFormateadas.length === 0) {
        imagenesFormateadas.push({
          url: "https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=Producto",
          orden: 1,
          esPrincipal: true
        });
      }

      const payload = {
        usuarioId: userId,
        categoriaId: productData.categoriaId,
        estadoProductoId: productData.estadoProductoId || DEFAULT_ESTADO_ID,
        titulo: productData.titulo.trim(),
        descripcion: productData.descripcion.trim(),
        valorEstimado: parseFloat(productData.valorEstimado),
        imagenes: imagenesFormateadas
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