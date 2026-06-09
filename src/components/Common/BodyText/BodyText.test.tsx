import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { BodyText } from '@/components/Common/BodyText';

vi.mock('@/components/Layout', () => ({
  Stack: ({ children, gap }: { children: ReactNode; gap: string }) => (
    <div data-stack-gap={gap}>{children}</div>
  ),
}));

vi.mock('@/components/Common/BodyText/BodyText.module.css', () => ({
  default: {
    root: 'root',
  },
}));

describe('BodyText', () => {
  it('renders a section by default', () => {
    const { container } = render(
      <BodyText>
        <p>Body copy</p>
      </BodyText>
    );

    expect(container.firstElementChild?.tagName).toBe('SECTION');
    expect(container.firstElementChild).toHaveClass('root');
  });

  it('renders the provided element when as is set', () => {
    const { container } = render(
      <BodyText as="article">
        <p>Article copy</p>
      </BodyText>
    );

    expect(container.firstElementChild?.tagName).toBe('ARTICLE');
  });

  it('passes children through the inner stack', () => {
    render(
      <BodyText>
        <p>Nested copy</p>
      </BodyText>
    );

    expect(screen.getByText('Nested copy')).toBeInTheDocument();
    expect(screen.getByText('Nested copy').parentElement).toHaveAttribute('data-stack-gap', 'md');
  });

  it('merges custom className with the root class', () => {
    const { container } = render(
      <BodyText className="custom-body-text">
        <p>Body copy</p>
      </BodyText>
    );

    expect(container.firstElementChild).toHaveClass('root');
    expect(container.firstElementChild).toHaveClass('custom-body-text');
  });
});
