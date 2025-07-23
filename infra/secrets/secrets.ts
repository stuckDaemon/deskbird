import * as fs from 'fs';
import * as path from 'path';

const secretsPath = path.resolve(__dirname, 'secrets', 'values.json');
const raw = fs.readFileSync(secretsPath, 'utf-8');
const data = JSON.parse(raw);

export const secrets = {
    dbPassword: data.dbPassword,
    jwtSecret: data.jwtSecret,
};
