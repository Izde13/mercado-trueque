import { useState } from 'react';
import { apiService } from '../services/apiAxios';

/**
 * Hook personalizado para crear una propuesta de trueque
 * @returns {Object} { createProposal, loading, error, success, clearError, result }
 */
export const useTradeProposal = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [result, setResult] = useState(null);

  const createProposal = async (proposalData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      // Validaciones básicas
      if (!proposalData.usuario_oferente_id) {
        throw new Error('Usuario oferente requerido');
      }
      if (!proposalData.requested_product_id) {
        throw new Error('Producto solicitado requerido');
      }
      if (!proposalData.offered_product_ids || proposalData.offered_product_ids.length === 0) {
        throw new Error('Debe ofrecer al menos un producto');
      }

      const payload = {
        usuario_oferente_id: proposalData.usuario_oferente_id,
        requested_product_id: proposalData.requested_product_id,
        offered_product_ids: proposalData.offered_product_ids,
        message: proposalData.message || undefined
      };

      // Hacer POST a la API
      const response = await apiService.post('/api/v1/trades/proposals', payload);

      setResult(response);
      setSuccess(true);

      return {
        success: true,
        data: response,
        message: 'Propuesta de trueque enviada correctamente'
      };
    } catch (err) {
      console.error('Error creating trade proposal:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Error al crear la propuesta';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    createProposal,
    loading,
    error,
    success,
    result,
    clearError: () => setError(null),
    clearSuccess: () => setSuccess(false)
  };
};
