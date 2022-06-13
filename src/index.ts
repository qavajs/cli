import yargs from 'yargs';
import install from './install';
import cli from './run';

const argv: any = yargs(process.argv.slice(2)).argv;

switch (argv._[0]) {
    case 'install': install(); break;
    case 'run': cli(); break;
}
