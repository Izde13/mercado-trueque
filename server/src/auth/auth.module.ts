import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { RoleService } from './services/role.service';
import { PrismaService } from '../infrastructure/services/prisma.service';
import { UserRepositoryImpl } from '../infrastructure/repositories/user.repository.impl';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>(
          'JWT_SECRET',
          'clave_super_segura_cambiar_en_produccion',
        ),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN') || '7d',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    RoleService,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    PrismaService,
    UserRepositoryImpl,
  ],
  exports: [AuthService, RoleService, JwtAuthGuard, RolesGuard, JwtModule],
})
export class AuthModule {}
