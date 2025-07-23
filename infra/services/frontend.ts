import * as aws from '@pulumi/aws';

// S3 bucket for static hosting
const siteBucket = new aws.s3.Bucket('deskbird-frontend-bucket', {
    website: {
        indexDocument: 'index.html',
        errorDocument: 'index.html',
    },
    acl: 'public-read',
});

// Public read policy for S3 bucket
new aws.s3.BucketPolicy('deskbird-frontend-policy', {
    bucket: siteBucket.bucket,
    policy: siteBucket.bucket.apply(bucketName =>
        JSON.stringify({
            Version: '2012-10-17',
            Statement: [
                {
                    Effect: 'Allow',
                    Principal: '*',
                    Action: ['s3:GetObject'],
                    Resource: [`arn:aws:s3:::${bucketName}/*`],
                },
            ],
        })
    ),
});

// CloudFront distribution for S3 bucket
const cdn = new aws.cloudfront.Distribution('deskbird-frontend-cdn', {
    enabled: true,
    origins: [
        {
            originId: siteBucket.arn,
            domainName: siteBucket.websiteEndpoint,
            customOriginConfig: {
                originProtocolPolicy: 'http-only',
                httpPort: 80,
                httpsPort: 443,
                originSslProtocols: ['TLSv1.2'],
            },
        },
    ],
    defaultCacheBehavior: {
        targetOriginId: siteBucket.arn,
        viewerProtocolPolicy: 'redirect-to-https',
        allowedMethods: ['GET', 'HEAD'],
        cachedMethods: ['GET', 'HEAD'],
        forwardedValues: {
            queryString: false,
            cookies: { forward: 'none' },
        },
    },
    priceClass: 'PriceClass_100',
    defaultRootObject: 'index.html',
    viewerCertificate: {
        cloudfrontDefaultCertificate: true,
    },
    restrictions: {
        geoRestriction: {
            restrictionType: 'none',
        },
    },
    isIpv6Enabled: true,
});

// Export the CDN URL
export const cdnUrl = cdn.domainName;
