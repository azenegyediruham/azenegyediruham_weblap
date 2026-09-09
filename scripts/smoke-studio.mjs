import { chromium } from "playwright";

/** Studio smoke-teszt: termék -> szín -> minta -> drag -> hátsó nézet -> 3D -> kosár. Használat: node scripts/smoke-studio.mjs [outDir] */

const OUT = process.argv[2] ?? "./.smoke";
import { mkdirSync } from "node:fs";
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true, args: ["--enable-unsafe-swiftshader"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
page.on("console", (m) => {
  if (m.type() === "error") errors.push("console: " + m.text());
});

await page.goto("http://localhost:3000/studio/", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
await page.screenshot({ path: `${OUT}/studio-1.png` });

// 1) termék választása (Classic póló)
await page.getByRole("button", { name: /Classic póló/ }).first().click();
await page.waitForTimeout(600);
await page.screenshot({ path: `${OUT}/studio-2.png` });

// 2) szín: Tengerészkék, tovább
await page.getByRole("radio", { name: "Tengerészkék" }).click();
await page.getByRole("button", { name: /Tovább a mintához/ }).click();
await page.waitForTimeout(800);

// 3) minta a könyvtárból
await page.getByRole("button", { name: /Nap és hullám hozzáadása/ }).click();
await page.waitForTimeout(1200);
const sizeText = await page.locator("text=/cm/").allTextContents();
await page.screenshot({ path: `${OUT}/studio-3.png` });

// drag a designon: a kijelölt g elem közepéről 120px jobbra-lefelé
const g = page.locator('svg[role="application"] g[role="img"]').first();
const box = await g.boundingBox();
if (box) {
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  await page.mouse.move(cx + 60, cy + 40, { steps: 8 });
  await page.mouse.move(cx + 400, cy + 400, { steps: 8 }); // messze: clamp
  await page.mouse.up();
  await page.waitForTimeout(400);
}
const after = await g.getAttribute("transform");
await page.screenshot({ path: `${OUT}/studio-3b.png` });

// hátsó nézet + második minta
await page.getByRole("button", { name: "Hátul", exact: true }).click();
await page.waitForTimeout(300);
await page.getByRole("button", { name: /Hegyvonulat hozzáadása/ }).click();
await page.waitForTimeout(1000);
await page.screenshot({ path: `${OUT}/studio-3c.png` });

// 4) 3D
await page.getByRole("button", { name: /3D előnézet →/ }).click();
await page.waitForTimeout(6000);
await page.screenshot({ path: `${OUT}/studio-4.png` });

// 5) összegzés + kosár
await page.getByRole("button", { name: /Mentés és kosár →/ }).click();
await page.waitForTimeout(600);
await page.getByRole("button", { name: /Kosárba/ }).click();
await page.waitForTimeout(600);
await page.screenshot({ path: `${OUT}/studio-5.png` });
const cartBadge = await page.locator("header").getByText(/Kosár/).first().textContent();

console.log(JSON.stringify({ transformAfterDrag: after, cartBadge, sizeTexts: sizeText.slice(0, 5), errors: errors.slice(0, 10) }, null, 2));
await browser.close();
