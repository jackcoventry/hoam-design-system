import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Grid } from '@/components/Layout/Grid';

describe('Grid', () => {
  it('renders children', () => {
    render(
      <Grid>
        <div>Item 1</div>
        <div>Item 2</div>
      </Grid>
    );

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('uses default cols and gap styles', () => {
    const { container } = render(
      <Grid>
        <div>Item</div>
      </Grid>
    );

    const element = container.firstChild as HTMLElement;

    expect(element.style.getPropertyValue('--grid-cols')).toBe('12');
    expect(element.style.getPropertyValue('--grid-gap')).toBe('var(--space-4, 1rem)');
    expect(element.style.getPropertyValue('--grid-row-gap')).toBe('var(--space-4, 1rem)');
  });

  it('applies custom cols and gap', () => {
    const { container } = render(
      <Grid
        cols={6}
        gap="xl"
      >
        <div>Item</div>
      </Grid>
    );

    const element = container.firstChild as HTMLElement;

    expect(element.style.getPropertyValue('--grid-cols')).toBe('6');
    expect(element.style.getPropertyValue('--grid-gap')).toBe('var(--space-8, 2rem)');
    expect(element.style.getPropertyValue('--grid-row-gap')).toBe('var(--space-8, 2rem)');
  });

  it('applies a custom rowGap', () => {
    const { container } = render(
      <Grid
        gap="sm"
        rowGap="lg"
      >
        <div>Item</div>
      </Grid>
    );

    const element = container.firstChild as HTMLElement;

    expect(element.style.getPropertyValue('--grid-gap')).toBe('var(--space-2, 0.5rem)');
    expect(element.style.getPropertyValue('--grid-row-gap')).toBe('var(--space-6, 1.5rem)');
  });

  it('forwards className', () => {
    const { container } = render(
      <Grid className="custom-grid">
        <div>Item</div>
      </Grid>
    );

    expect(container.firstChild).toHaveClass('custom-grid');
  });

  it('forwards native props', () => {
    render(
      <Grid
        data-testid="grid"
        id="main-grid"
      >
        <div>Item</div>
      </Grid>
    );

    const element = screen.getByTestId('grid');

    expect(element).toHaveAttribute('id', 'main-grid');
  });
});
