import { describe, expect, it } from "vitest";
import type { CustomizationZone } from "@/lib/catalog/types";
import { clampPosition, clampSize, constrainToZone, initialPlacement, normalizeDeg, rectContains } from "./geometry";
import { rotatedBounds } from "./texture-composer";

const zone: CustomizationZone = {
  id: "z",
  key: "front_center",
  displayName: "Elöl, középen",
  viewKey: "front",
  rectCm: { x: 13, y: 16, w: 28, h: 34 },
  minWidthCm: 4,
  maxWidthCm: 28,
  maxHeightCm: 34,
  isActive: true,
  sortOrder: 1,
};

describe("clampSize", () => {
  it("keeps aspect ratio and respects max width", () => {
    const s = clampSize(40, 2, zone);
    expect(s.widthCm).toBe(28);
    expect(s.heightCm).toBe(14);
  });
  it("respects max height for tall designs", () => {
    const s = clampSize(28, 0.5, zone);
    expect(s.heightCm).toBe(34);
    expect(s.widthCm).toBe(17);
  });
  it("enforces minimum width", () => {
    const s = clampSize(1, 1, zone);
    expect(s.widthCm).toBe(4);
  });
});

describe("clampPosition", () => {
  it("pushes a design back inside the zone", () => {
    const p = clampPosition({ xCm: 0, yCm: 0, widthCm: 10, heightCm: 10, rotationDeg: 0 }, zone);
    expect(p.xCm).toBe(18);
    expect(p.yCm).toBe(21);
  });
  it("centers when the design is wider than the zone", () => {
    const p = clampPosition({ xCm: 5, yCm: 5, widthCm: 60, heightCm: 10, rotationDeg: 0 }, zone);
    expect(p.xCm).toBe(27);
  });
  it("accounts for rotation", () => {
    const t = { xCm: 13, yCm: 16, widthCm: 20, heightCm: 6, rotationDeg: 45 };
    const p = clampPosition(t, zone);
    const b = rotatedBounds({ ...t, ...p });
    expect(rectContains(zone.rectCm, b)).toBe(true);
  });
});

describe("constrainToZone", () => {
  it("shrinks rotated designs that cannot fit", () => {
    const t = constrainToZone({ xCm: 27, yCm: 33, widthCm: 28, heightCm: 28, rotationDeg: 45 }, zone);
    const b = rotatedBounds(t);
    expect(rectContains(zone.rectCm, b)).toBe(true);
    expect(t.widthCm).toBeLessThan(28);
  });
  it("normalizes rotation", () => {
    expect(normalizeDeg(370)).toBe(10);
    expect(normalizeDeg(-190)).toBe(170);
    expect(normalizeDeg(180)).toBe(180);
  });
});

describe("initialPlacement", () => {
  it("centers the design in the zone at 70% width", () => {
    const p = initialPlacement(zone, 1.5);
    expect(p.xCm).toBe(27);
    expect(p.yCm).toBe(33);
    expect(p.widthCm).toBeCloseTo(19.6, 1);
    expect(p.heightCm).toBeCloseTo(13.07, 1);
  });
});
