import * as fs from 'fs';
import * as path from 'path';

const secretsPath = path.resolve(__dirname, 'values.json');
const raw = fs.readFileSync(secretsPath, 'utf-8');
const data = JSON.parse(raw);

export const secrets = {
    dbHost: data.dbHost,
    dbPort: data.dbPort,
    dbUsername: data.dbUsername,
    dbPassword: data.dbPassword,
    dbName: data.dbName,
};
