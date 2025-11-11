import "./ReceivedProposalsPage.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import ProposalCard from "../../features/trade/ProposalCard/ProposalCard.jsx";

import { useUserProposals } from "../../shared/hooks/useUserProposals";
import { useAcceptTradeProposal } from "../../shared/hooks/useAcceptTradeProposal";
import { useRejectTradeProposal } from "../../shared/hooks/useRejectTradeProposal";
import { getCurrentUserId } from "../../shared/constants/auth";

export default function ReceivedProposalsPage() {
  const navigate = useNavigate();

  // Obtener userId del archivo de constantes (mock de autenticación)
  const userId = getCurrentUserId();

  // Estado de propuestas pendientes
  const { proposals, loading: proposalsLoading, refetch } = useUserProposals(userId, "PROPUESTA");

  // Hooks para aceptar/rechazar
  const { acceptProposal, loading: acceptLoading, error: acceptError } = useAcceptTradeProposal();
  const { rejectProposal, loading: rejectLoading, error: rejectError } = useRejectTradeProposal();

  // Estado local para modal de confirmación
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedProposalId, setSelectedProposalId] = useState(null);

  // Estado para notificaciones
  const [notification, setNotification] = useState(null);

  // Limpiar notificación después de 3 segundos
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleAcceptClick = (proposalId) => {
    setConfirmAction('accept');
    setSelectedProposalId(proposalId);
  };

  const handleRejectClick = (proposalId) => {
    setConfirmAction('reject');
    setSelectedProposalId(proposalId);
  };

  const handleConfirmAction = async () => {
    if (!selectedProposalId) return;

    try {
      if (confirmAction === 'accept') {
        const result = await acceptProposal(selectedProposalId, userId);
        setNotification({
          type: 'success',
          message: 'Propuesta aceptada correctamente. El intercambio ha comenzado.'
        });
        refetch();
        // Redirigir después de 2 segundos usando el ID del intercambio
        setTimeout(() => {
          const intercambioId = result?.intercambioId;
          if (intercambioId) {
            navigate(`/trueque/${intercambioId}/enviar`);
          }
        }, 2000);
      } else if (confirmAction === 'reject') {
        await rejectProposal(selectedProposalId);
        setNotification({
          type: 'success',
          message: 'Propuesta rechazada.'
        });
        refetch();
      }
    } catch (err) {
      console.error('Error:', err);
      setNotification({
        type: 'error',
        message: acceptError || rejectError || 'Error al procesar la acción'
      });
    } finally {
      setConfirmAction(null);
      setSelectedProposalId(null);
    }
  };

  const handleCancelConfirm = () => {
    setConfirmAction(null);
    setSelectedProposalId(null);
  };

  const isLoading = proposalsLoading || acceptLoading || rejectLoading;

  return (
    <section className="received-proposals-wrap">
      <nav className="rp-breadcrumb">Inicio / <span>Propuestas Recibidas</span></nav>

      {notification && (
        <div className={`rp-notification rp-notification-${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div className="rp-header">
        <h1 className="rp-title">Propuestas Recibidas</h1>
        <p className="rp-subtitle">Revisa y acepta las propuestas de otros usuarios para intercambiar tus productos</p>
      </div>

      {proposalsLoading && (
        <div className="rp-loading">
          <p>Cargando propuestas...</p>
        </div>
      )}

      {!proposalsLoading && proposals.length === 0 && (
        <div className="rp-empty">
          <div className="rp-empty-icon">📭</div>
          <h2>No tienes propuestas pendientes</h2>
          <p>Cuando alguien proponga un intercambio contigo, aparecerán aquí.</p>
          <button
            className="rp-empty-cta"
            onClick={() => navigate("/productos")}
          >
            Explorar productos
          </button>
        </div>
      )}

      {!proposalsLoading && proposals.length > 0 && (
        <div className="rp-list">
          {proposals.map(proposal => (
            <ProposalCard
              key={proposal.id}
              proposal={proposal}
              onAccept={handleAcceptClick}
              onReject={handleRejectClick}
              loading={isLoading && selectedProposalId === proposal.id}
            />
          ))}
        </div>
      )}

      {/* Modal de confirmación */}
      {confirmAction && (
        <div className="rp-modal-overlay" onClick={handleCancelConfirm}>
          <div className="rp-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="rp-modal-title">
              {confirmAction === 'accept'
                ? '¿Aceptar esta propuesta?'
                : '¿Rechazar esta propuesta?'}
            </h2>

            <p className="rp-modal-message">
              {confirmAction === 'accept'
                ? 'Al aceptar, se iniciará el proceso de intercambio. Ambos usuarios deberán enviar sus productos al centro de distribución.'
                : 'Al rechazar, se notificará al usuario y no podrá ser aceptada después.'}
            </p>

            <div className="rp-modal-actions">
              <button
                className="rp-modal-btn rp-modal-btn-cancel"
                onClick={handleCancelConfirm}
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                className={`rp-modal-btn ${confirmAction === 'accept' ? 'rp-modal-btn-accept' : 'rp-modal-btn-reject'}`}
                onClick={handleConfirmAction}
                disabled={isLoading}
              >
                {isLoading ? 'Procesando...' : (confirmAction === 'accept' ? 'Aceptar' : 'Rechazar')}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
