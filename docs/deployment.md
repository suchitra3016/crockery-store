# Deployment guide

## One-time setup

### 1. AWS (about 10 minutes)

1. In the AWS Console, set the region to **US East (N. Virginia) us-east-1**.
2. Open **CloudFormation → Create stack → With new resources**.
3. Upload `infra/infrastructure.yaml`. Name the stack `tidewell-site`.
4. Leave the parameters as they are (`suchitra3016`, `crockery-store`, `main`). They are case-sensitive.
5. Tick the IAM acknowledgement and submit. Wait for **CREATE_COMPLETE**.
6. On the **Outputs** tab, copy `RoleArn`, `BucketName`, `DistributionId` and `WebsiteURL`.

### 2. GitHub

1. Create an **empty** repository named `crockery-store` under the `suchitra3016` account (no README, no .gitignore).
2. Open **Settings → Secrets and variables → Actions → Variables → New repository variable**, and add these as **variables** (not secrets):

| Name | Value |
|---|---|
| `AWS_REGION` | `us-east-1` |
| `AWS_ROLE_ARN` | the `RoleArn` output |
| `S3_BUCKET` | the `BucketName` output |
| `CF_DISTRIBUTION_ID` | the `DistributionId` output |
| `WEBSITE_URL` | the `WebsiteURL` output (optional, shown in the run summary) |

These are identifiers, not secrets. They give no access without the GitHub-only sign-in.

3. From your project folder, push:

```
git remote add origin https://github.com/suchitra3016/crockery-store.git
git branch -M main
git push -u origin main
```

GitHub asks you to sign in the first time. Use the browser sign-in, or a personal access token as the password.

4. Open the repository's **Actions** tab and watch the run. When both jobs are green, open the `WebsiteURL`.

## Everyday workflow

```
git checkout -b feature/my-change
# edit files
git add . && git commit -m "Describe the change"
git push -u origin feature/my-change
```

Open a pull request into `main`. The pipeline runs lint and tests. After you merge, the pipeline deploys. You can also commit straight to `main`, and a plain push deploys.

**Recommended:** in **Settings → Branches**, add a rule for `main` that requires the **Lint and test** check to pass before merging.

## Demonstrate the automation

1. Edit the headline in `site/index.html` (the `<h1>` in the hero).
2. `git add . && git commit -m "Update hero headline" && git push`
3. Watch the **Actions** tab. After the deploy job finishes (about a minute), refresh the website. The new headline appears with no manual steps.

Also try the safety check: break a test on purpose (for example, change a product price to 0 in `products.js`), push it on a branch, and see the pipeline fail before any deployment.

## Rolling back

Either revert the commit (`git revert <sha>` then push), which redeploys the old version automatically, or open the failed run's artifact `site-<sha>` of an older successful run to see exactly what was deployed.

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| "Repository variable ... is not set" | A variable is missing or misspelled. Add it, then use **Re-run jobs**. |
| "Not authorized to perform sts:AssumeRoleWithWebIdentity" | Repo name, username or branch does not match the stack parameters (case-sensitive), or the run is not on `main`. |
| Deploy job skipped | The run was a pull request or a branch other than `main`. |
| Website shows an error page right after setup | Nothing has been deployed yet, or CloudFront is still finishing. Wait a few minutes. |
| Old content still showing | Hard-refresh (Ctrl+F5). CSS and JS cache for 5 minutes. |
| Lint or test failure | Open the failed step in the run log and fix the reported file. |

## Deployment logs

Each run keeps its full log in the **Actions** tab, with a summary of the commit, bucket and CloudFront invalidation. The deployed files are kept as a downloadable artifact for 30 days.

## Clean up

1. Empty the S3 bucket (S3 → the bucket → **Empty**).
2. Delete the CloudFormation stack `tidewell-site`.

This removes the bucket, the CloudFront distribution, the role and the identity provider, and stops any charges.
