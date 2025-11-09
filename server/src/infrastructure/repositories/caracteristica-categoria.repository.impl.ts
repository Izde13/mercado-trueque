import { Injectable } from '@nestjs/common';
import { CaracteristicaCategoriaRepository } from '../../domain/repositories/caracteristica-categoria.repository';
import {
  CaracteristicaCategoria,
  TipoDatoCaracteristica,
} from '../../domain/entities/caracteristica-categoria.entity';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class CaracteristicaCategoriaRepositoryImpl
  implements CaracteristicaCategoriaRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async save(
    caracteristica: CaracteristicaCategoria,
  ): Promise<CaracteristicaCategoria> {
    const created = await this.prisma.caracteristicas_categoria.create({
      data: {
        id: caracteristica.id,
        categoria_id: caracteristica.categoriaId,
        nombre: caracteristica.nombre,
        tipo_dato: caracteristica.tipoDato,
        requerido: caracteristica.requerido,
        opciones: caracteristica.opciones,
      },
    });

    return this.toDomainEntity(created);
  }

  async findById(id: string): Promise<CaracteristicaCategoria | null> {
    const caracteristica =
      await this.prisma.caracteristicas_categoria.findUnique({
        where: { id },
      });

    return caracteristica ? this.toDomainEntity(caracteristica) : null;
  }

  async findAll(): Promise<CaracteristicaCategoria[]> {
    const caracteristicas =
      await this.prisma.caracteristicas_categoria.findMany();
    return caracteristicas.map((c) => this.toDomainEntity(c));
  }

  async update(
    caracteristica: CaracteristicaCategoria,
  ): Promise<CaracteristicaCategoria> {
    const updated = await this.prisma.caracteristicas_categoria.update({
      where: { id: caracteristica.id },
      data: {
        nombre: caracteristica.nombre,
        tipo_dato: caracteristica.tipoDato,
        requerido: caracteristica.requerido,
        opciones: caracteristica.opciones,
      },
    });

    return this.toDomainEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.caracteristicas_categoria.delete({
      where: { id },
    });
  }

  async findByCategoriaId(
    categoriaId: string,
  ): Promise<CaracteristicaCategoria[]> {
    const caracteristicas =
      await this.prisma.caracteristicas_categoria.findMany({
        where: { categoria_id: categoriaId },
      });

    return caracteristicas.map((c) => this.toDomainEntity(c));
  }

  async findRequeridas(
    categoriaId: string,
  ): Promise<CaracteristicaCategoria[]> {
    const caracteristicas =
      await this.prisma.caracteristicas_categoria.findMany({
        where: {
          categoria_id: categoriaId,
          requerido: true,
        },
      });

    return caracteristicas.map((c) => this.toDomainEntity(c));
  }

  private toDomainEntity(prismaCaracteristica: any): CaracteristicaCategoria {
    return new CaracteristicaCategoria(
      prismaCaracteristica.id,
      prismaCaracteristica.categoria_id,
      prismaCaracteristica.nombre,
      prismaCaracteristica.tipo_dato as TipoDatoCaracteristica,
      prismaCaracteristica.requerido,
      prismaCaracteristica.opciones,
    );
  }
}
