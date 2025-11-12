import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard que valida la presencia y validez del JWT token en la solicitud
 * Se aplica a controladores o métodos que requieren autenticación
 *
 * Uso:
 * @UseGuards(JwtAuthGuard)
 * getProfile() { ... }
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const result = await super.canActivate(context);
      return result as boolean;
    } catch (error) {
      throw new UnauthorizedException(
        'Token inválido o expirado. Debes autenticarte primero.',
      );
    }
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException(
          'Token no proporcionado o es inválido. Incluye el token en el header Authorization: Bearer <token>',
        )
      );
    }
    return user;
  }
}
