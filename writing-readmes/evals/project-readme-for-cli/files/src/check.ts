import type { Env } from './envFile.js';
import type { Schema, VarType } from './schema.js';

type Problem = Readonly<{ name: string; message: string }>;

const isUrl = (value: string): boolean => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

const validators: Readonly<Record<VarType, (value: string) => boolean>> = {
  string: () => true,
  number: value => value.trim() !== '' && Number.isFinite(Number(value)),
  boolean: value => value === 'true' || value === 'false',
  url: isUrl,
};

const check = (schema: Schema, env: Env, strict: boolean): ReadonlyArray<Problem> => [
  ...Object.entries(schema).flatMap(([name, spec]): ReadonlyArray<Problem> => {
    const value = env[name];
    if (value === undefined || value === '') {
      return spec.optional === true ? [] : [{ name, message: 'missing' }];
    }
    return validators[spec.type](value) ? [] : [{ name, message: `not a ${spec.type}` }];
  }),
  ...(strict
    ? Object.keys(env)
        .filter(name => !(name in schema))
        .map(name => ({ name, message: 'not in schema' }))
    : []),
];

export { check };
export type { Problem };
