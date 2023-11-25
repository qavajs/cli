import { DataTable, IWorld } from '@cucumber/cucumber';

export interface IQavajsWorld extends IWorld {
    executeStep(step: string, extraParam?: DataTable | string): Promise<void>;
}
