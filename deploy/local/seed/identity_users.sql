-- Cuentas iniciales (contraseña de todas: Gpi2026*). Mismos IDs que frontend/src/api/local/seed.ts.
INSERT INTO users (id, email, full_name, password_hash, role, created_at) VALUES
  ('0b6f8a52-7c1e-4d3a-8f2b-5e9c1d7a3b10', 'docente.gpi@unicartagena.edu.co', 'Carlos Herrera Díaz', '$2a$10$BknYQGW69v/jhHSoCRmhoOQdT2n1/4YpU4vD2hkE.KIR6ruc26kBW', 'docente', '2026-08-20T15:00:00Z'),
  ('0b6f8a52-7c1e-4d3a-8f2b-5e9c1d7a3b11', 'admin.ova@unicartagena.edu.co', 'Mónica Ríos Pacheco', '$2a$10$BknYQGW69v/jhHSoCRmhoOQdT2n1/4YpU4vD2hkE.KIR6ruc26kBW', 'administrador', '2026-08-20T15:00:00Z'),
  ('0b6f8a52-7c1e-4d3a-8f2b-5e9c1d7a3b12', 'validacion.ova@unicartagena.edu.co', 'Andrés Villalba Torres', '$2a$10$BknYQGW69v/jhHSoCRmhoOQdT2n1/4YpU4vD2hkE.KIR6ruc26kBW', 'validador', '2026-08-20T15:00:00Z'),
  ('0b6f8a52-7c1e-4d3a-8f2b-5e9c1d7a3b20', 'laura.martinez@unicartagena.edu.co', 'Laura Martínez Gómez', '$2a$10$BknYQGW69v/jhHSoCRmhoOQdT2n1/4YpU4vD2hkE.KIR6ruc26kBW', 'estudiante', '2026-08-20T15:00:00Z'),
  ('0b6f8a52-7c1e-4d3a-8f2b-5e9c1d7a3b21', 'andres.castillo@unicartagena.edu.co', 'Andrés Castillo Pérez', '$2a$10$BknYQGW69v/jhHSoCRmhoOQdT2n1/4YpU4vD2hkE.KIR6ruc26kBW', 'estudiante', '2026-08-20T15:00:00Z'),
  ('0b6f8a52-7c1e-4d3a-8f2b-5e9c1d7a3b22', 'valentina.orozco@unicartagena.edu.co', 'Valentina Orozco Ruiz', '$2a$10$BknYQGW69v/jhHSoCRmhoOQdT2n1/4YpU4vD2hkE.KIR6ruc26kBW', 'estudiante', '2026-08-20T15:00:00Z'),
  ('0b6f8a52-7c1e-4d3a-8f2b-5e9c1d7a3b23', 'juan.barrios@unicartagena.edu.co', 'Juan David Barrios Mendoza', '$2a$10$BknYQGW69v/jhHSoCRmhoOQdT2n1/4YpU4vD2hkE.KIR6ruc26kBW', 'estudiante', '2026-08-20T15:00:00Z'),
  ('0b6f8a52-7c1e-4d3a-8f2b-5e9c1d7a3b24', 'camila.herrera@unicartagena.edu.co', 'Camila Herrera Julio', '$2a$10$BknYQGW69v/jhHSoCRmhoOQdT2n1/4YpU4vD2hkE.KIR6ruc26kBW', 'estudiante', '2026-08-20T15:00:00Z'),
  ('0b6f8a52-7c1e-4d3a-8f2b-5e9c1d7a3b25', 'santiago.pineda@unicartagena.edu.co', 'Santiago Pineda Arrieta', '$2a$10$BknYQGW69v/jhHSoCRmhoOQdT2n1/4YpU4vD2hkE.KIR6ruc26kBW', 'estudiante', '2026-08-20T15:00:00Z'),
  ('0b6f8a52-7c1e-4d3a-8f2b-5e9c1d7a3b26', 'mariana.lopez@unicartagena.edu.co', 'Mariana López Villadiego', '$2a$10$BknYQGW69v/jhHSoCRmhoOQdT2n1/4YpU4vD2hkE.KIR6ruc26kBW', 'estudiante', '2026-08-20T15:00:00Z'),
  ('0b6f8a52-7c1e-4d3a-8f2b-5e9c1d7a3b27', 'sebastian.marrugo@unicartagena.edu.co', 'Sebastián Marrugo Cassiani', '$2a$10$BknYQGW69v/jhHSoCRmhoOQdT2n1/4YpU4vD2hkE.KIR6ruc26kBW', 'estudiante', '2026-08-20T15:00:00Z'),
  ('0b6f8a52-7c1e-4d3a-8f2b-5e9c1d7a3b28', 'daniela.acosta@unicartagena.edu.co', 'Daniela Acosta Blanco', '$2a$10$BknYQGW69v/jhHSoCRmhoOQdT2n1/4YpU4vD2hkE.KIR6ruc26kBW', 'estudiante', '2026-08-20T15:00:00Z'),
  ('0b6f8a52-7c1e-4d3a-8f2b-5e9c1d7a3b29', 'nicolas.guerrero@unicartagena.edu.co', 'Nicolás Guerrero Torres', '$2a$10$BknYQGW69v/jhHSoCRmhoOQdT2n1/4YpU4vD2hkE.KIR6ruc26kBW', 'estudiante', '2026-08-20T15:00:00Z'),
  ('0b6f8a52-7c1e-4d3a-8f2b-5e9c1d7a3b2a', 'isabella.cabarcas@unicartagena.edu.co', 'Isabella Cabarcas Díaz', '$2a$10$BknYQGW69v/jhHSoCRmhoOQdT2n1/4YpU4vD2hkE.KIR6ruc26kBW', 'estudiante', '2026-08-20T15:00:00Z'),
  ('0b6f8a52-7c1e-4d3a-8f2b-5e9c1d7a3b2b', 'mateo.puello@unicartagena.edu.co', 'Mateo Puello Morales', '$2a$10$BknYQGW69v/jhHSoCRmhoOQdT2n1/4YpU4vD2hkE.KIR6ruc26kBW', 'estudiante', '2026-08-20T15:00:00Z'),
  ('0b6f8a52-7c1e-4d3a-8f2b-5e9c1d7a3b2c', 'sofia.ramos@unicartagena.edu.co', 'Sofía Ramos Carmona', '$2a$10$BknYQGW69v/jhHSoCRmhoOQdT2n1/4YpU4vD2hkE.KIR6ruc26kBW', 'estudiante', '2026-08-20T15:00:00Z')
ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, full_name = EXCLUDED.full_name,
  password_hash = EXCLUDED.password_hash, role = EXCLUDED.role;
