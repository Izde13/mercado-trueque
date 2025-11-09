import { Injectable } from '@nestjs/common';
import { RespuestaPreguntaRepository } from '../../domain/repositories/respuesta-pregunta.repository';
import { RespuestaPregunta } from '../../domain/entities/respuesta-pregunta.entity';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class RespuestaPreguntaRepositoryImpl
  implements RespuestaPreguntaRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async save(respuesta: RespuestaPregunta): Promise<RespuestaPregunta> {
    const created = await this.prisma.respuestas_preguntas.create({
      data: {
        id: respuesta.id,
        pregunta_id: respuesta.preguntaId,
        usuario_id: respuesta.usuarioId,
        respuesta: respuesta.respuesta,
        fecha_respuesta: respuesta.fechaRespuesta,
      },
    });

    return this.toDomainEntity(created);
  }

  async findById(id: string): Promise<RespuestaPregunta | null> {
    const respuesta = await this.prisma.respuestas_preguntas.findUnique({
      where: { id },
    });

    return respuesta ? this.toDomainEntity(respuesta) : null;
  }

  async findAll(): Promise<RespuestaPregunta[]> {
    const respuestas = await this.prisma.respuestas_preguntas.findMany();
    return respuestas.map((r) => this.toDomainEntity(r));
  }

  async update(respuesta: RespuestaPregunta): Promise<RespuestaPregunta> {
    const updated = await this.prisma.respuestas_preguntas.update({
      where: { id: respuesta.id },
      data: {
        respuesta: respuesta.respuesta,
      },
    });

    return this.toDomainEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.respuestas_preguntas.delete({
      where: { id },
    });
  }

  async findByPreguntaId(preguntaId: string): Promise<RespuestaPregunta[]> {
    const respuestas = await this.prisma.respuestas_preguntas.findMany({
      where: { pregunta_id: preguntaId },
      orderBy: { fecha_respuesta: 'desc' },
    });

    return respuestas.map((r) => this.toDomainEntity(r));
  }

  async findByUsuarioId(usuarioId: string): Promise<RespuestaPregunta[]> {
    const respuestas = await this.prisma.respuestas_preguntas.findMany({
      where: { usuario_id: usuarioId },
      orderBy: { fecha_respuesta: 'desc' },
    });

    return respuestas.map((r) => this.toDomainEntity(r));
  }

  private toDomainEntity(prismaRespuesta: any): RespuestaPregunta {
    return new RespuestaPregunta(
      prismaRespuesta.id,
      prismaRespuesta.pregunta_id,
      prismaRespuesta.usuario_id,
      prismaRespuesta.respuesta,
      prismaRespuesta.fecha_respuesta,
    );
  }
}
