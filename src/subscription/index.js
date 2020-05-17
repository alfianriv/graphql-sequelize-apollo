import { PubSub } from 'apollo-server';

import * as DONATE_EVENTS from './donate';

export const EVENTS = {
  DONATE: DONATE_EVENTS,
};

export default new PubSub();
