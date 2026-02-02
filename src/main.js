import makeInitialState from './state.js';
import render from './render.js';
import update from './reducer.js';

let state = makeInitialState();
render(state);

function dispatch(action) {
  state = update(state, action);
  render(state);
}

document.getElementById('next-day').addEventListener('click', () => {
  dispatch({ type: 'NEXT_DAY' });
});

document.getElementById('clean').addEventListener('click', () => {
  dispatch({ type: 'CLEAN' });
});

const inventoryEl = document.getElementById('inventory');

inventoryEl.addEventListener('change', (e) => {
  if (e.target.id === 'price-coffee') {
    dispatch({
      type: 'SET_PRICE',
      item: 'coffee',
      price: Number(e.target.value),
    });
  }

  if (e.target.id === 'price-bagel') {
    dispatch({
      type: 'SET_PRICE',
      item: 'bagel',
      price: Number(e.target.value),
    });
  }
});

document.getElementById('open-shop').addEventListener('click', () => {
  dispatch({ type: 'OPEN_SHOP' });
});

document.getElementById('promo').addEventListener('click', () => {
  dispatch({ type: 'PROMO' });
});

document.getElementById("order-button").addEventListener("click", () => {
  const item = document.getElementById("order-item").value;
  const qty = Number(document.getElementById("order-qty").value);

  dispatch({
    type: "ORDER_STOCK",
    item,
    qty
  });
});