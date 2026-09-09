import { describe, expect, it } from "vitest";
import { asset } from "./asset-url";

describe("asset()", () => {
  it("adds a leading slash and keeps relative paths", () => {
    expect(asset("models/tshirt.glb")).toBe("/models/tshirt.glb");
    expect(asset("/models/tshirt.glb")).toBe("/models/tshirt.glb");
  });
  it("leaves absolute, data and blob URLs untouched", () => {
    expect(asset("https://x.test/a.png")).toBe("https://x.test/a.png");
    expect(asset("//cdn.test/a.png")).toBe("//cdn.test/a.png");
    expect(asset("data:image/png;base64,AAA")).toBe("data:image/png;base64,AAA");
    expect(asset("blob:http://localhost/abc")).toBe("blob:http://localhost/abc");
  });
});
