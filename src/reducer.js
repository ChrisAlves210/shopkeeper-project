// This file updates state based on actions.
import simulateDay from './economy.js';
import randomEvent from './events.js';
import { clampNumber, todayWholesale } from "./utils.js";
import { PRODUCTS } from "./products.js";

export default function update(state, action) {
  const newState = structuredClone(state);

  if (action.type === 'OPEN_SHOP') {
    // Apply any deliveries that arrive today before selling
    const remainingOrders = [];
    for (const order of newState.incomingOrders ?? []) {
      if (order.dayArrives === newState.day) {
        const current = newState.inventory[order.itemId] ?? 0;
        newState.inventory[order.itemId] = current + order.qty;
        newState.log.push(`Delivery arrived: +${order.qty} ${order.itemId}`);
      } else {
        remainingOrders.push(order);
      }
    }
    newState.incomingOrders = remainingOrders;

    // Apply simple daily spoilage for perishable items (like bagels)
    for (const product of PRODUCTS) {
      if (!product.spoilPerDay) continue;
      const id = product.id;
      const current = newState.inventory[id] ?? 0;
      if (current <= 0) continue;
      const spoiled = Math.min(product.spoilPerDay, current);
      if (spoiled > 0) {
        newState.inventory[id] = current - spoiled;
        newState.log.push(`${product.name}s spoiled: -${spoiled}`);
      }
    }

    const event = randomEvent();
    if (event) {
      newState.log.push(event.description);
    }

    const updatedState = simulateDay(newState, event);
    const rentCents = 200;
    Object.assign(newState, updatedState);
    newState.cashCents -= rentCents;
    newState.log.push(`Paid rent: $${(rentCents / 100).toFixed(2)}.`);
    newState.day += 1;
    // Roll a new wholesale market multiplier for the new day
    const min = 0.9;
    const max = 1.2;
    const roll = min + Math.random() * (max - min);
    newState.marketMultiplier = roll;
    if (roll < 1.0) {
      newState.log.push('Wholesale market is cheap today.');
    } else if (roll > 1.0) {
      newState.log.push('Wholesale market is expensive today.');
    } else {
      newState.log.push('Wholesale market is normal today.');
    }
    newState.log.push('You opened the shop.');
    newState.orderedToday = false;
  }
  if (action.type === 'NEXT_DAY') {
    newState.day += 1;
    const min = 0.9;
    const max = 1.2;
    const roll = min + Math.random() * (max - min);
    newState.marketMultiplier = roll;
    if (roll < 1.0) {
      newState.log.push('Wholesale market is cheap today.');
    } else if (roll > 1.0) {
      newState.log.push('Wholesale market is expensive today.');
    } else {
      newState.log.push('Wholesale market is normal today.');
    }
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
    let qty = clampNumber(action.qty, 1, 20);
    
    if (newState.orderedToday) {
      newState.log.push("You already placed an order today.");
      return newState;
    }

    const product = PRODUCTS.find(p => p.id === item);

    if (!product) {
      newState.log.push("Invalid item.");
      return newState;
    }

    // Enforce storage limits per product
    const current = newState.inventory[item] ?? 0;
    const limit = product.maxStock ?? Infinity;
    if (current + qty > limit) {
      qty = limit - current;
    }

    if (qty <= 0) {
      newState.log.push("Storage full for this item.");
      return newState;
    }

    const costPerItem = todayWholesale(product, newState);
    const totalCost = costPerItem * qty;

    if (newState.cashCents < totalCost) {
      newState.log.push("Not enough cash to place that order.");
      return newState;
    }

    newState.cashCents -= totalCost;
    // Record an incoming order that will arrive the next day
    const orderRecord = {
      dayArrives: newState.day + 1,
      itemId: item,
      qty,
    };
    if (!newState.incomingOrders) newState.incomingOrders = [];
    newState.incomingOrders.push(orderRecord);
    newState.orderedToday = true;

    newState.log.push(`Order placed: ${qty} ${item}(s) for $${(totalCost / 100).toFixed(2)}. Delivery arrives tomorrow.`);
  }

  if (newState.cashCents < 0) {
    newState.gameOver = true;
    newState.log.push("You went bankrupt. Game over.");
  }

  if (newState.day > 10 && newState.cashCents >= 6000) {
    newState.gameOver = true;
    newState.log.push("You ran a successful shop! You win!");
  }

  return newState;
}
