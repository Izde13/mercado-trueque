import { Notification } from '../entities/notification.entity';

export interface NotificationRepository {
  save(notification: Notification): Promise<Notification>;
  findById(id: string): Promise<Notification | null>;
  findAll(): Promise<Notification[]>;
  update(notification: Notification): Promise<Notification>;
  delete(id: string): Promise<void>;
  findByUsuarioId(usuarioId: string): Promise<Notification[]>;
  findUnreadByUsuarioId(usuarioId: string): Promise<Notification[]>;
  findByTipo(tipo: string): Promise<Notification[]>;
}
