const Memory = require('./memory/index.js');

module.exports = {
    default: {
        paths: ['test-e2e-features/*.feature'],
        require: [
            'test-e2e-cjs/step_definitions/*.js'
        ],
        memory: [new Memory(), {additionalValue: 12}],
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
}
