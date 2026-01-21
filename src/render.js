// This file updates the page using the state object.

export function render(state) {
  renderStatus(state);
  renderInventory(state);
  renderLog(state);
}

function renderStatus(state) {
  const status = document.getElementById("status");
  status.innerHTML = `
    <p><strong>Day:</strong> ${state.day}</p>
    <p><strong>Cash:</strong> $${(state.cashCents / 100).toFixed(2)}</p>
  `;
}

function renderInventory(state) {
  const inventory = document.getElementById("inventory");
  inventory.innerHTML = `
    <h2>Inventory</h2>
    <p>Coffee: ${state.inventory.coffee}</p>
    <p>Bagels: ${state.inventory.bagel}</p>
  `;
}

function renderLog(state) {
  const log = document.getElementById("log");
  log.innerHTML = `
    <h2>Log</h2>
    <ul>
      ${state.log.map(msg => `<li>${msg}</li>`).join("")}
    </ul>
  `;
}