import fs from "node:fs";

const toCents = (amount) => Math.round(Number(amount) * 100);

const totalsByCustomer = (orders) =>
  orders.reduce(
    (totals, o) => ({ ...totals, [o.customer]: (totals[o.customer] ?? 0) + toCents(o.amount) }),
    {},
  );

const toCsv = (totals) =>
  [
    "customer,orders_total",
    ...Object.entries(totals)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([customer, cents]) => `${customer},${(cents / 100).toFixed(2)}`),
  ].join("\n") + "\n";

process.on("message", (job) => {
  const orders = JSON.parse(fs.readFileSync(job.ordersPath, "utf8"));
  const recent = orders.filter((o) => new Date(o.createdAt) > job.since);
  fs.writeFileSync(job.outPath, toCsv(totalsByCustomer(recent)));
  process.exit(0);
});
