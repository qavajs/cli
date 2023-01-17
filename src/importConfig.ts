import path from 'path';

export default async function importConfig(configPath: string, profile: string): Promise<any> {
    return import('file://' + path.join(process.cwd(), configPath)).then(config => config[profile]?.import
        ? config[profile]
        : config.default[profile]
    );
}
