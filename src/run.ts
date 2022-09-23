import yargs from 'yargs';
import ServiceHandler from './ServiceHandler';
import path from 'path';

export default async function(): Promise<void> {
    const { Cli } = await import('@cucumber/cucumber');
    const argv: any = yargs(process.argv).argv;

    process.env.CONFIG = argv.config ?? 'cucumber.js' ?? 'cucumber.json';
    process.env.PROFILE = argv.profile ?? 'default';
    process.env.MEMORY_VALUES = argv.memoryValues ?? '{}';
    delete argv.memoryValues;
    delete argv['memory-values'];

    const serviceHandler = new ServiceHandler(process.env.CONFIG as string, process.env.PROFILE as string);
    await serviceHandler.before();
    const memoryLoadHook = path.resolve(__dirname, './loadHook.js');
    const cli = new Cli({
        argv: [...process.argv.slice(0, 2), '--require-module', memoryLoadHook, ...filterCucumberArgv(argv)],
        cwd: process.cwd(),
        stdout: process.stdout,
        stderr: process.stderr,
        env: process.env,
    });
    await cli.run();
    await serviceHandler.after();
}

/**
 * Filter params to pass into cucumber CLI
 * @param argv
 */
function filterCucumberArgv(argv: Object): Array<string> {
    return Object.entries(argv).reduce((args: Array<string>, [key, value]: [string, string]) => {
        if (key !== '_' && key !== '$0') {
            args.push('--' + key, value);
        }
        return args
    }, [])
}
