export default [
    '@cucumber/cucumber',
    '@qavajs/po',
    '@qavajs/memory'
]

export type ModuleDefinition = {
    module: string,
    packageName: string
}

export const steps: Array<ModuleDefinition> = [
    { module: 'wdio', packageName: '@qavajs/steps-wdio'},
    { module: 'api', packageName: '@qavajs/steps-api'},
    { module: 'memory', packageName: '@qavajs/steps-memory'},
]

export const format: Array<ModuleDefinition> = [
    { module: 'report-portal', packageName: '@qavajs/format-report-portal'},
]

export const services: Array<ModuleDefinition> = [
    { module: 'selenium-standalone', packageName: '@qavajs/service-selenium-standalone'},
]

export const modules: Array<ModuleDefinition> = [
    { module: 'template', packageName: '@qavajs/template'},
]

