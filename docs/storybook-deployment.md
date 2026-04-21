# Storybook Deployment

This project can be deployed to Vercel as a static Storybook site.

## What Vercel Should Run

Vercel should use:

- Build command: `npm run build-storybook`
- Output directory: `storybook-static`

This is already configured in [vercel.json](/Users/jackcoventry/dev/hoam-design-system/vercel.json).

`build-storybook` also runs token and icon generation first, so the deployment does not depend on generated files already existing in the workspace.

## Vercel Setup

1. Import the Git repository into Vercel.
2. When prompted for framework, use `Other`.
3. Confirm the project root is the repository root.
4. Confirm the build settings:

- Build Command: `npm run build-storybook`
- Output Directory: `storybook-static`

5. Deploy.

## Recommended Project Settings

- Production branch: `main`
- Node version: use the same major version you use locally and in CI

If you want preview deployments for every branch or PR, leave that enabled in Vercel. That works well for Storybook.

## Custom Domain

If you want a dedicated Storybook URL, add a domain such as:

- `storybook.<your-domain>`
- `design-system.<your-domain>`

Then assign it to the Vercel project in the Vercel dashboard.

## Notes

- This deploys Storybook only. It does not publish the npm package.
- If a deployment fails, the first thing to check is whether `npm run build-storybook` succeeds locally.
- Because this is a static Storybook build, no special server runtime is required.
