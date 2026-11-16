// Per-customer settings. Admins set these per workspace, so copy must never
// hardcode them. The product default for accessDurationDays is 90, but this
// workspace uses 30.
export const orgConfig = {
  accessDurationDays: 30,
  allowChanges: true,
};
