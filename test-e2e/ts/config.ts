import Memory from './memory';
import { IRunResult } from '@cucumber/cucumber/api';
import { IQavajsConfig } from "../../index";

export default {
    unexpected: 32,
    paths: ['test-e2e/features/*.feature'],
    require: [
        'test-e2e/ts/step_definitions/*.ts'
    ],
    memory: new Memory(),
    defaultTimeout: 20000,
    parallel: 1,
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
    }],
    serviceTimeout: 20000
} as IQavajsConfig;
