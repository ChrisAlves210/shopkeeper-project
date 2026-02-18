import { PRODUCTS } from "./products.js";

function renderStatus(state) {
  const status = document.getElementById('status');
  status.innerHTML = `
    <h2>Status</h2>
    <p><strong>Day:</strong> ${state.day}</p>
    <p><strong>Cash:</strong> $${(state.cashCents / 100).toFixed(2)}</p>
    <p><strong>Cleanliness:</strong> ${state.cleanliness}</p>
    <p><strong>Promo days left:</strong> ${state.promoDaysLeft}</p>
    <p><strong>Incoming orders:</strong> ${(state.incomingOrders || []).length}</p>
    <p><strong>Market multiplier:</strong> ${state.marketMultiplier.toFixed ? state.marketMultiplier.toFixed(2) : state.marketMultiplier}</p>
  `;
}

function renderInventory(state) {
  const inventory = document.getElementById('inventory');
  const rows = PRODUCTS.map(p => `
    <div class="row">
      <p>${p.name}: ${state.inventory[p.id]}</p>

      <label>
        ${p.name} Price (¢):
        <input
          class="price-input"
          data-item="${p.id}"
          type="number"
          value="${state.prices[p.id]}"
        >
      </label>
    </div>
  `).join("");

  inventory.innerHTML = `
    <h2>Inventory</h2>
    ${rows}
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

function renderReport(state) {
  const report = document.getElementById("report");

  if (!state.lastReport) {
    report.innerHTML = `<h2>Report</h2><p>No report yet.</p>`;
    return;
  }
  
  const lines = PRODUCTS.map(p => {
    const sold = state.lastReport.soldByItem[p.id] ?? 0;
    return `<p>${p.name} sold: ${sold}</p>`;
  }).join("");

  report.innerHTML = `
    <h2>Report Day ${state.day}</h2>
    ${lines}
    <p>Revenue: $${(state.lastReport.revenue / 100).toFixed(2)}</p>
  `;
}

function renderOrderPanel(state) {
  const select = document.getElementById("order-item");
  if (!select) return;

  const previous = select.value;

  select.innerHTML = PRODUCTS.map(p =>
    `<option value="${p.id}">${p.name}</option>`
  ).join("");

  if (previous) select.value = previous;

   // Show today's wholesale prices for each product
  const pricesEl = document.getElementById("order-prices");
  if (pricesEl) {
    const rows = PRODUCTS.map(p => {
      const base = p.wholesaleCents;
      const current = Math.round(base * (state.marketMultiplier ?? 1.0));
      return `<li>${p.name}: ${current}¢ (base ${base}¢)</li>`;
    }).join("");

    pricesEl.innerHTML = `
      <h3>Today's wholesale prices</h3>
      <ul>${rows}</ul>
    `;
  }

  const orderBtn = document.getElementById("order-button");
  if (orderBtn) {
    orderBtn.disabled = !!state.orderedToday || !!state.gameOver;
  }
}

// This file updates the page using the state object.

export default function render(state) {
  renderStatus(state);
  renderInventory(state);
  renderLog(state);
  renderReport(state);
  renderOrderPanel(state);
}
