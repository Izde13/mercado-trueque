import { Injectable, Inject } from '@nestjs/common';
import { Notification } from '../../domain/entities/notification.entity';
import type { NotificationRepository } from '../../domain/repositories/notification.repository';

@Injectable()
export class GetUserNotificationsUseCase {
  constructor(
    @Inject('NotificationRepository')
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(usuarioId: string): Promise<Notification[]> {
    return this.notificationRepository.findByUsuarioId(usuarioId);
  }
}
