import {test, beforeEach, vi, expect} from 'vitest';
import {run} from '../src/run';

import importConfig from '../src/importConfig';

vi.mock('../src/importConfig');

beforeEach(async () => {
    vi.resetAllMocks();
});

test.each([
    ['default', {}, `Service timeout '600000' ms exceeded`],
    ['custom', {serviceTimeout: 333333}, `Service timeout '333333' ms exceeded`]
])('%s service timeout', async (_, timeoutValue, errMsg) => {
    vi.mocked(importConfig).mockReturnValue(Promise.resolve(timeoutValue))
    const cucumberMock = {
        runCucumber: vi.fn(),
        loadConfiguration: vi.fn(() => {
            return {runConfiguration: {support: {requireModules: []}}}
        }),
        loadSources: vi.fn(() => {
            return {plan: []}
        })
    }
    const chalkMock = {blue: vi.fn()}
    expect(async () => await run(cucumberMock, chalkMock)).rejects.toThrowError(errMsg)
});
