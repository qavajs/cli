import { DataTable, IWorld } from '@cucumber/cucumber';

export interface IQavajsWorld extends IWorld {
    getValue(expression: string): Promise<any>;
    setValue(key: string, value: any): void;
    executeStep(step: string, extraParam?: DataTable | string): Promise<void>;
    config: any;
}
