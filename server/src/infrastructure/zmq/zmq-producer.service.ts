import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Publisher } from 'zeromq';

@Injectable()
export class ZmqProducerService implements OnModuleInit, OnModuleDestroy {
  private publisher: Publisher;
  private readonly logger = new Logger(ZmqProducerService.name);
  private zmqUrl: string;
  private isConnected = false;

  constructor(private configService: ConfigService) {
    this.zmqUrl = this.configService.get<string>(
      'ZMQ_URL',
      'tcp://127.0.0.1:5556',
    );
  }

  async onModuleInit() {
    try {
      this.publisher = new Publisher();
      await this.publisher.bind(this.zmqUrl);
      this.isConnected = true;
      this.logger.log(`ZMQ Publisher conectado en ${this.zmqUrl}`);
    } catch (error) {
      this.logger.error(
        `Error al conectar ZMQ Publisher: ${error.message}`,
        error.stack,
      );
      this.isConnected = false;
    }
  }

  async onModuleDestroy() {
    if (this.publisher) {
      await this.publisher.close();
      this.logger.log('ZMQ Publisher cerrado');
    }
  }

  /**
   * Publica un evento simple a través de ZMQ
   * Formato: "evento datos"
   * Ejemplo: "SendEmail user@example.com"
   * @param eventType Tipo de evento (será el topic/filtro)
   * @param data Datos asociados al evento
   */
  async publishEvent(eventType: string, data: string = ''): Promise<void> {
    if (!this.isConnected) {
      this.logger.warn(`ZMQ no conectado. Evento ${eventType} no fue enviado`);
      return;
    }

    try {
      const message = data ? `${eventType} ${data}` : eventType;

      // Enviar mensaje simple en formato: "topic mensaje"
      await this.publisher.send(Buffer.from(message, 'utf-8'));

      this.logger.debug(`Evento publicado: ${message}`);
    } catch (error) {
      this.logger.error(
        `Error al publicar evento ${eventType}: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Retorna el estado de conexión
   */
  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  /**
   * Retorna la URL de conexión
   */
  getZmqUrl(): string {
    return this.zmqUrl;
  }
}
