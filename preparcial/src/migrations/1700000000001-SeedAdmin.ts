import { MigrationInterface, QueryRunner } from 'typeorm';

const ADMIN_EMAIL = 'admin@preparcial.com';
// Hash scrypt generado por la propia API. La contraseña en claro NO va en el código.
const ADMIN_PASSWORD_HASH = '$scrypt$ln=17,r=8,p=1$CmuQOG/hWYxd9vG0BG/31w$1pMJ1Mg/v2O6wmBqe96oqLzNnOTgFCpkTVAxt3NofD4';

export class SeedAdmin1700000000001 implements MigrationInterface {
    name = 'SeedAdmin1700000000001';

    public async up(q: QueryRunner): Promise<void> {
        // ON CONFLICT DO NOTHING: si el admin ya existe (creado con el script SQL), no duplica nada.
        await q.query(
        `INSERT INTO roles (role_name, description) VALUES ('admin', 'Administrador')
        ON CONFLICT (role_name) DO NOTHING`,
        );
        // Con parámetros ($1, $2...): el hash lleva signos $ y así no hay que escaparlos.
        await q.query(
        `INSERT INTO users (email, password, name) VALUES ($1, $2, $3)
        ON CONFLICT (email) DO NOTHING`,
        [ADMIN_EMAIL, ADMIN_PASSWORD_HASH, 'Administrador'],
        );
        await q.query(
        `INSERT INTO users_roles (user_id, role_id)
        SELECT u.id, r.id FROM users u, roles r
        WHERE u.email = $1 AND r.role_name = 'admin'
        ON CONFLICT DO NOTHING`,
        [ADMIN_EMAIL],
        );
    }

    public async down(q: QueryRunner): Promise<void> {
        await q.query(
        `DELETE FROM users_roles WHERE user_id IN (SELECT id FROM users WHERE email = $1)`,
        [ADMIN_EMAIL],
        );
        await q.query(`DELETE FROM users WHERE email = $1`, [ADMIN_EMAIL]);
        await q.query(`DELETE FROM roles WHERE role_name = 'admin'`);
    }
}