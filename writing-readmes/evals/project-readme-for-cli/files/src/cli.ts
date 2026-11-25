#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { check } from './check.js';
import { parseEnvFile } from './envFile.js';
import { parseSchema } from './schema.js';

const HELP = `Usage: envcheck [options]

Checks an env file against a schema and lists every problem.

Options:
  -s, --schema <path>  Schema file (default: env.schema.json)
  -e, --env <path>     Env file to check (default: .env)
      --strict         Also report variables the schema doesn't list
  -h, --help           Show this help

Exit codes: 0 no problems, 1 problems found, 2 bad arguments or unreadable file`;

const options = {
  schema: { type: 'string', short: 's', default: 'env.schema.json' },
  env: { type: 'string', short: 'e', default: '.env' },
  strict: { type: 'boolean', default: false },
  help: { type: 'boolean', short: 'h', default: false },
} as const;

const read = (path: string): string | Error => {
  try {
    return readFileSync(path, 'utf8');
  } catch (error) {
    return error instanceof Error ? error : new Error(String(error));
  }
};

const run = (argv: ReadonlyArray<string>): number => {
  const parsed = (() => {
    try {
      return parseArgs({ args: [...argv], options });
    } catch (error) {
      console.error(String(error));
      return undefined;
    }
  })();
  if (parsed === undefined) return 2;
  if (parsed.values.help) {
    console.log(HELP);
    return 0;
  }

  const schemaText = read(parsed.values.schema);
  const envText = read(parsed.values.env);
  if (schemaText instanceof Error || envText instanceof Error) {
    console.error([schemaText, envText].filter(t => t instanceof Error).map(String).join('\n'));
    return 2;
  }

  const schema = (() => {
    try {
      return parseSchema(schemaText);
    } catch (error) {
      console.error(`${parsed.values.schema}: ${String(error)}`);
      return undefined;
    }
  })();
  if (schema === undefined) return 2;

  const problems = check(schema, parseEnvFile(envText), parsed.values.strict);
  problems.forEach(p => console.log(`${p.name}: ${p.message}`));
  if (problems.length === 0) console.log('ok');
  return problems.length === 0 ? 0 : 1;
};

process.exitCode = run(process.argv.slice(2));
