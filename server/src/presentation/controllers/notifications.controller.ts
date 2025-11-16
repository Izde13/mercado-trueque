import {
  Controller,
  Get,
  Param,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Auth } from '../../auth/decorators/auth.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { GetUserNotificationsUseCase } from '../../application/use-cases/get-user-notifications.use-case';
import { NotificationResponseDto } from '../../application/dtos/notification-response.dto';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly getUserNotificationsUseCase: GetUserNotificationsUseCase,
  ) {}

  /**
   * OBTENER NOTIFICACIONES DEL USUARIO
   * Retorna todas las notificaciones del usuario autenticado
   */
  @Get('user/:userId')
  @Auth()
  @ApiOperation({
    summary: 'Obtener notificaciones del usuario',
    description:
      'Retorna todas las notificaciones generadas para el usuario. Requiere autenticación.',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario',
    example: 'uuid-juan',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de notificaciones obtenida exitosamente',
    type: [NotificationResponseDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Permiso denegado - intentando acceder a notificaciones de otro usuario',
  })
  async getUserNotifications(
    @Param('userId') userId: string,
    @CurrentUser() user: any,
  ): Promise<NotificationResponseDto[]> {
    // Validar que el usuario solo puede ver sus propias notificaciones
    if (user.userId !== userId) {
      throw new BadRequestException(
        'No tienes permiso para ver las notificaciones de otro usuario',
      );
    }
    return await this.getUserNotificationsUseCase.execute(userId);
  }
}
