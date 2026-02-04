import makeInitialState from './state.js';
import render from './render.js';
import update from './reducer.js';
import { saveState, loadState } from "../storage.js";

let state = makeInitialState();
render(state);

function dispatch(action) {
  state = update(state, action);
  render(state);
  if (state.gameOver) {
    disableControls();
  }
}

function disableControls() {
  document.querySelectorAll("button, input, select").forEach(el => {
    el.disabled = true;
  });
}

document.getElementById('next-day').addEventListener('click', () => {
  dispatch({ type: 'NEXT_DAY' });
});

document.getElementById('clean').addEventListener('click', () => {
  dispatch({ type: 'CLEAN' });
});

const inventoryEl = document.getElementById('inventory');

inventoryEl.addEventListener('change', (e) => {
  if (!e.target.classList.contains('price-input')) return;

  const item = e.target.dataset.item;
  const price = Number(e.target.value);

  dispatch({
    type: 'SET_PRICE',
    item,
    price,
  });
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

document.getElementById("save").addEventListener("click", () => {
  saveState(state);
  // log without dispatch: this is UI-only feedback
  state.log.push("Game saved.");
  render(state);
});

document.getElementById("load").addEventListener("click", () => {
  const loaded = loadState();
  if (!loaded) {
    state.log.push("No save found.");
    render(state);
    return;
  }
  state = loaded;
  state.log.push("Game loaded.");
  render(state);

  if (state.gameOver) disableControls();
});

document.getElementById("new-game").addEventListener("click", () => {
  // reset everything
  state = makeInitialState();
  render(state);
});