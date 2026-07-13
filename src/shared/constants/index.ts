export const HABIT_COLORS = {
  flame: { css: "oklch(70.5% 0.213 47.6)", hex: "#f97316" },
  amber: { css: "oklch(76.9% 0.188 70.1)", hex: "#f59e0b" },
  sun: { css: "oklch(85.2% 0.199 91.936)", hex: "#facc15" },
  leaf: { css: "oklch(72.3% 0.219 149.6)", hex: "#22c55e" },
  ocean: { css: "oklch(62.3% 0.214 259.815)", hex: "#3b82f6" },
  violet: { css: "oklch(65% 0.2 305)", hex: "#a855f7" },
  rose: { css: "oklch(70% 0.19 350)", hex: "#ec4899" },
  berry: { css: "oklch(63.7% 0.237 25.3)", hex: "#ef4444" },
} as const;

export type HabitColor = keyof typeof HABIT_COLORS;

export const HABIT_COLOR_KEYS = Object.keys(HABIT_COLORS) as [
  HabitColor,
  ...HabitColor[],
];

/** Index 0 = Monday, matching `weekdayIndex` in shared/lib/dates. */
export const WEEKDAYS = [
  { index: 0, short: "Mon", letter: "M" },
  { index: 1, short: "Tue", letter: "T" },
  { index: 2, short: "Wed", letter: "W" },
  { index: 3, short: "Thu", letter: "T" },
  { index: 4, short: "Fri", letter: "F" },
  { index: 5, short: "Sat", letter: "S" },
  { index: 6, short: "Sun", letter: "S" },
] as const;

export const HABIT_EMOJIS = [
  "🔥",
  "💪",
  "🏃",
  "🧘",
  "📚",
  "✍️",
  "💧",
  "🥗",
  "🛌",
  "🦷",
  "🎸",
  "🎨",
  "💻",
  "🌱",
  "🚭",
  "💰",
  "📵",
  "☀️",
] as const;
