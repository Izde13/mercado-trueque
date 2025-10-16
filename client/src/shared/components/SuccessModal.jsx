import React from 'react';
import './SuccessModal.css';

const SuccessModal = ({ isOpen, onClose, title, message, productData = null }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="success-modal-overlay" onClick={handleOverlayClick}>
      <div className="success-modal">
        <div className="success-modal-header">
          <div className="success-icon">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="12" fill="#10B981"/>
              <path
                d="M8 12.5L10.5 15L16 9.5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="success-modal-title">{title}</h2>
        </div>

        <div className="success-modal-body">
          <p className="success-modal-message">{message}</p>

          {productData && (
            <div className="success-modal-product-info">
              <h3>Detalles del producto:</h3>
              <div className="product-info-grid">
                <div className="info-item">
                  <span className="info-label">Título:</span>
                  <span className="info-value">{productData.titulo}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Valor estimado:</span>
                  <span className="info-value">${Number(productData.valorEstimado).toLocaleString()}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">ID del producto:</span>
                  <span className="info-value">{productData.id}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="success-modal-footer">
          <button
            onClick={onClose}
            className="success-modal-close-btn"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;