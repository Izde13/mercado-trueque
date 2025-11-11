import { AlertaActivada } from '../entities/alerta-activada.entity';

export interface AlertaActivadaRepository {
  save(alerta: AlertaActivada): Promise<AlertaActivada>;
  findById(id: string): Promise<AlertaActivada | null>;
  findAll(): Promise<AlertaActivada[]>;
  update(alerta: AlertaActivada): Promise<AlertaActivada>;
  delete(id: string): Promise<void>;
  findBySuscripcionId(suscripcionId: string): Promise<AlertaActivada[]>;
  findByProductoId(productoId: string): Promise<AlertaActivada[]>;
  findNoEnviadas(): Promise<AlertaActivada[]>;
}
