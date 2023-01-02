import { findUp, pathExists } from 'find-up';
import path from 'path';
import { mergeDeepRight } from 'ramda';

import { ConfigSchema, ConfigType } from '../contexts/index.js';

export async function getConfig({ cwd }: { cwd: string } = { cwd: process.cwd() }) {
  const _path = await findUp('packlint.config.mjs', { cwd });
  if (_path == null) {
    return ConfigSchema.parse({});
  }

  const { default: _config } = await import(_path);
  const config = ConfigSchema.parse(_config);

  if (config.extends == null) {
    return config;
  }

  const parentPath = path.resolve(path.dirname(_path), config.extends);

  if (!pathExists(parentPath)) {
    return config;
  }

  const { default: _parentConfig } = await import(parentPath);
  const parentConfig = ConfigSchema.parse(_parentConfig);

  return mergeConfigs(parentConfig, config);
}

function mergeConfigs(parent: ConfigType, child: ConfigType): ConfigType {
  return { ...child, rules: mergeDeepRight(parent.rules ?? {}, child.rules ?? {}) as ConfigType['rules'] };
}
