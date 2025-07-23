import * as aws from '@pulumi/aws';
import {secrets} from "../secrets/secrets";

// RDS instance
export const dbInstance = new aws.rds.Instance('deskbird-db', {
    allocatedStorage: 20,
    engine: 'postgres',
    engineVersion: '15.3',
    instanceClass: 'db.t3.micro',
    dbName: secrets.dbName,
    username: secrets.dbUsername,
    password: secrets.dbPassword,
    skipFinalSnapshot: true,
    publiclyAccessible: true,
    multiAz: false,
    backupRetentionPeriod: 0,
    storageEncrypted: false,
    autoMinorVersionUpgrade: true,
    deletionProtection: false,
});

export const dbEndpoint = dbInstance.endpoint;
export const dbName = dbInstance.dbName;
