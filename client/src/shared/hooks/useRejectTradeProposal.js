import { useState } from 'react';
import { apiService } from '../services/apiAxios';

/**
 * Hook para rechazar una propuesta de trueque
 * @returns {Object} { rejectProposal, loading, error, success, clearError }
 */
export const useRejectTradeProposal = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [result, setResult] = useState(null);

  const rejectProposal = async (proposalId, razonRechazo = '') => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      if (!proposalId) {
        throw new Error('ID de propuesta requerido');
      }

      const payload = {
        reason: razonRechazo || undefined
      };

      // POST a endpoint de rechazar propuesta
      // TODO: Verificar endpoint exacto en backend
      const response = await apiService.post(
        `/api/v1/trades/proposals/${proposalId}/reject`,
        payload
      );

      setResult(response);
      setSuccess(true);

      return {
        success: true,
        data: response,
        message: 'Propuesta rechazada'
      };
    } catch (err) {
      console.error('Error rejecting trade proposal:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Error al rechazar la propuesta';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    rejectProposal,
    loading,
    error,
    success,
    result,
    clearError: () => setError(null),
    clearSuccess: () => setSuccess(false)
  };
};
