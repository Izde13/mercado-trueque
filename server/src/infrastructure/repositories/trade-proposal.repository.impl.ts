import { Injectable } from '@nestjs/common';
import { TradeProposalRepository } from '../../domain/repositories/trade-proposal.repository';
import { TradeProposal } from '../../domain/entities/trade-proposal.entity';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class TradeProposalRepositoryImpl implements TradeProposalRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(proposal: TradeProposal): Promise<TradeProposal> {
    const created = await this.prisma.propuestas_trueque.create({
      data: {
        id: proposal.id,
        usuario_oferente_id: proposal.usuarioOferenteId,
        producto_solicitado_id: proposal.productoSolicitadoId,
        mensaje: proposal.mensaje,
        estado: proposal.estado,
        fecha_propuesta: proposal.fechaPropuesta,
        fecha_respuesta: proposal.fechaRespuesta,
      },
    });

    return this.toDomainEntity(created);
  }

  async findById(id: string): Promise<TradeProposal | null> {
    const proposal = await this.prisma.propuestas_trueque.findUnique({
      where: { id },
    });

    return proposal ? this.toDomainEntity(proposal) : null;
  }

  async findAll(): Promise<TradeProposal[]> {
    const proposals = await this.prisma.propuestas_trueque.findMany();
    return proposals.map((p) => this.toDomainEntity(p));
  }

  async update(proposal: TradeProposal): Promise<TradeProposal> {
    const updated = await this.prisma.propuestas_trueque.update({
      where: { id: proposal.id },
      data: {
        estado: proposal.estado,
        mensaje: proposal.mensaje,
        fecha_respuesta: proposal.fechaRespuesta,
      },
    });

    return this.toDomainEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.propuestas_trueque.delete({
      where: { id },
    });
  }

  async findByUsuarioOferenteId(usuarioId: string): Promise<TradeProposal[]> {
    const proposals = await this.prisma.propuestas_trueque.findMany({
      where: { usuario_oferente_id: usuarioId },
      orderBy: { fecha_propuesta: 'desc' },
    });

    return proposals.map((p) => this.toDomainEntity(p));
  }

  async findByProductoSolicitadoId(
    productoId: string,
  ): Promise<TradeProposal[]> {
    const proposals = await this.prisma.propuestas_trueque.findMany({
      where: { producto_solicitado_id: productoId },
      orderBy: { fecha_propuesta: 'desc' },
    });

    return proposals.map((p) => this.toDomainEntity(p));
  }

  async findByEstado(estado: string): Promise<TradeProposal[]> {
    const proposals = await this.prisma.propuestas_trueque.findMany({
      where: { estado },
      orderBy: { fecha_propuesta: 'desc' },
    });

    return proposals.map((p) => this.toDomainEntity(p));
  }

  async findPending(): Promise<TradeProposal[]> {
    const proposals = await this.prisma.propuestas_trueque.findMany({
      where: { estado: 'pendiente' },
      orderBy: { fecha_propuesta: 'desc' },
    });

    return proposals.map((p) => this.toDomainEntity(p));
  }

  async findPendingByOfferentAndProduct(
    offerentId: string,
    productId: string,
  ): Promise<TradeProposal | null> {
    const proposal = await this.prisma.propuestas_trueque.findFirst({
      where: {
        usuario_oferente_id: offerentId,
        producto_solicitado_id: productId,
        estado: 'pendiente',
      },
    });

    return proposal ? this.toDomainEntity(proposal) : null;
  }

  async findByIdWithRelations(id: string): Promise<TradeProposal | null> {
    const proposal = await this.prisma.propuestas_trueque.findUnique({
      where: { id },
      include: {
        productos: true,
        productos_propuesta: true,
        usuarios: true,
      },
    });

    return proposal ? this.toDomainEntity(proposal) : null;
  }

  private toDomainEntity(prismaProposal: any): TradeProposal {
    return new TradeProposal(
      prismaProposal.id,
      prismaProposal.producto_solicitado_id,
      prismaProposal.usuario_oferente_id,
      prismaProposal.mensaje,
      prismaProposal.fecha_propuesta,
      prismaProposal.estado,
      prismaProposal.fecha_respuesta,
    );
  }
}
