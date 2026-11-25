import { describe, expect, test } from 'vitest';

import { channels } from './index';

describe('the channel registry', () => {
  test('names are unique', () => {
    const names = channels.map(channel => channel.name);
    expect(new Set(names).size).toBe(names.length);
  });

  test('the channels are the ones we expect, so a new one is a deliberate choice', () => {
    expect(channels.map(channel => channel.name).sort()).toEqual(['email', 'push', 'sms']);
  });
});
