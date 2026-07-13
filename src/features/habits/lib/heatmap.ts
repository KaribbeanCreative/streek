import { addDays, weekdayIndex } from "@/shared/lib/dates";

export type HeatmapCell = {
  date: string;
  /** 0 = not checked, 1–4 = checked, deeper as the run gets longer. */
  level: number;
};

/**
 * Builds the last `days` days ending today, with the intensity of each
 * checked day driven by the length of the consecutive run it belongs to —
 * the longer the streak burns, the hotter the cell.
 */
export function buildHeatmapCells(
  checkedDates: ReadonlySet<string>,
  scheduledDays: readonly number[],
  today: string,
  days = 365
): HeatmapCell[] {
  const scheduled = new Set(scheduledDays);
  const start = addDays(today, -(days - 1));
  const cells: HeatmapCell[] = [];
  let run = 0;

  for (let d = start; d <= today; d = addDays(d, 1)) {
    if (checkedDates.has(d)) {
      run += 1;
      cells.push({ date: d, level: intensityLevel(run) });
    } else {
      if (scheduled.has(weekdayIndex(d))) run = 0;
      cells.push({ date: d, level: 0 });
    }
  }

  return cells;
}

function intensityLevel(run: number): number {
  if (run >= 7) return 4;
  if (run >= 4) return 3;
  if (run >= 2) return 2;
  return 1;
}
