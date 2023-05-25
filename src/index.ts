import yargs from 'yargs';
import install from './install';
import run from './run';
import { bold, cyan } from 'chalk';

const argv: any = yargs(process.argv.slice(2)).argv;

console.log(bold(cyan(`@qavajs (v${require('../package.json').version})`)));

if (!argv._[0]) console.warn('Specify command: install or run');
switch (argv._[0]) {
    case 'install': install(); break;
    case 'run': run(); break;
    default: console.warn('Command is not supported');
}
