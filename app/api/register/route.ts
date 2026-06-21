import { NextResponse } from "next/server";
import { getQuorumStats } from "@/lib/quorum";
import { getSupabase } from "@/lib/supabase";
import {
  normalizeEmail,
  normalizeNombre,
  normalizePhone,
  registrationSchema,
} from "@/lib/validators";

function duplicateMessage(error: { code?: string; message?: string }) {
  if (error.code !== "23505") {
    return null;
  }

  const message = error.message?.toLowerCase() ?? "";

  if (message.includes("email")) {
    return "Este email ya está registrado";
  }

  if (message.includes("telefono")) {
    return "Este teléfono ya está registrado";
  }

  return "Ya existe un registro con estos datos";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registrationSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message ?? "Datos inválidos";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const stats = await getQuorumStats();

    if (stats.completed) {
      return NextResponse.json(
        { error: "El quórum ya está completo. No se aceptan más registros." },
        { status: 403 },
      );
    }

    const { nombre, email, telefono } = parsed.data;
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("estudiantes_interes")
      .insert({
        nombre: normalizeNombre(nombre),
        email: normalizeEmail(email),
        telefono: normalizePhone(telefono),
        compromiso: true,
      })
      .select("id")
      .single();

    if (error) {
      const duplicate = duplicateMessage(error);
      if (duplicate) {
        return NextResponse.json({ error: duplicate }, { status: 409 });
      }

      console.error("Registration error:", error);
      return NextResponse.json(
        { error: "No se pudo registrar tu interés. Intenta nuevamente." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, id: data.id }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
