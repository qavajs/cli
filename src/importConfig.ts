import {join} from 'path';

export default async function importConfig(configPath: string, profile: string): Promise<any> {
    const fullPath = join(process.cwd(), configPath);
    const importer: Promise<any> = fullPath.endsWith('.ts')
        ? Promise.resolve(require(fullPath))
        : import(fullPath);
    return importer.then(config => config.default?.default
        ? config.default[profile]
        : config[profile]
    );
}
