import { createClient, SupabaseClient } from "@supabase/supabase-js";

export interface Estudiante {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  compromiso: boolean;
  created_at: string;
}

// Datos de prueba simulados en memoria para el modo Demo
let mockEstudiantes: Estudiante[] = [
  { id: "1", nombre: "Ana María Rodríguez", email: "ana.rodriguez@example.com", telefono: "8095550101", compromiso: true, created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "2", nombre: "Carlos Jiménez", email: "carlos.jimenez@example.com", telefono: "8095550102", compromiso: true, created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "3", nombre: "Laura Pérez", email: "laura.perez@example.com", telefono: "8095550103", compromiso: true, created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "4", nombre: "Miguel Santos", email: "miguel.santos@example.com", telefono: "8095550104", compromiso: true, created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "5", nombre: "Patricia Gómez", email: "patricia.gomez@example.com", telefono: "8095550105", compromiso: true, created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "6", nombre: "Roberto Méndez", email: "roberto.mendez@example.com", telefono: "8095550106", compromiso: true, created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "7", nombre: "Sofía Hernández", email: "sofia.hernandez@example.com", telefono: "8095550107", compromiso: true, created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() },
  { id: "8", nombre: "Diego Ramírez", email: "diego.ramirez@example.com", telefono: "8095550108", compromiso: true, created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
];

class MockSupabaseQueryBuilder {
  select(columns?: string, options?: { count?: string; head?: boolean }) {
    const list = [...mockEstudiantes];

    const result = {
      order: (column: string, opts?: { ascending?: boolean }) => {
        const sorted = list.sort((a, b) => {
          const valA = a.created_at;
          const valB = b.created_at;
          const asc = opts?.ascending !== false;
          return asc ? (valA < valB ? -1 : 1) : (valA > valB ? -1 : 1);
        });
        return Promise.resolve({ data: sorted, error: null });
      },
      single: () => {
        return Promise.resolve({ data: list[list.length - 1] || null, error: null });
      },
      data: list,
      count: list.length,
      error: null,
    };

    if (options?.count === "exact" && options?.head === true) {
      return Promise.resolve({ count: mockEstudiantes.length, error: null });
    }

    const promise = Promise.resolve({ data: list, error: null });
    Object.assign(promise, result);
    return promise as any;
  }

  insert(values: any) {
    const emailDup = mockEstudiantes.some(e => e.email.toLowerCase() === values.email.toLowerCase());
    const phoneDup = mockEstudiantes.some(e => e.telefono === values.telefono);

    if (emailDup) {
      return {
        select: () => ({
          single: () => Promise.resolve({ data: null, error: { code: "23505", message: "Key (email) already exists." } })
        })
      } as any;
    }

    if (phoneDup) {
      return {
        select: () => ({
          single: () => Promise.resolve({ data: null, error: { code: "23505", message: "Key (telefono) already exists." } })
        })
      } as any;
    }

    const newStudent: Estudiante = {
      id: Math.random().toString(36).substring(2, 11),
      nombre: values.nombre,
      email: values.email,
      telefono: values.telefono,
      compromiso: values.compromiso ?? true,
      created_at: new Date().toISOString(),
    };

    mockEstudiantes.push(newStudent);

    return {
      select: (cols?: string) => ({
        single: () => Promise.resolve({ data: newStudent, error: null })
      })
    } as any;
  }

  delete() {
    return {
      eq: (col: string, val: any) => {
        if (col === "id") {
          mockEstudiantes = mockEstudiantes.filter(e => e.id !== val);
        }
        return Promise.resolve({ error: null });
      }
    } as any;
  }
}

const mockSupabaseClient = {
  from: (table: string) => {
    if (table === "estudiantes_interes") {
      return new MockSupabaseQueryBuilder();
    }
    throw new Error(`Table ${table} not supported in Mock client.`);
  }
};

let supabaseClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  let url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/^["']|["']$/g, "");
  if (url) {
    if (!url.includes(".")) {
      url = `https://${url}.supabase.co`;
    } else if (!url.startsWith("http")) {
      url = `https://${url}`;
    }
    url = url.replace(/\/+$/, "");
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim().replace(/^["']|["']$/g, "");

  console.log("Supabase config debug:", {
    urlLength: url?.length,
    keyLength: serviceRoleKey?.length,
    urlStart: url?.substring(0, 20),
    keyStart: serviceRoleKey?.substring(0, 20)
  });

  if (supabaseClient) {
    return supabaseClient;
  }

  // Si no hay credenciales, o son los placeholders por defecto, usamos el cliente mockeado para demostración
  if (
    !url ||
    !serviceRoleKey ||
    url.includes("placeholder.supabase.co") ||
    serviceRoleKey.includes("placeholder-service-role-key")
  ) {
    console.warn("Utilizando Mock Supabase Client en memoria para demostración.");
    supabaseClient = mockSupabaseClient as any as SupabaseClient;
    return supabaseClient;
  }

  supabaseClient = createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return supabaseClient;
}
