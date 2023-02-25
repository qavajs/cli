import Memory from './memory';

export default {
    paths: ['test-e2e-ts/features/*.feature'],
    import: [
        'test-e2e-ts/step_definitions/*.ts'
    ],
    memory: new Memory(),
    defaultTimeout: 20000,
    parallel: 1,
    publishQuiet: true
}
