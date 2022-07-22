import { test, jest } from '@jest/globals';
import { wdioService } from '../src/wdioServiceAdapter';
import { resolve } from 'path';

declare type Service = {
    options?: Object,
    capabilities?: Object,
    config?: Object,
    before: Function,
    after: Function
}

test('adapt default service', () => {
    const adaptedService = wdioService(resolve('test/mockService.ts')) as Service;
    expect(adaptedService.options).toEqual({});
    expect(adaptedService.capabilities).toEqual({});
    expect(adaptedService.config).toEqual({});
    expect(adaptedService.before()).toEqual({config: {}, capabilities: {}});
    expect(adaptedService.after()).toEqual({config: {}, capabilities: {}});
});

test('adapt configured service', () => {
    const adaptedService = wdioService([
        resolve('test/mockService.ts'),
        { option: 42 },
        { capability: 42 },
        { configValue: 42 }
    ]) as Service;
    expect(adaptedService.options).toEqual({ option: 42 });
    expect(adaptedService.capabilities).toEqual({ capability: 42 });
    expect(adaptedService.config).toEqual({ configValue: 42 });
    expect(adaptedService.before()).toEqual({config: { configValue: 42 }, capabilities: { capability: 42 }});
    expect(adaptedService.after()).toEqual({config: { configValue: 42 }, capabilities: { capability: 42 }});
});

test('adapt configured service with option', () => {
    const adaptedService = wdioService([
        resolve('test/mockService.ts'),
        { option: 42 }
    ]) as Service;
    expect(adaptedService.options).toEqual({ option: 42 });
    expect(adaptedService.capabilities).toEqual({});
    expect(adaptedService.config).toEqual({});
    expect(adaptedService.before()).toEqual({config: {}, capabilities: {}});
    expect(adaptedService.after()).toEqual({config: {}, capabilities: {}});
});

test('adapt configured service with option and capabilities', () => {
    const adaptedService = wdioService([
        resolve('test/mockService.ts'),
        { option: 42 },
        { capability: 42 }
    ]) as Service;
    expect(adaptedService.options).toEqual({ option: 42 });
    expect(adaptedService.capabilities).toEqual({ capability: 42 });
    expect(adaptedService.config).toEqual({});
    expect(adaptedService.before()).toEqual({config: {}, capabilities: { capability: 42 }});
    expect(adaptedService.after()).toEqual({config: {}, capabilities: { capability: 42 }});
});
