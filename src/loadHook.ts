import { Before, Given, setDefaultTimeout, supportCodeLibraryBuilder } from '@cucumber/cucumber';
import memory from '@qavajs/memory';
import computed from './computed';
import importConfig from './importConfig';

declare global {
  // eslint-disable-next-line no-var
  var config: any;
}

const configPath = process.env.CONFIG as string;
const profile = process.env.PROFILE as string;
const config = importConfig(configPath, profile);
const memoryValues = JSON.parse(process.env.MEMORY_VALUES as string);

/**
 * Basic initialization hook
 */
Before(async function () {
  global.config = await config;
  memory.register(computed);
  memory.register(Object.assign(global.config.memory ?? {}, memoryValues));
});

setDefaultTimeout(parseInt(process.env.DEFAULT_TIMEOUT as string));
