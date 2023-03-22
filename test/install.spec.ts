import {test, jest} from '@jest/globals';
import install from '../src/install';

import inquirer from 'inquirer';
import fs from 'fs-extra';
// @ts-ignore
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
        moduleSystem: 'CommonJS'
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
                '  default: {',
                '    paths: ["features/**/*.feature"],',
                '    require: [],',
                '    requireModule: [],',
                '    format: [],',
                '    memory: new Memory(),',
                '    publishQuiet: true,',
                '  }',
                '}',
                ''
            ]),
            'utf-8'
        ],
        [
            './memory/index.js',
            multiline([
                'module.exports = class Constants {',
                '}',
                '',
            ]),
            'utf-8'
        ]
    ]);
    // @ts-ignore
    expect(yarnInstall.mock.calls).toEqual([
        [
            {
                deps: ['@cucumber/cucumber', '@qavajs/memory'],
                respectNpm5: true,
                cwd: process.cwd(),
            }
        ]
    ])
});

test('template install', async () => {
    // @ts-ignore
    inquirer.prompt.mockResolvedValue({
        steps: [],
        formats: [],
        modules: ['template'],
        moduleSystem: 'CommonJS'
    });
    // @ts-ignore
    fs.readFile.mockImplementation(fsActual.readFile);
    await install();
    // @ts-ignore
    expect(fs.ensureDir.mock.calls).toEqual([
        ['./features'],
        ['./memory'],
        ['./report'],
        ['./templates']
    ]);
    // @ts-ignore
    expect(fs.writeFile.mock.calls).toEqual([
        [
            'config.js',
            multiline([
                'const Memory = require("./memory");',
                'module.exports = {',
                '  default: {',
                '    paths: ["features/**/*.feature"],',
                '    require: [],',
                '    requireModule: ["@qavajs/template"],',
                '    format: [],',
                '    memory: new Memory(),',
                '    templates: ["templates/*.feature"],',
                '    publishQuiet: true,',
                '  }',
                '}',
                ''
            ]),
            'utf-8'
        ],
        [
            './memory/index.js',
            multiline([
                'module.exports = class Constants {',
                '}',
                '',
            ]),
            'utf-8'
        ]
    ]);
    // @ts-ignore
    expect(yarnInstall.mock.calls).toEqual([
        [
            {
                deps: ['@cucumber/cucumber', '@qavajs/memory', '@qavajs/template'],
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
        moduleSystem: 'CommonJS'
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
            './page_object/index.js',
            multiline([
                'const { $, $$, Component } = require("@qavajs/po");',
                'module.exports = class App {',
                '  Body = $("body");',
                '  GetStartedButton = $("a.button[href=\'/docs/intro\']");',
                '}',
                '',
            ]),
            'utf-8'
        ],
        [
            'config.js',
            multiline([
                'const Memory = require("./memory");',
                'const App = require("./page_object");',
                'module.exports = {',
                '  default: {',
                '    paths: ["features/**/*.feature"],',
                '    require: ["node_modules/@qavajs/steps-wdio/index.js"],',
                '    requireModule: [],',
                '    format: [],',
                '    memory: new Memory(),',
                '    pageObject: new App(),',
                '    browser: {',
                '      capabilities: {',
                '        browserName: "chrome"',
                '      }',
                '    },',
                '    publishQuiet: true,',
                '  }',
                '}',
                ''
            ]),
            'utf-8'
        ],
        [
            './memory/index.js',
            multiline([
                'module.exports = class Constants {',
                '}',
                '',
            ]),
            'utf-8'
        ]
    ]);
    // @ts-ignore
    expect(yarnInstall.mock.calls).toEqual([
        [
            {
                deps: ['@cucumber/cucumber', '@qavajs/memory', '@qavajs/po', '@qavajs/steps-wdio'],
                respectNpm5: true,
                cwd: process.cwd(),
            }
        ]
    ])
});

test('wdio with html formatter install', async () => {
    // @ts-ignore
    inquirer.prompt.mockResolvedValue({
        steps: ['wdio'],
        formats: ['html'],
        modules: [],
        moduleSystem: 'CommonJS'
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
            './page_object/index.js',
            multiline([
                'const { $, $$, Component } = require("@qavajs/po");',
                'module.exports = class App {',
                '  Body = $("body");',
                '  GetStartedButton = $("a.button[href=\'/docs/intro\']");',
                '}',
                ''
            ]),
            'utf-8'
        ],
        [
            'config.js',
            multiline([
                'const Memory = require("./memory");',
                'const App = require("./page_object");',
                'module.exports = {',
                '  default: {',
                '    paths: ["features/**/*.feature"],',
                '    require: ["node_modules/@qavajs/steps-wdio/index.js"],',
                '    requireModule: [],',
                '    format: ["@qavajs/html-formatter:report/report.html"],',
                '    memory: new Memory(),',
                '    pageObject: new App(),',
                '    browser: {',
                '      capabilities: {',
                '        browserName: "chrome"',
                '      }',
                '    },',
                '    publishQuiet: true,',
                '  }',
                '}',
                ''
            ]),
            'utf-8'
        ],
        [
            './memory/index.js',
            multiline([
                'module.exports = class Constants {',
                '}',
                '',
            ]),
            'utf-8'
        ]
    ]);
    // @ts-ignore
    expect(yarnInstall.mock.calls).toEqual([
        [
            {
                deps: [
                    '@cucumber/cucumber',
                    '@qavajs/memory',
                    '@qavajs/po',
                    '@qavajs/steps-wdio',
                    '@qavajs/html-formatter'
                ],
                respectNpm5: true,
                cwd: process.cwd(),
            }
        ]
    ])
});

