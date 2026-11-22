import { Policy, type PolicyBefore } from '@nestjs/authorization';
import type { User } from '../entities/user.entity.js';
import { hasRole } from '../auth/has-role.js';

@Policy()
export class UsersPolicy implements PolicyBefore<User> {
    before(user: User | null) {
        if (hasRole(user, 'admin')) return true;
    }

    list(_user: User | null) {
        return false;
    }

    assignRoles(_user: User | null) {
        return false;
    }
}