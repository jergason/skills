type Env = Readonly<Record<string, string>>;

const unquote = (value: string): string =>
  /^(['"]).*\1$/.test(value) ? value.slice(1, -1) : value;

const parseEnvFile = (text: string): Env =>
  Object.fromEntries(
    text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line !== '' && !line.startsWith('#'))
      .map(line => line.replace(/^export\s+/, ''))
      .filter(line => line.includes('='))
      .map(line => {
        const at = line.indexOf('=');
        return [line.slice(0, at).trim(), unquote(line.slice(at + 1).trim())];
      }),
  );

export { parseEnvFile };
export type { Env };
