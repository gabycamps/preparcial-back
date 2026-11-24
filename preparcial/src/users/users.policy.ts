import { Policy, type PolicyBefore } from '@nestjs/authorization';
import type { User } from '../entities/user.entity.js';
import { hasRole } from '../auth/has-role.js';

@Policy()
export class UsersPolicy implements PolicyBefore<User> {
  // Corre antes de cada regla: el admin las pasa todas.
    before(user: User | null) {
        if (hasRole(user, 'admin')) return true;
    }

    list(_user: User | null) {
        return false;
    }

    assignRoles(_user: User | null) {
        return false;
    }

    // ver un usuario por id. Solo el supervisor (el admin ya pasó en before()).
    findOne(user: User | null) {
        return hasRole(user, 'supervisor');
    }
}