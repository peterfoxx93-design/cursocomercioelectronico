import { QUORUM_TARGET } from "./constants";
import { getSupabase } from "./supabase";

export interface QuorumStats {
  total: number;
  target: number;
  remaining: number;
  percentage: number;
  completed: boolean;
}

export async function getQuorumStats(): Promise<QuorumStats> {
  const supabase = getSupabase();
  const { count, error } = await supabase
    .from("estudiantes_interes")
    .select("*", { count: "exact", head: true });

  if (error) {
    throw error;
  }

  const total = count ?? 0;
  const target = QUORUM_TARGET;
  const remaining = Math.max(target - total, 0);
  const percentage = Math.min(Math.round((total / target) * 100), 100);
  const completed = total >= target;

  return { total, target, remaining, percentage, completed };
}
