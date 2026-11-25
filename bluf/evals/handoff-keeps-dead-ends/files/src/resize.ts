import type { IncomingMessage } from "node:http";
import sharp from "sharp";
import { getObject } from "./s3.js";

export async function resize(req: IncomingMessage): Promise<Buffer> {
  const url = new URL(req.url ?? "/", "http://localhost");
  const key = url.searchParams.get("key") ?? "";
  const width = Number(url.searchParams.get("w") ?? 800);
  const original = await getObject(key);
  return sharp(original).resize({ width }).webp().toBuffer();
}
