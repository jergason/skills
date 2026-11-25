import { describe, expect, it } from 'vitest';
import { check } from './check.js';
import { parseEnvFile } from './envFile.js';
import { parseSchema } from './schema.js';

const schema = parseSchema(
  JSON.stringify({
    PORT: { type: 'number' },
    API_URL: { type: 'url' },
    DEBUG: { type: 'boolean', optional: true },
  }),
);

describe('check', () => {
  it('passes a complete env', () => {
    expect(check(schema, parseEnvFile('PORT=3000\nAPI_URL=https://api.example.com'), false)).toEqual([]);
  });

  it('reports missing and mistyped variables', () => {
    expect(check(schema, parseEnvFile('PORT=abc'), false)).toEqual([
      { name: 'PORT', message: 'not a number' },
      { name: 'API_URL', message: 'missing' },
    ]);
  });

  it('reports unknown variables only in strict mode', () => {
    const env = parseEnvFile('PORT=1\nAPI_URL=https://x.dev\nEXTRA=1');
    expect(check(schema, env, false)).toEqual([]);
    expect(check(schema, env, true)).toEqual([{ name: 'EXTRA', message: 'not in schema' }]);
  });

  it('rejects unknown types in the schema', () => {
    expect(() => parseSchema('{"PORT":{"type":"integer"}}')).toThrow('PORT: type must be one of');
  });
});
