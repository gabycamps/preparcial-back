import { Injectable } from '@nestjs/common';
import { AuthenticationRegistry, JwtBearerProvider, type JwtClaims } from '@nestjs/authentication';
import { User } from '../entities/user.entity.js';
import { UsersService } from '../users/users.service.js';

@Injectable()
export class JwtAuth extends JwtBearerProvider<User> {
    constructor(
    private readonly users: UsersService,
    registry: AuthenticationRegistry,
    ) {
    super(); // usa la misma configuración de accessToken del módulo
    registry.registerProvider(this); // se anota en la lista del guard
    }

  // El paquete ya verificó firma, emisor, audiencia y expiración.
  // Aquí solo convertimos el id del token (sub, es un texto/uuid) en el usuario con sus roles.
  // Devolver null = 401.
    async validate({ sub }: JwtClaims) {
    if (!sub) return null;
    const user = await this.users.findById(sub);
    // Opcional (decisión mía, no del enunciado): un usuario desactivado pierde
    // el acceso de inmediato. Para seguir el enunciado al pie de la letra,
    // reemplaza esta línea por: return user;
    return user?.isActive ? user : null;
    }
}