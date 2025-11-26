import { Injectable, Logger } from '@nestjs/common';

interface ShippingMessage {
  envio_id: string;
  intercambio_id: string;
  origen: string;
  destino: string;
  producto_id?: string;
}

@Injectable()
export class ShippingQueueService {
  private readonly logger = new Logger(ShippingQueueService.name);
  private readonly brokerUrl = process.env.SHIPPING_BROKER_URL || 'http://localhost:8000';

  /**
   * Publica un envío en la cola de transportistas
   */
  async publishShipment(message: ShippingMessage): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.brokerUrl}/produce`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      this.logger.log(
        `Envío ${message.envio_id} publicado en la cola exitosamente`
      );
      return true;
    } catch (error) {
      this.logger.error(
        `Error al publicar envío ${message.envio_id} en la cola`,
        error instanceof Error ? error.message : String(error)
      );
      // No lanzar excepción, solo registrar el error
      // El envío ya está guardado en la BD
      return false;
    }
  }

  /**
   * Obtiene métricas de la cola
   */
  async getQueueMetrics(): Promise<any> {
    try {
      const response = await fetch(
        `${this.brokerUrl}/metrics`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      this.logger.error(
        'Error al obtener métricas de la cola',
        error instanceof Error ? error.message : String(error)
      );
      return null;
    }
  }

  /**
   * Obtiene el estado de la cola
   */
  async getQueueStatus(): Promise<any> {
    try {
      const response = await fetch(
        `${this.brokerUrl}/queue`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      this.logger.error(
        'Error al obtener estado de la cola',
        error instanceof Error ? error.message : String(error)
      );
      return null;
    }
  }
}
