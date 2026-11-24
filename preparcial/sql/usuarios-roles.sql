-- Usuarios y roles de prueba. Se puede ejecutar varias veces sin duplicar nada.
-- Contrasena de todos los usuarios de prueba: ver README.
-- Requiere que las tablas existan (sql/estructura.sql).

-- 1. Roles
INSERT INTO roles (role_name, description) VALUES
  ('admin', 'Administrador'),
  ('supervisor', 'Supervisor'),
  ('usuario', 'Usuario')
ON CONFLICT (role_name) DO NOTHING;

-- 2. Usuarios base (password = hash scrypt generado con el PasswordHasher de @nestjs/authentication)
INSERT INTO users (email, password, name) VALUES
  ('admin@preparcial.com', '$scrypt$ln=17,r=8,p=1$CmuQOG/hWYxd9vG0BG/31w$1pMJ1Mg/v2O6wmBqe96oqLzNnOTgFCpkTVAxt3NofD4', 'Administrador'),
  ('supervisor@preparcial.com', '$scrypt$ln=17,r=8,p=1$CmuQOG/hWYxd9vG0BG/31w$1pMJ1Mg/v2O6wmBqe96oqLzNnOTgFCpkTVAxt3NofD4', 'Supervisor de prueba'),
  ('usuario@preparcial.com', '$scrypt$ln=17,r=8,p=1$CmuQOG/hWYxd9vG0BG/31w$1pMJ1Mg/v2O6wmBqe96oqLzNnOTgFCpkTVAxt3NofD4', 'Usuario sin rol')
ON CONFLICT (email) DO NOTHING;

-- 3. Usuarios adicionales: copian la contrasena del admin (correo, nombre, telefono, activo)
INSERT INTO users (email, password, name, phone, is_active)
SELECT v.email, a.password, v.name, v.phone, v.is_active
FROM (VALUES
  ('usuario1@preparcial.com',    'Usuario Uno',       '3001112233', true),
  ('usuario2@preparcial.com',    'Usuario Dos',       '3004445566', true),
  ('supervisor2@preparcial.com', 'Sofia Supervisora', NULL,         true),
  ('multirol@preparcial.com',    'Marta Multirol',    '3007778899', true),
  ('inactivo@preparcial.com',    'Ivan Inactivo',     NULL,         false)
) AS v(email, name, phone, is_active)
CROSS JOIN (SELECT password FROM users WHERE email = 'admin@preparcial.com') AS a
ON CONFLICT (email) DO NOTHING;

-- 4. Asignar roles (una fila por pareja correo-rol; un usuario puede aparecer varias veces)
INSERT INTO users_roles (user_id, role_id)
SELECT u.id, r.id
FROM (VALUES
  ('admin@preparcial.com',       'admin'),
  ('supervisor@preparcial.com',  'supervisor'),
  ('usuario1@preparcial.com',    'usuario'),
  ('usuario2@preparcial.com',    'usuario'),
  ('supervisor2@preparcial.com', 'supervisor'),
  ('multirol@preparcial.com',    'supervisor'),
  ('multirol@preparcial.com',    'usuario')
) AS v(email, role_name)
JOIN users u ON u.email = v.email
JOIN roles r ON r.role_name = v.role_name
ON CONFLICT DO NOTHING;

-- 5. Comprobar: cada usuario con sus roles (sin el password)
SELECT u.email, u.is_active,
        COALESCE(string_agg(r.role_name, ', ' ORDER BY r.role_name), '(sin roles)') AS roles
FROM users u
LEFT JOIN users_roles ur ON ur.user_id = u.id
LEFT JOIN roles r ON r.id = ur.role_id
GROUP BY u.id
ORDER BY u.email;