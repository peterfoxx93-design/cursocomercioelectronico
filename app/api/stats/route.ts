import { NextResponse } from "next/server";
import { getQuorumStats } from "@/lib/quorum";

export async function GET() {
  try {
    const stats = await getQuorumStats();
    return NextResponse.json(stats);
  } catch (error: any) {
    console.error("Error fetching stats detailed:", {
      message: error?.message,
      details: error?.details,
      hint: error?.hint,
      code: error?.code,
      stack: error?.stack,
      raw: error
    });
    return NextResponse.json(
      { error: "No se pudo obtener el estado del quórum" },
      { status: 500 },
    );
  }
}
