-- Estructura de la base de datos: la misma que crea la migracion CreateTables.
-- Sirve para leer como esta armada la base, o para crearla a mano en una base vacia.
-- No falla si las tablas ya existen (IF NOT EXISTS).

-- Roles: admin, supervisor, ...
CREATE TABLE IF NOT EXISTS roles (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_name   varchar   NOT NULL UNIQUE,
  description varchar,
  created_at  timestamp NOT NULL DEFAULT now()
);

-- Usuarios. password guarda el hash (scrypt), nunca la contrasena.
CREATE TABLE IF NOT EXISTS users (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email      varchar   NOT NULL UNIQUE,
  password   varchar   NOT NULL,
  name       varchar   NOT NULL,
  phone      varchar,
  is_active  boolean   NOT NULL DEFAULT true,  -- false: el login responde 423
  created_at timestamp NOT NULL DEFAULT now()
);

-- Relacion muchos a muchos: que roles tiene cada usuario.
-- Llave compuesta: un usuario no puede tener el mismo rol dos veces.
-- ON DELETE CASCADE: si se borra un usuario o un rol, sus filas aqui se borran.
CREATE TABLE IF NOT EXISTS users_roles (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id uuid NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);