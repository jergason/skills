import { readFileSync } from 'node:fs';

import { describe, expect, test } from 'vitest';

import { providers } from './index';

const envExample = readFileSync(new URL('../../../.env.example', import.meta.url), 'utf8');

describe('the provider registry', () => {
  test('names are unique', () => {
    const names = providers.map(provider => provider.name);
    expect(new Set(names).size).toBe(names.length);
  });

  test("every provider's secret is listed in .env.example", () => {
    for (const provider of providers) {
      expect(envExample, `${provider.secretEnvVar} is missing from .env.example`).toContain(`${provider.secretEnvVar}=`);
    }
  });
});
