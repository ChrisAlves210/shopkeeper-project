// This file updates state based on actions.
import simulateDay from './economy.js';
import randomEvent from './events.js';
import { clampNumber } from "./utils.js";

export default function update(state, action) {
  const newState = structuredClone(state);

  if (action.type === 'OPEN_SHOP') {
    const event = randomEvent(newState);
    const updatedState = simulateDay(newState, event);
    const rentCents = 200;
    newState.cashCents -= rentCents;
    newState.log.push(`Paid rent: $${(rentCents / 100).toFixed(2)}.`);
    Object.assign(newState, updatedState);
    newState.day += 1;
    newState.log.push('You opened the shop.');
    newState.orderedToday = false;
  }
  if (action.type === 'NEXT_DAY') {
    newState.day += 1;
    newState.log.push('A new day begins.');
  }

  if (action.type === 'CLEAN') {
    newState.cleanliness += 10;
    if (newState.cleanliness > 100) {
      newState.cleanliness = 100;
    }
    newState.log.push('You cleaned the shop.');
  }

  if (action.type === 'PROMO') {
    if (newState.cashCents >= 300) {
      newState.cashCents -= 300;
      newState.promoDaysLeft = 2;
      newState.log.push('You ran a promotion.');
    } else {
      newState.log.push('Not enough cash to run a promotion.');
    }
  }

  if (action.type === 'SET_PRICE') {
    const { item, price } = action;
    newState.prices[item] = price;
  }

  if (action.type === "ORDER_STOCK") {
    const item = action.item;
    const qty = clampNumber(action.qty, 1, 20);

  if (newState.orderedToday) {
    newState.log.push("You already placed an order today.");
    return newState;
  }

    const costPerItem =
    item === "coffee" ? 150 :
    item === "bagel" ? 100 :
    null;

  if (costPerItem === null) {
    newState.log.push("Invalid item.");
    return newState;
  }

    const totalCost = costPerItem * qty;

  if (newState.cashCents < totalCost) {
    newState.log.push("Not enough cash to place that order.");
    return newState;
  }

    newState.cashCents -= totalCost;
    newState.inventory[item] += qty;
    newState.orderedToday = true;

    newState.log.push(`Ordered ${qty} ${item}(s) for $${(totalCost / 100).toFixed(2)}.`);
}

  return newState;
}
