import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '../../domain/repositories/notification.repository';
import { Notification } from '../../domain/entities/notification.entity';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class NotificationRepositoryImpl implements NotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(notification: Notification): Promise<Notification> {
    const created = await this.prisma.notificaciones.create({
      data: {
        id: notification.id,
        usuario_id: notification.usuarioId,
        tipo: notification.tipo,
        titulo: notification.titulo,
        mensaje: notification.mensaje,
        leida: notification.leida ?? false,
        fecha_creacion: notification.fechaCreacion,
        referencia_id: notification.referenciaId,
        referencia_tipo: notification.referenciaTipo,
      },
    });

    return this.toDomainEntity(created);
  }

  async findById(id: string): Promise<Notification | null> {
    const notification = await this.prisma.notificaciones.findUnique({
      where: { id },
    });

    return notification ? this.toDomainEntity(notification) : null;
  }

  async findAll(): Promise<Notification[]> {
    const notifications = await this.prisma.notificaciones.findMany();
    return notifications.map((n) => this.toDomainEntity(n));
  }

  async update(notification: Notification): Promise<Notification> {
    const updated = await this.prisma.notificaciones.update({
      where: { id: notification.id },
      data: {
        titulo: notification.titulo,
        mensaje: notification.mensaje,
        leida: notification.leida,
      },
    });

    return this.toDomainEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.notificaciones.delete({
      where: { id },
    });
  }

  async findByUsuarioId(usuarioId: string): Promise<Notification[]> {
    const notifications = await this.prisma.notificaciones.findMany({
      where: { usuario_id: usuarioId },
      orderBy: { fecha_creacion: 'desc' },
    });

    return notifications.map((n) => this.toDomainEntity(n));
  }

  async findUnreadByUsuarioId(usuarioId: string): Promise<Notification[]> {
    const notifications = await this.prisma.notificaciones.findMany({
      where: {
        usuario_id: usuarioId,
        leida: false,
      },
      orderBy: { fecha_creacion: 'desc' },
    });

    return notifications.map((n) => this.toDomainEntity(n));
  }

  async findByTipo(tipo: string): Promise<Notification[]> {
    const notifications = await this.prisma.notificaciones.findMany({
      where: { tipo },
    });

    return notifications.map((n) => this.toDomainEntity(n));
  }

  private toDomainEntity(prismaNot: any): Notification {
    return new Notification(
      prismaNot.id,
      prismaNot.usuario_id,
      prismaNot.tipo,
      prismaNot.titulo,
      prismaNot.mensaje,
      prismaNot.leida,
      prismaNot.fecha_creacion,
      prismaNot.referencia_id,
      prismaNot.referencia_tipo,
    );
  }
}
