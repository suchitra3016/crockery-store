# Tidewell Ceramics

A demo e-commerce website for a fictional premium crockery brand, with an automated GitHub-to-AWS deployment pipeline.

Tidewell is not a real business. Nothing is sold, and no payment or personal data is processed.

> **Technology note:** the original brief asked for Flutter Web. This project uses plain HTML, CSS and JavaScript instead. The AWS and CI/CD design is the same either way, and only the app code and the build step differ.

## What it includes

| Page | File |
|---|---|
| Home | `site/index.html` |
| Shop (search, filters, sorting) | `site/shop.html` |
| Product details | `site/product.html?id=1` |
| About | `site/about.html` |
| Contact (validated form) | `site/contact.html` |
| Cart and demo checkout | `site/cart.html`, `site/checkout.html` |
| FAQ, Privacy, Terms, 404 | `site/faq.html`, `site/privacy.html`, `site/terms.html`, `site/404.html` |

The 24 products are dummy data in `site/js/products.js`, with SVG images generated in code. The cart is saved in the browser's local storage.

## Project structure

```
site/                  the website (only this folder is deployed)
  css/  js/  assets/
tests/                 automated tests (Node built-in test runner)
infra/infrastructure.yaml   AWS CloudFormation template
.github/workflows/deploy.yml   CI/CD pipeline
docs/                  architecture and deployment documentation
package.json           lint and test commands
```

## Run it locally

No build step is needed.

1. Open the project in VS Code and trust the folder.
2. Right-click `site/index.html` and choose **Open with Live Server**. You can also just double-click `site/index.html`.

## Lint and test (optional locally)

Requires Node.js 20 or newer.

```
npm install
npm run check      # ESLint + HTMLHint + unit tests
```

## Deployment

Every push to `main` is deployed automatically. Pull requests run the lint and tests only.

```
push to main -> lint -> test -> assume AWS role (OIDC) -> upload to S3 -> clear CloudFront cache
```

- [Architecture](docs/architecture.md): how the pieces fit together and why.
- [Deployment guide](docs/deployment.md): one-time AWS and GitHub setup, how to deploy, roll back and clean up.

## Branching and commits

- `main` is production. Anything merged to it is deployed.
- Work on short-lived branches such as `feature/cart-badge` and open a pull request into `main`.
- Commit messages are short and in the imperative mood, for example `Add price filter to shop`.
