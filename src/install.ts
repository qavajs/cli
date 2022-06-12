import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import yarnInstall from 'yarn-install';

type Answers = {
    modules: Array<string>,
    format: Array<string>,
    parallel: number
}

export default async function install(): Promise<void> {
    const answers = await inquirer.prompt([
        {
            type: 'checkbox',
            message: 'select modules to install:',
            name: 'modules',
            choices: ['wdio', 'api']
        },
        {
            type: 'checkbox',
            message: 'select formatters (reporters) to install:',
            name: 'format',
            choices: ['html', 'json', 'progress']
        },
        {
            type: 'number',
            message: 'how many parallel instances to run?',
            name: 'parallel',
            default: 1
        }
    ]) as Answers;

    const isWDIOIncluded: boolean = answers.modules.includes('wdio');

    const configTemplate: string = await fs.readFile(
        path.resolve(__dirname, '../templates/config.template'),
        'utf-8'
    );

    let config: string = configTemplate
        .replace('<modules>', JSON.stringify(answers.modules))
        .replace('<format>', JSON.stringify(answers.format))
        .replace('<parallel>', answers.parallel.toString())

    if (isWDIOIncluded) {
        config = config
            .replace('<importPageObject>', `const App = require("./page_object");`)
            .replace('<configPageObject>', 'pageObject: new App(),');
    }

    config = config
        .replace(/<.+?>/g, '')
        .replace(/\n\s+\n/g, '\n');

    await fs.writeFile('config.js', config, 'utf-8');
    await fs.ensureDir('./features');
    await fs.ensureDir('./memory/');

    const memoryTemplate: string = await fs.readFile(
        path.resolve(__dirname, '../templates/memory.template'),
        'utf-8'
    );

    await fs.writeFile('./memory/index.js', memoryTemplate, 'utf-8');

    if (isWDIOIncluded) {
        await fs.ensureDir('./page_object');
        const poTemplate: string = await fs.readFile(
            path.resolve(__dirname, '../templates/po.template'),
            'utf-8'
        );
        await fs.writeFile('./page_object/index.js', poTemplate, 'utf-8');
    }

    yarnInstall({
        deps: ['@cucumber-e2e/po2', '@cucumber-e2e/memory2'],
        cwd: process.cwd(),
        respectNpm5: true
    });
}
