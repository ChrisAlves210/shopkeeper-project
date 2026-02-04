export default function simulateDay(state, event = null) {
  let revenue = 0;

  // Cleanliness modifier
  let cleanlinessModifier = 0;
  if (state.cleanliness < 40) {
    cleanlinessModifier = -1;
  } else if (state.cleanliness > 70) {
    cleanlinessModifier = 1;
  }

  // Coffee sales (demand)
  let coffeeSold = 0;
  if (state.prices.coffee <= 350) {
    coffeeSold = 3;
  } else {
    coffeeSold = 1;
  }

  // Bagel sales (demand)
  let bagelSold = 0;
  if (state.prices.bagel <= 300) {
    bagelSold = 2;
  } else {
    bagelSold = 1;
  }

  // Apply cleanliness, then clamp to [0, inventory]
  coffeeSold = Math.max(0, coffeeSold + cleanlinessModifier);
  coffeeSold = Math.min(coffeeSold, state.inventory.coffee);

  bagelSold = Math.max(0, bagelSold + cleanlinessModifier);
  bagelSold = Math.min(bagelSold, state.inventory.bagel);

  // Apply promotion bonus
  if (state.promoDaysLeft > 0) {
    coffeeSold += 1;
    bagelSold += 1;
  }

  // Apply event effects to demand
  if (event?.demandBoost) {
    coffeeSold += event.demandBoost;
    bagelSold += event.demandBoost;
  }

  if (event?.noBagels) {
    bagelSold = 0;
  }

   // Apply cleanliness boost event (helpful neighbor)
  let effectiveCleanliness = state.cleanliness;
  if (event?.cleanlinessBoost) {
    effectiveCleanliness += event.cleanlinessBoost;
  }

  // Clamp again after promo and events
  coffeeSold = Math.max(0, Math.min(coffeeSold, state.inventory.coffee));
  bagelSold = Math.max(0, Math.min(bagelSold, state.inventory.bagel));

  // Update inventory and revenue
  let updatedInventoryCoffee = state.inventory.coffee - coffeeSold;
  let updatedInventoryBagel = state.inventory.bagel - bagelSold;

  // Raccoon steals after sales
  if (event?.steal) {
    const stealCoffee = Math.random() < 0.5;
    if (stealCoffee && updatedInventoryCoffee > 0) {
      updatedInventoryCoffee -= 1;
    } else if (!stealCoffee && updatedInventoryBagel > 0) {
      updatedInventoryBagel -= 1;
    }
  }

  const updatedRevenueFromCoffee = coffeeSold * state.prices.coffee;
  const updatedRevenueFromBagel = bagelSold * state.prices.bagel;

  revenue += updatedRevenueFromCoffee + updatedRevenueFromBagel;

  const updatedCashCents = state.cashCents + revenue;

  const updatedLastReport = {
    soldByItem: {
      coffee: coffeeSold,
      bagel: bagelSold,
    },
    revenue,
  };

  // Decrement promo days left after a shop day
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
      coffee: updatedInventoryCoffee,
      bagel: updatedInventoryBagel,
    },
    lastReport: updatedLastReport,
  };
}
