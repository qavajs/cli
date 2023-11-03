import {Before, IWorld, setDefaultTimeout, supportCodeLibraryBuilder} from '@cucumber/cucumber';
import memory from '@qavajs/memory';
import importConfig from './importConfig';
import StepDefinition from '@cucumber/cucumber/lib/models/step_definition';

declare global {
  // eslint-disable-next-line no-var
  var config: any;
}

const configPath = process.env.CONFIG as string;
const profile = process.env.PROFILE as string;
const config = importConfig(configPath, profile);
const memoryValues = JSON.parse(process.env.MEMORY_VALUES as string);

export async function executeStep(this: any, text: string) {
  const stepDefsLibrary = supportCodeLibraryBuilder.buildStepDefinitions();
  const steps = stepDefsLibrary.stepDefinitions.filter(s => s.matchesStepName(text));
  if (steps.length === 0) throw new Error(`Step "${text}" is not defined`);
  if (steps.length > 1) throw new Error(`"${text}" matches multiple step definitions`);
  const step = steps.pop() as StepDefinition;
  const { parameters } = await step.getInvocationParameters({ step: { text }, world: this } as any);
  await step.code.apply(this, parameters);
}

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
  this.executeStep = executeStep;
});

setDefaultTimeout(parseInt(process.env.DEFAULT_TIMEOUT as string));
