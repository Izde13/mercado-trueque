import { Body, Controller, Post, Get, Inject } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RoleService } from './services/role.service';
import { RegisterUserDto } from '../application/dtos/register-user.dto';
import { LoginDto } from '../application/dtos/login-user.dto';
import { Auth } from './decorators/auth.decorator';
import { Roles } from './decorators/roles.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly roleService: RoleService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar nuevo usuario' })
  register(@Body() dto: RegisterUserDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login de usuario' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  /**
   * Endpoint de prueba: Solo accesible para usuarios con rol 'admin'
   */
  @Get('admin/dashboard')
  @Auth('admin')
  @ApiOperation({
    summary: 'Dashboard admin (Solo admin)',
    description: 'Endpoint protegido solo para usuarios con rol admin',
  })
  async getAdminDashboard(@CurrentUser() user: any) {
    return {
      message: 'Bienvenido al dashboard admin',
      usuario: {
        id: user.userId,
        email: user.email,
        roles: user.roles,
      },
      timestamp: new Date(),
    };
  }

  /**
   * Endpoint de prueba: Accesible para 'admin' o 'moderator'
   */
  @Get('moderator/reports')
  @Auth('admin', 'moderator')
  @ApiOperation({
    summary: 'Ver reportes (Admin o Moderator)',
    description:
      'Endpoint protegido solo para usuarios con roles admin o moderator',
  })
  async getReports(@CurrentUser() user: any) {
    return {
      message: 'Acceso a reportes concedido',
      usuario: {
        id: user.userId,
        email: user.email,
        roles: user.roles,
      },
      reportes: [
        { id: '1', titulo: 'Reportes del sistema', fecha: new Date() },
      ],
      timestamp: new Date(),
    };
  }

  /**
   * Endpoint de prueba: Asignar rol a un usuario (Admin only)
   */
  @Post('admin/assign-role')
  @Auth('admin')
  @ApiOperation({
    summary: 'Asignar rol a usuario (Admin only)',
    description: 'Permite a un admin asignar un rol a otro usuario',
  })
  async assignRole(
    @Body() body: { usuarioId: string; roleName: string },
    @CurrentUser() user: any,
  ) {
    try {
      const resultado = await this.roleService.assignRoleToUser(
        body.usuarioId,
        body.roleName,
      );

      return {
        message: `Rol "${body.roleName}" asignado al usuario ${body.usuarioId}`,
        usuario: {
          id: resultado.id,
          email: resultado.email,
          rol: resultado.roles?.nombre || null,
        },
        asignado_por: user.email,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

