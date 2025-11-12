import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(
        'JWT_SECRET',
        'clave_super_segura_cambiar_en_produccion',
      ),
    });
  }

  /**
   * Valida el payload del token JWT
   * @param payload Payload decodificado del token
   *   {
   *     sub: userId,
   *     email: string,
   *     roles?: string[]
   *   }
   * @returns Objeto de usuario que se inyecta en request.user
   */
  async validate(payload: any) {
    return {
      userId: payload.sub,
      email: payload.email,
      roles: payload.roles || [], // Array de nombres de roles
    };
  }
}
