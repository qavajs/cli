import yargs from 'yargs';

export function cliOptions(argv: string[]) {
    return yargs(argv)
        .command(
            'install',
            'init qavajs project and install dependencies'
        )
        .command(
            'run',
            'run qavajs tests'
        )
        .option('config', {
            type: 'string',
            describe: 'Config file to execute',
        })
        .option('profile', {
            type: 'string',
            describe: 'Profile to execute',
        })
        .option('paths', {
            type: 'array',
            array: true,
            describe: 'Paths to where your feature files are',
        })
        .option('backtrace', {
            type: 'boolean',
            describe: 'Show the full backtrace for errors',
            alias: 'b',
        })
        .option('dryRun', {
            type: 'boolean',
            describe: "Prepare a test run but don't run it",
            alias: 'd',
        })
        .option('forceExit', {
            type: 'boolean',
            describe: 'Explicitly call process.exit() after the test run (when run via CLI)',
            alias: ['exit', 'force-exit'],
        })
        .option('failFast', {
            type: 'boolean',
            describe: 'Stop running tests when a test fails',
        })
        .option('format', {
            type: 'array',
            describe: 'Name/path and (optionally) output file path of each formatter to use',
            alias: 'f',
        })
        .option('formatOptions', {
            type: 'string',
            describe: 'Options to be provided to formatters'
        })
        .option('import', {
            type: 'array',
            describe: 'Paths to where your support code is (ES modules)',
            alias: 'i',
        })
        .option('name', {
            type: 'array',
            array: true,
            describe: 'Regular expressions of which scenario names should match one of to be run',
        })
        .option('order', {
            type: 'string',
            describe: 'Run in the order defined, or in a random order',
        })
        .option('parallel', {
            type: 'number',
            describe: 'Run tests in parallel with the given number of worker processes'
        })
        .option('require', {
            type: 'array',
            array: true,
            describe: 'Paths to where your support code is (CommonJS)',
            alias: 'r'
        })
        .option('requireModule', {
            type: 'array',
            array: true,
            describe: 'Names of transpilation modules to load, loaded via require()'
        })
        .option('retry', {
            type: 'number',
            describe: 'Retry failing tests up to the given number of times'
        })
        .option('retryTagFilter', {
            type: 'array',
            array: true,
            describe: 'Tag expression to filter which scenarios can be retried'
        })
        .option('strict', {
            type: 'boolean',
            describe: 'Fail the test run if there are pending steps'
        })
        .option('tags', {
            type: 'array',
            array: true,
            describe: 'Tag expression to filter which scenarios should be run',
            alias: 't'
        })
        .option('worldParameters', {
            type: 'string',
            describe: 'Parameters to be passed to your World'
        })
        .option('memoryValues', {
            type: 'string',
            describe: 'Values to be set to memory',
        })
        .option('shard', {
            type: 'string',
            describe: 'Shard tests (--shard x/y)',
        })
        .option('no-error-exit', {
            type: 'boolean',
            describe: 'Suppress emitting non-zero exit code if tests fail',
        })
        .help()
        .argv;
}
