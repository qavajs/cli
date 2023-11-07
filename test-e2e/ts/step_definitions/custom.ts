import { When } from '@cucumber/cucumber';
import { expect } from 'chai';
import memory from '@qavajs/memory';
import {Override} from '../../../utils';
//@ts-ignore
import moduleCJS from '../../modules/module.cjs';

When('I do test', async function() {});

Override('I do test', async function() {
    console.log('I am overridden')
});

When('I do smth async', async function() {
    await new Promise<void>(resolve => {
        setTimeout(() => resolve(), 12000);
    });
});

When('I verify that config loaded', async function() {
    // @ts-ignore
    expect(config.defaultTimeout).to.equal(20000);
});

When('I verify that memory loaded', async function() {
    expect(memory.getValue('$customValue')).to.equal('esm');
});

When('I verify that process env loaded', async function() {
    expect(process.env.CONFIG).to.equal('test-e2e/ts/config.ts');
    expect(process.env.PROFILE).to.equal('default');
    expect(process.env.MEMORY_VALUES).to.equal('{}');
    expect(process.env.CLI_ARGV).to.include('--qavaBoolean --qavaValue 42');
    expect(process.env.DEFAULT_TIMEOUT).to.equal('20000');
    expect(process.env.CURRENT_SCENARIO_NAME).to.equal('verify process env');
});

When('I import cjs', async function() {
    expect(moduleCJS()).to.equal(`I'm cjs`);
});

When('I import esm', async function() {
    //@ts-ignore
    const moduleESM = await import('../../modules/module.mjs');
    expect(moduleESM.default()).to.equal(`I'm esm`);
});

When('I execute composite step', async function () {
    await this.executeStep('Nested step "42"');
    expect(memory.getValue('$nestedValue')).to.equal('42');
});

When('Nested step {string}', async function(val) {
    memory.setValue('nestedValue', val);
});

