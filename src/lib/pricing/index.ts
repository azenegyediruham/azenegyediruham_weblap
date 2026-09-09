/**
 * Árképzés – cserélhető stratégia. Az MVP-ben mock szabályok (site_settings.pricing),
 * később Supabase-ből töltött szabálykészlet vagy szerveroldali kalkuláció.
 *
 * Támogatott tényezők: alapruha ára, hímzés alapdíja, hímzés mérete (cm²),
 * színek száma, öltésszám (becsült), extra pozíciók, darabszám-sávok, sürgősségi felár.
 */
export interface PricingRules {
  embroideryBaseHuf: number;
  embroideryPerCm2Huf: number;
  includedColors: number;
  extraColorHuf: number;
  extraPositionHuf: number;
  rushSurchargePercent: number;
  quantityTiers: { minQty: number; discountPercent: number }[];
  /** becsült öltés/cm² (digitizálás előtt) */
  stitchesPerCm2: number;
}

export const DEFAULT_PRICING_RULES: PricingRules = {
  embroideryBaseHuf: 1490,
  embroideryPerCm2Huf: 38,
  includedColors: 3,
  extraColorHuf: 250,
  extraPositionHuf: 990,
  rushSurchargePercent: 25,
  quantityTiers: [
    { minQty: 10, discountPercent: 10 },
    { minQty: 25, discountPercent: 15 },
    { minQty: 50, discountPercent: 20 },
  ],
  stitchesPerCm2: 110,
};

export interface EmbroideryItemInput {
  widthCm: number;
  heightCm: number;
  colorCount?: number;
}

export interface QuoteInput {
  garmentPriceHuf: number;
  items: EmbroideryItemInput[];
  quantity: number;
  rush?: boolean;
}

export interface QuoteLine {
  label: string;
  amountHuf: number;
}

export interface Quote {
  unitGarmentHuf: number;
  unitEmbroideryHuf: number;
  unitTotalHuf: number;
  quantity: number;
  discountPercent: number;
  discountHuf: number;
  rushHuf: number;
  totalHuf: number;
  estimatedStitches: number;
  lines: QuoteLine[];
}

export interface PricingStrategy {
  quote(input: QuoteInput): Quote;
}

export class RuleBasedPricing implements PricingStrategy {
  constructor(private readonly rules: PricingRules = DEFAULT_PRICING_RULES) {}

  quote(input: QuoteInput): Quote {
    const r = this.rules;
    const qty = Math.max(1, Math.floor(input.quantity));
    const lines: QuoteLine[] = [{ label: "Alapruha", amountHuf: input.garmentPriceHuf }];
    let embroidery = 0;
    let stitches = 0;

    input.items.forEach((item, i) => {
      const area = Math.max(0, item.widthCm) * Math.max(0, item.heightCm);
      const colors = Math.max(1, item.colorCount ?? 1);
      const extraColors = Math.max(0, colors - r.includedColors);
      const itemCost = r.embroideryBaseHuf + Math.round(area * r.embroideryPerCm2Huf) + extraColors * r.extraColorHuf + (i > 0 ? r.extraPositionHuf : 0);
      embroidery += itemCost;
      stitches += Math.round(area * r.stitchesPerCm2);
      lines.push({ label: `Hímzés ${i + 1} (${item.widthCm.toFixed(1)} × ${item.heightCm.toFixed(1)} cm)`, amountHuf: itemCost });
    });

    const unitTotal = input.garmentPriceHuf + embroidery;
    const tier = [...r.quantityTiers].sort((a, b) => b.minQty - a.minQty).find((t) => qty >= t.minQty);
    const discountPercent = tier?.discountPercent ?? 0;
    const gross = unitTotal * qty;
    const discountHuf = Math.round((gross * discountPercent) / 100);
    const rushHuf = input.rush ? Math.round(((gross - discountHuf) * r.rushSurchargePercent) / 100) : 0;
    if (discountHuf) lines.push({ label: `Mennyiségi kedvezmény (${discountPercent}%)`, amountHuf: -discountHuf });
    if (rushHuf) lines.push({ label: `Sürgősségi felár (${r.rushSurchargePercent}%)`, amountHuf: rushHuf });

    return {
      unitGarmentHuf: input.garmentPriceHuf,
      unitEmbroideryHuf: embroidery,
      unitTotalHuf: unitTotal,
      quantity: qty,
      discountPercent,
      discountHuf,
      rushHuf,
      totalHuf: gross - discountHuf + rushHuf,
      estimatedStitches: stitches,
      lines,
    };
  }
}

let active: PricingStrategy = new RuleBasedPricing();

export function setPricingStrategy(strategy: PricingStrategy) {
  active = strategy;
}

export function getPricing(): PricingStrategy {
  return active;
}

export function pricingFromSettings(value: unknown): RuleBasedPricing {
  if (!value || typeof value !== "object") return new RuleBasedPricing();
  const v = value as Partial<PricingRules>;
  return new RuleBasedPricing({ ...DEFAULT_PRICING_RULES, ...v });
}
