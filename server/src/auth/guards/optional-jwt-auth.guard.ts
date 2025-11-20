import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard que valida opcionalmente la presencia del JWT token
 * Si el token está presente y es válido, extrae el usuario
 * Si no está presente o es inválido, permite que la solicitud continúe (user será undefined)
 *
 * Útil para endpoints que pueden ser públicos pero también beneficiarse
 * de información del usuario autenticado si está disponible
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const result = await super.canActivate(context);
      return result as boolean;
    } catch (error) {
      // Si hay un error (token inválido o ausente), permitimos que continúe
      // El usuario será undefined en request.user
      return true;
    }
  }

  handleRequest(err: any, user: any, info: any) {
    // Si hay un error o no hay usuario, simplemente retornamos null/undefined
    // Esto permite que el endpoint continúe sin requerir autenticación
    if (err || !user) {
      return null;
    }
    return user;
  }
}
