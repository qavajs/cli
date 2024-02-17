import install from './install';
import run from './run';
import { cliOptions } from './cliOptions';
const chalk = import('chalk').then(m => m.default);

const argv: any = cliOptions(process.argv.slice(2));

async function main() {
    const { bold, cyan } = await chalk;
    console.log(bold(cyan(`@qavajs (v${require('../package.json').version})`)));
    if (!argv._[0]) console.warn('Specify command: install or run');
    switch (argv._[0]) {
        case 'install': return install();
        case 'run': return run();
        default: console.warn('Command is not supported');
    }
}

main();

