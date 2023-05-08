import Memory from './memory';
import { IRunResult } from '@cucumber/cucumber/api';

export default {
    paths: ['test-e2e-features/*.feature'],
    import: [
        'test-e2e-ts/step_definitions/*.ts'
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
        after(result: IRunResult) {
            console.log(result.success);
        }
    }]
}
