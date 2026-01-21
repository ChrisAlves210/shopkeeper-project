// This file updates state based on actions.

export function update(state, action) {
  // Make a copy so we don’t change the original
  const newState = structuredClone(state);

  if (action.type === "NEXT_DAY") {
    newState.day += 1;
    newState.log.push("A new day begins.");
  }

  if (action.type === "CLEAN") {
    newState.cleanliness += 10;
    if (newState.cleanliness > 100) {
      newState.cleanliness = 100;
    }
    newState.log.push("You cleaned the shop.");
  }

  if (action.type === "SET_PRICE") {
    const { item, price } = action;
    newState.prices[item] = price;
  }

  return newState;
}