#!/usr/bin/env node
/**
 * Vizuális ellenőrzés: végiggörgeti az oldalt (scroll-reveal, lazy 3D), majd
 * teljes oldalas képernyőképet készít. A gépen telepített Chrome-ot használja.
 *
 *   node scripts/screenshot.mjs <url> <out.png> [--mobile] [--wait=6000]
 *   node scripts/screenshot.mjs http://localhost:3000/concepts/01-premium-minimal/ shots/01.png
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const [url, out, ...flags] = process.argv.slice(2);
if (!url || !out) {
  console.error("Használat: node scripts/screenshot.mjs <url> <out.png> [--mobile] [--wait=ms]");
  process.exit(1);
}
const mobile = flags.includes("--mobile");
const waitFlag = flags.find((f) => f.startsWith("--wait="));
const wait = waitFlag ? Number(waitFlag.split("=")[1]) : 6000;

const browser = await chromium.launch({ channel: "chrome", headless: true, args: ["--enable-unsafe-swiftshader"] });
const context = await browser.newContext({
  viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  isMobile: mobile,
  hasTouch: mobile,
  locale: "hu-HU",
});
const page = await context.newPage();
await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(wait);

// lassú végiggörgetés: IntersectionObserver alapú reveal-ek és lazy elemek aktiválása
await page.evaluate(async () => {
  const step = Math.max(300, Math.floor(window.innerHeight * 0.6));
  const total = document.documentElement.scrollHeight;
  for (let y = 0; y < total; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 140));
  }
  window.scrollTo(0, total);
  await new Promise((r) => setTimeout(r, 600));
  window.scrollTo(0, 0);
  await new Promise((r) => setTimeout(r, 400));
});
await page.waitForTimeout(1200);

const target = resolve(out);
mkdirSync(dirname(target), { recursive: true });
await page.screenshot({ path: target, fullPage: true });
console.log(`OK ${target}`);
await browser.close();
