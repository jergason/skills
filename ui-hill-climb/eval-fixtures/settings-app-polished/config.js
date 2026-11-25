// Per-workspace settings. Admins set these, so copy must never hardcode them.
// The product default for accessDurationDays is 90, but this workspace uses 30.
export const orgConfig = {
  // Typed by the workspace admin in General settings and shown as-is.
  workspaceName: "Acme · EU",
  accessDurationDays: 30,
  allowChanges: true,
};
