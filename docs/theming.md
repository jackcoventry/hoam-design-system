# Theming Guide

The design system ships a compiled stylesheet and exposes theme values through CSS custom properties.

## Import the base styles

```tsx
import 'hoam-design-system/styles.css';
```

## Override tokens in your app

Set overrides after the library stylesheet loads. The simplest place is your app-level stylesheet:

```css
:root {
  --hoam-color-accent-default: #7a2f14;
  --hoam-color-surface-default: #fff8ef;
  --hoam-color-text-default: #26150f;
  --hoam-border-radius-default: 12px;
}
```

## Scope a custom theme

You can also scope overrides to part of the UI:

```css
[data-theme='coffee-dark'] {
  --hoam-color-surface-default: #1f140f;
  --hoam-color-surface-inverse: #2d1d16;
  --hoam-color-text-default: #f4e7db;
  --hoam-color-text-inverse: #f4e7db;
  --hoam-color-accent-default: #d58d52;
}
```

```tsx
export function CoffeeTheme({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div data-theme="coffee-dark">{children}</div>;
}
```

## Recommendations

- Override tokens, not component class names, when you want consistent theming.
- Keep contrast compliant when changing text, accent, and surface colors.
- Treat spacing, radii, and typography tokens as part of the visual system so component proportions stay consistent.
