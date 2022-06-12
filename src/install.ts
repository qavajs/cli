import inquirer from 'inquirer';

export default async function main() {
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
            name: 'formatters',
            choices: ['html', 'json', 'progress']
        }
    ]);

    console.log(answers)
}
