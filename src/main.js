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