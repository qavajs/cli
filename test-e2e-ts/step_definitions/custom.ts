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
