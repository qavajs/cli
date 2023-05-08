import Memory from './memory/index.js';

export default {
    paths: ['test-e2e-features/*.feature'],
    import: [
        'test-e2e-esm/step_definitions/*.js'
    ],
    memory: new Memory(),
    defaultTimeout: 20000,
    parallel: 1,
    publishQuiet: true,
    service: [{
        before() {
            console.log('service 1 started');
        },
    }, {
        before() {
            console.log('service 2 started');
        },
        after(result) {
            console.log(result.success);
        }
    }]
}
