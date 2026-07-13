import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/shared/lib/supabase/server";
import { addDays } from "@/shared/lib/dates";
import {
  XP_VALUES,
  computeGlobalStreak,
  levelForXp,
  type EventType,
} from "../rules";

const STREAK_LOOKBACK_DAYS = 400;

type TrackOptions = {
  /** Local date (YYYY-MM-DD) of the action, provided by the client. */
  date: string;
};

/**
 * Central gamification hook. Features signal an action; this writes the raw
 * event and refreshes the cached user stats (XP, level, streaks, freezes).
 */
export async function trackEvent(
  type: EventType,
  entityId: string,
  { date }: TrackOptions
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const xp = XP_VALUES[type];
  await supabase.from("events").insert({
    user_id: user.id,
    type,
    entity_id: entityId,
    xp_earned: xp,
  });

  await refreshUserStats(supabase, user.id, date, xp);
}

/**
 * Reverts the most recent event of the given type for an entity (e.g. when
 * a habit check is undone) and refreshes the stats.
 */
export async function untrackEvent(
  type: EventType,
  entityId: string,
  { date }: TrackOptions
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: events } = await supabase
    .from("events")
    .select("id")
    .eq("user_id", user.id)
    .eq("type", type)
    .eq("entity_id", entityId)
    .order("created_at", { ascending: false })
    .limit(1);

  const event = events?.[0] as { id: string } | undefined;
  if (!event) return;

  await supabase.from("events").delete().eq("id", event.id);
  await refreshUserStats(supabase, user.id, date, -XP_VALUES[type]);
}

async function refreshUserStats(
  supabase: SupabaseClient,
  userId: string,
  today: string,
  xpDelta: number
) {
  const [{ data: stats }, { data: checks }, { data: habits }] =
    await Promise.all([
      supabase
        .from("user_stats")
        .select("total_xp, longest_streak")
        .eq("user_id", userId)
        .maybeSingle(),
      supabase
        .from("habit_checks")
        .select("checked_date")
        .eq("user_id", userId)
        .gte("checked_date", addDays(today, -STREAK_LOOKBACK_DAYS)),
      supabase
        .from("habits")
        .select("frequency, created_at")
        .eq("user_id", userId)
        .is("archived_at", null),
    ]);

  const checkedDates = new Set(
    ((checks ?? []) as { checked_date: string }[]).map((c) => c.checked_date)
  );

  const scheduledWeekdays = new Set<number>();
  let earliestDate: string | null = null;
  for (const habit of (habits ?? []) as {
    frequency: { days?: number[] };
    created_at: string;
  }[]) {
    for (const day of habit.frequency?.days ?? []) scheduledWeekdays.add(day);
    const created = habit.created_at.slice(0, 10);
    if (!earliestDate || created < earliestDate) earliestDate = created;
  }

  const streak = computeGlobalStreak({
    checkedDates,
    scheduledWeekdays,
    earliestDate,
    today,
  });

  const currentStats = (stats ?? { total_xp: 0, longest_streak: 0 }) as {
    total_xp: number;
    longest_streak: number;
  };
  const totalXp = Math.max(0, currentStats.total_xp + xpDelta);

  await supabase.from("user_stats").upsert({
    user_id: userId,
    total_xp: totalXp,
    level: levelForXp(totalXp),
    current_streak: streak.current,
    longest_streak: Math.max(currentStats.longest_streak, streak.current),
    freezes_available: streak.freezesRemaining,
    updated_at: new Date().toISOString(),
  });
}
