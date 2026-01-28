// This file updates state based on actions.
import simulateDay from './economy';

export default function update(state, action) {
  const newState = structuredClone(state);

  if (action.type === 'OPEN_SHOP') {
    const updatedState = simulateDay(newState);
    Object.assign(newState, updatedState);
    newState.day += 1;
    newState.log.push('You opened the shop.');
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

  if (action.type === 'SET_PRICE') {
    const { item, price } = action;
    newState.prices[item] = price;
  }

  return newState;
}
