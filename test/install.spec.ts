import {test, beforeEach, vi, expect} from 'vitest';
import install from '../src/install';
import {ensureDir} from 'fs-extra';
import {readFile, writeFile} from 'node:fs/promises';
// @ts-ignore
import yarnInstall from 'yarn-install';

const inquirer = import('inquirer').then(m => m.default);
vi.mock('inquirer', () => {
    return Promise.resolve({
        default: {
            prompt: vi.fn()
        }
    })
});

vi.mock('node:fs/promises', () => {
    return {
        readFile: vi.fn(),
        writeFile: vi.fn()
    }
});
vi.mock('fs-extra', () => {
    return {
        ensureDir: vi.fn()
    }
});
vi.mock('yarn-install');

const fsActual = vi.importActual('node:fs/promises');

const multiline = (lines: Array<string>) => lines.join('\n');

let prompt: Function;
beforeEach(async () => {
    vi.resetAllMocks();
    prompt = (await inquirer).prompt;
});
test('minimum install', async () => {
    //@ts-ignore
    prompt.mockResolvedValue({
        steps: [],
        formats: [],
        modules: [],
        additionalModules: [],
        moduleSystem: 'CommonJS'
    });
    // @ts-ignore
    readFile.mockImplementation((await fsActual).readFile);
    await install();
    // @ts-ignore
    expect(ensureDir.mock.calls).toEqual([
        ['./features'],
        ['./memory'],
        ['./report'],
        ['./step_definition']
    ]);
    // @ts-ignore
    expect(writeFile.mock.calls).toEqual([
        [
            'config.js',
            multiline([
                'const Memory = require("./memory");',
                'module.exports = {',
                '  default: {',
                '    paths: ["features/**/*.feature"],',
                '    require: ["step_definition/*.js"],',
                '    requireModule: [],',
                '    format: [],',
                '    memory: new Memory(),',
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
        ],
        [
            './README.MD',
            multiline([
                '# qavajs',
                '## Docs',
                'https://qavajs.github.io/docs/intro',
                '## Install Modules',
                '```bash',
                'npm install',
                '```',
                '## Execute Tests',
                '```bash',
                'npx qavajs run --config config.js',
                '```',
                '## Project Structure',
                '- [config](./config.js) - main config',
                '- [features](./features) - test cases',
                '- [memory](./memory) - test data',
                '- [page_object](./page_object) - page objects',
                '- [step_definitions](./step_definitions) - project specific step definitions',
                '- [report](./report) - reports',
                ''
            ]),
            'utf-8'
        ],
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
    prompt.mockResolvedValue({
        steps: [],
        formats: [],
        modules: ['template'],
        additionalModules: [],
        moduleSystem: 'CommonJS'
    });
    // @ts-ignore
    readFile.mockImplementation((await fsActual).readFile);
    await install();
    // @ts-ignore
    expect(ensureDir.mock.calls).toEqual([
        ['./features'],
        ['./memory'],
        ['./report'],
        ['./step_definition'],
        ['./templates']
    ]);
    // @ts-ignore
    expect(writeFile.mock.calls).toEqual([
        [
            'config.js',
            multiline([
                'const Memory = require("./memory");',
                'module.exports = {',
                '  default: {',
                '    paths: ["features/**/*.feature"],',
                '    require: ["step_definition/*.js"],',
                '    requireModule: ["@qavajs/template"],',
                '    format: [],',
                '    memory: new Memory(),',
                '    templates: ["templates/*.feature"],',
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
        ],
        [
            './README.MD',
            multiline([
                '# qavajs',
                '## Docs',
                'https://qavajs.github.io/docs/intro',
                '## Install Modules',
                '```bash',
                'npm install',
                '```',
                '## Execute Tests',
                '```bash',
                'npx qavajs run --config config.js',
                '```',
                '## Project Structure',
                '- [config](./config.js) - main config',
                '- [features](./features) - test cases',
                '- [memory](./memory) - test data',
                '- [page_object](./page_object) - page objects',
                '- [step_definitions](./step_definitions) - project specific step definitions',
                '- [report](./report) - reports',
                ''
            ]),
            'utf-8'
        ],
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
    prompt.mockResolvedValue({
        steps: ['wdio'],
        formats: [],
        modules: [],
        additionalModules: [],
        moduleSystem: 'CommonJS'
    });
    // @ts-ignore
    readFile.mockImplementation((await fsActual).readFile);
    await install();
    // @ts-ignore
    expect(ensureDir.mock.calls).toEqual([
        ['./features'],
        ['./memory'],
        ['./report'],
        ['./step_definition'],
        ['./page_object']
    ]);
    // @ts-ignore
    expect(writeFile.mock.calls).toEqual([
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
                '    require: ["step_definition/*.js","node_modules/@qavajs/steps-wdio/index.js"],',
                '    requireModule: [],',
                '    format: [],',
                '    memory: new Memory(),',
                '    pageObject: new App(),',
                '    browser: {',
                '      capabilities: {',
                '        browserName: "chrome"',
                '      }',
                '    },',
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
        ],
        [
            './README.MD',
            multiline([
                '# qavajs',
                '## Docs',
                'https://qavajs.github.io/docs/intro',
                '## Install Modules',
                '```bash',
                'npm install',
                '```',
                '## Execute Tests',
                '```bash',
                'npx qavajs run --config config.js',
                '```',
                '## Project Structure',
                '- [config](./config.js) - main config',
                '- [features](./features) - test cases',
                '- [memory](./memory) - test data',
                '- [page_object](./page_object) - page objects',
                '- [step_definitions](./step_definitions) - project specific step definitions',
                '- [report](./report) - reports',
                ''
            ]),
            'utf-8'
        ],
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
    prompt.mockResolvedValue({
        steps: ['wdio'],
        formats: ['html'],
        modules: [],
        additionalModules: [],
        moduleSystem: 'CommonJS'
    });
    // @ts-ignore
    readFile.mockImplementation((await fsActual).readFile);
    await install();
    // @ts-ignore
    expect(ensureDir.mock.calls).toEqual([
        ['./features'],
        ['./memory'],
        ['./report'],
        ['./step_definition'],
        ['./page_object']
    ]);
    // @ts-ignore
    expect(writeFile.mock.calls).toEqual([
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
                '    require: ["step_definition/*.js","node_modules/@qavajs/steps-wdio/index.js"],',
                '    requireModule: [],',
                '    format: ["@qavajs/html-formatter:report/report.html"],',
                '    memory: new Memory(),',
                '    pageObject: new App(),',
                '    browser: {',
                '      capabilities: {',
                '        browserName: "chrome"',
                '      }',
                '    },',
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
        ],
        [
            './README.MD',
            multiline([
                '# qavajs',
                '## Docs',
                'https://qavajs.github.io/docs/intro',
                '## Install Modules',
                '```bash',
                'npm install',
                '```',
                '## Execute Tests',
                '```bash',
                'npx qavajs run --config config.js',
                '```',
                '## Project Structure',
                '- [config](./config.js) - main config',
                '- [features](./features) - test cases',
                '- [memory](./memory) - test data',
                '- [page_object](./page_object) - page objects',
                '- [step_definitions](./step_definitions) - project specific step definitions',
                '- [report](./report) - reports',
                ''
            ]),
            'utf-8'
        ],
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
    prompt.mockResolvedValue({
        steps: ['wdio'],
        formats: ['console'],
        modules: [],
        additionalModules: [],
        moduleSystem: 'CommonJS'
    });
    // @ts-ignore
    readFile.mockImplementation((await fsActual).readFile);
    await install();
    // @ts-ignore
    expect(ensureDir.mock.calls).toEqual([
        ['./features'],
        ['./memory'],
        ['./report'],
        ['./step_definition'],
        ['./page_object']
    ]);
    // @ts-ignore
    expect(writeFile.mock.calls).toEqual([
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
                '    require: ["step_definition/*.js","node_modules/@qavajs/steps-wdio/index.js"],',
                '    requireModule: [],',
                '    format: ["@qavajs/console-formatter"],',
                '    memory: new Memory(),',
                '    pageObject: new App(),',
                '    browser: {',
                '      capabilities: {',
                '        browserName: "chrome"',
                '      }',
                '    },',
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
        ],
        [
            './README.MD',
            multiline([
                '# qavajs',
                '## Docs',
                'https://qavajs.github.io/docs/intro',
                '## Install Modules',
                '```bash',
                'npm install',
                '```',
                '## Execute Tests',
                '```bash',
                'npx qavajs run --config config.js',
                '```',
                '## Project Structure',
                '- [config](./config.js) - main config',
                '- [features](./features) - test cases',
                '- [memory](./memory) - test data',
                '- [page_object](./page_object) - page objects',
                '- [step_definitions](./step_definitions) - project specific step definitions',
                '- [report](./report) - reports',
                ''
            ]),
            'utf-8'
        ],
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
    prompt.mockResolvedValue({
        steps: ['playwright'],
        formats: [],
        modules: [],
        additionalModules: [],
        moduleSystem: 'CommonJS'
    });
    // @ts-ignore
    readFile.mockImplementation((await fsActual).readFile);
    await install();
    // @ts-ignore
    expect(ensureDir.mock.calls).toEqual([
        ['./features'],
        ['./memory'],
        ['./report'],
        ['./step_definition'],
        ['./page_object']
    ]);
    // @ts-ignore
    expect(writeFile.mock.calls).toEqual([
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
                '    require: ["step_definition/*.js","node_modules/@qavajs/steps-playwright/index.js"],',
                '    requireModule: [],',
                '    format: [],',
                '    memory: new Memory(),',
                '    pageObject: new App(),',
                '    browser: {',
                '      capabilities: {',
                '        browserName: "chromium"',
                '      }',
                '    },',
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
        ],
        [
            './README.MD',
            multiline([
                '# qavajs',
                '## Docs',
                'https://qavajs.github.io/docs/intro',
                '## Install Modules',
                '```bash',
                'npm install',
                '```',
                '## Execute Tests',
                '```bash',
                'npx qavajs run --config config.js',
                '```',
                '## Project Structure',
                '- [config](./config.js) - main config',
                '- [features](./features) - test cases',
                '- [memory](./memory) - test data',
                '- [page_object](./page_object) - page objects',
                '- [step_definitions](./step_definitions) - project specific step definitions',
                '- [report](./report) - reports',
                ''
            ]),
            'utf-8'
        ],
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
    prompt.mockResolvedValue({
        steps: ['wdio', 'sql'],
        formats: [],
        modules: [],
        additionalModules: [],
        moduleSystem: 'CommonJS'
    });
    // @ts-ignore
    readFile.mockImplementation((await fsActual).readFile);
    await install();
    // @ts-ignore
    expect(ensureDir.mock.calls).toEqual([
        ['./features'],
        ['./memory'],
        ['./report'],
        ['./step_definition'],
        ['./page_object']
    ]);
    // @ts-ignore
    expect(writeFile.mock.calls).toEqual([
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
                '    require: ["step_definition/*.js","node_modules/@qavajs/steps-wdio/index.js","node_modules/@qavajs/steps-sql/index.js"],',
                '    requireModule: [],',
                '    format: [],',
                '    memory: new Memory(),',
                '    pageObject: new App(),',
                '    browser: {',
                '      capabilities: {',
                '        browserName: "chrome"',
                '      }',
                '    },',
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
        ],
        [
            './README.MD',
            multiline([
                '# qavajs',
                '## Docs',
                'https://qavajs.github.io/docs/intro',
                '## Install Modules',
                '```bash',
                'npm install',
                '```',
                '## Execute Tests',
                '```bash',
                'npx qavajs run --config config.js',
                '```',
                '## Project Structure',
                '- [config](./config.js) - main config',
                '- [features](./features) - test cases',
                '- [memory](./memory) - test data',
                '- [page_object](./page_object) - page objects',
                '- [step_definitions](./step_definitions) - project specific step definitions',
                '- [report](./report) - reports',
                ''
            ]),
            'utf-8'
        ],
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
    prompt.mockResolvedValue({
        steps: ['notFound'],
        formats: [],
        modules: [],
        additionalModules: [],
        moduleSystem: 'CommonJS'
    });

    await expect(install).rejects.toThrow('notFound module is not found');
});

test('both wdio and playwright selected', async () => {
    // @ts-ignore
    prompt.mockResolvedValue({
        steps: ['wdio', 'playwright'],
        formats: [],
        modules: [],
        additionalModules: [],
        moduleSystem: 'CommonJS'
    });

    await expect(install).rejects.toThrow('Please select only one browser driver');
});

test('wdio with console formatter install es modules', async () => {
    // @ts-ignore
    prompt.mockResolvedValue({
        steps: ['wdio'],
        formats: ['console'],
        modules: ['template'],
        additionalModules: [],
        moduleSystem: 'ES Modules'
    });
    // @ts-ignore
    readFile.mockImplementation((await fsActual).readFile);
    await install();
    // @ts-ignore
    expect(ensureDir.mock.calls).toEqual([
        ['./features'],
        ['./memory'],
        ['./report'],
        ['./step_definition'],
        ['./page_object'],
        ['./templates']
    ]);
    // @ts-ignore
    expect(writeFile.mock.calls).toEqual([
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
                '  import: ["step_definition/*.js","node_modules/@qavajs/steps-wdio/index.js"],',
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
        ],
        [
            './README.MD',
            multiline([
                '# qavajs',
                '## Docs',
                'https://qavajs.github.io/docs/intro',
                '## Install Modules',
                '```bash',
                'npm install',
                '```',
                '## Execute Tests',
                '```bash',
                'npx qavajs run --config config.js',
                '```',
                '## Project Structure',
                '- [config](./config.js) - main config',
                '- [features](./features) - test cases',
                '- [memory](./memory) - test data',
                '- [page_object](./page_object) - page objects',
                '- [step_definitions](./step_definitions) - project specific step definitions',
                '- [report](./report) - reports',
                ''
            ]),
            'utf-8'
        ],
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
    prompt.mockResolvedValue({
        steps: ['wdio'],
        formats: ['console'],
        modules: ['template'],
        additionalModules: [],
        moduleSystem: 'Typescript'
    });
    // @ts-ignore
    readFile.mockImplementation((await fsActual).readFile);
    await install();
    // @ts-ignore
    expect(ensureDir.mock.calls).toEqual([
        ['./features'],
        ['./memory'],
        ['./report'],
        ['./step_definition'],
        ['./page_object'],
        ['./templates']
    ]);
    // @ts-ignore
    expect(writeFile.mock.calls).toEqual([
        [
            './tsconfig.json',
            multiline([
                '{',
                '  "compilerOptions": {',
                '    "target": "es2016",',
                '    "module": "node16",',
                '    "moduleResolution": "node16",',
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
                '  require: ["step_definition/*.ts","node_modules/@qavajs/steps-wdio/index.js"],',
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
        ],
        [
            './README.MD',
            multiline([
                '# qavajs',
                '## Docs',
                'https://qavajs.github.io/docs/intro',
                '## Install Modules',
                '```bash',
                'npm install',
                '```',
                '## Execute Tests',
                '```bash',
                'npx qavajs run --config config.ts',
                '```',
                '## Project Structure',
                '- [config](./config.ts) - main config',
                '- [features](./features) - test cases',
                '- [memory](./memory) - test data',
                '- [page_object](./page_object) - page objects',
                '- [step_definitions](./step_definitions) - project specific step definitions',
                '- [report](./report) - reports',
                ''
            ]),
            'utf-8'
        ],
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

test('wdio with console formatter and wdio service adapter install typescript', async () => {
    // @ts-ignore
    prompt.mockResolvedValue({
        steps: ['wdio'],
        formats: ['console'],
        modules: ['template'],
        additionalModules: ['wdio service adapter'],
        moduleSystem: 'Typescript'
    });
    // @ts-ignore
    readFile.mockImplementation((await fsActual).readFile);
    await install();
    // @ts-ignore
    expect(ensureDir.mock.calls).toEqual([
        ['./features'],
        ['./memory'],
        ['./report'],
        ['./step_definition'],
        ['./page_object'],
        ['./templates']
    ]);
    // @ts-ignore
    expect(writeFile.mock.calls).toEqual([
        [
            './tsconfig.json',
            multiline([
                '{',
                '  "compilerOptions": {',
                '    "target": "es2016",',
                '    "module": "node16",',
                '    "moduleResolution": "node16",',
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
                '  require: ["step_definition/*.ts","node_modules/@qavajs/steps-wdio/index.js"],',
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
        ],
        [
            './README.MD',
            multiline([
                '# qavajs',
                '## Docs',
                'https://qavajs.github.io/docs/intro',
                '## Install Modules',
                '```bash',
                'npm install',
                '```',
                '## Execute Tests',
                '```bash',
                'npx qavajs run --config config.ts',
                '```',
                '## Project Structure',
                '- [config](./config.ts) - main config',
                '- [features](./features) - test cases',
                '- [memory](./memory) - test data',
                '- [page_object](./page_object) - page objects',
                '- [step_definitions](./step_definitions) - project specific step definitions',
                '- [report](./report) - reports',
                ''
            ]),
            'utf-8'
        ],
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
                    '@qavajs/template',
                    '@qavajs/wdio-service-adapter'
                ],
                respectNpm5: true,
                cwd: process.cwd(),
            }
        ]
    ])
});

test('api install', async () => {
    // @ts-ignore
    prompt.mockResolvedValue({
        steps: ['api'],
        formats: [],
        modules: [],
        additionalModules: [],
        moduleSystem: 'CommonJS'
    });
    // @ts-ignore
    readFile.mockImplementation((await fsActual).readFile);
    await install();
    // @ts-ignore
    expect(ensureDir.mock.calls).toEqual([
        ['./features'],
        ['./memory'],
        ['./report'],
        ['./step_definition']
    ]);
    // @ts-ignore
    expect(writeFile.mock.calls).toEqual([
        [
            './features/qavajsApi.feature',
            multiline([
                'Feature: qavajs framework',
                '  Scenario: Request qavajs site',
                '    When I create \'GET\' request \'request\'',
                '    And I add \'https://qavajs.github.io/\' url to \'$request\'',
                '    And I send \'$request\' request and save response as \'response\'',
                '    And I parse \'$response\' body as text',
                '    Then I expect \'$response.payload\' contains \'@qavajs\'',
                '',
            ]),
            'utf-8'
        ],
        [
            'config.js',
            multiline([
                'const Memory = require("./memory");',
                'module.exports = {',
                '  default: {',
                '    paths: ["features/**/*.feature"],',
                '    require: ["step_definition/*.js","node_modules/@qavajs/steps-api/index.js"],',
                '    requireModule: [],',
                '    format: [],',
                '    memory: new Memory(),',
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
        ],
        [
            './README.MD',
            multiline([
                '# qavajs',
                '## Docs',
                'https://qavajs.github.io/docs/intro',
                '## Install Modules',
                '```bash',
                'npm install',
                '```',
                '## Execute Tests',
                '```bash',
                'npx qavajs run --config config.js',
                '```',
                '## Project Structure',
                '- [config](./config.js) - main config',
                '- [features](./features) - test cases',
                '- [memory](./memory) - test data',
                '- [page_object](./page_object) - page objects',
                '- [step_definitions](./step_definitions) - project specific step definitions',
                '- [report](./report) - reports',
                ''
            ]),
            'utf-8'
        ],
    ]);
    // @ts-ignore
    expect(yarnInstall.mock.calls).toEqual([
        [
            {
                deps: ['@cucumber/cucumber', '@qavajs/memory', '@qavajs/steps-api'],
                respectNpm5: true,
                cwd: process.cwd(),
            }
        ]
    ])
});