test('wdio with console formatter install', async () => {
    // @ts-ignore
    inquirer.prompt.mockResolvedValue({
        steps: ['wdio'],
        formats: ['console'],
        modules: [],
        moduleSystem: 'CommonJS'
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
            './page_object/index.js',
            multiline([
                'const { $, $$, Component } = require("@qavajs/po");',
                'module.exports = class App {',
                '  Body = $("body");',
                '  GetStartedButton = $("a.button[href=\'/docs/intro\']");',
                '}',
                '',
            ]),
            'utf-8'
        ],
        [
            'config.js',
            multiline([
                'const Memory = require("./memory");',
                'const App = require("./page_object");',
                'module.exports = {',
                '  default: {',
                '    paths: ["features/**/*.feature"],',
                '    require: ["node_modules/@qavajs/steps-wdio/index.js"],',
                '    requireModule: [],',
                '    format: ["@qavajs/console-formatter"],',
                '    memory: new Memory(),',
                '    pageObject: new App(),',
                '    browser: {',
                '      capabilities: {',
                '        browserName: "chrome"',
                '      }',
                '    },',
                '    publishQuiet: true,',
                '  }',
                '}',
                ''
            ]),
            'utf-8'
        ],
        [
            './memory/index.js',
            multiline([
                'module.exports = class Constants {',
                '}',
                '',
            ]),
            'utf-8'
        ]
    ]);
    // @ts-ignore
    expect(yarnInstall.mock.calls).toEqual([
        [
            {
                deps: [
                    '@cucumber/cucumber',
                    '@qavajs/memory',
                    '@qavajs/po',
                    '@qavajs/steps-wdio',
                    '@qavajs/console-formatter'
                ],
                respectNpm5: true,
                cwd: process.cwd(),
            }
        ]
    ])
});

