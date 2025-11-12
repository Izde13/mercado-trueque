import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorador para inyectar el usuario autenticado actual en parámetros de función
 * Solo funciona con @UseGuards(JwtAuthGuard)
 *
 * Ejemplo:
 * @Get('profile')
 * @UseGuards(JwtAuthGuard)
 * getProfile(@CurrentUser() user: any) {
 *   return { userId: user.userId, email: user.email };
 * }
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
