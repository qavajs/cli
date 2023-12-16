import {test, beforeEach, vi, expect} from 'vitest';
import {run} from '../src/run';

import importConfig from '../src/importConfig';

vi.mock('../src/importConfig');

beforeEach(async () => {
    vi.resetAllMocks();
    vi.useRealTimers();
});

test.each([
    // ['default', {}, `Service timeout '600000' ms exceeded`],
    [
        'custom',
        {
            serviceTimeout: 10_000,
            service: [
                {
                    before() {
                        return new Promise(resolve => setTimeout(() => resolve(0), 25_000));
                    },
                }
            ]
        },
        `Service timeout '10000' ms exceeded`,
        61_000
    ],
])('%s service timeout', async (_, timeoutValue, errMsg, msRewind) => {
    vi.mocked(importConfig).mockReturnValue(Promise.resolve(timeoutValue));
    vi.useFakeTimers();
    const cucumberMock = {
        runCucumber: vi.fn(),
        loadConfiguration: vi.fn(() => {
            return {runConfiguration: {support: {requireModules: []}}}
        }),
        loadSources: vi.fn(() => {
            return {plan: []}
        }),
    };
    const chalkMock = {blue: vi.fn()};
    const failedRun = run(cucumberMock, chalkMock).catch(err => err);
    await vi.advanceTimersByTimeAsync(msRewind)
    const error = await failedRun;
    expect(error.message).toEqual(errMsg);
});
