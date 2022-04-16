import { inspect } from '@xstate/inspect';

import.meta.env.DEV && inspect({
  iframe: false,
});

export * from './meta';
export * from './loader';
export * from './editor';
