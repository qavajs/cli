import yargs from 'yargs';
import ServiceHandler from './ServiceHandler';
import path from 'path';
import importConfig from './importConfig';
import {IRunResult} from '@cucumber/cucumber/api';

/**
 * Merge json like params passed from CLI
 * @param list
 */
function mergeJSONParams(list: string[]): Object {
    return Object.assign({}, ...(list ?? []).map((option: string) => JSON.parse(option)));
}

export default async function(): Promise<void> {
    const { runCucumber, loadConfiguration } = await import('@cucumber/cucumber/api');
    const argv: any = yargs(process.argv).argv;
    process.env.CONFIG = argv.config ?? 'cucumber.js' ?? 'cucumber.json';
    process.env.PROFILE = argv.profile ?? 'default';
    process.env.MEMORY_VALUES = argv.memoryValues ?? '{}';
    process.env.CLI_ARGV = process.argv.join(' ');
    const serviceHandler = new ServiceHandler(process.env.CONFIG as string, process.env.PROFILE as string);
    const config = await importConfig(process.env.CONFIG as string, process.env.PROFILE as string);
    process.env.DEFAULT_TIMEOUT = config.defaultTimeout ?? 10000;
    await serviceHandler.before();
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
    const result: IRunResult = await runCucumber(runConfiguration, environment);
    await serviceHandler.after(result);
}
