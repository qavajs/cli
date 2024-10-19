import { DataTable, IWorld } from '@cucumber/cucumber';
import { Validation } from './load';

export interface IQavajsWorld extends IWorld {
    getValue(expression: string): Promise<any>;
    setValue(key: string, value: any): void;
    executeStep(step: string, extraParam?: DataTable | string): Promise<void>;
    validation(type: string): Validation;
    config: any;
}
