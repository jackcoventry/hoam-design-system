import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Stack } from '@/components/Layout/Stack';

vi.mock('@/design-tokens/spacing', () => ({
  mapGapToValue: vi.fn((gap: string) => {
    const values: Record<string, string> = {
      none: '0rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    };

    return values[gap] ?? '1rem';
  }),
}));

describe('Stack', () => {
  it('renders its children', () => {
    render(
      <Stack>
        <div>First child</div>
        <div>Second child</div>
      </Stack>
    );

    expect(screen.getByText('First child')).toBeInTheDocument();
    expect(screen.getByText('Second child')).toBeInTheDocument();
  });

  it('applies the default gap and align custom properties', () => {
    render(<Stack data-testid="stack">Content</Stack>);

    const stack = screen.getByTestId('stack');
    expect(stack.style.getPropertyValue('--stack-gap')).toBe('1rem');
    expect(stack.style.getPropertyValue('--stack-align')).toBe('stretch');
  });

  it('applies a custom gap', () => {
    render(
      <Stack
        data-testid="stack"
        gap="lg"
      >
        Content
      </Stack>
    );

    const stack = screen.getByTestId('stack');
    expect(stack.style.getPropertyValue('--stack-gap')).toBe('1.5rem');
  });

  it('applies align="start"', () => {
    render(
      <Stack
        data-testid="stack"
        align="start"
      >
        Content
      </Stack>
    );

    const stack = screen.getByTestId('stack');
    expect(stack.style.getPropertyValue('--stack-align')).toBe('flex-start');
  });

  it('applies align="center"', () => {
    render(
      <Stack
        data-testid="stack"
        align="center"
      >
        Content
      </Stack>
    );

    const stack = screen.getByTestId('stack');
    expect(stack.style.getPropertyValue('--stack-align')).toBe('center');
  });

  it('applies align="end"', () => {
    render(
      <Stack
        data-testid="stack"
        align="end"
      >
        Content
      </Stack>
    );

    const stack = screen.getByTestId('stack');
    expect(stack.style.getPropertyValue('--stack-align')).toBe('flex-end');
  });

  it('applies align="stretch"', () => {
    render(
      <Stack
        data-testid="stack"
        align="stretch"
      >
        Content
      </Stack>
    );

    const stack = screen.getByTestId('stack');
    expect(stack.style.getPropertyValue('--stack-align')).toBe('stretch');
  });

  it('merges a custom className', () => {
    render(
      <Stack
        data-testid="stack"
        className="custom-stack"
      >
        Content
      </Stack>
    );

    expect(screen.getByTestId('stack')).toHaveClass('custom-stack');
  });

  it('passes through standard div attributes', () => {
    render(
      <Stack
        data-testid="stack"
        id="main-stack"
        aria-label="Example stack"
        title="Stack title"
      >
        Content
      </Stack>
    );

    const stack = screen.getByTestId('stack');
    expect(stack).toHaveAttribute('id', 'main-stack');
    expect(stack).toHaveAttribute('aria-label', 'Example stack');
    expect(stack).toHaveAttribute('title', 'Stack title');
  });

  it('passes through event handlers', () => {
    const onClick = vi.fn();

    render(
      <Stack
        data-testid="stack"
        onClick={onClick}
      >
        Content
      </Stack>
    );

    screen.getByTestId('stack').click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
