-- Quórum Comercio Electrónico - Schema
-- Ejecutar en Supabase SQL Editor

create table if not exists estudiantes_interes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  email text not null,
  telefono text not null,
  compromiso boolean not null default false,
  created_at timestamptz not null default now(),
  constraint estudiantes_email_unique unique (email),
  constraint estudiantes_telefono_unique unique (telefono),
  constraint estudiantes_compromiso_check check (compromiso = true)
);

create index if not exists idx_estudiantes_created_at
  on estudiantes_interes (created_at desc);
