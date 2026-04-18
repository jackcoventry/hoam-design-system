import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Icon } from '@/components/Icon';

describe('Icon', () => {
  it('renders an svg element', () => {
    const { container } = render(<Icon id="arrow-left" />);

    const svg = container.querySelector('svg');

    expect(svg).toBeInTheDocument();
  });

  it('renders a use element with the correct sprite reference', () => {
    const { container } = render(<Icon id="arrow-left" />);

    const use = container.querySelector('use');

    expect(use).toBeInTheDocument();
    expect(use).toHaveAttribute('xlink:href', expect.stringContaining('icons.svg#arrow-left'));
  });

  it('is decorative by default', () => {
    const { container } = render(<Icon id="arrow-left" />);

    const svg = container.querySelector('svg');

    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).not.toHaveAttribute('role');
    expect(svg).not.toHaveAttribute('aria-label');
  });

  it('renders as an accessible image when aria-label is provided', () => {
    render(
      <Icon
        id="arrow-left"
        aria-label="Go back"
      />
    );

    const icon = screen.getByRole('img', { name: 'Go back' });

    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('aria-label', 'Go back');
    expect(icon).not.toHaveAttribute('aria-hidden');
  });

  it('applies a custom className', () => {
    const { container } = render(
      <Icon
        id="arrow-left"
        className="custom-icon"
      />
    );

    const svg = container.querySelector('svg');

    expect(svg).toHaveClass('custom-icon');
  });

  it('uses the default size when none is provided', () => {
    const { container } = render(<Icon id="arrow-left" />);

    const svg = container.querySelector('svg');

    expect(svg).toHaveAttribute('width', '1.25em');
    expect(svg).toHaveAttribute('height', '1.25em');
  });

  it('uses a custom string size when provided', () => {
    const { container } = render(
      <Icon
        id="arrow-left"
        size="2rem"
      />
    );

    const svg = container.querySelector('svg');

    expect(svg).toHaveAttribute('width', '2rem');
    expect(svg).toHaveAttribute('height', '2rem');
  });

  it('uses a custom numeric size when provided', () => {
    const { container } = render(
      <Icon
        id="arrow-left"
        size={24}
      />
    );

    const svg = container.querySelector('svg');

    expect(svg).toHaveAttribute('width', '24');
    expect(svg).toHaveAttribute('height', '24');
  });

  it('uses currentColor fill', () => {
    const { container } = render(<Icon id="arrow-left" />);

    const svg = container.querySelector('svg');

    expect(svg).toHaveAttribute('fill', 'currentColor');
  });
});
