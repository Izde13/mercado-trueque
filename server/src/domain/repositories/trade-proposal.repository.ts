import { TradeProposal } from '../entities/trade-proposal.entity';

export interface TradeProposalRepository {
  save(proposal: TradeProposal): Promise<TradeProposal>;
  findById(id: string): Promise<TradeProposal | null>;
  findAll(): Promise<TradeProposal[]>;
  update(proposal: TradeProposal): Promise<TradeProposal>;
  delete(id: string): Promise<void>;
  findByUsuarioOferenteId(usuarioId: string): Promise<TradeProposal[]>;
  findByProductoSolicitadoId(productoId: string): Promise<TradeProposal[]>;
  findByEstado(estado: string): Promise<TradeProposal[]>;
  findPending(): Promise<TradeProposal[]>;
}
