import type { Provider } from './provider';

type Recipient = { id: number; address: string };

type Message = { subject?: string; body: string };

type LogFacts = Readonly<Record<string, number>>;

type ChannelDefinition = {
  name: string;
  rateLimitPerMinute: number;
  maxAttempts: number;
  logFacts?: (message: Message) => LogFacts;
  deliver: (context: {
    recipient: Recipient;
    message: Message;
    provider: Provider;
  }) => Promise<{ providerMessageId: string }>;
};

const channelNamePattern = /^[a-z][a-z0-9_]{0,31}$/;

function refusal(definition: ChannelDefinition): string | undefined {
  if (!channelNamePattern.test(definition.name)) {
    return `Channel name "${definition.name}" must be snake_case and at most 32 characters`;
  }
  if (definition.name.startsWith('test_')) {
    return `Channel "${definition.name}" uses the test_ prefix, which the provider sandbox reserves`;
  }
  if (definition.rateLimitPerMinute <= 0) {
    return `Channel "${definition.name}" needs a positive rateLimitPerMinute, because the provider suspends accounts that send in bursts`;
  }
  if (definition.maxAttempts < 1 || definition.maxAttempts > 10) {
    return `Channel "${definition.name}" must make between 1 and 10 attempts`;
  }
  return undefined;
}

function defineChannel(definition: ChannelDefinition): ChannelDefinition {
  const problem = refusal(definition);
  if (problem !== undefined) {
    throw new Error(problem);
  }
  return definition;
}

export type { ChannelDefinition, LogFacts, Message, Recipient };
export { defineChannel };
