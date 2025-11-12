import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

/**
 * Guard que valida que el usuario autenticado tenga uno de los roles requeridos
 * Se utiliza junto con el decorador @Roles()
 * Los roles se obtienen del JWT token (que contiene los roles del usuario desde BD)
 *
 * Uso:
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * @Roles('admin', 'moderator')
 * deleteUser() { ... }
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Si no hay roles definidos, permitir acceso (protegido por JwtAuthGuard)
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Verificar que el usuario existe
    if (!user) {
      throw new ForbiddenException(
        'Usuario no autenticado. Por favor, proporciona un token válido.',
      );
    }

    // Obtener los roles del usuario (vienen del JWT token)
    const userRoles: string[] = user.roles || [];

    // Validar que el usuario tiene al menos uno de los roles requeridos
    const hasRole = requiredRoles.some((role) =>
      userRoles.includes(role)
    );

    if (!hasRole) {
      throw new ForbiddenException(
        `Acceso denegado. Se requieren los roles: ${requiredRoles.join(', ')}. Tu rol es: ${userRoles.length > 0 ? userRoles.join(', ') : 'sin asignar'}.`,
      );
    }

    return true;
  }
}
