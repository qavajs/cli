import yargs from 'yargs';
import install from './install';
import run from './run';

const argv: any = yargs(process.argv.slice(2)).argv;

if (!argv._[0]) console.warn('Specify command: install or run');
switch (argv._[0]) {
    case 'install': install(); break;
    case 'run': run(); break;
    default: console.warn('Command is not supported');
}
