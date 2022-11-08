import { cosmiconfig } from 'cosmiconfig';

import { ConfigType } from '../contexts';

type Result = {
  config: ConfigType;
  filepath: string;
  isEmpty?: boolean;
} | null;

export async function getConfig() {
  return cosmiconfig('packlint').search() as Promise<Result>;
}
