# DeskbirdInfrastructure — Pulumi+AWS

## 📋Purpose

This package defines reproducible AWS infrastructure for the Deskbird platform. All resources are expressed as TypeScriptPulumi components, enabling **one‑command** environment creation, audit‑ready diffs, and straightforward roll‑backs.

---

## 🗺️Resources Provisioned

| Module        | AWS Service(s)                                                           | Role in Platform                                                                                |
| ------------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| `networking`  | VPC, subnets, security groups                                            | Isolates workloads and enforces least‑privilege ingress/egress.                                 |
| `ecr.ts`      | ElasticContainerRegistry                                               | Stores versioned backend Docker images; image tag promoted by CI pipeline.                      |
| `ecs.ts`      | ECSFargate cluster, task definition, service; ApplicationLoadBalancer | Runs stateless backend container behind an ALB with health checks and auto‑scaling policies.    |
| `database.ts` | AmazonRDSPostgreSQL (single‑AZ, GP2)                                   | Durable relational store for application data; encryption at rest and in‑flight enabled.        |
| `secrets.ts`  | AWSSecretsManager parameters                                           | Holds database credentials, JWT signing keys, and other sensitive values consumed by ECS tasks. |
| `frontend.ts` | S3 static‑site bucket, CloudFront distribution, ACM certificate          | Delivers the Angular SPA globally with HTTPS, compression, and edge caching.                    |

All components are tagged with `project=deskbird` and `stage=<stack>` to support cost allocation and clean tear‑downs.

---

## 🏗️Project Structure

```text
infra/
├── ecr.ts            # ECR repository definition
├── ecs.ts            # Cluster, task definition, ALB, service
├── database.ts       # RDS PostgreSQL instance and subnet group
├── secrets.ts        # Secrets Manager entries and IAM policies
├── frontend.ts       # S3 bucket, CloudFront, DNS records (Route 53)
├── networking.ts     # VPC, subnets, NAT, security groups
├── Pulumi.yaml       # Project metadata
├── Pulumi.<stack>.yaml  # Per‑environment config (dev, prod, etc.)
└── README.md         # You are here
```

---

## 🚀Bootstrapping a New Environment

### Prerequisites

* PulumiCLI ≥v3.0
* Node.js22.x
* AWS credentials with privileges for the services above
* An existing Route 53 hosted zone (for CloudFront certificate validation)

### Quick start

```bash
cd infra
yarn install                   # installs Pulumi and type definitions
pulumi stack init dev
pulumi config set aws:region eu-central-1
pulumi config set deskbird:dbPassword <secure-password> --secret
pulumi up                      # review preview, then confirm
```

Typical create time: **≈10minutes** (RDS dominates).

---

## 🔄CI/CD Integration (High‑level)

1. **Build & push** backend image to ECR (`ecr.ts` outputs `repositoryUrl`).
2. **pulumi up --yes** with new `imageTag` config to trigger zero‑downtime ECS deployment.
3. **Invalidate** CloudFront cache on SPA re‑build (handled in pipeline).

---

## 📑Outputs

Pulumi exports the following for downstream automation:

| Name               | Description                          |
| ------------------ | ------------------------------------ |
| `frontendUrl`      | CloudFront distribution domain (SPA) |
| `apiUrl`           | ALB DNS name (backend)               |
| `dbEndpoint`       | RDS hostname and port                |
| `ecrRepositoryUrl` | Fully qualified ECR repository URI   |

---

## 🔒Security Posture Highlights

* **Private subnets** for RDS; only ECS tasks can reach the database.
* **TLS1.2+** enforced on ALB and CloudFront.
* **IAM least privilege**: ECS task role can retrieve only its own secrets.
* **Encryption at rest** on S3 and RDS with AWS‑managed KMS keys.

---

## 🗺️Next Steps

1. **Multi‑AZ RDS & automated backups** for higher availability.
2. **WAF rules** in front of ALB and CloudFront to mitigate common exploits.
3. **Autoscaling policies** based on CloudWatch metrics (CPU, latency).
4. **Pulumi CrossGuard policies** to enforce tagging and cost controls.

---

*For any deployment issue or enhancement request, please open an issue or contact the infrastructure maintainer.*
