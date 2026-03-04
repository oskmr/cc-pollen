// Pollen level thresholds (count/cm2 per hour)
const THRESHOLDS = [
  [0, 0], [1, 9], [10, 29], [30, 49], [50, 99], [100, Infinity],
] as const satisfies readonly (readonly [number, number])[];

export interface LevelInfo {
  ja: string;
  en: string;
  icon: string;
  bar: string;
}

export const LEVELS = [
  { ja: "なし",       en: "None",      icon: "🟢", bar: "░░░░░" },
  { ja: "少ない",     en: "Low",       icon: "🟡", bar: "▓░░░░" },
  { ja: "やや多い",   en: "Moderate",  icon: "🟠", bar: "▓▓░░░" },
  { ja: "多い",       en: "High",      icon: "🔴", bar: "▓▓▓░░" },
  { ja: "非常に多い", en: "Very High", icon: "🟣", bar: "▓▓▓▓░" },
  { ja: "極めて多い", en: "Extreme",   icon: "💀", bar: "▓▓▓▓▓" },
] as const satisfies readonly LevelInfo[];

export const COLORS = [
  "\x1b[32m", "\x1b[33m", "\x1b[33m",
  "\x1b[31m", "\x1b[35m", "\x1b[35;1m",
] as const satisfies readonly string[];

export const RESET = "\x1b[0m" as const;

export function countToLevel(n: number): number {
  if (n <= 0) return 0;
  for (let i = 0; i < THRESHOLDS.length; i++) {
    if (n >= THRESHOLDS[i][0] && n <= THRESHOLDS[i][1]) return i;
  }
  return 5;
}

