import { Before, DataTable, setDefaultTimeout, supportCodeLibraryBuilder } from '@cucumber/cucumber';
import memory from '@qavajs/memory';
import importConfig from './importConfig';
import { IQavajsWorld } from './IQavajsWorld';

declare global {
  // eslint-disable-next-line no-var
  var config: any;
}

const configPath = process.env.CONFIG as string;
const profile = process.env.PROFILE as string;
const config = importConfig(configPath, profile);
const memoryValues = JSON.parse(process.env.MEMORY_VALUES as string);

export async function executeStep(this: any, text: string, extraParam?: DataTable | string) {
  const stepDefsLibrary = supportCodeLibraryBuilder.buildStepDefinitions();
  const steps = stepDefsLibrary.stepDefinitions.filter(s => s.matchesStepName(text));
  if (steps.length === 0) throw new Error(`Step "${text}" is not defined`);
  if (steps.length > 1) throw new Error(`"${text}" matches multiple step definitions`);
  const step = steps.pop() as any;
  const { parameters } = await step.getInvocationParameters({ step: { text }, world: this } as any);
  try {
    await step.code.apply(this, [...parameters, extraParam]);
  } catch (err) {
    throw new Error(`${text}\n${err}`);
  }
}

function setValue(key: string, value: any): void {
  memory.setValue(key, value);
}

async function getValue(expression: string): Promise<any> {
  return memory.getValue(expression);
}

/**
 * Basic initialization hook
 */
Before({name: 'qavajs init'}, async function (this: IQavajsWorld, scenario) {
  process.env.CURRENT_SCENARIO_NAME = scenario.pickle.name;
  this.config = await config;
  this.config.memory = this.config.memory ?? [];
  const memoryInstances = Array.isArray(this.config.memory) ? this.config.memory : [this.config.memory];
  if (memory.setLogger) {
    memory.setLogger(this);
  }
  memory.register(Object.assign({}, ...memoryInstances, memoryValues));
  this.executeStep = executeStep;
  this.getValue = getValue;
  this.setValue = setValue;
  global.config = this.config;
});

setDefaultTimeout(parseInt(process.env.DEFAULT_TIMEOUT as string));
