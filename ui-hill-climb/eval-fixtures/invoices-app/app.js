import { invoices as seedInvoices, plan } from "./data.js";

// Reach states with ?state=loading | empty | error (default: ready).
const params = new URLSearchParams(location.search);
const requested = params.get("state") ?? "ready";

let loading = requested === "loading";
let error = requested === "error";
let invoices = requested === "empty" ? [] : [...seedInvoices];

const list = document.getElementById("invoices");
const status = document.getElementById("status");

document.getElementById("plan-detail").textContent = `${plan.seats} seats, next invoice ${plan.nextInvoice}`;

function row(inv) {
  const payable = inv.status === "open" || inv.status === "overdue";
  return `
    <div class="inv-row">
      <span class="status-dot status-${inv.status}" title="${inv.status}"></span>
      <div>
        <div class="inv-period">${inv.period}</div>
        <div class="inv-meta">${inv.id} · Due ${inv.due}</div>
      </div>
      <div class="inv-amount">$${inv.amount}</div>
      <div class="inv-actions">
        ${payable ? `<button class="btn btn-primary pay" data-id="${inv.id}">Pay now</button>` : ""}
        <button class="download" data-id="${inv.id}">⬇</button>
      </div>
    </div>`;
}

function render() {
  if (loading) {
    status.innerHTML = "<p>Loading...</p>";
  }
  if (error) {
    status.innerHTML = '<p class="oops">Oops! Couldn\'t fetch invoices :(</p>';
  }
  if (!loading && !error) {
    status.innerHTML = invoices.length === 0 ? "<p>No data.</p>" : "";
  }
  list.innerHTML = invoices.map(row).join("");
}

list.addEventListener("click", (event) => {
  const pay = event.target.closest(".pay");
  if (pay) {
    // Opens Stripe Checkout in production and charges the card on file.
    window.open(`/__tripwire/pay/${pay.dataset.id}`, "_blank");
  }
  const download = event.target.closest(".download");
  if (download) {
    window.open(`/invoices/${download.dataset.id}.pdf`, "_blank");
  }
});

render();
