import { createClient } from "@/shared/lib/supabase/server";
import type { UserStats } from "../types";

export async function getUserStats(): Promise<UserStats | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("user_stats")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  return (data as UserStats | null) ?? null;
}
