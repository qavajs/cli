export default [
    '@cucumber/cucumber',
    '@qavajs/memory'
]

export type ModuleDefinition = {
    module: string,
    packageName: string,
    out?: string
}

export const steps: Array<ModuleDefinition> = [
    { module: 'wdio', packageName: '@qavajs/steps-wdio' },
    { module: 'playwright', packageName: '@qavajs/steps-playwright' },
    { module: 'api', packageName: '@qavajs/steps-api' },
    { module: 'memory', packageName: '@qavajs/steps-memory' },
    { module: 'files', packageName: '@qavajs/steps-files' },
    { module: 'sql', packageName: '@qavajs/steps-sql' },
    { module: 'accessibility', packageName: '@qavajs/steps-accessibility' }
]

export const format: Array<ModuleDefinition> = [
    { module: 'report-portal', packageName: '@qavajs/format-report-portal', out: 'report/rp.out' },
    { module: 'console', packageName: '@qavajs/console-formatter' },
    { module: 'xunit', packageName: '@qavajs/xunit-formatter', out: 'report/report.xml' },
    { module: 'html', packageName: '@qavajs/html-formatter', out: 'report/report.html' },
]

export const modules: Array<ModuleDefinition> = [
    { module: 'template', packageName: '@qavajs/template' },
    { module: 'soft-assertion', packageName: '@qavajs/soft-assertion' },
]

