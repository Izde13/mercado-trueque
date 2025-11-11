import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../infrastructure/services/prisma.service';
import { UserRepositoryImpl } from '../infrastructure/repositories/user.repository.impl';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'clave_super_segura',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController], // 👈 esto debe estar presente
  providers: [AuthService, PrismaService, UserRepositoryImpl],
  exports: [AuthService],
})
export class AuthModule {}
