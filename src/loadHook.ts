import { Before, setDefaultTimeout } from '@cucumber/cucumber';
import path from 'path';
import memory from '@qavajs/memory';
import computed from './computed';

declare global {
  // eslint-disable-next-line no-var
  var config: any;
}

const configPath = process.env.CONFIG as string;
const profile = process.env.PROFILE as string;
const config = require(path.join(process.cwd(), configPath))[profile];
setDefaultTimeout(config.defaultTimeout ?? 10000);

/**
 * Basic initialization hook
 */
Before(async function () {
  global.config = config;
  memory.register(computed);
  memory.register(config.memory ?? {});
});
