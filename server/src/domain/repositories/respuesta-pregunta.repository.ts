import { RespuestaPregunta } from '../entities/respuesta-pregunta.entity';

export interface RespuestaPreguntaRepository {
  save(respuesta: RespuestaPregunta): Promise<RespuestaPregunta>;
  findById(id: string): Promise<RespuestaPregunta | null>;
  findAll(): Promise<RespuestaPregunta[]>;
  update(respuesta: RespuestaPregunta): Promise<RespuestaPregunta>;
  delete(id: string): Promise<void>;
  findByPreguntaId(preguntaId: string): Promise<RespuestaPregunta[]>;
  findByUsuarioId(usuarioId: string): Promise<RespuestaPregunta[]>;
}
