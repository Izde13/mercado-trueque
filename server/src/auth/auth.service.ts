import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepositoryImpl } from '../infrastructure/repositories/user.repository.impl';
import { RegisterUserDto } from 'src/application/dtos/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepositoryImpl,
    private readonly jwtService: JwtService,
  ) {}

  // 🧾 Registro de usuario
  async register(data: RegisterUserDto) {
  const existingUser = await this.userRepository.findByEmail(data.email);
  if (existingUser) {
    throw new UnauthorizedException('El correo ya está registrado');
  }

  const hashedPassword = await bcrypt.hash(data.contrasena, 10);

  const newUser = await this.userRepository.create({
    email: data.email,
    nombre: data.nombre,
    apellido: data.apellido,
    contrasena: hashedPassword,
  });

  return {
    message: 'Usuario registrado exitosamente',
    user: {
      id: newUser.id,
      email: newUser.email,
      nombre: newUser.nombre,
      apellido: newUser.apellido,
          },
        };
    }   

  // 🔑 Login de usuario
async login(data: { email: string; contrasena: string }) {
  const user = await this.userRepository.findByEmail(data.email);
  if (!user) throw new UnauthorizedException('Credenciales inválidas');

  const isPasswordValid = await bcrypt.compare(data.contrasena, user.contrasena);
  if (!isPasswordValid) throw new UnauthorizedException('Credenciales inválidas');

  // Obtener roles del usuario
  const roles = user.roles ? [user.roles.nombre] : [];

  const payload = {
    sub: user.id,
    email: user.email,
    roles: roles, // Incluir roles en el JWT
  };
  const token = this.jwtService.sign(payload);

  return {
    message: 'Inicio de sesión exitoso',
    access_token: token,
    user: {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      apellido: user.apellido,
      rol: user.roles ? user.roles.nombre : null,
    },
  };
}

}
