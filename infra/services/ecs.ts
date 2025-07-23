import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import {secrets} from "../secrets/secrets";
import {dbInstance} from "./database";
import {ecrRepository} from "./ecr";

const config = new pulumi.Config();

// ECS cluster
const cluster = new aws.ecs.Cluster('deskbird-ecs-cluster');

// Application Load Balancer
const alb = new aws.lb.LoadBalancer('deskbird-alb', {
    loadBalancerType: 'application',
    internal: false,
    securityGroups: [],
    subnets: [], // Optional: add subnet ids if needed
});

// Target group
const targetGroup = new aws.lb.TargetGroup('deskbird-target-group', {
    port: 80,
    protocol: 'HTTP',
    targetType: 'ip',
    vpcId: '', // Optional: add vpcId if needed
});

// Listener
const listener = new aws.lb.Listener('deskbird-listener', {
    loadBalancerArn: alb.arn,
    port: 80,
    defaultActions: [
        {
            type: 'forward',
            targetGroupArn: targetGroup.arn,
        },
    ],
});

// ECS task definition
const taskExecutionRole = new aws.iam.Role('deskbird-task-exec-role', {
    assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
        Service: 'ecs-tasks.amazonaws.com',
    }),
});

new aws.iam.RolePolicyAttachment('deskbird-task-exec-policy', {
    role: taskExecutionRole.name,
    policyArn: aws.iam.ManagedPolicy.AmazonECSTaskExecutionRolePolicy,
});


// ECS task definition
const taskDefinition = new aws.ecs.TaskDefinition('deskbird-task', {
    family: 'deskbird-task-family',
    networkMode: 'awsvpc',
    requiresCompatibilities: ['FARGATE'],
    cpu: '256',
    memory: '512',
    executionRoleArn: taskExecutionRole.arn,
    containerDefinitions: pulumi
        .all([ecrRepository.repositoryUrl, dbInstance.address])
        .apply(([url, rdsAddress]) =>
            JSON.stringify([
                {
                    name: 'deskbird-api',
                    image: `${url}:latest`,
                    environment: [
                        { name: 'DB_DIALECT', value: 'postgres' },
                        { name: 'DB_HOST', value: `${rdsAddress}`},
                        { name: 'DB_PORT', value: `${secrets.dbPort}`},
                        { name: 'DB_USERNAME', value: `${secrets.dbUsername}`},
                        { name: 'DB_PASSWORD', value: `${secrets.dbPassword}`},
                        { name: 'DB_NAME', value: `${secrets.dbName}`},
                        { name: 'DEPLOY_TIMESTAMP', value: new Date().toISOString() }, // Forces a new task definition on every deploy
                        { name: 'DB_SSL', value: 'true'},
                    ],
                    logConfiguration: {
                        logDriver: 'awslogs',
                        options: {
                            'awslogs-group': '/ecs/deskbird-api',
                            'awslogs-region': aws.config.region,
                            'awslogs-stream-prefix': 'deskbird',
                        },
                    },
                },
            ]),
        ),
});

// ECS service
const service = new aws.ecs.Service('deskbird-service', {
    cluster: cluster.arn,
    desiredCount: 1,
    launchType: 'FARGATE',
    taskDefinition: taskDefinition.arn,
    networkConfiguration: {
        assignPublicIp: true,
        subnets: [], // Optional: add subnet ids if needed
        securityGroups: [], // Optional: add security groups if needed
    },
    loadBalancers: [
        {
            targetGroupArn: targetGroup.arn,
            containerName: 'deskbird-api',
            containerPort: 3000,
        },
    ],
    waitForSteadyState: true,
});

export const serviceUrl = alb.dnsName;
