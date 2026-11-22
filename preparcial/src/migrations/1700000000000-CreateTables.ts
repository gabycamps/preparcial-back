import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTables1700000000000 implements MigrationInterface {
    name = 'CreateTables1700000000000';

    public async up(q: QueryRunner): Promise<void> {
        // IF NOT EXISTS: si las tablas ya existen (creadas con sql/estructura.sql), no falla.
        await q.query(`
        CREATE TABLE IF NOT EXISTS roles (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            role_name varchar NOT NULL UNIQUE,
            description varchar,
            created_at timestamp NOT NULL DEFAULT now()
        )`);
        await q.query(`
        CREATE TABLE IF NOT EXISTS users (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            email varchar NOT NULL UNIQUE,
            password varchar NOT NULL,
            name varchar NOT NULL,
            phone varchar,
            is_active boolean NOT NULL DEFAULT true,
            created_at timestamp NOT NULL DEFAULT now()
        )`);
        // Tabla puente del muchos-a-muchos: la PK compuesta evita repetir la pareja usuario-rol.
        await q.query(`
        CREATE TABLE IF NOT EXISTS users_roles (
            user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            role_id uuid NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
            PRIMARY KEY (user_id, role_id)
        )`);
    }

    public async down(q: QueryRunner): Promise<void> {
        await q.query(`DROP TABLE IF EXISTS users_roles`);
        await q.query(`DROP TABLE IF EXISTS users`);
        await q.query(`DROP TABLE IF EXISTS roles`);
    }
}