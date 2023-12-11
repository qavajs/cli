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
    { module: 'accessibility', packageName: '@qavajs/steps-accessibility' },
    { module: 'lighthouse', packageName: '@qavajs/steps-lighthouse' },
    { module: 'visual testing', packageName: '@qavajs/steps-visual-testing' }
]

export const format: Array<ModuleDefinition> = [
    { module: 'report portal', packageName: '@qavajs/format-report-portal', out: 'report/rp.out' },
    { module: 'console', packageName: '@qavajs/console-formatter' },
    { module: 'html', packageName: '@qavajs/html-formatter', out: 'report/report.html' },
    { module: 'jira xray', packageName: '@qavajs/xray-formatter', out: 'report/xray.out' },
]

export const modules: Array<ModuleDefinition> = [
    { module: 'template', packageName: '@qavajs/template' },
    { module: 'soft-assertion', packageName: '@qavajs/soft-assertion' },
]

export const additionalModules: Array<ModuleDefinition> = [
    { module: 'wdio service adapter', packageName: '@qavajs/wdio-service-adapter' },
    { module: 'webstorm adapter', packageName: '@qavajs/webstorm-adapter' },
]

