# Release Process

This project uses a lightweight manual release flow.

The goal is to keep publishing predictable without adding release automation overhead too early.

## Principles

- Keep versioning explicit.
- Update the changelog in the same commit as the release changes.
- Always run the full verification flow before publishing.
- Tag every published version in Git.

## Versioning

Use semantic versioning:

- `patch`
  Fixes, small refinements, non-breaking internal improvements.
- `minor`
  New components, new props, new features, or meaningful non-breaking behavior changes.
- `major`
  Breaking API changes, removed exports, renamed props, changed required setup, or anything that forces consumer code changes.

When in doubt:

- default to `patch` for safe maintenance work
- use `minor` when consumers get something new
- use `major` when consumers must change their code


## Release Checklist

1. Confirm the branch is ready to publish.
2. Update `package.json` version.
3. Run:

```bash
npm run verify
```

If you need full nested command output while checking the release:

```bash
npm run verify -- --verbose
```

4. Commit the release changes.
5. Create an annotated Git tag matching the package version.
6. Push the commit and tag.

## Suggested Commands

Example for a patch release to `0.0.2`:

```bash
npm version 0.0.2 --no-git-tag-version
npm run verify
git add .
git commit -m "Release 0.0.2"
git tag -a v0.0.2 -m "Release 0.0.2"
git push origin main --follow-tags
```
