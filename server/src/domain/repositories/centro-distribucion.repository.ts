import { CentroDistribucion } from '../entities/centro-distribucion.entity';

export interface CentroDistribucionRepository {
  save(centro: CentroDistribucion): Promise<CentroDistribucion>;
  findById(id: string): Promise<CentroDistribucion | null>;
  findAll(): Promise<CentroDistribucion[]>;
  update(centro: CentroDistribucion): Promise<CentroDistribucion>;
  delete(id: string): Promise<void>;
  findByCodigo(codigo: number): Promise<CentroDistribucion | null>;
  findActivos(): Promise<CentroDistribucion[]>;
  findByDepartamento(departamento: string): Promise<CentroDistribucion[]>;
  findByCiudad(ciudad: string): Promise<CentroDistribucion[]>;
}
