import yargs from 'yargs';
import ServiceHandler from './ServiceHandler';
import path from 'path';

export default async function(): Promise<void> {
    const { runCucumber, loadConfiguration } = await import('@cucumber/cucumber/api');
    const argv: any = yargs(process.argv).argv;
    process.env.CONFIG = argv.config ?? 'cucumber.js' ?? 'cucumber.json';
    process.env.PROFILE = argv.profile ?? 'default';
    process.env.MEMORY_VALUES = argv.memoryValues ?? '{}';
    const serviceHandler = new ServiceHandler(process.env.CONFIG as string, process.env.PROFILE as string);
    await serviceHandler.before();
    const memoryLoadHook = path.resolve(__dirname, './loadHook.js');
    const environment = {
        cwd: process.cwd(),
        stdout: process.stdout,
        stderr: process.stderr,
        env: process.env,
    }
    const options = {
        file: process.env.CONFIG,
        provided: argv
    }
    const { runConfiguration } = await loadConfiguration(options, environment);
    runConfiguration.support.requireModules = [memoryLoadHook, ...runConfiguration.support.requireModules];
    await runCucumber(runConfiguration, environment);
    await serviceHandler.after();
}
