import { UseGuards, applyDecorators } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from './roles.decorator';

/**
 * Decorador compuesto que aplica autenticación y validación de roles
 * Combina @UseGuards(JwtAuthGuard, RolesGuard) + @Roles()
 *
 * Ejemplos:
 *
 * 1. Solo autenticación (sin validar roles):
 * @Auth()
 * getProfile() { ... }
 *
 * 2. Con validación de roles:
 * @Auth('admin')
 * deleteUser() { ... }
 *
 * 3. Múltiples roles (usuario puede tener cualquiera de estos):
 * @Auth('admin', 'moderator')
 * editContent() { ... }
 */
export function Auth(...roles: string[]) {
  const decorators = [UseGuards(JwtAuthGuard, RolesGuard)];

  if (roles.length > 0) {
    decorators.push(Roles(...roles));
  }

  return applyDecorators(...decorators);
}
