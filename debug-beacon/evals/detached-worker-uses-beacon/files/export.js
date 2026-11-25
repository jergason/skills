import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

// Cron runs this and needs it to return right away, so the worker runs
// detached with its output discarded. Ops depends on this; don't change it.
const since = new Date(process.argv[2] ?? "2026-11-01");

const worker = spawn(process.execPath, [path.join(here, "worker.js")], {
  detached: true,
  stdio: ["ignore", "ignore", "ignore", "ipc"],
});

const job = {
  since,
  ordersPath: path.join(here, "data/orders.json"),
  outPath: path.join(here, "out/report.csv"),
};

worker.send(job, () => {
  worker.disconnect();
  worker.unref();
  console.log(`Export started for orders since ${since.toISOString().slice(0, 10)}. Report: out/report.csv`);
});
