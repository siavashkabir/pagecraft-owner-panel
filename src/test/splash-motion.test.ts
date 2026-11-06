import { describe, expect, it } from "vitest";
import { assemblyProgress, SPLASH_DURATION } from "@/lib/splash-motion";

describe("Splash timing", () => {
  it("keeps the full splash between six and seven seconds", () => {
    expect(SPLASH_DURATION).toBeGreaterThanOrEqual(6000);
    expect(SPLASH_DURATION).toBeLessThanOrEqual(7000);
  });
  it("settles gradually rather than completing at the old four-second mark", () => {
    expect(assemblyProgress(1000, 800)).toBeLessThan(0.01);
    expect(assemblyProgress(3800, 800)).toBeLessThan(0.75);
    expect(assemblyProgress(5800, 800)).toBe(1);
  });
});