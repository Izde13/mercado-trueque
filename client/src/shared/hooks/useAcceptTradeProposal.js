import { useState } from 'react';
import { apiService } from '../services/apiAxios';

/**
 * Hook para aceptar una propuesta de trueque
 * @returns {Object} { acceptProposal, loading, error, success, clearError }
 */
export const useAcceptTradeProposal = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [result, setResult] = useState(null);

  const acceptProposal = async (proposalId, usuarioAceptanteId) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      if (!proposalId) {
        throw new Error('ID de propuesta requerido');
      }
      if (!usuarioAceptanteId) {
        throw new Error('ID de usuario aceptante requerido');
      }

      const payload = {
        usuario_aceptante_id: usuarioAceptanteId
      };

      // POST a endpoint de aceptar propuesta
      const response = await apiService.post(
        `/trades/proposals/${proposalId}/accept`,
        payload
      );

      setResult(response);
      setSuccess(true);

      return {
        success: true,
        intercambioId: response.id,  // El ID del intercambio creado
        data: response,
        message: 'Propuesta aceptada correctamente'
      };
    } catch (err) {
      console.error('Error accepting trade proposal:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Error al aceptar la propuesta';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    acceptProposal,
    loading,
    error,
    success,
    result,
    clearError: () => setError(null),
    clearSuccess: () => setSuccess(false)
  };
};