import { NextResponse } from "next/server";
import { getQuorumStats } from "@/lib/quorum";

export async function GET() {
  try {
    const stats = await getQuorumStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "No se pudo obtener el estado del quórum" },
      { status: 500 },
    );
  }
}
