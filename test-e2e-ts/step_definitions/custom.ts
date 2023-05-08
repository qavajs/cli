import { When } from '@cucumber/cucumber';
import { expect } from 'chai';
import memory from '@qavajs/memory';
When('I do test', async function() {});

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
    expect(memory.getValue('$number("42")')).to.equal(42);
    expect(memory.getValue('$customValue')).to.equal('esm');
});

When('I verify that process env loaded', async function() {
    expect(process.env.CONFIG).to.equal('test-e2e-ts/config.ts');
    expect(process.env.PROFILE).to.equal('default');
    expect(process.env.MEMORY_VALUES).to.equal('{}');
    expect(process.env.CLI_ARGV).to.include('--qavaBoolean --qavaValue 42');
    expect(process.env.DEFAULT_TIMEOUT).to.equal('20000');
});
