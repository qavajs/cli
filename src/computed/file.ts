import fs from 'fs/promises';

export default {
    file: (path: string): Promise<Buffer> => fs.readFile(path),
    textFile: (path: string): Promise<string> => fs.readFile(path, 'utf-8'),
    json: async (path: string): Promise<string> => JSON.parse(await fs.readFile(path, 'utf-8'))
}
