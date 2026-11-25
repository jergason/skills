// Seed data. Varied on purpose: every status, big and small amounts, a long
// period label, and amounts with and without cents.
export const invoices = [
  { id: "INV-1042", period: "October 2026", due: "Oct 31", amount: 1200, status: "open" },
  { id: "INV-1031", period: "September 2026", due: "Oct 3", amount: 12400, status: "overdue" },
  { id: "INV-1019", period: "August 2026", due: "Aug 31", amount: 89.5, status: "paid" },
  { id: "INV-1007", period: "July 2026", due: "Jul 31", amount: 1180.25, status: "paid" },
  { id: "INV-0998", period: "June 2026 (prorated after a mid-cycle seat increase)", due: "Jun 30", amount: 412, status: "void" },
];

export const plan = { seats: 24, nextInvoice: "Nov 1", currency: "USD" };
