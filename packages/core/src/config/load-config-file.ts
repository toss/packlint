import { cosmiconfig } from 'cosmiconfig';

export async function loadConfigFile<T>(): Promise<{
  config: T;
  filepath: string;
} | null> {
  const explorer = cosmiconfig('packlint', {
    searchPlaces: ['packlint.config.js', 'packlint.config.ts', 'packlint.config.mjs', 'packlint.config.cjs'],
  });

  const result = await explorer.search();

  if (result === null) {
    return null;
  }

  return {
    config: result.config,
    filepath: result.filepath,
  };
}
