import { cosmiconfig } from 'cosmiconfig';

import { ConfigSchema } from '../contexts';

export async function getConfig() {
  const { config } = (await cosmiconfig('packlint').search()) ?? {};

  return ConfigSchema.parse(config);
}
