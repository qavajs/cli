import yargs from 'yargs';
import { Cli } from '@cucumber/cucumber';
const argv: any = yargs(process.argv.slice(2)).argv;

console.log(process.cwd());
process.env.CONFIG = argv.config ?? 'cucumber.js' ?? 'cucumber.json';
process.env.PROFILE = argv.profile ?? 'default';

const cli = new Cli({
    argv: process.argv,
    cwd: process.cwd(),
    stdout: process.stdout,
    stderr: process.stderr,
    env: process.env,
});

export default cli;
