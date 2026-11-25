#!/usr/bin/env bun
// Tiny log collector for agent debugging. Instrumented code POSTs JSON objects
// to /log and the agent reads them back from /logs.
import { appendFile, readFile, writeFile } from "node:fs/promises";

const PORT = Number(process.env.PORT ?? 7243);
const HOST = process.env.HOST ?? "127.0.0.1";
const LOG_FILE = process.env.LOG_FILE ?? "/tmp/agent-debug.log";

// Browser code on any origin needs to be able to post here.
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const text = (body: string, status = 200) => new Response(body, { status, headers: cors });

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const readLogs = async () =>
  (await readFile(LOG_FILE, "utf8"))
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line));

// Append rather than read-then-write, so concurrent requests can't overwrite each other's lines.
const appendLog = async (req: Request) => {
  const entry = await req.json().catch(() => undefined);
  if (!isObject(entry)) return text("Body must be a JSON object", 400);
  await appendFile(LOG_FILE, JSON.stringify({ timestamp: Date.now(), ...entry }) + "\n");
  return text("OK");
};

const routes: Record<string, (req: Request) => Response | Promise<Response>> = {
  "GET /health": () => text("OK"),
  "GET /logs": async () => Response.json(await readLogs(), { headers: cors }),
  "POST /log": appendLog,
  "POST /reset": async () => {
    await writeFile(LOG_FILE, "");
    return text("Logs cleared");
  },
};

await writeFile(LOG_FILE, "");

Bun.serve({
  hostname: HOST,
  port: PORT,
  fetch: (req) => {
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    const route = routes[`${req.method} ${new URL(req.url).pathname}`];
    return route ? route(req) : text("Not Found", 404);
  },
});

console.log(`Agent debug log server on http://${HOST}:${PORT}, writing to ${LOG_FILE}`);
