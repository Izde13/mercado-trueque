import api from '../../auth/authService';

/**
 * Servicio para manejar endpoints de revisión de productos
 * Fase 4: Revisar productos en el centro de distribución
 *
 * Utiliza la instancia de axios del authService que ya tiene
 * configurados los interceptores para agregar el token JWT automáticamente
 */
const reviewService = {
  /**
   * Obtiene los intercambios pendientes de revisión
   * (Intercambios en estado PRODUCTOS_ENVIADOS)
   */
  async getPendingReviews() {
    try {
      const response = await api.get('/trades/pending-review/list');
      return response.data;
    } catch (error) {
      console.error('Error fetching pending reviews:', error);
      throw error;
    }
  },

  /**
   * Obtiene los detalles de un intercambio específico
   */
  async getTradeDetails(intercambioId) {
    try {
      const response = await api.get(`/trades/${intercambioId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching trade details:', error);
      throw error;
    }
  },

  /**
   * Revisa un producto específico
   * @param {string} intercambioId - ID del intercambio
   * @param {string} productId - ID del producto a revisar
   * @param {object} reviewData - Datos de la revisión
   *   - condition_rating: 1-5 (calificación del estado del producto)
   *   - observations: string opcional (observaciones sobre daños o problemas)
   *   - photos: array opcional (URLs de fotos de la revisión)
   */
  async reviewProduct(intercambioId, productId, reviewData) {
    try {
      const response = await api.post(
        `/trades/${intercambioId}/products/${productId}/review`,
        {
          intercambio_id: intercambioId,
          producto_id: productId,
          condition_rating: reviewData.condition_rating,
          observations: reviewData.observations,
          photos: reviewData.photos,
        },
      );
      return response.data;
    } catch (error) {
      console.error('Error reviewing product:', error);
      throw error;
    }
  },

  /**
   * Obtiene todas las revisiones de un intercambio
   */
  async getInterchangeReviews(intercambioId) {
    try {
      const response = await api.get(`/trades/${intercambioId}/reviews`);
      return response.data;
    } catch (error) {
      console.error('Error fetching interchange reviews:', error);
      throw error;
    }
  },

  /**
   * Aprueba la revisión completa y hace automáticamente el deliver para ambos usuarios
   * Obtiene direcciones desde el backend y calcula fecha estimada + 5 días
   * @param {string} intercambioId - ID del intercambio
   * @param {object} trade - Objeto del intercambio con usuarios
   */
  async approveReviewAndDeliver(intercambioId, trade) {
    try {
      // Validar que tenemos la información necesaria
      if (!trade.usuarioOferta?.id || !trade.usuarioRecepcion?.id) {
        throw new Error('Información de usuarios incompleta');
      }

      // Obtener los envíos del intercambio para extraer direcciones
      const shipments = await api.get(`/trades/${intercambioId}/shipments`);
      const shipsData = shipments.data;

      if (!shipsData || shipsData.length === 0) {
        throw new Error('No se encontraron envíos para este intercambio');
      }

      // Encontrar direcciones de origen de cada usuario
      const offerentShip = shipsData.find((s) => s.usuario_id === trade.usuarioOferta.id);
      const receptorShip = shipsData.find((s) => s.usuario_id === trade.usuarioRecepcion.id);

      if (!offerentShip || !receptorShip) {
        throw new Error('No se encontraron direcciones de envío para ambos usuarios');
      }

      // Calcular fecha estimada de entrega (5 días desde ahora)
      const estimatedDate = new Date();
      estimatedDate.setDate(estimatedDate.getDate() + 5);
      const formattedDate = estimatedDate.toISOString().split('T')[0]; // YYYY-MM-DD

      // Datos para el deliver del oferente
      // El oferente recibe en su dirección de origen (donde vive)
      const deliverOfferentData = {
        usuario_id: trade.usuarioOferta.id,
        delivery_address: offerentShip.direccion_origen,
        fecha_entrega_estimada: formattedDate,
      };

      // Datos para el deliver del receptor
      // El receptor recibe en su dirección de origen (donde vive)
      const deliverReceptorData = {
        usuario_id: trade.usuarioRecepcion.id,
        delivery_address: receptorShip.direccion_origen,
        fecha_entrega_estimada: formattedDate,
      };

      // Hacer los dos delivers en paralelo
      const [offerentResponse, receptorResponse] = await Promise.all([
        api.post(`/trades/${intercambioId}/deliver`, deliverOfferentData),
        api.post(`/trades/${intercambioId}/deliver`, deliverReceptorData),
      ]);

      return {
        success: true,
        offerentDelivery: offerentResponse.data,
        receptorDelivery: receptorResponse.data,
        message: 'Revisión aprobada. Productos entregados automáticamente a ambos usuarios.',
      };
    } catch (error) {
      console.error('Error approving review and delivering:', error);
      throw error;
    }
  },
};

export default reviewService;
