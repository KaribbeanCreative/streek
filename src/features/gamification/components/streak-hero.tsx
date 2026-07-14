import { FlameIcon, SnowflakeIcon, TrophyIcon } from "@/shared/icons";
import { addDays, weekdayIndex } from "@/shared/lib/dates";
import { WEEKDAYS } from "@/shared/constants";

const INK = "oklch(98.5% 0.005 85)";

type StreakHeroProps = {
  current: number;
  longest: number;
  freezesRemaining: number;
  checkedDates: string[];
  today: string;
};

export function StreakHero({
  current,
  longest,
  freezesRemaining,
  checkedDates,
  today,
}: StreakHeroProps) {
  const checked = new Set(checkedDates);
  const week = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(today, i - 6);
    return {
      date,
      letter: WEEKDAYS[weekdayIndex(date)].letter,
      checked: checked.has(date),
      isToday: date === today,
    };
  });

  return (
    <section
      aria-label="Streak"
      className="rounded-3xl bg-gradient-to-br from-flame-from to-flame-to p-5 shadow-lg shadow-primary/20"
      style={{ color: INK }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">Current streak</p>
          <p className="font-heading text-6xl font-bold leading-none tracking-tight">
            {current}
            <span className="ml-1.5 font-sans text-lg font-medium opacity-80">
              {current === 1 ? "day" : "days"}
            </span>
          </p>
        </div>
        <FlameIcon className="size-9 opacity-90" />
      </div>

      <div className="mt-5 flex gap-1.5">
        {week.map((day) => (
          <div key={day.date} className="flex flex-1 flex-col items-center gap-1.5">
            <span className="text-[10px] font-semibold uppercase opacity-70">
              {day.letter}
            </span>
            <span
              className="h-2 w-full rounded-full"
              style={{
                backgroundColor: day.checked
                  ? INK
                  : "oklch(98.5% 0.005 85 / 30%)",
                outline: day.isToday ? `1.5px solid ${INK}` : undefined,
                outlineOffset: day.isToday ? "2px" : undefined,
              }}
            />
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between text-sm font-medium">
        <span className="flex items-center gap-1.5">
          <TrophyIcon className="size-4" />
          Best {longest} {longest === 1 ? "day" : "days"}
        </span>
        <span className="flex items-center gap-1.5">
          <SnowflakeIcon className="size-4" />
          {freezesRemaining} {freezesRemaining === 1 ? "freeze" : "freezes"} left
        </span>
      </div>
    </section>
  );
}
