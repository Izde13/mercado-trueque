import "./TradeProposalPage.css";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import InterestProductCard from "./../../features/trade/InterestProductCard/InterestProductCard.jsx";
import ProposalsList from "./../../features/trade/ProposalsList/ProposalsList.jsx";
import SummaryBox from "./../../features/trade/SummaryBox/SummaryBox.jsx";

import { useUserProducts } from "../../shared/hooks/useUserProducts";
import { useProductDetail } from "../../shared/hooks/useProductDetail";
import { useTradeProposal } from "../../shared/hooks/useTradeProposal";
import { useAuth } from "../../context/AuthContext";

export default function TradeProposalPage(){
  const { productId } = useParams();
  const navigate = useNavigate();

  // Obtener userId del contexto de autenticación
  const { user } = useAuth();
  const userId = user?.id;

  // Estado de productos seleccionados para la propuesta
  const [selectedProducts, setSelectedProducts] = useState([]);

  // Estado del mensaje (nota) de la propuesta
  const [message, setMessage] = useState("");

  // Estado para mostrar mensaje de éxito temporal
  const [successMessage, setSuccessMessage] = useState("");

  // Obtener el producto de interés desde la URL
  const { product: interest, loading: interestLoading, error: interestError } = useProductDetail(productId);

  // Obtener productos del usuario
  const { products: userProducts, loading: productsLoading } = useUserProducts(userId);

  // Hook para crear propuesta
  const { createProposal, loading: proposalLoading, error: proposalError, success: proposalSuccess } = useTradeProposal();

  // Limpiar mensaje de éxito después de 3 segundos
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Redirigir después de éxito tras 2 segundos
  useEffect(() => {
    if (proposalSuccess) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [proposalSuccess, navigate]);

  // Manejar cambio de selección de productos
  const handleProductToggle = (productId) => {
    setSelectedProducts(prev => {
      const isSelected = prev.includes(productId);
      if (isSelected) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  // Manejar envío de propuesta
  const handleSubmitProposal = async () => {
    if (!interest || selectedProducts.length === 0) {
      return; // El SummaryBox ya muestra este error
    }

    try {
      await createProposal({
        usuario_oferente_id: userId,
        requested_product_id: interest.id,
        offered_product_ids: selectedProducts,
        message: message
      });

      // El useEffect se encargará de redirigir después de proposalSuccess
    } catch (err) {
      console.error("Error:", err);
      // El error se mostrará en el SummaryBox mediante proposalError
    }
  };

  // Preparar items con estado de selección
  const itemsWithSelection = userProducts.map(product => ({
    ...product,
    checked: selectedProducts.includes(product.id)
  }));

  if (interestLoading || productsLoading) {
    return (
      <section className="trade-wrap">
        <nav className="trade-bc">Inicio / <span>Propuesta</span></nav>
        <h1 className="trade-title">Cargando...</h1>
      </section>
    );
  }

  if (interestError) {
    return (
      <section className="trade-wrap">
        <nav className="trade-bc">Inicio / <span>Propuesta</span></nav>
        <h1 className="trade-title">Error: {interestError}</h1>
      </section>
    );
  }

  if (!interest) {
    return (
      <section className="trade-wrap">
        <nav className="trade-bc">Inicio / <span>Propuesta</span></nav>
        <h1 className="trade-title">Producto no encontrado</h1>
      </section>
    );
  }

  return (
    <section className="trade-wrap">
      <nav className="trade-bc">Inicio / <span>Propuesta</span></nav>

      <h1 className="trade-title">Tu propuesta de trueque</h1>

      <div className="trade-grid">
        <div className="trade-col">
          <InterestProductCard product={interest} />

          <ProposalsList
            items={itemsWithSelection}
            onProductToggle={handleProductToggle}
          />
        </div>

        <aside className="trade-aside">
          <SummaryBox
            interest={interest}
            selected={userProducts.filter(p => selectedProducts.includes(p.id))}
            onSubmit={handleSubmitProposal}
            loading={proposalLoading}
            error={proposalError}
            success={proposalSuccess}
            message={message}
            onMessageChange={setMessage}
          />
        </aside>
      </div>
    </section>
  );
}