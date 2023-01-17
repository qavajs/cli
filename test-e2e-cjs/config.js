const Memory = require('./memory/index.js');

module.exports = {
    default: {
        paths: ['test-e2e-cjs/features/*.feature'],
        require: [
            'test-e2e-cjs/step_definitions/*.js'
        ],
        memory: new Memory(),
        defaultTimeout: 20000,
        parallel: 1,
        publishQuiet: true
    }
}
