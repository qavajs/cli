import yargs from 'yargs';
import { Cli } from '@cucumber/cucumber';

export default async function(): Promise<void> {
    const argv: any = yargs(process.argv.slice(2)).argv;

    process.env.CONFIG = argv.config ?? 'cucumber.js' ?? 'cucumber.json';
    process.env.PROFILE = argv.profile ?? 'default';

    const cli = new Cli({
        argv: [...process.argv.slice(0,2), ...process.argv.slice(3)],
        cwd: process.cwd(),
        stdout: process.stdout,
        stderr: process.stderr,
        env: process.env,
    });
    await cli.run();
}
