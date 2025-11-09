import { HistoriaTrueque } from '../entities/historia-trueque.entity';

export interface HistoriaTruequeRepository {
  save(historia: HistoriaTrueque): Promise<HistoriaTrueque>;
  findById(id: string): Promise<HistoriaTrueque | null>;
  findAll(): Promise<HistoriaTrueque[]>;
  update(historia: HistoriaTrueque): Promise<HistoriaTrueque>;
  delete(id: string): Promise<void>;
  findByUsuarioId(usuarioId: string): Promise<HistoriaTrueque[]>;
  findActivas(): Promise<HistoriaTrueque[]>;
}
