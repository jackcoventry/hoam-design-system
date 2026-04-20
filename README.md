# hoam-design-system

React component library for HOAM.

## Installation

```bash
npm install hoam-design-system
```

Peer dependencies:

- `react` `^18 || ^19`
- `react-dom` `^18 || ^19`

## Basic Usage

Import the bundled stylesheet once, then use components from the root package or a component subpath.

```tsx
import { Button, ProductTile } from 'hoam-design-system';
import 'hoam-design-system/styles.css';

export function Example() {
  return (
    <ProductTile
      title="Single Origin Espresso"
      price={{ amount: 18.5, currency: 'GBP' }}
      image={{
        src: '/coffee/espresso.jpg',
        alt: 'Bag of single origin espresso beans',
      }}
      cta={{
        label: 'Shop now',
        href: '/coffee/single-origin-espresso',
      }}
    />
  );
}
```

You can also import a specific component entrypoint:

```tsx
import { Button } from 'hoam-design-system/Button';
import 'hoam-design-system/styles.css';
```

Available entrypoints:

- root package: `hoam-design-system`
- top-level component barrels: `hoam-design-system/Button`, `hoam-design-system/Hero`, `hoam-design-system/Modal`, etc.
- hooks barrel: `hoam-design-system/hooks`
- stylesheet: `hoam-design-system/styles.css`

## TypeScript

The package ships declaration files for both the root export and component subpaths.

```tsx
import { type ButtonProps } from 'hoam-design-system/Button';
```

## Next.js

Use the library in Next.js by importing the stylesheet at the app root and rendering interactive components from a client boundary.

- Guide: [docs/nextjs.md](/Users/jackcoventry/dev/hoam-design-system/docs/nextjs.md)

## Theming

Override the exported CSS custom properties in your app to customize colors, typography, spacing, and radii.

- Guide: [docs/theming.md](/Users/jackcoventry/dev/hoam-design-system/docs/theming.md)

## Modal Stacking

`Modal` works without a provider for single-modal usage.

When your app can open multiple modals at once, wrap your app with `ModalStackProvider` so focus and stacking order stay coordinated.

## Development

```bash
npm run dev
```

## Verification

```bash
npm run verify
```

Additional checks:

- `npm run test:a11y`


## Bundle Budgets

```bash
npm run budgets
```

This checks:

- `dist/index.js` raw + gzip size
- `dist/index.css` raw + gzip size
- `npm pack --dry-run` tarball + unpacked size

Override thresholds with environment variables (bytes):

- `HOAM_BUDGET_INDEX_JS_RAW`
- `HOAM_BUDGET_INDEX_JS_GZIP`
- `HOAM_BUDGET_INDEX_CSS_RAW`
- `HOAM_BUDGET_INDEX_CSS_GZIP`
- `HOAM_BUDGET_PACK_TARBALL`
- `HOAM_BUDGET_PACK_UNPACKED`
