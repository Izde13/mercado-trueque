import { Injectable } from '@nestjs/common';
import { MensajePropuestaRepository } from '../../domain/repositories/mensaje-propuesta.repository';
import { MensajePropuesta } from '../../domain/entities/mensaje-propuesta.entity';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class MensajePropuestaRepositoryImpl
  implements MensajePropuestaRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async save(mensaje: MensajePropuesta): Promise<MensajePropuesta> {
    const created = await this.prisma.mensajes_propuesta.create({
      data: {
        id: mensaje.id,
        propuesta_id: mensaje.propuestaId,
        usuario_id: mensaje.usuarioId,
        mensaje: mensaje.mensaje,
        fecha_mensaje: mensaje.fechaMensaje,
      },
    });

    return this.toDomainEntity(created);
  }

  async findById(id: string): Promise<MensajePropuesta | null> {
    const mensaje = await this.prisma.mensajes_propuesta.findUnique({
      where: { id },
    });

    return mensaje ? this.toDomainEntity(mensaje) : null;
  }

  async findAll(): Promise<MensajePropuesta[]> {
    const mensajes = await this.prisma.mensajes_propuesta.findMany();
    return mensajes.map((m) => this.toDomainEntity(m));
  }

  async update(mensaje: MensajePropuesta): Promise<MensajePropuesta> {
    const updated = await this.prisma.mensajes_propuesta.update({
      where: { id: mensaje.id },
      data: {
        mensaje: mensaje.mensaje,
      },
    });

    return this.toDomainEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.mensajes_propuesta.delete({
      where: { id },
    });
  }

  async findByPropuestaId(propuestaId: string): Promise<MensajePropuesta[]> {
    const mensajes = await this.prisma.mensajes_propuesta.findMany({
      where: { propuesta_id: propuestaId },
      orderBy: { fecha_mensaje: 'asc' },
    });

    return mensajes.map((m) => this.toDomainEntity(m));
  }

  async findByUsuarioId(usuarioId: string): Promise<MensajePropuesta[]> {
    const mensajes = await this.prisma.mensajes_propuesta.findMany({
      where: { usuario_id: usuarioId },
      orderBy: { fecha_mensaje: 'desc' },
    });

    return mensajes.map((m) => this.toDomainEntity(m));
  }

  private toDomainEntity(prismaMensaje: any): MensajePropuesta {
    return new MensajePropuesta(
      prismaMensaje.id,
      prismaMensaje.propuesta_id,
      prismaMensaje.usuario_id,
      prismaMensaje.mensaje,
      prismaMensaje.fecha_mensaje,
    );
  }
}
