import Memory from './memory/index.js';

export default {
    paths: ['test-e2e-esm/features/*.feature'],
    import: [
        'test-e2e-esm/step_definitions/*.js'
    ],
    memory: new Memory(),
    defaultTimeout: 20000,
    parallel: 1,
    publishQuiet: true
}
