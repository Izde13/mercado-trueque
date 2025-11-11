import { useState } from 'react';
import { apiService } from '../services/apiAxios';

/**
 * Hook para enviar productos al centro de distribución (FASE 3)
 * @returns {Object} { shipTrade, loading, error, success, clearError }
 */
export const useShipTrade = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [result, setResult] = useState(null);

  const shipTrade = async (intercambioId, usuarioId, origenDireccion, destinoDireccion, notas = '') => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      if (!intercambioId) {
        throw new Error('ID del intercambio requerido');
      }
      if (!usuarioId) {
        throw new Error('ID del usuario requerido');
      }
      if (!origenDireccion) {
        throw new Error('Dirección de origen requerida');
      }
      if (!destinoDireccion) {
        throw new Error('Dirección de destino requerida');
      }

      const payload = {
        intercambio_id: intercambioId,
        usuario_id: usuarioId,
        origen_direccion: origenDireccion,
        destino_direccion: destinoDireccion,
        notas: notas
      };

      // POST a endpoint de envío
      const response = await apiService.post(
        `/api/v1/trades/${intercambioId}/ship`,
        payload
      );

      setResult(response);
      setSuccess(true);

      return {
        success: true,
        data: response,
        message: 'Productos enviados correctamente'
      };
    } catch (err) {
      console.error('Error shipping trade:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Error al enviar los productos';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    shipTrade,
    loading,
    error,
    success,
    result,
    clearError: () => setError(null),
    clearSuccess: () => setSuccess(false)
  };
};
