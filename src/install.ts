import { prompt } from 'inquirer';
import { readFile, writeFile } from 'fs/promises';
import { ensureDir } from 'fs-extra';
import { resolve } from 'path';
import yarnInstall from 'yarn-install';
import deps, {steps, format, modules, additionalModules, ModuleDefinition} from './deps';
import { compile } from 'ejs';

type Answers = {
    steps: Array<string>,
    formats: Array<string>,
    modules: Array<string>,
    additionalModules: Array<string>,
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
    const answers = await prompt([
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
        },
        {
            type: 'checkbox',
            message: 'select additional modules to install:',
            name: 'additionalModules',
            choices: packs(additionalModules)
        },
    ]) as Answers;

    const stepsPackages: Array<string> = packages(answers.steps, steps);
    const formatPackages: Array<string> = packages(answers.formats, format);
    const modulePackages: Array<string> = packages(answers.modules, modules);
    const additionalPackages: Array<string> = packages(answers.additionalModules, additionalModules);

    const isTypescript = answers.moduleSystem === 'Typescript';
    const isWdioIncluded = answers.steps.includes('wdio');
    const isPlaywrightIncluded = answers.steps.includes('playwright');
    const isApiIncluded = answers.steps.includes('api');
    //checking if user selected only one browser driver
    if (isPlaywrightIncluded && isWdioIncluded) {
        throw new Error('Please select only one browser driver');
    }
    const isPOIncluded: boolean = isWdioIncluded || isPlaywrightIncluded;
    const isTemplateIncluded: boolean = answers.modules.includes('template');

    // add ts-node package if module system is typescript
    // put tsconfig
    if (isTypescript) {
        requiredDeps.push('ts-node');
        const tsconfig = await readFile(
            resolve(__dirname, '../templates/tsconfig.json'),
            'utf-8'
        );
        await writeFile(`./tsconfig.json`, tsconfig, 'utf-8');
    }
    const configTemplate: string = await readFile(
        resolve(__dirname, '../templates/config.ejs'),
        'utf-8'
    );
    const configEjs = compile(configTemplate);
    const stepDefinitionGlob = `step_definition/*.${isTypescript ? 'ts' : 'js'}`;
    const stepsPackagesGlobs = [...stepsPackages].map(p => `node_modules/${p}/index.js`);
    const config = configEjs({
        steps: JSON.stringify([stepDefinitionGlob, ...stepsPackagesGlobs]),
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

    await ensureDir('./features');
    await ensureDir('./memory');
    await ensureDir('./report');
    await ensureDir('./step_definition');

    if (isPOIncluded) {
        let poModule: string | undefined;
        if (isWdioIncluded) poModule = '@qavajs/po';
        if (isPlaywrightIncluded) poModule = '@qavajs/po-playwright';
        if (!poModule) throw new Error('No PO module');
        requiredDeps.push(poModule);
        const featureTemplate: string = await readFile(
            resolve(__dirname, '../templates/feature.ejs'),
            'utf-8'
        );
        const featureEjs = compile(featureTemplate);
        const featureFile = featureEjs();
        await writeFile('./features/qavajs.feature', replaceNewLines(featureFile), 'utf-8');

        //create page object folder
        await ensureDir('./page_object');
        const poTemplate: string = await readFile(
            resolve(__dirname, '../templates/po.ejs'),
            'utf-8'
        );
        const poEjs = compile(poTemplate);
        const poFile = poEjs({
            moduleSystem: answers.moduleSystem,
            poModule
        })
        await writeFile(`./page_object/index.${isTypescript ? 'ts' : 'js'}`, replaceNewLines(poFile), 'utf-8');
    }

    if (isApiIncluded) {
        const featureTemplate: string = await readFile(
            resolve(__dirname, '../templates/featureApi.ejs'),
            'utf-8'
        );
        const featureEjs = compile(featureTemplate);
        const featureFile = featureEjs();
        await writeFile('./features/qavajsApi.feature', replaceNewLines(featureFile), 'utf-8');
    }

    if (isTemplateIncluded) {
        await ensureDir('./templates');
    }

    await writeFile(`config.${isTypescript ? 'ts' : 'js'}`, replaceNewLines(config), 'utf-8');

    const memoryTemplate: string = await readFile(
        resolve(__dirname, '../templates/memory.ejs'),
        'utf-8'
    );
    const memoryEjs = compile(memoryTemplate);
    const memoryFile = memoryEjs({
        moduleSystem: answers.moduleSystem
    })

    await writeFile(`./memory/index.${isTypescript ? 'ts' : 'js'}`, replaceNewLines(memoryFile), 'utf-8');

    const modulesToInstall = [
        ...requiredDeps,
        ...stepsPackages,
        ...formatPackages,
        ...modulePackages,
        ...additionalPackages
    ];
    console.log('installing packages...');
    console.log(modulesToInstall);

    yarnInstall({
        deps: modulesToInstall,
        cwd: process.cwd(),
        respectNpm5: true
    });

    console.log('test script:');
    console.log(`npx qavajs run --config config.${isTypescript ? 'ts' : 'js'}`);
}
