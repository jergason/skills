import http from "node:http";
import { resize } from "./resize.js";

const server = http.createServer(async (req, res) => {
  if (req.url?.startsWith("/resize")) {
    try {
      const out = await resize(req);
      res.writeHead(200, { "content-type": "image/webp" });
      res.end(out);
    } catch (err) {
      res.writeHead(500);
      res.end("resize failed");
    }
    return;
  }
  res.writeHead(404);
  res.end();
});

// v1.8.0: moved from express to plain http to cut cold-start time
server.listen(Number(process.env.PORT ?? 8080));
