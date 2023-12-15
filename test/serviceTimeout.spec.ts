import {test, beforeEach, vi, expect} from 'vitest';
import {run} from '../src/run';

import importConfig from '../src/importConfig';

vi.mock('../src/importConfig');

beforeEach(async () => {
    vi.resetAllMocks();
});

test('default service timeout', async () => {
    //@ts-ignore
    vi.mocked(importConfig).mockReturnValue(Promise.resolve({}))
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
    const expectedError = new Error(`Service timeout '600000' ms exceeded`)
    expect(async () => await run(cucumberMock, chalkMock)).rejects.toThrowError(expectedError)
});

test('custom service timeout', async () => {
    //@ts-ignore
    vi.mocked(importConfig).mockReturnValue(Promise.resolve({serviceTimeout: 333333}))
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
    const expectedError = new Error(`Service timeout '333333' ms exceeded`)
    expect(async () => await run(cucumberMock, chalkMock)).rejects.toThrowError(expectedError)
});
