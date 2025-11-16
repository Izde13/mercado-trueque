import "./TradeProposalPage.css";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { useShipTrade } from "../../shared/hooks/useShipTrade";
import { useAuth } from "../../context/AuthContext";

export default function ShipTradeProposalPage() {
  const { intercambioId } = useParams();
  const navigate = useNavigate();

  // Obtener userId del contexto de autenticación
  const { user } = useAuth();
  const userId = user?.id;

  // Estados para el envío
  const [origenDireccion, setOrigenDireccion] = useState("");
  const [destinoDireccion, setDestinoDireccion] = useState("Centro de Distribución - Bogotá");
  const [notas, setNotas] = useState("");

  // Estado para notificaciones
  const [notification, setNotification] = useState(null);

  // Hook para enviar productos
  const { shipTrade, loading: shipLoading, error: shipError, success: shipSuccess } = useShipTrade();

  // Limpiar notificación después de 3 segundos
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Validación: verificar que tenemos el intercambioId
  if (!intercambioId) {
    return (
      <section className="trade-wrap">
        <nav className="trade-bc">Inicio / <span>Envío</span></nav>
        <h1 className="trade-title">Error: Intercambio no encontrado</h1>
      </section>
    );
  }

  // Manejar envío de productos
  const handleSubmitShip = async () => {
    if (!origenDireccion.trim()) {
      setNotification({
        type: 'error',
        message: 'Debes ingresar la dirección de origen'
      });
      return;
    }

    try {
      await shipTrade(
        intercambioId,
        userId,
        origenDireccion,
        destinoDireccion,
        notas
      );

      setNotification({
        type: 'success',
        message: '¡Productos enviados correctamente! El centro de distribución está procesando tu envío.'
      });

      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate("/mis-intercambios");
      }, 2000);
    } catch (err) {
      console.error("Error:", err);
      setNotification({
        type: 'error',
        message: shipError || "Error al enviar los productos"
      });
    }
  };

  return (
    <section className="trade-wrap">
      <nav className="trade-bc">Inicio / <span>Envío</span></nav>

      {notification && (
        <div className={`rp-notification rp-notification-${notification.type}`}>
          {notification.message}
        </div>
      )}

      <h1 className="trade-title">Enviar Productos</h1>

      <div className="trade-grid">
        <div className="trade-col">
          <div className="ship-section">
            <h2 className="box-title">Información de Envío</h2>

            <div className="form-group">
              <label htmlFor="origen">Dirección de Origen *</label>
              <input
                id="origen"
                type="text"
                className="form-input"
                placeholder="Ej: Calle Principal 123, Apto 4B, Bogotá"
                value={origenDireccion}
                onChange={(e) => setOrigenDireccion(e.target.value)}
              />
              <small className="form-helper">Donde se recogerán los productos</small>
            </div>

            <div className="form-group">
              <label htmlFor="destino">Dirección de Destino</label>
              <input
                id="destino"
                type="text"
                className="form-input"
                placeholder="Centro de Distribución"
                value={destinoDireccion}
                disabled
              />
              <small className="form-helper">Se asigna automáticamente</small>
            </div>

            <div className="form-group">
              <label htmlFor="notas">Notas (opcional)</label>
              <textarea
                id="notas"
                className="form-textarea"
                placeholder="Ej: Producto frágil, empacar con cuidado..."
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                maxLength={500}
                rows={4}
              />
              <small className="form-helper">{notas.length}/500</small>
            </div>

            {shipError && (
              <div className="form-error">
                {shipError}
              </div>
            )}

            {shipSuccess && (
              <div className="form-success">
                ✓ Productos enviados correctamente
              </div>
            )}

            <button
              className="sum-cta"
              type="button"
              onClick={handleSubmitShip}
              disabled={shipLoading}
            >
              {shipLoading ? "Enviando..." : "Confirmar Envío"}
            </button>
          </div>
        </div>

        <aside className="trade-aside">
          <div className="ship-info">
            <h3 className="box-title">Proceso de Envío</h3>
            <ol className="ship-steps">
              <li className="step completed">
                <strong>Propuesta Aceptada</strong>
                <span>El intercambio fue aceptado</span>
              </li>
              <li className="step active">
                <strong>Enviar Productos</strong>
                <span>Envía tus productos al centro</span>
              </li>
              <li className="step">
                <strong>Revisión</strong>
                <span>El centro revisa la condición</span>
              </li>
              <li className="step">
                <strong>Entrega</strong>
                <span>Recibirás los productos</span>
              </li>
              <li className="step">
                <strong>Calificación</strong>
                <span>Evalúa la transacción</span>
              </li>
            </ol>

            <div className="ship-info-box">
              <h4>Tiempo Estimado</h4>
              <p>3-5 días hábiles desde el envío</p>
            </div>

            <div className="ship-info-box">
              <h4>Transportista</h4>
              <p>Servicio de mensajería estándar</p>
            </div>

            <div className="ship-info-box">
              <h4>Centro de Distribución</h4>
              <p>Bogotá - Cra. 7 con Calle 45</p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}