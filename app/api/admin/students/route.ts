import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { getQuorumStats } from "@/lib/quorum";
import { getSupabase } from "@/lib/supabase";

export async function GET() {
  const session = await requireAdminSession();

  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("estudiantes_interes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    const stats = await getQuorumStats();

    return NextResponse.json({
      students: data ?? [],
      stats,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "No se pudieron cargar los inscritos" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const session = await requireAdminSession();

  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID de registro requerido" },
        { status: 400 },
      );
    }

    const supabase = getSupabase();
    const { error } = await supabase
      .from("estudiantes_interes")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting student:", error);
    return NextResponse.json(
      { error: "No se pudo eliminar el registro" },
      { status: 500 },
    );
  }
}
