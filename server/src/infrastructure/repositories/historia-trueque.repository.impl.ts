import { Injectable } from '@nestjs/common';
import { HistoriaTruequeRepository } from '../../domain/repositories/historia-trueque.repository';
import { HistoriaTrueque } from '../../domain/entities/historia-trueque.entity';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class HistoriaTruequeRepositoryImpl
  implements HistoriaTruequeRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async save(historia: HistoriaTrueque): Promise<HistoriaTrueque> {
    const created = await this.prisma.historias_trueque.create({
      data: {
        id: historia.id,
        usuario_id: historia.usuarioId,
        titulo: historia.titulo,
        historia: historia.historia,
        imagen_url: historia.imagenUrl,
        fecha_publicacion: historia.fechaPublicacion,
        activa: historia.activa,
      },
    });

    return this.toDomainEntity(created);
  }

  async findById(id: string): Promise<HistoriaTrueque | null> {
    const historia = await this.prisma.historias_trueque.findUnique({
      where: { id },
    });

    return historia ? this.toDomainEntity(historia) : null;
  }

  async findAll(): Promise<HistoriaTrueque[]> {
    const historias = await this.prisma.historias_trueque.findMany();
    return historias.map((h) => this.toDomainEntity(h));
  }

  async update(historia: HistoriaTrueque): Promise<HistoriaTrueque> {
    const updated = await this.prisma.historias_trueque.update({
      where: { id: historia.id },
      data: {
        titulo: historia.titulo,
        historia: historia.historia,
        imagen_url: historia.imagenUrl,
        activa: historia.activa,
      },
    });

    return this.toDomainEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.historias_trueque.delete({
      where: { id },
    });
  }

  async findByUsuarioId(usuarioId: string): Promise<HistoriaTrueque[]> {
    const historias = await this.prisma.historias_trueque.findMany({
      where: { usuario_id: usuarioId },
      orderBy: { fecha_publicacion: 'desc' },
    });

    return historias.map((h) => this.toDomainEntity(h));
  }

  async findActivas(): Promise<HistoriaTrueque[]> {
    const historias = await this.prisma.historias_trueque.findMany({
      where: { activa: true },
      orderBy: { fecha_publicacion: 'desc' },
    });

    return historias.map((h) => this.toDomainEntity(h));
  }

  private toDomainEntity(prismaHistoria: any): HistoriaTrueque {
    return new HistoriaTrueque(
      prismaHistoria.id,
      prismaHistoria.usuario_id,
      prismaHistoria.titulo,
      prismaHistoria.historia,
      prismaHistoria.fecha_publicacion,
      prismaHistoria.activa,
      prismaHistoria.imagen_url,
    );
  }
}
