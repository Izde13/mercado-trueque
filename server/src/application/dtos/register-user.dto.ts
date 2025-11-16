import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  nombre: string;

  @IsNotEmpty()
  apellido: string;

  @MinLength(6)
  contrasena: string;
}
