#!/usr/bin/env bun

import { renderMermaidASCII } from "beautiful-mermaid";

interface Options {
  paddingX: number;
  paddingY: number;
}

interface ParsedArgs {
  diagram: string;
  file: string;
  options: Options;
}

function parseArgs(args: string[]): ParsedArgs {
  const options: Options = {
    paddingX: 5,
    paddingY: 5,
  };

  let diagram = "";
  let file = "";
  let i = 0;

  while (i < args.length) {
    const arg = args[i];

    if (arg === "--padding-x" && args[i + 1]) {
      options.paddingX = parseInt(args[i + 1], 10);
      i += 2;
    } else if (arg === "--padding-y" && args[i + 1]) {
      options.paddingY = parseInt(args[i + 1], 10);
      i += 2;
    } else if (arg === "--file" && args[i + 1]) {
      file = args[i + 1];
      i += 2;
    } else if (!arg.startsWith("--")) {
      diagram = arg;
      i++;
    } else {
      i++;
    }
  }

  return { diagram, file, options };
}

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of Bun.stdin.stream()) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf-8").trim();
}

async function main() {
  const args = process.argv.slice(2);
  let { diagram, file, options } = parseArgs(args);

  if (file) {
    if (!(await Bun.file(file).exists())) {
      console.error(`render error: no such file: ${file}`);
      process.exit(1);
    }
    diagram = (await Bun.file(file).text()).trim();
  }

  // if no diagram arg or file, try stdin
  if (!diagram) {
    const isTTY = process.stdin.isTTY;
    if (!isTTY) {
      diagram = await readStdin();
    }
  }

  if (!diagram) {
    console.error("usage: bun run render.ts --file diagram.mmd");
    console.error("       bun run render.ts < diagram.mmd");
    console.error("Put each statement on its own line, not separated by semicolons.");
    process.exit(1);
  }

  try {
    const output = renderMermaidASCII(diagram, {
      paddingX: options.paddingX,
      paddingY: options.paddingY,
    });
    console.log(output);
  } catch (err) {
    console.error("render error:", err instanceof Error ? err.message : err);
    process.exit(1);
  }
}

main();
