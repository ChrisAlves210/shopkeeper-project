import { makeInitialState } from "./state.js";
import { render } from "./render.js";
import { update } from "./reducer.js";

let state = makeInitialState();
render(state);

function dispatch(action) {
  state = update(state, action);
  render(state);
}

document.getElementById("next-day").addEventListener("click", () => {
  dispatch({ type: "NEXT_DAY" });
});

document.getElementById("clean").addEventListener("click", () => {
  dispatch({ type: "CLEAN" });
});

document.getElementById("price-coffee").addEventListener("change", e => {
  dispatch({
    type: "SET_PRICE",
    item: "coffee",
    price: Number(e.target.value)
  });
});

document.getElementById("price-bagel").addEventListener("change", e => {
  dispatch({
    type: "SET_PRICE",
    item: "bagel",
    price: Number(e.target.value)
  });
});