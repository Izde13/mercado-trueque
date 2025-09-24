import { Category } from '../../domain/entities/category.entity';

export class CategoryResponseDto {
  id: string;
  codigo: number;
  nombre: string;
  descripcion?: string;
  activo?: boolean;

  constructor(category: Category) {
    this.id = category.id;
    this.codigo = category.codigo;
    this.nombre = category.nombre;
    this.descripcion = category.descripcion;
    this.activo = category.activo;
  }
}
