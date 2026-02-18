import { PRODUCTS } from './products.js';

export default function simulateDay(state, event = null) {
  let revenue = 0;

  // --- Day-level randomness ooo scary ---
  const dayRoll = Math.random();
  let dayDemandMultiplier = 1;

  if (dayRoll < 0.1) {
    dayDemandMultiplier = 0.7; // 30% lower demand to know
    state.log.push('Very Terrible day — almost no one came by due to unforeseen circumstances (demand about 30% lower than usual).');
  } else if (dayRoll < 0.3) {
    dayDemandMultiplier = 0.85; // 15% lower demand to know
    state.log.push('So So day — fewer customers than usual  (demand about 15% lower).');
  } else if (dayRoll < 0.85) {
    dayDemandMultiplier = 1.0;
    state.log.push('Nice day — customer traffic was about average but better than some days.');
  } else {
    dayDemandMultiplier = 1.25; // 25% higher demand to know
    state.log.push('Great day — lunch rush was huge and everyone was excited (demand about 25% higher than usual).');
  }

  let effectiveCleanliness = state.cleanliness;
  if (event?.cleanlinessDelta) {
    effectiveCleanliness += event.cleanlinessDelta;
  }

  const updatedInventory = { ...state.inventory };
  const soldByItem = {};

  let cleanlinessMultiplier = 1;
  if (effectiveCleanliness < 40) {
    cleanlinessMultiplier = 0.5;
  } else if (effectiveCleanliness > 70) {
    cleanlinessMultiplier = 1.5;
  }

  const promoMultiplier = state.promoDaysLeft > 0 ? 1.5 : 1;

  PRODUCTS.forEach((product) => {
    const { id } = product;

    let dailySales = product.baseDemand;

    // Apply day-level randomness once for all products
    dailySales *= dayDemandMultiplier;

    // Apply cleanliness and promo effects
    dailySales *= cleanlinessMultiplier;
    dailySales *= promoMultiplier;

    // multiplier
    if (event?.demandMultiplier) {
      dailySales *= event.demandMultiplier;
    }

    dailySales = Math.round(dailySales);

    if (event?.disabledProducts && event.disabledProducts.includes(id)) {
      dailySales = 0;
    }

    const available = updatedInventory[id] ?? 0;
    dailySales = Math.max(0, Math.min(dailySales, available));

    updatedInventory[id] = available - dailySales;

    const priceCents = state.prices[id] ?? 0;
    revenue += dailySales * priceCents;

    soldByItem[id] = dailySales;
  });

  if (event?.stealQuantity) {
    const candidates = PRODUCTS.filter((product) => (updatedInventory[product.id] ?? 0) > 0);
    if (candidates.length > 0) {
      for (let i = 0; i < event.stealQuantity; i += 1) {
        const availableCandidates = PRODUCTS.filter((product) => (updatedInventory[product.id] ?? 0) > 0);
        if (availableCandidates.length === 0) break;
        const randomIndex = Math.floor(Math.random() * availableCandidates.length);
        const stolenId = availableCandidates[randomIndex].id;
        updatedInventory[stolenId] -= 1;
      }
    }
  }

  const updatedCashCents = state.cashCents + revenue;

  const updatedLastReport = {
    soldByItem,
    revenue,
  };

  let updatedPromoDaysLeft = state.promoDaysLeft;
  if (updatedPromoDaysLeft > 0) {
    updatedPromoDaysLeft -= 1;
  }

  return {
    ...state,
    cashCents: updatedCashCents,
    promoDaysLeft: updatedPromoDaysLeft,
    inventory: {
      ...state.inventory,
      ...updatedInventory,
    },
    lastReport: updatedLastReport,
  };
}
