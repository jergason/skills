function info(message: string, data: Readonly<Record<string, unknown>>) {
  process.stdout.write(JSON.stringify({ timestamp: new Date().toISOString(), message, ...data }) + '\n');
}

const log = { info };

export { log };
