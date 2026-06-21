import { z } from "zod";

export const registrationSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(3, "El nombre completo es obligatorio (mínimo 3 caracteres)"),
  email: z.string().trim().email("Ingresa un email válido"),
  telefono: z
    .string()
    .trim()
    .min(7, "El teléfono es obligatorio")
    .regex(/^[\d\s\-().+]+$/, "Ingresa un teléfono válido"),
  compromiso: z.boolean().refine((value) => value === true, {
    message: "Debes aceptar la nota de compromiso para continuar",
  }),
});

export const loginSchema = z.object({
  username: z.string().min(1, "El usuario es obligatorio"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function normalizePhone(telefono: string): string {
  return telefono.replace(/[\s\-().+]/g, "");
}

export function normalizeNombre(nombre: string): string {
  return nombre.trim().replace(/\s+/g, " ");
}
