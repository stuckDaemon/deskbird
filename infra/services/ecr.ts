import * as aws from '@pulumi/aws';

// Explicit ECR repository with delete policy
export const ecrRepository = new aws.ecr.Repository('deskbird-backend-repo', {
    name: 'deskbird-backend-repo',
    forceDelete: true,
    imageScanningConfiguration: {
        scanOnPush: true,
    },
    encryptionConfigurations: [
        {
            encryptionType: 'AES256',
        },
    ],
});

// Optional lifecycle policy (auto-delete old images if you want)
const lifecyclePolicy = new aws.ecr.LifecyclePolicy('deskbird-ecr-lifecycle-policy', {
    repository: ecrRepository.name,
    policy: JSON.stringify({
        rules: [
            {
                rulePriority: 1,
                description: 'Expire untagged images after 30 days',
                selection: {
                    tagStatus: 'untagged',
                    countType: 'sinceImagePushed',
                    countUnit: 'days',
                    countNumber: 30,
                },
                action: {
                    type: 'expire',
                },
            },
        ],
    }),
});

export const repositoryUrl = ecrRepository.repositoryUrl;
