import {test, jest} from '@jest/globals';
import install from '../src/install';

import inquirer from 'inquirer';
import fs from 'fs-extra';
import yarnInstall from 'yarn-install';

jest.mock('inquirer');
jest.mock('fs-extra');
jest.mock('yarn-install');
const fsActual = jest.requireActual('fs-extra')

const multiline = (lines: Array<string>) => lines.join('\n');

test('minimum install', async () => {
    // @ts-ignore
    inquirer.prompt.mockResolvedValue({
        steps: [],
        formats: [],
        modules: [],
        parallel: 1
    });
    // @ts-ignore
    fs.readFile.mockImplementation(fsActual.readFile);
    await install();
    // @ts-ignore
    expect(fs.ensureDir.mock.calls).toEqual([
        ['./features'],
        ['./memory'],
        ['./report']
    ]);
    // @ts-ignore
    expect(fs.writeFile.mock.calls).toEqual([
        [
            'config.js',
            multiline([
                'const Memory = require("./memory");',
                'module.exports = {',
                '    default: {',
                '        paths: ["features/**/*.feature"],',
                '        require: [],',
                '        requireModule: [],',
                '        format: [],',
                '        memory: new Memory(),',
                '        parallel: 1,',
                '        publishQuiet: true',
                '    }',
                '}',
                ''
            ]),
            'utf-8'
        ],
        [
            './memory/index.js',
            multiline([
                'class Constants {',
                '',
                '}',
                '',
                'module.exports = Constants;',
                ''
            ]),
            'utf-8'
        ]
    ]);
    // @ts-ignore
    expect(yarnInstall.mock.calls).toEqual([
        [
            {
                deps: ['@cucumber/cucumber', '@qavajs/po', '@qavajs/memory'],
                respectNpm5: true,
                cwd: process.cwd(),
            }
        ]
    ])
});

test('wdio install', async () => {
    // @ts-ignore
    inquirer.prompt.mockResolvedValue({
        steps: ['wdio'],
        formats: [],
        modules: [],
        parallel: 1
    });
    // @ts-ignore
    fs.readFile.mockImplementation(fsActual.readFile);
    await install();
    // @ts-ignore
    expect(fs.ensureDir.mock.calls).toEqual([
        ['./features'],
        ['./memory'],
        ['./report'],
        ['./page_object']
    ]);
    // @ts-ignore
    expect(fs.writeFile.mock.calls).toEqual([
        [
            './features/qavajs.feature',
            multiline([
                'Feature: qavajs framework',
                '',
                '  Scenario: Open qavajs docs',
                '    Given I open \'https://qavajs.github.io/\' url',
                '    When I click \'Get Started Button\'',
                '    And I wait until \'Get Started Button\' to be invisible',
                '    Then I expect text of \'Body\' to contain \'npm install @qavajs/cli\'',
                '',
            ]),
            'utf-8'
        ],
        [
            'config.js',
            multiline([
                'const Memory = require("./memory");',
                'const App = require("./page_object");',
                '',
                'module.exports = {',
                '    default: {',
                '        paths: ["features/**/*.feature"],',
                '        require: ["node_modules/@qavajs/steps-wdio"],',
                '        requireModule: [],',
                '        format: [],',
                '        memory: new Memory(),',
                '        pageObject: new App(),',
                '        browser: {',
                '            capabilities: {',
                '                browserName: "chrome"',
                '            }',
                '        },',
                '        parallel: 1,',
                '        publishQuiet: true',
                '    }',
                '}',
                ''
            ]),
            'utf-8'
        ],
        [
            './memory/index.js',
            multiline([
                'class Constants {',
                '',
                '}',
                '',
                'module.exports = Constants;',
                ''
            ]),
            'utf-8'
        ],
        [
            './page_object/index.js',
            multiline([
                'const { $, $$ } = require("@qavajs/po");',
                '',
                'class App {',
                '    Body = $("body");',
                '    GetStartedButton = $(\'a.button[href="/docs/intro"]\');',
                '}',
                '',
                'module.exports = App;',
                ''
            ]),
            'utf-8'
        ]
    ]);
    // @ts-ignore
    expect(yarnInstall.mock.calls).toEqual([
        [
            {
                deps: ['@cucumber/cucumber', '@qavajs/po', '@qavajs/memory', '@qavajs/steps-wdio'],
                respectNpm5: true,
                cwd: process.cwd(),
            }
        ]
    ])
});

test('package not found', async () => {
    // @ts-ignore
    inquirer.prompt.mockResolvedValue({
        steps: ['notFound'],
        formats: [],
        modules: [],
        parallel: 1
    });

    await expect(install).rejects.toThrow('notFound module is not found');
});
