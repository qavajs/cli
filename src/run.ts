import yargs from 'yargs';
import ServiceHandler from './ServiceHandler';
import path from 'path';
import importConfig from './importConfig';
import {IPlannedPickle, IRunResult} from '@cucumber/cucumber/api';

/**
 * Merge json like params passed from CLI
 * @param list
 */
function mergeJSONParams(list: string[]): Object {
    return Object.assign({}, ...(list ?? []).map((option: string) => JSON.parse(option)));
}

export default async function(): Promise<void> {
    const { runCucumber, loadConfiguration, loadSources } = await import('@cucumber/cucumber/api');
    const argv: any = yargs(process.argv).argv;
    process.env.CONFIG = argv.config ?? 'cucumber.js' ?? 'cucumber.json';
    process.env.PROFILE = argv.profile ?? 'default';
    process.env.MEMORY_VALUES = argv.memoryValues ?? '{}';
    process.env.CLI_ARGV = process.argv.join(' ');
    const serviceHandler = new ServiceHandler(process.env.CONFIG as string, process.env.PROFILE as string);
    const config = await importConfig(process.env.CONFIG as string, process.env.PROFILE as string);
    const serviceTimeout = config.serviceTimeout || 600000
    const timeoutMessage = `Service timeout '${serviceTimeout}' ms exceeded`;
    process.env.DEFAULT_TIMEOUT = config.defaultTimeout ?? 10000;
    await Promise.race([
        // @ts-ignore
        new Promise((_, reject) => setTimeout(reject(new Error(timeoutMessage)), serviceTimeout)),
        await serviceHandler.before()
    ])
    const memoryLoadHook = path.resolve(__dirname, './loadHook.js');
    argv.formatOptions = mergeJSONParams(argv.formatOptions);
    argv.worldParameters = mergeJSONParams(argv.worldParameters);
    const environment = {
        cwd: process.cwd(),
        stdout: process.stdout,
        stderr: process.stderr,
        env: process.env,
    }
    const options = {
        file: process.env.CONFIG,
        provided: argv,
        profiles: [process.env.PROFILE as string]
    }
    const { runConfiguration } = await loadConfiguration(options, environment);
    runConfiguration.support.requireModules = [memoryLoadHook, ...runConfiguration.support.requireModules];
    if (argv.shard) {
        const { plan } = await loadSources(runConfiguration.sources);
        const [ shard, totalShards ] = argv.shard.split('/').map((val: string) => parseInt(val));
        const chunkLength = plan.length / totalShards;
        const startIndex = Math.floor(shard * chunkLength - chunkLength);
        const endIndex = totalShards/shard === 1 ? plan.length : chunkLength * shard;
        const chunk = plan.slice(startIndex, endIndex);
        runConfiguration.sources.names = chunk.map((scenario: IPlannedPickle) => scenario.name);
    }
    const result: IRunResult = await runCucumber(runConfiguration, environment);
    await Promise.race([
        // @ts-ignore
        new Promise((_, reject) => setTimeout(reject(new Error(timeoutMessage)), serviceTimeout)),
        await serviceHandler.after(result)
        ])
}
