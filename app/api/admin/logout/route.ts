import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { getSession } from "@/lib/session";

export async function POST() {
  const session = await requireAdminSession();

  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const ironSession = await getSession();
  ironSession.destroy();

  return NextResponse.json({ success: true });
}
