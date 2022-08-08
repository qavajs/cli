import fs from 'fs/promises';

export default {
    file: (path: string): Promise<Buffer> => fs.readFile(path),
    textFile: (path: string): Promise<string> => fs.readFile(path, 'utf-8')
}
