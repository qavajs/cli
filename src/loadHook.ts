import { Before, IWorld, setDefaultTimeout } from '@cucumber/cucumber';
import memory from '@qavajs/memory';
import importConfig from './importConfig';
import { bindWorld } from './utils';

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
Before({name: 'qavajs init'}, async function (this: IWorld, scenario) {
  process.env.CURRENT_SCENARIO_NAME = scenario.pickle.name;
  global.config = await config;
  global.config.memory = global.config.memory ?? [];
  const memoryInstances = Array.isArray(global.config.memory) ? global.config.memory : [global.config.memory];
  if (memory.setLogger) {
    memory.setLogger(this);
  }
  memory.register(Object.assign({}, ...memoryInstances, memoryValues));
  bindWorld(this);
});

setDefaultTimeout(parseInt(process.env.DEFAULT_TIMEOUT as string));
