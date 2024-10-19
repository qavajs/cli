import {
  Before,
  DataTable,
  defineParameterType,
  setDefaultTimeout,
  supportCodeLibraryBuilder
} from '@cucumber/cucumber';

import memory from '@qavajs/memory';
import { getValidation, getPollValidation } from '@qavajs/validation';
import importConfig from './importConfig';
import { IQavajsWorld } from './IQavajsWorld';

const configPath = process.env.CONFIG as string;
const profile = process.env.PROFILE as string;
const config = importConfig(configPath, profile);
const memoryValues = JSON.parse(process.env.MEMORY_VALUES as string);

export async function executeStep(this: any, text: string, extraParam?: DataTable | string) {
  const stepDefsLibrary = supportCodeLibraryBuilder.buildStepDefinitions();
  const steps = stepDefsLibrary.stepDefinitions.filter(s => s.matchesStepName(text));
  if (steps.length === 0) throw new Error(`Step '${text}' is not defined`);
  if (steps.length > 1) throw new Error(`'${text}' matches multiple step definitions`);
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

export class MemoryValue {
  constructor(public expression: string) {}

  /**
   * Return resolved value
   * @example
   * url.value()
   * @return Promise<any>
   */
  value() { return memory.getValue(this.expression) }

  /**
   * Set value to memory with provided key
   * @param value any - value to set
   * @example
   * url.set('https://qavajs.github.io/')
   */
  set(value: any): void { memory.setValue(this.expression, value); }
}

export interface Validation {
  (AR: any, ER: any): void;
  type: string;
  poll: (AR: any, ER: any, options?: {timeout?: number, interval?: number}) => Promise<unknown>
}

function transformString(fn: (value: string) => any) {
  return function (s1: string, s2: string) {
    const expression = (s1 || s2 || '').replace(/\\"/g, '"').replace(/\\'/g, "'")
    return fn(expression);
  }
}

defineParameterType({
  name: 'value',
  regexp: /"([^"\\]*(\\.[^"\\]*)*)"|'([^'\\]*(\\.[^'\\]*)*)'/,
  transformer: transformString(expression => new MemoryValue(expression)),
});

defineParameterType({
  name: 'validation',
  regexp: /((?:is |do |does |to )?(not |to not )?(?:to )?(?:be )?(equal|strictly equal|deeply equal|have member|match|contain|above|below|greater than|less than|have type|have property|match schema|include members)(?:s|es)?)/,
  transformer: transformString(type => {
    const validation = getValidation(type) as Validation;
    validation.poll = getPollValidation(type);
    validation.type = type;
    return validation;
  }),
  useForSnippets: false
});


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
  this.validation = function (type: string) {
    const validation = getValidation(type) as Validation;
    validation.poll = getPollValidation(type);
    return validation;
  }
});

setDefaultTimeout(parseInt(process.env.DEFAULT_TIMEOUT as string));
