import "./MyTradesPage.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { useUserTrades } from "../../shared/hooks/useUserTrades";
import { getCurrentUserId } from "../../shared/constants/auth";

export default function MyTradesPage() {
  const navigate = useNavigate();
  const userId = getCurrentUserId();
  const { trades, loading } = useUserTrades(userId);

  // Estado para filtro de estado
  const [filterStatus, setFilterStatus] = useState("todos");

  // Función para obtener color según estado
  const getStatusColor = (estado) => {
    switch (estado?.toUpperCase()) {
      case "INICIADO":
      case "EN_ENVIO":
        return "status-pending";
      case "PRODUCTOS_ENVIADOS":
      case "EN_REVISION":
        return "status-review";
      case "ENTREGADO":
      case "COMPLETADO":
        return "status-completed";
      default:
        return "status-default";
    }
  };

  // Función para obtener icono según estado
  const getStatusIcon = (estado) => {
    switch (estado?.toUpperCase()) {
      case "INICIADO":
      case "EN_ENVIO":
        return "🚚";
      case "PRODUCTOS_ENVIADOS":
      case "EN_REVISION":
        return "🔍";
      case "ENTREGADO":
      case "COMPLETADO":
        return "✅";
      default:
        return "⏳";
    }
  };

  // Función para formatear fecha
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  // Filtrar trades por estado
  const filteredTrades =
    filterStatus === "todos"
      ? trades
      : trades.filter(
          (trade) =>
            trade.estado?.toUpperCase() === filterStatus.toUpperCase()
        );

  return (
    <section className="my-trades-wrap">
      <nav className="mt-breadcrumb">Inicio / <span>Mis Intercambios</span></nav>

      <div className="mt-header">
        <div>
          <h1 className="mt-title">Mis Intercambios</h1>
          <p className="mt-subtitle">
            Aquí puedes ver el estado de todos tus intercambios
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="mt-filters">
        <button
          className={`mt-filter-btn ${filterStatus === "todos" ? "active" : ""}`}
          onClick={() => setFilterStatus("todos")}
        >
          Todos ({trades.length})
        </button>
        <button
          className={`mt-filter-btn ${filterStatus === "iniciado" ? "active" : ""}`}
          onClick={() => setFilterStatus("iniciado")}
        >
          En Envío ({trades.filter(t => t.estado?.toUpperCase() === "EN_ENVIO" || t.estado?.toUpperCase() === "INICIADO").length})
        </button>
        <button
          className={`mt-filter-btn ${filterStatus === "en_revision" ? "active" : ""}`}
          onClick={() => setFilterStatus("en_revision")}
        >
          En Revisión ({trades.filter(t => t.estado?.toUpperCase() === "EN_REVISION" || t.estado?.toUpperCase() === "PRODUCTOS_ENVIADOS").length})
        </button>
        <button
          className={`mt-filter-btn ${filterStatus === "completado" ? "active" : ""}`}
          onClick={() => setFilterStatus("completado")}
        >
          Completado ({trades.filter(t => t.estado?.toUpperCase() === "COMPLETADO" || t.estado?.toUpperCase() === "ENTREGADO").length})
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="mt-loading">
          <p>Cargando tus intercambios...</p>
        </div>
      )}

      {/* Listado de intercambios */}
      {!loading && filteredTrades.length === 0 && (
        <div className="mt-empty">
          <div className="mt-empty-icon">📦</div>
          <h2>No hay intercambios</h2>
          <p>
            {filterStatus === "todos"
              ? "Aún no tienes ningún intercambio. ¡Comienza a proponer!"
              : `No hay intercambios en estado "${filterStatus}"`}
          </p>
          <button
            className="mt-empty-cta"
            onClick={() => navigate("/productos")}
          >
            Ver productos
          </button>
        </div>
      )}

      {!loading && filteredTrades.length > 0 && (
        <div className="mt-list">
          {filteredTrades.map((trade) => (
            <div key={trade.id} className="mt-card">
              {/* Header de la tarjeta */}
              <div className="mt-card-header">
                <div className="mt-card-title-section">
                  <h3 className="mt-card-title">Intercambio #{trade.id.slice(0, 8)}</h3>
                  <span className={`mt-status ${getStatusColor(trade.estado)}`}>
                    {getStatusIcon(trade.estado)} {trade.estado || "Desconocido"}
                  </span>
                </div>
                <div className="mt-card-date">
                  {formatDate(trade.fecha_inicio)}
                </div>
              </div>

              {/* Contenido */}
              <div className="mt-card-content">
                {/* Información del intercambio */}
                <div className="mt-trade-info">
                  <div className="mt-info-item">
                    <label>Centro de Distribución</label>
                    <p>{trade.centro_distribucion_id?.slice(0, 8) || "N/A"}</p>
                  </div>
                  <div className="mt-info-item">
                    <label>Estado Actual</label>
                    <p className={getStatusColor(trade.estado)}>
                      {trade.estado || "Pendiente"}
                    </p>
                  </div>
                  {trade.fecha_completado && (
                    <div className="mt-info-item">
                      <label>Completado</label>
                      <p>{formatDate(trade.fecha_completado)}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer con acciones */}
              <div className="mt-card-footer">
                {(trade.estado?.toUpperCase() === "INICIADO" ||
                  trade.estado?.toUpperCase() === "EN_ENVIO") && (
                  <button
                    className="mt-card-btn mt-card-btn-ship"
                    onClick={() => navigate(`/trueque/${trade.id}/enviar`)}
                  >
                    📦 Continuar Envío
                  </button>
                )}

                {(trade.estado?.toUpperCase() === "PRODUCTOS_ENVIADOS" ||
                  trade.estado?.toUpperCase() === "EN_REVISION") && (
                  <button className="mt-card-btn mt-card-btn-review" disabled>
                    🔍 En Revisión
                  </button>
                )}

                {(trade.estado?.toUpperCase() === "COMPLETADO" ||
                  trade.estado?.toUpperCase() === "ENTREGADO") && (
                  <button className="mt-card-btn mt-card-btn-completed" disabled>
                    ✅ Completado
                  </button>
                )}

                <button className="mt-card-btn mt-card-btn-details">
                  Ver Detalles →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
