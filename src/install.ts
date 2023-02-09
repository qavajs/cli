import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import yarnInstall from 'yarn-install';
import deps, {steps, format, modules, ModuleDefinition} from './deps';
import ejs from 'ejs';

type Answers = {
    steps: Array<string>,
    formats: Array<string>,
    modules: Array<string>,
    parallel: number,
    moduleSystem: string
}

const packs = (deps: Array<ModuleDefinition>) => deps.map(({module}) => module);
const packages = (moduleList: Array<string>, packageMap: Array<ModuleDefinition>): Array<string> => {
    return moduleList
        .map((module: string) => {
            const pkg = packageMap.find((p: ModuleDefinition) => p.module === module);
            if (!pkg) throw new Error(`${module} module is not found`);
            return pkg.packageName
        }) as Array<string>
}

const replaceNewLines = (text: string) => text.replace(/(\n\r?)+/g, '\n');

export default async function install(): Promise<void> {
    const requiredDeps = [...deps];
    const answers = await inquirer.prompt([
        {
            type: 'list',
            message: 'select module system you want to use:',
            name: 'moduleSystem',
            choices: [
                'CommonJS',
                'ES Modules',
                'Typescript'
            ]
        },
        {
            type: 'checkbox',
            message: 'select step packages to install:',
            name: 'steps',
            choices: packs(steps)
        },
        {
            type: 'checkbox',
            message: 'select modules to install:',
            name: 'modules',
            choices: packs(modules)
        },
        {
            type: 'checkbox',
            message: 'select formatters (reporters) to install:',
            name: 'formats',
            choices: packs(format)
        }
    ]) as Answers;

    const stepsPackages: Array<string> = packages(answers.steps, steps);
    const formatPackages: Array<string> = packages(answers.formats, format);
    const modulePackages: Array<string> = packages(answers.modules, modules);

    const isTypescript = answers.moduleSystem === 'Typescript';
    const isWdioIncluded = answers.steps.includes('wdio');
    const isPlaywrightIncluded = answers.steps.includes('playwright');
    //checking if user selected only one browser driver
    if (isPlaywrightIncluded && isWdioIncluded) {
        throw new Error('Please select only one browser driver');
    }
    const isPOIncluded: boolean = isWdioIncluded || isPlaywrightIncluded;
    const isTemplateIncluded: boolean = answers.modules.includes('template');

    const configTemplate: string = await fs.readFile(
        path.resolve(__dirname, '../templates/config.ejs'),
        'utf-8'
    );
    const configEjs = ejs.compile(configTemplate);
    const config = configEjs({
        steps: JSON.stringify([...stepsPackages].map(p => `node_modules/${p}`)),
        moduleSystem: answers.moduleSystem,
        modules: JSON.stringify(modulePackages),
        format: JSON.stringify(
            format
                .filter(p => formatPackages.includes(p.packageName))
                .map(p => p.packageName + (p.out ? `:${p.out}` : ''))
        ),
        isWdioIncluded,
        isPlaywrightIncluded,
        isTemplateIncluded
    });

    await fs.ensureDir('./features');
    await fs.ensureDir('./memory');
    await fs.ensureDir('./report');

    if (isPOIncluded) {
        const poModule = isWdioIncluded ? '@qavajs/po' : '@qavajs/po-playwright';
        requiredDeps.push(poModule);
        const featureTemplate: string = await fs.readFile(
            path.resolve(__dirname, '../templates/feature.ejs'),
            'utf-8'
        );
        const featureEjs = ejs.compile(featureTemplate);
        const featureFile = featureEjs();
        await fs.writeFile('./features/qavajs.feature', replaceNewLines(featureFile), 'utf-8');

        //create page object folder
        await fs.ensureDir('./page_object');
        const poTemplate: string = await fs.readFile(
            path.resolve(__dirname, '../templates/po.ejs'),
            'utf-8'
        );
        const poEjs = ejs.compile(poTemplate);
        const poFile = poEjs({
            moduleSystem: answers.moduleSystem,
            poModule
        })
        await fs.writeFile(`./page_object/index.${isTypescript ? 'ts' : 'js'}`, replaceNewLines(poFile), 'utf-8');
    }

    if (isTemplateIncluded) {
        await fs.ensureDir('./templates');
    }

    await fs.writeFile(`config.${isTypescript ? 'ts' : 'js'}`, replaceNewLines(config), 'utf-8');

    const memoryTemplate: string = await fs.readFile(
        path.resolve(__dirname, '../templates/memory.ejs'),
        'utf-8'
    );
    const memoryEjs = ejs.compile(memoryTemplate);
    const memoryFile = memoryEjs({
        moduleSystem: answers.moduleSystem
    })

    await fs.writeFile(`./memory/index.${isTypescript ? 'ts' : 'js'}`, replaceNewLines(memoryFile), 'utf-8');

    const modulesToInstall = [...requiredDeps, ...stepsPackages, ...formatPackages, ...modulePackages];
    console.log('installing packages...');
    console.log(modulesToInstall);

    yarnInstall({
        deps: modulesToInstall,
        cwd: process.cwd(),
        respectNpm5: true
    });
}
