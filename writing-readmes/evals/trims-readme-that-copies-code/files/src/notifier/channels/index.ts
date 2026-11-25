import type { ChannelDefinition } from '../defineChannel';

import { email } from './email';
import { push } from './push';
import { sms } from './sms';

const channels: ReadonlyArray<ChannelDefinition> = [email, sms, push];

export { channels };
