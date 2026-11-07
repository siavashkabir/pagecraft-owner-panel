const DAY_MS = 24 * 60 * 60 * 1000;

export function remainingDays(expiresAt: string, now: Date = new Date()): number {
  const expires = new Date(expiresAt).getTime();
  if (!Number.isFinite(expires) || expires <= now.getTime()) return 0;
  return Math.ceil((expires - now.getTime()) / DAY_MS);
}
