type VarType = 'string' | 'number' | 'boolean' | 'url';

type VarSpec = Readonly<{ type: VarType; optional?: boolean }>;

type Schema = Readonly<Record<string, VarSpec>>;

const VAR_TYPES: ReadonlyArray<VarType> = ['string', 'number', 'boolean', 'url'];

const isVarSpec = (spec: unknown): spec is VarSpec =>
  typeof spec === 'object' &&
  spec !== null &&
  VAR_TYPES.includes((spec as { type?: unknown }).type as VarType);

const parseSchema = (text: string): Schema => {
  const raw: unknown = JSON.parse(text);
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    throw new Error('schema must be a JSON object keyed by variable name');
  }
  return Object.fromEntries(
    Object.entries(raw).map(([name, spec]) => {
      if (!isVarSpec(spec)) {
        throw new Error(`${name}: type must be one of ${VAR_TYPES.join(', ')}`);
      }
      return [name, spec];
    }),
  );
};

export { parseSchema, VAR_TYPES };
export type { Schema, VarSpec, VarType };
