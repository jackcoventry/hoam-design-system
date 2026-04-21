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
- i18n utilities: `hoam-design-system/i18n`
- stylesheet: `hoam-design-system/styles.css`

## Packaging Notes

- `hoam-design-system/styles.css` is intentionally all-in. This library is designed to ship as a cohesive single-brand system rather than as per-component CSS fragments.
- `swiper` is an intentional dependency of the library. It powers `Carousel` and components built on top of it, such as `Hero` and `ImageGallery`.
- Form validation uses `zod/mini` internally to keep the validation/runtime bundle leaner without changing the public API.

## TypeScript

The package ships declaration files for both the root export and component subpaths.

```tsx
import { type ButtonProps } from 'hoam-design-system/Button';
```

## Next.js

Use the library in Next.js by importing the stylesheet at the app root and rendering interactive components from a client boundary.

- Guide: [docs/nextjs.md](/Users/jackcoventry/dev/hoam-design-system/docs/nextjs.md)

Practical notes:

- `Modal`, `Navigation`, `NotificationBar`, `QuantitySelector`, and the exported hooks should normally live behind a client boundary
- `LibraryI18nProvider` is available from `hoam-design-system/i18n`
- `swiper` is only used by `Carousel` and components built on it, such as `Hero` and `ImageGallery`
- `LogoCarousel` does not use `swiper`
- the stylesheet is intentionally a single global import: `hoam-design-system/styles.css`

## Theming

Override the exported CSS custom properties in your app to customize colors, typography, spacing, and radii.

- Guide: [docs/theming.md](/Users/jackcoventry/dev/hoam-design-system/docs/theming.md)

## Releasing

- Guide: [docs/releasing.md](/Users/jackcoventry/dev/hoam-design-system/docs/releasing.md)

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

Verbose mode:

```bash
npm run verify -- --verbose
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
- the built `Carousel` chunk raw + gzip size
- the built `schemas-*` chunk raw + gzip size
- `npm pack --dry-run` tarball + unpacked size

Override thresholds with environment variables (bytes):

- `HOAM_BUDGET_INDEX_JS_RAW`
- `HOAM_BUDGET_INDEX_JS_GZIP`
- `HOAM_BUDGET_INDEX_CSS_RAW`
- `HOAM_BUDGET_INDEX_CSS_GZIP`
- `HOAM_BUDGET_CAROUSEL_CHUNK_RAW`
- `HOAM_BUDGET_CAROUSEL_CHUNK_GZIP`
- `HOAM_BUDGET_SCHEMAS_CHUNK_RAW`
- `HOAM_BUDGET_SCHEMAS_CHUNK_GZIP`
- `HOAM_BUDGET_PACK_TARBALL`
- `HOAM_BUDGET_PACK_UNPACKED`
