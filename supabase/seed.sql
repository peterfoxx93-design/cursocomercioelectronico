-- Datos de prueba para desarrollo (NO ejecutar en producción)
-- Ejecutar solo después de schema.sql

insert into estudiantes_interes (nombre, email, telefono, compromiso, created_at) values
  ('Ana María Rodríguez', 'ana.rodriguez@example.com', '8095550101', true, now() - interval '6 days'),
  ('Carlos Jiménez', 'carlos.jimenez@example.com', '8095550102', true, now() - interval '5 days'),
  ('Laura Pérez', 'laura.perez@example.com', '8095550103', true, now() - interval '4 days'),
  ('Miguel Santos', 'miguel.santos@example.com', '8095550104', true, now() - interval '3 days'),
  ('Patricia Gómez', 'patricia.gomez@example.com', '8095550105', true, now() - interval '2 days'),
  ('Roberto Méndez', 'roberto.mendez@example.com', '8095550106', true, now() - interval '1 day'),
  ('Sofía Hernández', 'sofia.hernandez@example.com', '8095550107', true, now() - interval '12 hours'),
  ('Diego Ramírez', 'diego.ramirez@example.com', '8095550108', true, now() - interval '2 hours')
on conflict do nothing;
