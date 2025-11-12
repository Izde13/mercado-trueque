import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Decorador para especificar los roles requeridos en una ruta
 * Se utiliza junto con RolesGuard
 *
 * Ejemplo:
 * @Roles('admin', 'moderator')
 * deleteUser(@Param('id') id: string) { ... }
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
