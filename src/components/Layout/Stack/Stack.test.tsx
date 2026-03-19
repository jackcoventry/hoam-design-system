import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Stack } from '@/components/Layout/Stack';

describe('Stack', () => {
  it('renders children', () => {
    render(
      <Stack>
        <div>Item 1</div>
        <div>Item 2</div>
      </Stack>
    );

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('uses default gap and align styles', () => {
    const { container } = render(
      <Stack>
        <div>Item</div>
      </Stack>
    );

    const element = container.firstChild as HTMLElement;

    expect(element.style.getPropertyValue('--stack-gap')).toBe('var(--space-4, 1rem)');
    expect(element.style.getPropertyValue('--stack-align')).toBe('stretch');
  });

  it('applies custom gap and align', () => {
    const { container } = render(
      <Stack
        gap="xl"
        align="center"
      >
        <div>Item</div>
      </Stack>
    );

    const element = container.firstChild as HTMLElement;

    expect(element.style.getPropertyValue('--stack-gap')).toBe('var(--space-8, 2rem)');
    expect(element.style.getPropertyValue('--stack-align')).toBe('center');
  });

  it('forwards className', () => {
    const { container } = render(
      <Stack className="custom-stack">
        <div>Item</div>
      </Stack>
    );

    expect(container.firstChild).toHaveClass('custom-stack');
  });

  it('forwards native props', () => {
    render(
      <Stack
        data-testid="stack"
        id="content-stack"
      >
        <div>Item</div>
      </Stack>
    );

    const element = screen.getByTestId('stack');

    expect(element).toHaveAttribute('id', 'content-stack');
  });
});
