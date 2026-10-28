import { describe, expect, it } from "vitest";
import { getRemaining } from "@/lib/countdown";

describe("countdown", () => {
  it("splits remaining time", () => {
    const now = new Date("2026-12-18T15:58:59+05:00").getTime();
    expect(getRemaining("2026-12-19T17:00:00+05:00", now)).toEqual({
      status: "running", days: 1, hours: 1, minutes: 1, seconds: 1,
    });
  });
  it("reports expired dates", () => {
    expect(getRemaining("2020-01-01T00:00:00Z").status).toBe("expired");
  });
  it("reports invalid dates", () => {
    expect(getRemaining("not-a-date").status).toBe("invalid");
  });
});
