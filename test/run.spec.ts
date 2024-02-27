import {test, beforeEach, vi, expect} from 'vitest';
import {run} from '../src/run';

import importConfig from '../src/importConfig';

vi.mock('../src/importConfig');

beforeEach(async () => {
    vi.resetAllMocks();
    vi.useRealTimers();
});

test('exitCode=1 if scenario failed', async () => {
    vi.mocked(importConfig).mockReturnValue(Promise.resolve({
        service: []
    }));
    const cucumberMock = {
        runCucumber: vi.fn().mockReturnValue({ success: false }),
        loadConfiguration: vi.fn(() => {
            return {runConfiguration: {support: {requireModules: []}}}
        }),
        loadSources: vi.fn(() => {
            return {plan: []}
        }),
        loadSupport: vi.fn(() => {
            return {}
        })
    };
    const chalkMock = {blue: vi.fn()};
    await run(cucumberMock, chalkMock);
    expect(process.exitCode).to.equal(1);
});

test('exitCode=0 if passed --no-error-exit', async () => {
    process.argv.push('--no-error-exit')
    vi.mocked(importConfig).mockReturnValue(Promise.resolve({
        service: []
    }));
    const cucumberMock = {
        runCucumber: vi.fn().mockReturnValue({ success: false }),
        loadConfiguration: vi.fn(() => {
            return {runConfiguration: {support: {requireModules: []}}}
        }),
        loadSources: vi.fn(() => {
            return {plan: []}
        }),
        loadSupport: vi.fn(() => {
            return {}
        })
    };
    const chalkMock = {blue: vi.fn()};
    await run(cucumberMock, chalkMock);
    expect(process.exitCode).to.equal(0);
});
