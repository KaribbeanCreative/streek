"use client";

import { useEffect, useMemo, useRef } from "react";
import { HABIT_COLORS, type HabitColor } from "@/shared/constants";
import { monthShortLabel, toDateKey, weekdayIndex } from "@/shared/lib/dates";
import { buildHeatmapCells } from "../lib/heatmap";

const CELL = 11;
const GAP = 3;
const LEVEL_MIX = [0, 40, 62, 82, 100] as const;

type HabitHeatmapProps = {
  checkedDates: string[];
  scheduledDays: number[];
  color: HabitColor;
  days?: number;
};

export function HabitHeatmap({
  checkedDates,
  scheduledDays,
  color,
  days = 365,
}: HabitHeatmapProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const colorCss = HABIT_COLORS[color].css;

  const { columns, monthLabels } = useMemo(() => {
    const today = toDateKey(new Date());
    const cells = buildHeatmapCells(
      new Set(checkedDates),
      scheduledDays,
      today,
      days
    );

    const leading = weekdayIndex(cells[0].date);
    const padded = [
      ...Array.from({ length: leading }, () => null),
      ...cells,
    ];

    const columns: (typeof padded)[] = [];
    for (let i = 0; i < padded.length; i += 7) {
      columns.push(padded.slice(i, i + 7));
    }

    const monthLabels: (string | null)[] = columns.map((column, i) => {
      const first = column.find((cell) => cell !== null);
      if (!first) return null;
      const label = monthShortLabel(first.date);
      if (i === 0) return label;
      const prev = columns[i - 1].find((cell) => cell !== null);
      return prev && monthShortLabel(prev.date) !== label ? label : null;
    });

    return { columns, monthLabels };
  }, [checkedDates, scheduledDays, days]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, [columns]);

  return (
    <div ref={scrollRef} className="overflow-x-auto pb-1">
      <div className="w-max">
        <div
          className="mb-1 grid grid-flow-col text-[10px] text-muted-foreground"
          style={{ gridAutoColumns: CELL + GAP }}
        >
          {monthLabels.map((label, i) => (
            <span key={i} className="overflow-visible whitespace-nowrap">
              {label}
            </span>
          ))}
        </div>
        <div className="flex" style={{ gap: GAP }}>
          {columns.map((column, colIndex) => (
            <div key={colIndex} className="flex flex-col" style={{ gap: GAP }}>
              {column.map((cell, rowIndex) =>
                cell === null ? (
                  <span
                    key={rowIndex}
                    style={{ width: CELL, height: CELL }}
                  />
                ) : (
                  <span
                    key={cell.date}
                    title={
                      cell.level > 0 ? `${cell.date} — checked` : cell.date
                    }
                    className="rounded-[2.5px]"
                    style={{
                      width: CELL,
                      height: CELL,
                      backgroundColor:
                        cell.level === 0
                          ? "var(--muted)"
                          : `color-mix(in oklab, ${colorCss} ${LEVEL_MIX[cell.level]}%, var(--muted))`,
                    }}
                  />
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
