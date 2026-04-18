# hoam-design-system

React component library for HOAM.

## Install

```bash
npm install hoam-design-system
```

## Usage

```tsx
import { Button } from 'hoam-design-system';
import 'hoam-design-system/styles.css';

export function Example() {
  return <Button>Shop now</Button>;
}
```

## Peer Dependencies

- `react` `^18 || ^19`
- `react-dom` `^18 || ^19`

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Bundle Budgets

```bash
npm run budgets
```

This checks:
- `dist/index.js` raw + gzip size
- `dist/index.css` raw + gzip size
- `npm pack --dry-run` tarball + unpacked size

`npm run verify` now includes `npm run budgets` after build.

Override thresholds with environment variables (bytes):
- `HOAM_BUDGET_INDEX_JS_RAW`
- `HOAM_BUDGET_INDEX_JS_GZIP`
- `HOAM_BUDGET_INDEX_CSS_RAW`
- `HOAM_BUDGET_INDEX_CSS_GZIP`
- `HOAM_BUDGET_PACK_TARBALL`
- `HOAM_BUDGET_PACK_UNPACKED`
