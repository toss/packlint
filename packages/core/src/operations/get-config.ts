import { cosmiconfig, cosmiconfigSync } from 'cosmiconfig';

import { ConfigSchema } from '../contexts/index.js';

export async function getConfig() {
  const { config } = (await cosmiconfig('packlint').search()) ?? {};

  return ConfigSchema.parse(config);
}

getConfig.sync = function () {
  const { config } = cosmiconfigSync('packlint').search() ?? {};

  return ConfigSchema.parse(config);
};
