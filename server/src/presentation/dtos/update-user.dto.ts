import { IsEmail, IsOptional, IsString, IsEnum } from 'class-validator';
import { EstadoUsuario } from '../../domain/entities/user.entity';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  apellido?: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsEnum(EstadoUsuario)
  @IsOptional()
  estado?: EstadoUsuario;

  @IsString()
  @IsOptional()
  avatarUrl?: string;
}
