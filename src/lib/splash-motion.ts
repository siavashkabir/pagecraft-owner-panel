export const SPLASH_DURATION = 6800;
export const ASSEMBLY_DURATION = 5800;

export function assemblyProgress(elapsed: number, delay: number) {
  const t = Math.max(0, Math.min(1, (elapsed - delay) / (ASSEMBLY_DURATION - delay)));
  return t * t * t * (t * (t * 6 - 15) + 10);
}