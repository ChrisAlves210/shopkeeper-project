export function clampNumber(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

// Compute today's wholesale price for a product based on the
// current market multiplier stored in state.
export function todayWholesale(product, state) {
  const raw = product.wholesaleCents * (state.marketMultiplier ?? 1.0);
  return Math.round(raw);
}