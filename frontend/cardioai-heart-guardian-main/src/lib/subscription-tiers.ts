export const TIERS = {
  professional: {
    name: "Clinical Professional",
    price_id: "price_1TDUHxBsK5P7sC8ijxS5HGav",
    product_id: "prod_UBs2fI0nNkg7hw",
    price: 49,
  },
  institution: {
    name: "Healthcare Institution",
    price_id: "price_1TDUIEBsK5P7sC8isgRL2Rmr",
    product_id: "prod_UBs2beVqvM2jXT",
    price: 199,
  },
} as const;

export type TierKey = keyof typeof TIERS;

export function getTierByProductId(productId: string | null): TierKey | null {
  if (!productId) return null;
  for (const [key, tier] of Object.entries(TIERS)) {
    if (tier.product_id === productId) return key as TierKey;
  }
  return null;
}
