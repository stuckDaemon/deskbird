import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';

// Configurable database password (can pull from config or secrets later)
const config = new pulumi.Config();
const dbPassword = config.requireSecret('dbPassword');

// RDS instance
const dbInstance = new aws.rds.Instance('deskbird-db', {
    allocatedStorage: 20,
    engine: 'postgres',
    engineVersion: '15.3',
    instanceClass: 'db.t3.micro',
    dbName: 'deskbird',
    username: 'postgres',
    password: dbPassword,
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
