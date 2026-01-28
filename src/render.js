function renderStatus(state) {
  const status = document.getElementById('status');
  status.innerHTML = `
    <h2>Status</h2>
    <p><strong>Day:</strong> ${state.day}</p>
    <p><strong>Cash:</strong> $${(state.cashCents / 100).toFixed(2)}</p>
  `;
}

function renderInventory(state) {
  const inventory = document.getElementById('inventory');
  inventory.innerHTML = `
    <h2>Inventory</h2>

    <p>Coffee: ${state.inventory.coffee}</p>
    <label>
      Coffee Price (¢):
      <input id="price-coffee" type="number" value="${state.prices.coffee}">
    </label>

    <p>Bagels: ${state.inventory.bagel}</p>
    <label>
      Bagel Price (¢):
      <input id="price-bagel" type="number" value="${state.prices.bagel}">
    </label>
  `;
}

function renderLog(state) {
  const log = document.getElementById('log');
  log.innerHTML = `
    <h2>Log</h2>
    <ul>
      ${state.log.map((msg) => `<li>${msg}</li>`).join('')}
    </ul>
  `;
}

// This file updates the page using the state object.

export default function render(state) {
  renderStatus(state);
  renderInventory(state);
  renderLog(state);
}