test('playwright install', async () => {
    // @ts-ignore
    inquirer.prompt.mockResolvedValue({
        steps: ['playwright'],
        formats: [],
        modules: [],
        moduleSystem: 'CommonJS'
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
            './page_object/index.js',
            multiline([
                'const { $, $$, Component } = require("@qavajs/po-playwright");',
                'module.exports = class App {',
                '  Body = $("body");',
                '  GetStartedButton = $("a.button[href=\'/docs/intro\']");',
                '}',
                '',
            ]),
            'utf-8'
        ],
        [
            'config.js',
            multiline([
                'const Memory = require("./memory");',
                'const App = require("./page_object");',
                'module.exports = {',
                '  default: {',
                '    paths: ["features/**/*.feature"],',
                '    require: ["node_modules/@qavajs/steps-playwright/index.js"],',
                '    requireModule: [],',
                '    format: [],',
                '    memory: new Memory(),',
                '    pageObject: new App(),',
                '    browser: {',
                '      capabilities: {',
                '        browserName: "chromium"',
                '      }',
                '    },',
                '    publishQuiet: true,',
                '  }',
                '}',
                ''
            ]),
            'utf-8'
        ],
        [
            './memory/index.js',
            multiline([
                'module.exports = class Constants {',
                '}',
                '',
            ]),
            'utf-8'
        ]
    ]);
    // @ts-ignore
    expect(yarnInstall.mock.calls).toEqual([
        [
            {
                deps: ['@cucumber/cucumber', '@qavajs/memory', '@qavajs/po-playwright', '@qavajs/steps-playwright'],
                respectNpm5: true,
                cwd: process.cwd(),
            }
        ]
    ])
});

