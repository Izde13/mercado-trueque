import { MensajePropuesta } from '../entities/mensaje-propuesta.entity';

export interface MensajePropuestaRepository {
  save(mensaje: MensajePropuesta): Promise<MensajePropuesta>;
  findById(id: string): Promise<MensajePropuesta | null>;
  findAll(): Promise<MensajePropuesta[]>;
  update(mensaje: MensajePropuesta): Promise<MensajePropuesta>;
  delete(id: string): Promise<void>;
  findByPropuestaId(propuestaId: string): Promise<MensajePropuesta[]>;
  findByUsuarioId(usuarioId: string): Promise<MensajePropuesta[]>;
}
