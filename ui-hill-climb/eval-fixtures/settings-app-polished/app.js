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
const unverifiedNote = document.getElementById("unverified-note");
const toggle = document.getElementById("allow-changes");
const dialog = document.getElementById("confirm");
const toasts = document.getElementById("toasts");

// App names come from third parties, so never put them into markup unescaped.
const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);

const days = orgConfig.accessDurationDays;
document.getElementById("workspace-name").textContent = orgConfig.workspaceName;
document.getElementById("lede").textContent =
  `These are the apps people in your workspace have connected. Each one keeps access for ${days} ${days === 1 ? "day" : "days"}. After that, someone has to connect it again.`;
toggle.checked = allowChanges;

function chips(app) {
  const canEdit = app.scope === "edit" && allowChanges;
  const scope = canEdit
    ? '<span class="chip chip-edit">Can view and edit</span>'
    : '<span class="chip chip-view">Can view</span>';
  const paused = app.scope === "edit" && !allowChanges ? '<span class="chip">Editing paused</span>' : "";
  const unverified = app.verified ? "" : '<span class="chip chip-warning">Unverified</span>';
  return `<span class="row-chips">${scope}${paused}${unverified}</span>`;
}

function row(app) {
  const name = escapeHtml(app.name);
  return `
    <li class="row">
      <div class="avatar" aria-hidden="true">${escapeHtml(app.name[0].toUpperCase())}</div>
      <div class="row-text">
        <div class="row-title">
          <span class="row-name">${name}</span>
          ${chips(app)}
        </div>
        <div class="row-meta">
          <span>Last used ${escapeHtml(app.lastUsed)}</span>
          <span>Connected by ${escapeHtml(app.connectedBy)}</span>
        </div>
      </div>
      <button class="btn btn-danger-text revoke" data-id="${escapeHtml(app.id)}" aria-label="Revoke ${name}">Revoke</button>
    </li>`;
}

function render() {
  unverifiedNote.hidden = !(view.kind === "ready" && view.apps.some((app) => !app.verified));
  if (view.kind === "loading") {
    status.innerHTML = '<div class="spinner" aria-hidden="true"></div><span class="visually-hidden">Loading connected apps</span>';
    list.innerHTML = "";
    return;
  }
  if (view.kind === "failed") {
    status.innerHTML = `<p class="error-text">${escapeHtml(view.message)}</p>`;
    list.innerHTML = "";
    return;
  }
  status.innerHTML =
    view.apps.length === 0
      ? '<p class="type-body muted empty" id="empty-note" tabindex="-1">No apps are connected. When someone connects an app, it shows up here.</p>'
      : "";
  list.innerHTML = view.apps.map(row).join("");
}

function toast(message) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = message;
  toasts.append(el);
  setTimeout(() => el.remove(), 4000);
}

list.addEventListener("click", (event) => {
  const button = event.target.closest(".revoke");
  if (!button || view.kind !== "ready") return;
  pendingRevoke = view.apps.find((a) => a.id === button.dataset.id);
  document.getElementById("confirm-title").textContent = `Revoke ${pendingRevoke.name}?`;
  document.getElementById("confirm-lede").textContent = `${pendingRevoke.name} loses access right away.`;
  dialog.showModal();
});

document.getElementById("confirm-ok").addEventListener("click", () => {
  // Revoking is immediate on the server.
  const revoked = pendingRevoke;
  if (!revoked) return;
  const index = view.apps.findIndex((app) => app.id === revoked.id);
  view = { kind: "ready", apps: view.apps.filter((app) => app.id !== revoked.id) };
  pendingRevoke = null;
  dialog.close();
  render();
  // The row that held focus is gone: move focus to the next row's action, or to the empty state.
  const next = list.querySelectorAll(".revoke")[Math.min(index, view.apps.length - 1)];
  (next ?? document.getElementById("empty-note")).focus();
  toast(`Revoked access for ${revoked.name}.`);
});

document.getElementById("confirm-cancel").addEventListener("click", () => dialog.close());
dialog.addEventListener("close", () => {
  pendingRevoke = null;
});

toggle.addEventListener("change", (event) => {
  allowChanges = event.target.checked;
  render();
});

render();
