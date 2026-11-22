import type { User } from '../entities/user.entity.js';

// true si el usuario tiene alguno de los roles dados (por role_name).
// Los roles vienen cargados: JwtAuth los pide con relations en cada petición.
export const hasRole = (user: User | null, ...names: string[]) =>
    !!user?.roles?.some((role) => names.includes(role.roleName));