import { forwardRef, type MouseEvent } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button, type LinkComponentProps } from '@/components/Button';

const MockLink = forwardRef<HTMLAnchorElement, LinkComponentProps>(function MockLink(
  { children, ...props },
  ref
) {
  return (
    <a
      ref={ref}
      data-testid="mock-link"
      {...props}
    >
      {children}
    </a>
  );
});

describe('Button', () => {
  it('renders a native button by default', () => {
    render(<Button>Save</Button>);

    const button = screen.getByRole('button', { name: 'Save' });

    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('renders a submit button when type is provided', () => {
    render(<Button type="submit">Submit</Button>);

    const button = screen.getByRole('button', { name: 'Submit' });

    expect(button).toHaveAttribute('type', 'submit');
  });

  it('calls onClick when clicked in button mode', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Save</Button>);

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('supports disabled in button mode', () => {
    render(<Button disabled>Disabled</Button>);

    expect(screen.getByRole('button', { name: 'Disabled' })).toBeDisabled();
  });

  it('renders an anchor when as="a"', () => {
    render(
      <Button
        as="a"
        href="/about"
      >
        About
      </Button>
    );

    const link = screen.getByRole('link', { name: 'About' });

    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/about');
  });

  it('adds noopener noreferrer when target is _blank and rel is not provided', () => {
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

  it('preserves provided rel when target is _blank', () => {
    render(
      <Button
        as="a"
        href="https://example.com"
        target="_blank"
        rel="external"
      >
        External
      </Button>
    );

    const link = screen.getByRole('link', { name: 'External' });

    expect(link).toHaveAttribute('rel', 'external');
  });

  it('renders a custom link component', () => {
    render(
      <Button
        as={MockLink}
        href="/dashboard"
      >
        Dashboard
      </Button>
    );

    const link = screen.getByRole('link', { name: 'Dashboard' });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/dashboard');
    expect(screen.getByTestId('mock-link')).toBeInTheDocument();
  });

  it('passes visual data attributes to a custom link component', () => {
    render(
      <Button
        as={MockLink}
        href="/dashboard"
        iconPosition="left"
        variant="secondary"
        size="small"
      >
        Dashboard
      </Button>
    );

    const link = screen.getByTestId('mock-link');

    expect(link).toHaveAttribute('data-icon-position', 'left');
    expect(link).toHaveAttribute('data-variant', 'secondary');
    expect(link).toHaveAttribute('data-size', 'small');
  });

  it('uses explicit aria-label when provided', () => {
    render(
      <Button
        icon="close"
        iconOnly
        aria-label="Close dialog"
      >
        Close
      </Button>
    );

    expect(screen.getByRole('button', { name: 'Close dialog' })).toBeInTheDocument();
  });

  it('uses string children as the accessible name for iconOnly buttons when aria-label is omitted', () => {
    render(
      <Button
        icon="close"
        iconOnly
      >
        Close
      </Button>
    );

    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('does not render visible text content when iconOnly is true', () => {
    render(
      <Button
        icon="close"
        iconOnly
      >
        Close
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Close' });

    expect(button).toBeInTheDocument();
    expect(button.querySelector('span')).not.toHaveTextContent('Close');
  });

  it('renders visible text content when iconOnly is false', () => {
    render(<Button>Read more</Button>);

    expect(screen.getByText('Read more')).toBeInTheDocument();
  });

  it('renders an icon when icon is provided', () => {
    const { container } = render(<Button icon="arrow-right">Next</Button>);

    const use = container.querySelector('use');

    expect(use).toBeInTheDocument();
    expect(use).toHaveAttribute('xlink:href', expect.stringContaining('icons.svg#arrow-right'));
  });

  it('applies visual data attributes in button mode', () => {
    render(
      <Button
        variant="tertiary"
        size="small"
        iconPosition="left"
      >
        Settings
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Settings' });

    expect(button).toHaveAttribute('data-variant', 'tertiary');
    expect(button).toHaveAttribute('data-size', 'small');
    expect(button).toHaveAttribute('data-icon-position', 'left');
  });

  it('applies visual data attributes in anchor mode', () => {
    render(
      <Button
        as="a"
        href="/settings"
        variant="secondary"
        size="small"
        iconPosition="left"
      >
        Settings
      </Button>
    );

    const link = screen.getByRole('link', { name: 'Settings' });

    expect(link).toHaveAttribute('data-variant', 'secondary');
    expect(link).toHaveAttribute('data-size', 'small');
    expect(link).toHaveAttribute('data-icon-position', 'left');
  });

  it('passes className through', () => {
    render(<Button className="custom-class">Styled</Button>);

    expect(screen.getByRole('button', { name: 'Styled' })).toHaveClass('custom-class');
  });

  it('supports anchor onClick', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn<(event: MouseEvent<HTMLAnchorElement>) => void>((event) => {
      event.preventDefault();
    });

    render(
      <Button
        as="a"
        href="/docs"
        onClick={handleClick}
      >
        Docs
      </Button>
    );

    await user.click(screen.getByRole('link', { name: 'Docs' }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
