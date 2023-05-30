const { When } = require('@cucumber/cucumber');
const { Override } = require('../../../utils');
const { expect } = require('chai');
const memory = require('@qavajs/memory');
When('I do test', async function() {});
Override('I do test', async function() {
    console.log('I am overridden')
});

When('I do smth async', async function() {
    await new Promise(resolve => {
        setTimeout(() => resolve(), 6000);
    });
});

When('I verify that config loaded', async function() {
    expect(config.defaultTimeout).to.equal(20000);
});

When('I verify that memory loaded', async function() {
    expect(memory.getValue('$number("42")')).to.equal(42);
    expect(memory.getValue('$customValue')).to.equal('cjs');
    expect(memory.getValue('$additionalValue')).to.equal(12);
});

When('I verify that process env loaded', async function() {
    expect(process.env.CONFIG).to.equal('test-e2e/cjs/config.js');
    expect(process.env.PROFILE).to.equal('default');
    expect(process.env.MEMORY_VALUES).to.equal('{}');
    expect(process.env.CLI_ARGV).to.include('--qavaBoolean --qavaValue 42');
    expect(process.env.DEFAULT_TIMEOUT).to.equal('20000');
    expect(process.env.CURRENT_SCENARIO_NAME).to.equal('verify process env');
});

When('I import cjs', async function() {
    const module = require('../../modules/module.cjs');
    expect(module()).to.equal(`I'm cjs`)
});

When('I import esm', async function() {
    const module = (await import('../../modules/module.mjs')).default;
    expect(module()).to.equal(`I'm esm`)
});
