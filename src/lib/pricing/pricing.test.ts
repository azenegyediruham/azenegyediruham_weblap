import { describe, expect, it } from "vitest";
import { RuleBasedPricing } from "./index";

const pricing = new RuleBasedPricing();

describe("RuleBasedPricing", () => {
  it("prices a single embroidery by area", () => {
    const q = pricing.quote({ garmentPriceHuf: 5990, items: [{ widthCm: 10, heightCm: 10 }], quantity: 1 });
    expect(q.unitEmbroideryHuf).toBe(1490 + 100 * 38);
    expect(q.unitTotalHuf).toBe(5990 + 1490 + 3800);
    expect(q.totalHuf).toBe(q.unitTotalHuf);
    expect(q.estimatedStitches).toBe(11000);
  });
  it("adds extra position and extra colours", () => {
    const q = pricing.quote({
      garmentPriceHuf: 5990,
      items: [
        { widthCm: 10, heightCm: 10, colorCount: 5 },
        { widthCm: 5, heightCm: 5 },
      ],
      quantity: 1,
    });
    expect(q.unitEmbroideryHuf).toBe(1490 + 3800 + 2 * 250 + (1490 + Math.round(25 * 38) + 990));
  });
  it("applies quantity tiers and rush surcharge", () => {
    const q = pricing.quote({ garmentPriceHuf: 5000, items: [], quantity: 25, rush: true });
    expect(q.discountPercent).toBe(15);
    expect(q.discountHuf).toBe(Math.round(5000 * 25 * 0.15));
    expect(q.rushHuf).toBe(Math.round((125000 - q.discountHuf) * 0.25));
    expect(q.totalHuf).toBe(125000 - q.discountHuf + q.rushHuf);
  });
});
