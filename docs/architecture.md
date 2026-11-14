# Architecture

## Overview

```
 Developer
    |  git push
    v
 GitHub (main branch)
    |  triggers
    v
 GitHub Actions
    1. lint + unit tests   --(fail)--> stop, nothing is deployed
    2. request an OIDC token from GitHub
    3. exchange it for temporary AWS credentials (IAM role)
    4. aws s3 sync   ------------------------+
    5. CloudFront invalidation --------+     |
                                       v     v
 Visitor --HTTPS--> CloudFront --OAC--> private S3 bucket
                    (*.cloudfront.net)   (website files)
```

## Components

| Component | Purpose |
|---|---|
| **S3 bucket** | Stores the static files. All public access is blocked, files are encrypted at rest, and old versions expire after 30 days. |
| **CloudFront** | Serves the site worldwide over HTTPS, redirects HTTP to HTTPS, compresses files and adds standard security headers. The default `*.cloudfront.net` certificate means no domain or certificate setup is needed. |
| **Origin Access Control (OAC)** | CloudFront signs its requests to S3. The bucket policy allows reads only from this one distribution, so the bucket cannot be read directly. |
| **IAM OIDC provider** | Tells AWS to trust identity tokens issued by GitHub Actions. |
| **IAM deploy role** | Assumed by the pipeline. It can be assumed only by repository `suchitra3016/crockery-store` (matched by its numeric GitHub IDs) on branch `main`. |
| **GitHub Actions** | Runs the lint, tests and deployment on every push. |
| **CloudFormation** | Creates all the AWS resources from `infra/infrastructure.yaml`, so the setup is repeatable and can be deleted cleanly. |

## Security

- **No long-lived AWS keys exist anywhere.** The pipeline gets credentials that expire after about an hour.
- **Least privilege:** the deploy role can only list and write to this one bucket and clear the cache of this one distribution.
- **Branch lock:** pull requests and other branches cannot assume the role. The trust policy requires the token subject `repo:suchitra3016@231582289/crockery-store@1456766364:ref:refs/heads/main`. GitHub includes the numeric account and repository IDs in the subject, and matching on them means a deleted and re-created repo with the same name cannot reuse the role.
- **Private origin:** the bucket is not a public website. Only CloudFront can read it, and only over HTTPS.
- **Failed builds are never deployed.** The deploy job depends on the lint and test job.

## Caching

| Files | Browser cache | Why |
|---|---|---|
| `*.html` | `no-cache` | Visitors always get the latest page. |
| `css/`, `js/` | 5 minutes | These files are not renamed on each release, so they must refresh quickly. |
| `assets/` | 1 day | Rarely change. |

After every deployment the pipeline also invalidates `/*` in CloudFront, so the edge caches update straight away.

## Routing

Each page is its own HTML file, so no single-page-app routing is needed and deep links work directly. Missing pages return `404.html` with a 404 status.

## Why these services

- **S3 + CloudFront** is the standard low-cost design for static sites. There are no servers to patch, and cost depends on traffic, which for a demo is near zero.
- **AWS Amplify Hosting** is easier but hides the pipeline. This project is meant to demonstrate the pipeline.
- **GitHub OIDC** is preferred over IAM access keys because nothing permanent can leak.
- **CloudFormation** was chosen over Terraform because it needs no extra tools, and the console can deploy it.

## Limitations

- The default CloudFront domain is the only address. A custom domain would add Route 53 and an ACM certificate (in `us-east-1`).
- There is no backend. Products are static data, and the forms are simulated.
- There is a single environment (production). A staging site would be a second stack.
