type InternalEvent = { type: string; externalId: string; payload: Readonly<Record<string, unknown>> };

type ProviderDefinition = {
  name: string;
  secretEnvVar: string;
  signatureHeader: string;
  verify: (rawBody: string, signature: string, secret: string) => boolean;
  toEvent: (body: unknown) => InternalEvent;
};

function defineProvider(definition: ProviderDefinition): ProviderDefinition {
  if (!/^[a-z]+$/.test(definition.name)) {
    throw new Error(`Provider name "${definition.name}" must be lowercase letters, because it is the URL path segment`);
  }
  return definition;
}

export type { InternalEvent, ProviderDefinition };
export { defineProvider };
