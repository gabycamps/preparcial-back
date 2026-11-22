import { Policy, type PolicyBefore } from '@nestjs/authorization';
import type { User } from '../entities/user.entity.js';
import { hasRole } from '../auth/has-role.js';

@Policy()
export class RolesPolicy implements PolicyBefore<User> {
  // Corre antes de cada regla: el admin las pasa todas.
  // Debe aceptar null (un invitado también llega aquí).
    before(user: User | null) {
        if (hasRole(user, 'admin')) return true;
    }

    // Nadie más que el admin, que ya pasó en before().
    // Las reglas de ruta deben aceptar User | null para compilar.
    create(_user: User | null) {
        return false;
    }

    list(_user: User | null) {
        return false;
    }
}