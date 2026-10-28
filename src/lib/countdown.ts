export type Remaining =
  | { status: "invalid" }
  | { status: "expired" }
  | { status: "running"; days: number; hours: number; minutes: number; seconds: number };

export function getRemaining(target: string, now: number = Date.now()): Remaining {
  const t = new Date(target).getTime();
  if (Number.isNaN(t)) return { status: "invalid" };
  const diff = t - now;
  if (diff <= 0) return { status: "expired" };
  const s = Math.floor(diff / 1000);
  return {
    status: "running",
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}
