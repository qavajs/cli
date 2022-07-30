import { test, jest } from '@jest/globals';
import install from '../src/install';
import inquirer, {PromptModule} from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import yarnInstall from 'yarn-install';

jest.mock('inquirer');
jest.mock('fs-extra');
jest.mock('path');
jest.mock('yarn-install');

inquirer.prompt = jest.fn(() => ({})) as PromptModule;

test('minimum install', async () => {
    await install();
});
