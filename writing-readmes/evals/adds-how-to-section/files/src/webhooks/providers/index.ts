import type { ProviderDefinition } from '../defineProvider';

import { github } from './github';
import { stripe } from './stripe';

const providers: ReadonlyArray<ProviderDefinition> = [github, stripe];

export { providers };
