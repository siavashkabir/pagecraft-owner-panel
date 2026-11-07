import { describe, expect, it } from "vitest";
import { safeRedirect } from "@/lib/auth";
import { remainingDays } from "@/lib/dashboard";

describe("customer auth redirect", () => {
  it("keeps local paths", () => {
    expect(safeRedirect("/dashboard")).toBe("/dashboard");
    expect(safeRedirect("/shop/admin-ai?plan=3")).toBe("/shop/admin-ai?plan=3");
  });

  it("rejects external and protocol-relative destinations", () => {
    expect(safeRedirect("https://example.com")).toBeUndefined();
    expect(safeRedirect("//example.com/dashboard")).toBeUndefined();
    expect(safeRedirect(undefined)).toBeUndefined();
  });
});

describe("subscription remaining days", () => {
  const now = new Date("2026-11-07T00:00:00.000Z");

  it("rounds a partial remaining day up", () => {
    expect(remainingDays("2026-11-08T12:00:00.000Z", now)).toBe(2);
  });

  it("returns zero at expiry and after expiry", () => {
    expect(remainingDays("2026-11-07T00:00:00.000Z", now)).toBe(0);
    expect(remainingDays("2026-11-01T00:00:00.000Z", now)).toBe(0);
  });
});
