import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Polymorphic Button component', () => {
  it('renders as a native <button> by default', () => {
    render(<Button>Click me</Button>);
    const el = screen.getByRole('button', { name: 'Click me' });
    expect(el).toBeInTheDocument();
    expect(el.tagName).toBe('BUTTON');
    // default type for component
    expect(el).toHaveAttribute('type', 'button');
  });

  it('supports submit/reset types for native button', () => {
    const { rerender } = render(<Button type="submit">Save</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');

    rerender(<Button type="reset">Reset</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'reset');
  });

  it('renders as <a> when as="a" and href provided', () => {
    render(
      <Button
        as="a"
        href="/pricing"
      >
        Pricing
      </Button>
    );
    const el = screen.getByRole('link', { name: 'Pricing' });
    expect(el).toBeInTheDocument();
    expect(el.tagName).toBe('A');
    expect(el).toHaveAttribute('href', '/pricing');
  });

  it('adds rel="noopener noreferrer" automatically for target="_blank" anchors if explicit rel not added', () => {
    render(
      <Button
        as="a"
        href="https://example.com"
        target="_blank"
      >
        External
      </Button>
    );
    const link = screen.getByRole('link', { name: 'External' });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('respects custom rel when provided with target="_blank"', () => {
    render(
      <Button
        as="a"
        href="https://example.com"
        target="_blank"
        rel="nofollow"
      >
        External
      </Button>
    );
    const link = screen.getByRole('link', { name: 'External' });
    expect(link).toHaveAttribute('rel', 'nofollow');
  });

  it('applies variant and icon-position data attributes', () => {
    render(
      <Button
        variant="secondary"
        iconPosition="left"
      >
        Label
      </Button>
    );
    const el = screen.getByRole('button', { name: 'Label' });
    expect(el).toHaveAttribute('data-variant', 'secondary');
    expect(el).toHaveAttribute('data-icon-position', 'left');
  });

  it('merges className correctly', () => {
    render(<Button className="extra">Text</Button>);
    const el = screen.getByRole('button', { name: 'Text' });
    expect(el.className).toMatch(/hoam-button/);
    expect(el.className).toMatch(/extra/);
  });

  it('rest spreads custom props correctly', () => {
    render(
      <Button
        data-testid="btn"
        aria-describedby="hint"
      >
        Hello
      </Button>
    );
    const el = screen.getByTestId('btn');
    expect(el).toHaveAttribute('aria-describedby', 'hint');
  });

  it('handles click for native button', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    fireEvent.click(screen.getByRole('button', { name: 'Go' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not fire click when disabled', () => {
    const onClick = vi.fn();
    render(
      <Button
        disabled
        onClick={onClick}
      >
        Disabled
      </Button>
    );
    const btn = screen.getByRole('button', { name: 'Disabled' });
    expect(btn).toBeDisabled();
    fireEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('forwards ref to the correct element (button)', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref target</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current?.tagName).toBe('BUTTON');
  });

  it('forwards ref to the correct element (anchor)', () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <Button
        as="a"
        href="/docs"
        ref={ref}
      >
        Docs
      </Button>
    );
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
    expect(ref.current?.tagName).toBe('A');
  });

  describe('iconOnly + aria-label behavior', () => {
    it('uses explicit ariaLabel when provided', () => {
      render(
        <Button
          iconOnly
          icon="x"
          ariaLabel="Close"
        >
          (ignored)
        </Button>
      );
      const el = screen.getByRole('button', { name: 'Close' });
      expect(el).toBeInTheDocument();
    });

    it('falls back to string children when iconOnly and no ariaLabel', () => {
      render(
        <Button
          iconOnly
          icon="x"
        >
          Close
        </Button>
      );
      const el = screen.getByRole('button', { name: 'Close' });
      expect(el).toBeInTheDocument();
    });

    it('does not render text when iconOnly', () => {
      render(
        <Button
          iconOnly
          icon="x"
          ariaLabel="Close"
        >
          Close
        </Button>
      );
      const btn = screen.getByRole('button', { name: 'Close' });
      expect(btn.querySelector('.hoam-button__content')).toBeNull();
      // Icon container should exist if icon prop is passed
      expect(btn.querySelector('.hoam-button__icon')).not.toBeNull();
    });
  });
});
