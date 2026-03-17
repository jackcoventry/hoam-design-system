import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Button } from '@/components/Button';

describe('Button', () => {
  it('renders a button by default', () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole('button', { name: 'Click me' });

    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('renders button children', () => {
    render(<Button>Save</Button>);

    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('renders as an anchor when as="a"', () => {
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
    expect(link).toHaveAttribute('href', '/about');
  });

  it('applies safe rel for external links opened in a new tab', () => {
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

  it('preserves an explicit rel on external links', () => {
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

  it('calls onClick for button usage', () => {
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Press</Button>);

    fireEvent.click(screen.getByRole('button', { name: 'Press' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('respects disabled on button usage', () => {
    const onClick = vi.fn();

    render(
      <Button
        disabled
        onClick={onClick}
      >
        Press
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Press' });

    expect(button).toBeDisabled();

    fireEvent.click(button);

    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders submit type when provided', () => {
    render(<Button type="submit">Submit</Button>);

    expect(screen.getByRole('button', { name: 'Submit' })).toHaveAttribute('type', 'submit');
  });

  it('renders icon-only button with ariaLabel', () => {
    render(
      <Button
        icon="search"
        iconOnly
        ariaLabel="Search"
      >
        Hidden text
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Search' });

    expect(button).toBeInTheDocument();
    expect(screen.queryByText('Hidden text')).not.toBeInTheDocument();
  });

  it('falls back to string children as aria-label for icon-only button', () => {
    render(
      <Button
        icon="search"
        iconOnly
      >
        Search
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Search' });

    expect(button).toBeInTheDocument();
    expect(screen.queryByText('Search')).not.toBeInTheDocument();
  });

  it('renders icon-only anchor with ariaLabel', () => {
    render(
      <Button
        as="a"
        href="/search"
        icon="search"
        iconOnly
        ariaLabel="Search"
      >
        Hidden text
      </Button>
    );

    const link = screen.getByRole('link', { name: 'Search' });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/search');
    expect(screen.queryByText('Hidden text')).not.toBeInTheDocument();
  });

  it('forwards a ref to a button element', () => {
    const ref = createRef<HTMLButtonElement>();

    render(<Button ref={ref}>Ref button</Button>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('forwards a ref to an anchor element', () => {
    const ref = createRef<HTMLAnchorElement>();

    render(
      <Button
        as="a"
        href="/about"
        ref={ref}
      >
        About
      </Button>
    );

    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });

  it('passes through extra button attributes', () => {
    render(
      <Button
        data-testid="custom-button"
        name="save-button"
      >
        Save
      </Button>
    );

    const button = screen.getByTestId('custom-button');

    expect(button).toHaveAttribute('name', 'save-button');
  });

  it('passes through extra anchor attributes', () => {
    render(
      <Button
        as="a"
        href="/about"
        data-testid="custom-link"
      >
        About
      </Button>
    );

    const link = screen.getByTestId('custom-link');

    expect(link).toHaveAttribute('href', '/about');
  });
});
