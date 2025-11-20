import { useState } from 'react';
import { apiService } from '../services/apiAxios';

/**
 * Hook para calificar un intercambio completado (FASE 6)
 * @returns {Object} { rateTrade, loading, error, success, clearError }
 */
export const useRateTrade = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [result, setResult] = useState(null);

  const rateTrade = async (
    intercambioId,
    usuarioId,
    usuarioCalificadoId,
    calificacionUsuario,
    calificacionProducto,
    comentario = ''
  ) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      // Validaciones
      if (!intercambioId) {
        throw new Error('ID del intercambio requerido');
      }
      if (!usuarioId) {
        throw new Error('ID del usuario requerido');
      }
      if (!usuarioCalificadoId) {
        throw new Error('ID del usuario a calificar requerido');
      }
      if (!calificacionUsuario || calificacionUsuario < 1 || calificacionUsuario > 5) {
        throw new Error('La calificación del usuario debe estar entre 1 y 5');
      }
      if (!calificacionProducto || calificacionProducto < 1 || calificacionProducto > 5) {
        throw new Error('La calificación del producto debe estar entre 1 y 5');
      }

      const payload = {
        usuario_id: usuarioId,
        usuario_calificado_id: usuarioCalificadoId,
        calificacion_usuario: calificacionUsuario,
        calificacion_producto: calificacionProducto,
        comentario: comentario.trim()
      };

      // POST a endpoint de calificación
      const response = await apiService.post(
        `/trades/${intercambioId}/rate`,
        payload
      );

      setResult(response);
      setSuccess(true);

      return {
        success: true,
        data: response,
        message: 'Calificación registrada correctamente'
      };
    } catch (err) {
      console.error('Error rating trade:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Error al calificar el intercambio';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    rateTrade,
    loading,
    error,
    success,
    result,
    clearError: () => setError(null),
    clearSuccess: () => setSuccess(false)
  };
};
