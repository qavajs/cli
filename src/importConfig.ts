import { join } from 'path';

let loadTS = true;
async function importTS(configPath: string) {
    const { register } = require('ts-node');
    if (loadTS) {
        register();
        loadTS = false;
    }
    return require(configPath)
}
export default async function importConfig(configPath: string, profile: string): Promise<any> {
    const fullPath = join(process.cwd(), configPath);
    const importer: Promise<any> = fullPath.endsWith('.ts')
        ? importTS(fullPath)
        : import('file://' + fullPath);
    return importer.then(config => config.default?.default
        ? config.default[profile]
        : config[profile]
    );
}
