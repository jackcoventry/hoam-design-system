# Next.js Integration

`hoam-design-system` works in both the Pages Router and the App Router.

## Install

```bash
npm install hoam-design-system
```

## Import styles once

Import the library stylesheet at your application root.

### App Router

```tsx
// app/layout.tsx
import 'hoam-design-system/styles.css';

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### Pages Router

```tsx
// pages/_app.tsx
import 'hoam-design-system/styles.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
```

## Client component guidance

Do not add `'use client'` globally to your whole app just to consume this library.

Instead:

- import static, presentational components wherever you normally would
- render interactive components from a client boundary when the component relies on hooks, effects, refs, or browser APIs
- keep server components responsible for data loading and composition

Example:

```tsx
// app/products/[slug]/ProductActions.tsx
'use client';

import { Button, QuantitySelector } from 'hoam-design-system';
import { useState } from 'react';

export function ProductActions() {
  const [quantity, setQuantity] = useState(1);

  return (
    <>
      <QuantitySelector
        value={quantity}
        onChange={setQuantity}
      />
      <Button>Add to basket</Button>
    </>
  );
}
```

The main components that should normally live behind a client boundary are:

- `Modal` and `ModalStackProvider`
- `Navigation`
- `NotificationBar`
- `QuantitySelector`
- `Hero` and `ImageGallery` when they render multiple slides
- any consumer code that calls the exported hooks from `hoam-design-system/hooks`

Most static presentational components can stay in server components.

## SSR-safe behavior

The library guards browser-only APIs inside effects and runtime checks, so importing these components from a client boundary is safe in Next.js server rendering.

Notable details:

- `Modal` portals only after `document` is available
- media-query hooks fall back safely when `matchMedia` is unavailable
- `LogoCarousel` uses an isomorphic layout effect so server rendering does not emit layout-effect warnings

The main rule for consumers is still the same: if your usage relies on interaction, local state, refs, or browser APIs, create a small client wrapper for that part of the UI.

## Modal stack provider

`Modal` works on its own for a single modal.

Wrap your app with `ModalStackProvider` when you want multiple modals to coordinate focus and stacking order:

```tsx
'use client';

import { ModalStackProvider } from 'hoam-design-system';

export function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  return <ModalStackProvider>{children}</ModalStackProvider>;
}
```

Then mount that provider near your application root.

## i18n provider

If you want to override the library's default copy or formatting, wrap your app with `LibraryI18nProvider` from `hoam-design-system/i18n` and pass custom message or formatting overrides from a client boundary.

```tsx
'use client';

import { LibraryI18nProvider } from 'hoam-design-system/i18n';

export function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <LibraryI18nProvider
      locale="en-GB"
      currency="GBP"
    >
      {children}
    </LibraryI18nProvider>
  );
}
```

## Carousel and bundle cost

`swiper` is only used by the `Carousel` component and components built on top of it, such as `Hero` and `ImageGallery`.

Practical guidance:

- `LogoCarousel` does not use `swiper`
- import `Carousel` from the component subpath when you need it: `hoam-design-system/Carousel`
- prefer importing only the components you actually use instead of defaulting to large convenience wrappers in performance-sensitive routes
- `styles.css` is intentionally a single global import for the whole brand system, so import it once at the app root rather than trying to split library CSS per route

## Troubleshooting

- Hydration mismatch: move the consuming component behind a client boundary instead of promoting the entire route tree to client rendering.
- Missing styles: confirm `hoam-design-system/styles.css` is imported once at the app root.
- Layered modals behaving independently: add `ModalStackProvider`.
