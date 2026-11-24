import { Policy, PolicyBefore } from "@nestjs/authorization";
import { hasRole } from "../auth/has-role.js";
import type { User } from "../entities/user.entity.js";

@Policy()
export class ReservationsPolicy implements PolicyBefore<User> {
    before(user: User | null) {
        if (hasRole(user, 'admin')) return true;
    }

    update(user: User | null) {
        return hasRole(user, 'supervisor');
    }

    delete(user: User | null) {
        return (hasRole(user, 'user'));
    }
}