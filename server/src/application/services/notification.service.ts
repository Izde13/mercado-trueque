import { Injectable, Inject } from '@nestjs/common';
import type { NotificationRepository } from '../../domain/repositories/notification.repository';
import { Notification } from '../../domain/entities/notification.entity';

export type NotificationType =
  | 'propuesta'
  | 'pregunta'
  | 'envio'
  | 'revision'
  | 'intercambio_completado'
  | 'alerta'
  | 'mensaje';

@Injectable()
export class NotificationService {
  constructor(
    @Inject('NotificationRepository')
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async notifyProposalCreated(
    productoOwnerUserId: string,
    propuestaId: string,
    offerentName: string,
    productTitle: string,
  ): Promise<Notification> {
    const notification = Notification.create(
      productoOwnerUserId,
      'propuesta',
      `Nueva propuesta de ${offerentName}`,
      `${offerentName} ha hecho una propuesta para tu producto "${productTitle}"`,
      propuestaId,
      'propuesta',
    );

    return this.notificationRepository.save(notification);
  }

  async notifyProposalAccepted(
    offerentUserId: string,
    propuestaId: string,
    intercambioId: string,
    ownerName: string,
  ): Promise<Notification> {
    const notification = Notification.create(
      offerentUserId,
      'propuesta',
      `Tu propuesta fue aceptada`,
      `${ownerName} ha aceptado tu propuesta. El intercambio ha comenzado.`,
      intercambioId,
      'propuesta',
    );

    return this.notificationRepository.save(notification);
  }

  async notifyProposalAcceptedToOwner(
    ownerUserId: string,
    intercambioId: string,
    offerentName: string,
  ): Promise<Notification> {
    const notification = Notification.create(
      ownerUserId,
      'propuesta',
      `Propuesta aceptada`,
      `Has iniciado un intercambio con ${offerentName}. Por favor confirma tu envío.`,
      intercambioId,
      'propuesta',
    );

    return this.notificationRepository.save(notification);
  }

  async notifyBothConfirmedShipment(
    userId1: string,
    userId2: string,
    intercambioId: string,
    user1Name: string,
    user2Name: string,
  ): Promise<Notification[]> {
    const notifications: Notification[] = [];

    const notif1 = Notification.create(
      userId1,
      'envio',
      `Envío confirmado`,
      `${user2Name} ha confirmado el envío. Los productos están en camino.`,
      intercambioId,
      'envio',
    );
    notifications.push(await this.notificationRepository.save(notif1));

    const notif2 = Notification.create(
      userId2,
      'envio',
      `Envío confirmado`,
      `${user1Name} ha confirmado el envío. Los productos están en camino.`,
      intercambioId,
      'envio',
    );
    notifications.push(await this.notificationRepository.save(notif2));

    return notifications;
  }

  async notifyReviewCompleted(
    userId1: string,
    userId2: string,
    intercambioId: string,
    user1Name: string,
    user2Name: string,
  ): Promise<Notification[]> {
    const notifications: Notification[] = [];

    const notif1 = Notification.create(
      userId1,
      'revision',
      `Revisión completada`,
      `Tus productos pasaron la revisión. Se están preparando para la entrega.`,
      intercambioId,
      'revision',
    );
    notifications.push(await this.notificationRepository.save(notif1));

    const notif2 = Notification.create(
      userId2,
      'revision',
      `Revisión completada`,
      `Los productos del intercambio pasaron la revisión. Se están preparando para la entrega.`,
      intercambioId,
      'revision',
    );
    notifications.push(await this.notificationRepository.save(notif2));

    return notifications;
  }

  async notifyTradeCompleted(
    userId1: string,
    userId2: string,
    intercambioId: string,
    user1Name: string,
    user2Name: string,
  ): Promise<Notification[]> {
    const notifications: Notification[] = [];

    const notif1 = Notification.create(
      userId1,
      'intercambio_completado',
      `¡Intercambio completado!`,
      `El intercambio con ${user2Name} se ha completado exitosamente. Ahora puedes calificar.`,
      intercambioId,
      'intercambio_completado',
    );
    notifications.push(await this.notificationRepository.save(notif1));

    const notif2 = Notification.create(
      userId2,
      'intercambio_completado',
      `¡Intercambio completado!`,
      `El intercambio con ${user1Name} se ha completado exitosamente. Ahora puedes calificar.`,
      intercambioId,
      'intercambio_completado',
    );
    notifications.push(await this.notificationRepository.save(notif2));

    return notifications;
  }

  async notifyRatingReceived(
    ratedUserId: string,
    intercambioId: string,
    raterName: string,
    rating: number,
  ): Promise<Notification> {
    const notification = Notification.create(
      ratedUserId,
      'mensaje',
      `${raterName} te ha calificado`,
      `${raterName} te ha dejado una calificación de ${rating}/5 en el intercambio.`,
      intercambioId,
      'calificacion',
    );

    return this.notificationRepository.save(notification);
  }
}
