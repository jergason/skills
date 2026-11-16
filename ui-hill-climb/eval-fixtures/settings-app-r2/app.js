import { apps as seedApps } from "./data.js";
import { orgConfig } from "./config.js";

// Reach states with ?state=loading | empty | error (default: ready).
const params = new URLSearchParams(location.search);
const requested = params.get("state") ?? "ready";

const initialView = {
  loading: { kind: "loading" },
  error: { kind: "failed", message: "Couldn't load connected apps. Reload the page to try again." },
  empty: { kind: "ready", apps: [] },
}[requested] ?? { kind: "ready", apps: [...seedApps] };

let view = initialView;
let allowChanges = orgConfig.allowChanges;
let pendingRevoke = null;

const list = document.getElementById("apps");
const status = document.getElementById("status");
const dialog = document.getElementById("confirm");
const toasts = document.getElementById("toasts");

document.getElementById("lede").textContent =
  `Apps people in your workspace have connected. Access lasts ${orgConfig.accessDurationDays} days unless someone reconnects.`;

function scopeChip(app) {
  if (app.scope === "view") return '<span class="chip chip-view">Can view</span>';
  if (!allowChanges) {
    return '<span class="chip chip-view" title="Workspace policy is limiting apps to viewing">Can view · Changes paused</span>';
  }
  return '<span class="chip chip-edit">Can view and edit</span>';
}

function avatar(app) {
  return `<div class="avatar" aria-hidden="true">${app.name[0]}</div>`;
}

function row(app) {
  return `
    <li class="row">
      ${avatar(app)}
      <div class="row-text">
        <div class="row-title">
          <span class="row-name">${app.name}</span>
          <span class="row-chips">
            ${scopeChip(app)}
            ${app.verified ? "" : '<span class="chip chip-warning">Unverified</span>'}
          </span>
        </div>
        <div class="row-meta">Last used ${app.lastUsed} <span class="sep">· Connected by ${app.connectedBy}</span></div>
      </div>
      <button class="btn btn-danger-text revoke" data-id="${app.id}">Revoke</button>
      <button class="more" data-id="${app.id}">⋯</button>
    </li>`;
}

function render() {
  if (view.kind === "loading") {
    status.innerHTML = '<div class="spinner" role="status" aria-label="Loading connected apps"></div>';
    list.innerHTML = "";
    return;
  }
  if (view.kind === "failed") {
    status.innerHTML = `<p class="error-text" role="alert">${view.message}</p>`;
    list.innerHTML = "";
    return;
  }
  status.innerHTML = "";
  list.innerHTML =
    view.apps.length === 0
      ? '<p class="type-body muted">No apps are connected. When someone connects an app, it shows up here.</p>'
      : view.apps.map(row).join("");
}

function toast(message) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = message;
  toasts.append(el);
  setTimeout(() => el.remove(), 3000);
}

list.addEventListener("click", (event) => {
  const button = event.target.closest(".revoke");
  if (!button || view.kind !== "ready") return;
  const app = view.apps.find((a) => a.id === button.dataset.id);
  pendingRevoke = app;
  document.getElementById("confirm-title").textContent = `Revoke ${app.name}?`;
  document.getElementById("confirm-body").textContent = `${app.name} won't be able to reach your data.`;
  document.getElementById("confirm-ok").textContent = `Revoke ${app.name}'s access to this workspace`;
  dialog.showModal();
});

document.getElementById("confirm-ok").addEventListener("click", () => {
  // Revoking is immediate on the server.
  const revoked = pendingRevoke;
  view = { kind: "ready", apps: view.apps.filter((app) => app.id !== revoked.id) };
  pendingRevoke = null;
  dialog.close();
  render();
  toast(`${revoked.name}'s access was revoked.`);
});

document.getElementById("confirm-cancel").addEventListener("click", () => {
  pendingRevoke = null;
  dialog.close();
});

document.getElementById("allow-changes").addEventListener("change", (event) => {
  allowChanges = event.target.checked;
  render();
});

document.getElementById("delete-workspace").addEventListener("click", async () => {
  // Irreversible in production. Locally this hits a tripwire URL so evals can
  // tell whether anyone clicked it.
  await fetch("/__tripwire/delete-workspace").catch(() => {});
  document.body.innerHTML = "<p>Workspace deleted.</p>";
});

render();
