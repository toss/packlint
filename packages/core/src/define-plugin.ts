import type { Plugin } from './types/index.js';

export function definePlugin<Args extends unknown[]>(plugin: (...args: Args) => Plugin): (...args: Args) => Plugin {
  return plugin;
}
