#!/usr/bin/env node

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('ts-node').register({ project: __dirname + '/../tsconfig.json', transpileOnly: true });
require('../src/index.ts');
