export default function simulateDay(state) {
  let revenue = 0;

  // Coffee sales
  let coffeeSold = 0;
  if (state.prices.coffee <= 350) {
    coffeeSold = Math.min(3, state.inventory.coffee);
  } else {
    coffeeSold = Math.min(1, state.inventory.coffee);
  }

  const updatedInventoryCoffee = state.inventory.coffee - coffeeSold;
  const updatedRevenueFromCoffee = coffeeSold * state.prices.coffee;

  // Bagel sales
  let bagelSold = 0;
  if (state.prices.bagel <= 300) {
    bagelSold = Math.min(2, state.inventory.bagel);
  } else {
    bagelSold = Math.min(1, state.inventory.bagel);
  }

  const updatedInventoryBagel = state.inventory.bagel - bagelSold;
  const updatedRevenueFromBagel = bagelSold * state.prices.bagel;

  revenue += updatedRevenueFromCoffee + updatedRevenueFromBagel;

  const updatedCashCents = state.cashCents + revenue;

  const updatedLastReport = {
    coffeeSold,
    bagelSold,
    revenue,
  };

  // Return a new state object instead of mutating the parameter
  return {
    ...state,
    cashCents: updatedCashCents,
    inventory: {
      ...state.inventory,
      coffee: updatedInventoryCoffee,
      bagel: updatedInventoryBagel,
    },
    lastReport: updatedLastReport,
  };
}
