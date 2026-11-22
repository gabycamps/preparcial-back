
# Preparcial: usuarios y roles (NestJS)

API con NestJS: JWT (access y refresh), roles con policies y PostgreSQL con TypeORM.

## Arranque

```bash
npm install
cp .env.example .env     # llenar las variables (abajo)
npm run start:dev        # http://localhost:3000
```

Al arrancar, las migraciones (`src/migrations/`) crean las tablas y el admin. Usuarios de prueba extra (opcional):

```powershell
Get-Content sql\usuarios-roles.sql -Encoding UTF8 | docker exec -i pg-preparcial psql -U postgres -d preparcial
```

`sql/estructura.sql` es el mismo `CREATE TABLE` en SQL puro.


## Usuarios de prueba

Contraseña de todos: `Admin-Preparcial-2026`

| Correo | Rol |
|---|---|
| `admin@preparcial.com` | admin |
| `supervisor@preparcial.com` | supervisor |
| `usuario@preparcial.com` | (sin rol) |

## Endpoints

| Ruta | Acceso |
|---|---|
| `POST /auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout` | público |
| `GET /users/me` | autenticado |
| `GET /users`, `GET /roles`, `POST /roles`, `PATCH /users/:id/roles` | admin |

Sin token: 401. Sin permiso: 403. El access token dura 2 minutos.

## Comandos útiles (PowerShell)

Token:
```powershell
curl.exe -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{\"email\":\"admin@preparcial.com\",\"password\":\"Admin-Preparcial-2026\"}'
```

Crear un rol (API o SQL):
```powershell
curl.exe -X POST http://localhost:3000/roles -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" -d '{\"role_name\":\"auditor\",\"description\":\"Auditor\"}'
```
```sql
INSERT INTO roles (role_name, description) VALUES ('auditor', 'Auditor') ON CONFLICT (role_name) DO NOTHING;
```

Asignar un rol (reemplaza los roles del usuario):
```powershell
curl.exe -X PATCH http://localhost:3000/users/<ID>/roles -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" -d '{\"roles\":[\"auditor\"]}'
```
```sql
INSERT INTO users_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.email = 'CORREO' AND r.role_name = 'auditor'
ON CONFLICT DO NOTHING;
```

Ver usuarios con sus roles:
```powershell
docker exec -it pg-preparcial psql -U postgres -d preparcial -c "SELECT u.email, r.role_name FROM users u JOIN users_roles ur ON ur.user_id = u.id JOIN roles r ON r.id = ur.role_id;"
```

Reiniciar la base (detener la app antes); al arrancar de nuevo se recrea todo:
```powershell
docker exec -it pg-preparcial psql -U postgres -c "DROP DATABASE preparcial;"
docker exec -it pg-preparcial psql -U postgres -c "CREATE DATABASE preparcial;"
```

## Dar permisos a un rol

En la policy (`src/roles/roles.policy.ts` o `src/users/users.policy.ts`). El admin pasa todo por `before()`.

```ts
list(user: User | null) {
  return hasRole(user, 'supervisor', 'auditor');   // src/auth/has-role.ts
}
```

La ruta usa la regla: `@Can(RolesPolicy, 'list')`. Una policy nueva va en `providers` de su módulo.

## Tabla nueva

1. Entidad en `src/entities/` y agregarla a `entities: [...]` en `src/app.module.ts`.
2. En su módulo: `TypeOrmModule.forFeature([Entidad])`; en el servicio: `@InjectRepository(Entidad)`.
3. Crear la tabla: `CREATE TABLE` en `sql/estructura.sql` o una migración nueva (clase con número mayor, agregada a `migrations: [...]`). En desarrollo, `synchronize: true` y `migrationsRun: false` mientras tanto.
4. Módulo nuevo: agregarlo a `imports` de `src/app.module.ts`.

## Cosas que fallan seguido

- Ruta sin `@Can()`, `@Can.Anyone()` o `@Public()` responde 403, incluso al admin.
- Las reglas usadas en rutas deben aceptar `User | null`.
- Los roles creados por la API no quedan en los `.sql`: si hay que entregarlos, se escriben en el script.
- Los imports relativos terminan en `.js` (`'./users.service.js'`).