test('wdio and sql install', async () => {
    // @ts-ignore
    inquirer.prompt.mockResolvedValue({
        steps: ['wdio', 'sql'],
        formats: [],
        modules: [],
        moduleSystem: 'CommonJS'
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
            './page_object/index.js',
            multiline([
                'const { $, $$, Component } = require("@qavajs/po");',
                'module.exports = class App {',
                '  Body = $("body");',
                '  GetStartedButton = $("a.button[href=\'/docs/intro\']");',
                '}',
                '',
            ]),
            'utf-8'
        ],
        [
            'config.js',
            multiline([
                'const Memory = require("./memory");',
                'const App = require("./page_object");',
                'module.exports = {',
                '  default: {',
                '    paths: ["features/**/*.feature"],',
                '    require: ["node_modules/@qavajs/steps-wdio/index.js","node_modules/@qavajs/steps-sql/index.js"],',
                '    requireModule: [],',
                '    format: [],',
                '    memory: new Memory(),',
                '    pageObject: new App(),',
                '    browser: {',
                '      capabilities: {',
                '        browserName: "chrome"',
                '      }',
                '    },',
                '    publishQuiet: true,',
                '  }',
                '}',
                ''
            ]),
            'utf-8'
        ],
        [
            './memory/index.js',
            multiline([
                'module.exports = class Constants {',
                '}',
                '',
            ]),
            'utf-8'
        ]
    ]);
    // @ts-ignore
    expect(yarnInstall.mock.calls).toEqual([
        [
            {
                deps: [
                    '@cucumber/cucumber',
                    '@qavajs/memory',
                    '@qavajs/po',
                    '@qavajs/steps-wdio',
                    '@qavajs/steps-sql'
                ],
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
        moduleSystem: 'CommonJS'
    });

    await expect(install).rejects.toThrow('notFound module is not found');
});

test('both wdio and playwright selected', async () => {
    // @ts-ignore
    inquirer.prompt.mockResolvedValue({
        steps: ['wdio', 'playwright'],
        formats: [],
        modules: [],
        moduleSystem: 'CommonJS'
    });

    await expect(install).rejects.toThrow('Please select only one browser driver');
});

test('wdio with console formatter install es modules', async () => {
    // @ts-ignore
    inquirer.prompt.mockResolvedValue({
        steps: ['wdio'],
        formats: ['console'],
        modules: ['template'],
        moduleSystem: 'ES Modules'
    });
    // @ts-ignore
    fs.readFile.mockImplementation(fsActual.readFile);
    await install();
    // @ts-ignore
    expect(fs.ensureDir.mock.calls).toEqual([
        ['./features'],
        ['./memory'],
        ['./report'],
        ['./page_object'],
        ['./templates']
    ]);
    // @ts-ignore
    expect(fs.writeFile.mock.calls).toEqual([
        [
            './features/qavajs.feature',
            multiline([
                'Feature: qavajs framework',
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
            './page_object/index.js',
            multiline([
                'import { $, $$, Component } from "@qavajs/po";',
                'export default class App {',
                '  Body = $("body");',
                '  GetStartedButton = $("a.button[href=\'/docs/intro\']");',
                '}',
                '',
            ]),
            'utf-8'
        ],
        [
            'config.js',
            multiline([
                'import Memory from "./memory/index.js";',
                'import App from "./page_object/index.js";',
                'export default {',
                '  paths: ["features/**/*.feature"],',
                '  import: ["node_modules/@qavajs/steps-wdio/index.js"],',
                '  requireModule: ["@qavajs/template"],',
                '  format: ["@qavajs/console-formatter"],',
                '  memory: new Memory(),',
                '  pageObject: new App(),',
                '  browser: {',
                '    capabilities: {',
                '      browserName: "chrome"',
                '    }',
                '  },',
                '  templates: ["templates/*.feature"],',
                '  publishQuiet: true,',
                '}',
                ''
            ]),
            'utf-8'
        ],
        [
            './memory/index.js',
            multiline([
                'export default class Constants {',
                '}',
                '',
            ]),
            'utf-8'
        ]
    ]);
    // @ts-ignore
    expect(yarnInstall.mock.calls).toEqual([
        [
            {
                deps: [
                    '@cucumber/cucumber',
                    '@qavajs/memory',
                    '@qavajs/po',
                    '@qavajs/steps-wdio',
                    '@qavajs/console-formatter',
                    '@qavajs/template'
                ],
                respectNpm5: true,
                cwd: process.cwd(),
            }
        ]
    ])
});

test('wdio with console formatter install typescript', async () => {
    // @ts-ignore
    inquirer.prompt.mockResolvedValue({
        steps: ['wdio'],
        formats: ['console'],
        modules: ['template'],
        moduleSystem: 'Typescript'
    });
    // @ts-ignore
    fs.readFile.mockImplementation(fsActual.readFile);
    await install();
    // @ts-ignore
    expect(fs.ensureDir.mock.calls).toEqual([
        ['./features'],
        ['./memory'],
        ['./report'],
        ['./page_object'],
        ['./templates']
    ]);
    // @ts-ignore
    expect(fs.writeFile.mock.calls).toEqual([
        [
            './tsconfig.json',
            multiline([
                '{',
                '  "compilerOptions": {',
                '    "target": "es2016",',
                '    "module": "commonjs",',
                '    "moduleResolution": "node",',
                '    "outDir": "./lib",',
                '    "esModuleInterop": true,',
                '    "forceConsistentCasingInFileNames": true,',
                '    "strict": true,',
                '    "skipLibCheck": true',
                '  }',
                '}',
                ''
            ]),
            'utf-8'
        ],
        [
            './features/qavajs.feature',
            multiline([
                'Feature: qavajs framework',
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
            './page_object/index.ts',
            multiline([
                'import { $, $$, Component } from "@qavajs/po";',
                'export default class App {',
                '  Body = $("body");',
                '  GetStartedButton = $("a.button[href=\'/docs/intro\']");',
                '}',
                '',
            ]),
            'utf-8'
        ],
        [
            'config.ts',
            multiline([
                'import Memory from "./memory";',
                'import App from "./page_object";',
                'export default {',
                '  paths: ["features/**/*.feature"],',
                '  require: ["node_modules/@qavajs/steps-wdio/index.js"],',
                '  requireModule: ["@qavajs/template"],',
                '  format: ["@qavajs/console-formatter"],',
                '  memory: new Memory(),',
                '  pageObject: new App(),',
                '  browser: {',
                '    capabilities: {',
                '      browserName: "chrome"',
                '    }',
                '  },',
                '  templates: ["templates/*.feature"],',
                '  publishQuiet: true,',
                '}',
                ''
            ]),
            'utf-8'
        ],
        [
            './memory/index.ts',
            multiline([
                'export default class Constants {',
                '}',
                '',
            ]),
            'utf-8'
        ]
    ]);
    // @ts-ignore
    expect(yarnInstall.mock.calls).toEqual([
        [
            {
                deps: [
                    '@cucumber/cucumber',
                    '@qavajs/memory',
                    'ts-node',
                    '@qavajs/po',
                    '@qavajs/steps-wdio',
                    '@qavajs/console-formatter',
                    '@qavajs/template'
                ],
                respectNpm5: true,
                cwd: process.cwd(),
            }
        ]
    ])
});
