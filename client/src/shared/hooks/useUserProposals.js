import { useState, useEffect } from 'react';
import { apiService } from '../services/apiAxios';

/**
 * Mapea propuesta desde la API al formato frontend
 */
const mapProposalFromAPI = (apiProposal) => {
  return {
    id: apiProposal.id,
    propuestaId: apiProposal.propuestaId || apiProposal.id,
    usuarioOferenteId: apiProposal.usuarioOferenteId,
    usuarioOferenteNombre: apiProposal.usuarioOferenteNombre || "Usuario",
    usuarioOferenteRating: apiProposal.usuarioOferenteRating || 0,
    productoSolicitadoId: apiProposal.productoSolicitadoId,
    productoSolicitado: apiProposal.productoSolicitado,
    mensaje: apiProposal.mensaje || apiProposal.message || "",
    fechaPropuesta: apiProposal.fechaPropuesta || apiProposal.createdAt,
    estado: apiProposal.estado,
    productosOfrecidos: apiProposal.productosOfrecidos || [],
    totalValorOfrecido: apiProposal.totalValorOfrecido || 0,
    totalValorSolicitado: apiProposal.totalValorSolicitado || 0
  };
};

/**
 * Hook para obtener propuestas recibidas por el usuario
 * @param {string} userId - ID del usuario
 * @param {string} estado - Filtrar por estado (PROPUESTA, ACEPTADA, RECHAZADA, etc.)
 * @returns {Object} { proposals, loading, error, refetch }
 */
export const useUserProposals = (userId, estado = null) => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProposals = async () => {
    try {
      if (!userId) {
        setError('Usuario no identificado');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      // Llamar al endpoint para obtener propuestas recibidas por el usuario
      const url = `/trades/proposals/received/${userId}`;

      const data = await apiService.get(url);

      // Manejar diferentes formatos de respuesta
      const proposalsList = Array.isArray(data) ? data : data.data || [];
      const mappedProposals = proposalsList
        .filter(p => {
          const estadoUpper = (p.estado || '').toUpperCase();
          return estadoUpper === 'PROPUESTA' || estadoUpper === 'PENDING' || estadoUpper === 'PENDIENTE';
        })
        .map(mapProposalFromAPI);

      setProposals(mappedProposals);
    } catch (err) {
      console.warn('Error fetching proposals (endpoint podría no existir):', err.message);
      // No lanzar error, simplemente mostrar lista vacía por ahora
      setProposals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchProposals();
    }
  }, [userId, estado]);

  const refetch = () => {
    fetchProposals();
  };

  return { proposals, loading, error, refetch };
};