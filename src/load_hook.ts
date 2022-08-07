import { Before } from '@cucumber/cucumber';
import path from 'path';
import memory from '@qavajs/memory';
import computed from './computed';

declare global {
  // eslint-disable-next-line no-var
  var config: any;
}

/**
 * Basic initialization hook
 */
Before(async function () {
  const configPath = process.env.CONFIG as string;
  const profile = process.env.PROFILE as string;
  global.config = (await import(path.join(process.cwd(), configPath))).default[profile];
  memory.register(computed);
  memory.register(config.memory ?? {});
});
