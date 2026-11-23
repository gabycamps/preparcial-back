-- Usuarios y roles de prueba. Se puede ejecutar varias veces sin duplicar nada.
-- Contrasena de todos los usuarios de prueba: ver README.
-- Requiere que las tablas existan (migraciones o sql/estructura.sql).

-- 1. Roles
INSERT INTO roles (role_name, description) VALUES
  ('admin', 'Administrador'),
  ('supervisor', 'Supervisor')
ON CONFLICT (role_name) DO NOTHING;

-- 2. Usuarios (password = hash scrypt generado con el PasswordHasher de @nestjs/authentication)
INSERT INTO users (email, password, name) VALUES
  ('admin@preparcial.com', '$scrypt$ln=17,r=8,p=1$CmuQOG/hWYxd9vG0BG/31w$1pMJ1Mg/v2O6wmBqe96oqLzNnOTgFCpkTVAxt3NofD4', 'Administrador'),
  ('supervisor@preparcial.com', '$scrypt$ln=17,r=8,p=1$CmuQOG/hWYxd9vG0BG/31w$1pMJ1Mg/v2O6wmBqe96oqLzNnOTgFCpkTVAxt3NofD4', 'Supervisor de prueba'),
  ('usuario@preparcial.com', '$scrypt$ln=17,r=8,p=1$CmuQOG/hWYxd9vG0BG/31w$1pMJ1Mg/v2O6wmBqe96oqLzNnOTgFCpkTVAxt3NofD4', 'Usuario sin rol')
ON CONFLICT (email) DO NOTHING;

-- 3. Asignar roles
INSERT INTO users_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
JOIN roles r
  ON (u.email = 'admin@preparcial.com' AND r.role_name = 'admin')
  OR (u.email = 'supervisor@preparcial.com' AND r.role_name = 'supervisor')
ON CONFLICT DO NOTHING;

-- 4. Consultas para comprobar
SELECT id, role_name, description FROM roles ORDER BY role_name;

-- Cada usuario con sus roles (sin el password)
SELECT u.email, u.name, u.is_active,
      COALESCE(string_agg(r.role_name, ', ' ORDER BY r.role_name), '(sin roles)') AS roles
FROM users u
LEFT JOIN users_roles ur ON ur.user_id = u.id
LEFT JOIN roles r ON r.id = ur.role_id
GROUP BY u.id
ORDER BY u.email;