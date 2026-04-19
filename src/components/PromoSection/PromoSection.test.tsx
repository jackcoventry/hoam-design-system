import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { PromoSection } from '@/components/PromoSection';

vi.mock('@/components/Button', () => ({
  Button: ({
    children,
    as,
    href,
    className,
    variant,
    ...rest
  }: {
    children: React.ReactNode;
    as?: string;
    href?: string;
    className?: string;
    variant?: string;
  }) => {
    if (as === 'a') {
      return (
        <a
          href={href}
          className={className}
          data-variant={variant}
          {...rest}
        >
          {children}
        </a>
      );
    }

    return (
      <button
        className={className}
        data-variant={variant}
        {...rest}
      >
        {children}
      </button>
    );
  },
}));

vi.mock('@/components/Layout', () => ({
  Container: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="container">{children}</div>
  ),
  Grid: ({ children }: { children: React.ReactNode }) => <div data-testid="grid">{children}</div>,
  GridItem: ({
    children,
    span,
    spanLg,
    ...rest
  }: {
    children?: React.ReactNode;
    span?: number;
    spanLg?: number;
  } & React.HTMLAttributes<HTMLDivElement>) => (
    <div
      data-testid="grid-item"
      data-span={span}
      data-span-lg={spanLg}
      {...rest}
    >
      {children}
    </div>
  ),
  Stack: ({
    children,
    gap,
    className,
    ...rest
  }: {
    children: React.ReactNode;
    gap?: string;
    className?: string;
  } & React.HTMLAttributes<HTMLDivElement>) => (
    <div
      data-testid="stack"
      data-gap={gap}
      className={className}
      {...rest}
    >
      {children}
    </div>
  ),
}));

describe('PromoSection', () => {
  it('renders the required title', () => {
    render(<PromoSection title="Big promo" />);

    expect(screen.getByRole('heading', { level: 2, name: 'Big promo' })).toBeInTheDocument();
  });

  it('renders subtitle and description when provided', () => {
    render(
      <PromoSection
        title="Big promo"
        subtitle="Limited time"
        description="Save money on something great."
      />
    );

    expect(screen.getByText('Limited time')).toBeInTheDocument();
    expect(screen.getByText('Save money on something great.')).toBeInTheDocument();
  });

  it('does not render subtitle or description when not provided', () => {
    render(<PromoSection title="Big promo" />);

    expect(screen.queryByText('Limited time')).not.toBeInTheDocument();
    expect(screen.queryByText(/save money/i)).not.toBeInTheDocument();
  });

  it('renders an image when imageUrl is provided', () => {
    render(
      <PromoSection
        title="Big promo"
        imageUrl="/promo.jpg"
      />
    );

    const image = screen.getByRole('img', { name: 'Big promo' });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/promo.jpg');
  });

  it('does not render an image when imageUrl is not provided', () => {
    render(<PromoSection title="Big promo" />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders a link button when linkUrl and linkText are both provided', () => {
    render(
      <PromoSection
        title="Big promo"
        linkUrl="/shop"
        linkText="Shop now"
      />
    );

    const link = screen.getByRole('link', { name: 'Shop now' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/shop');
    expect(link).toHaveAttribute('data-variant', 'tertiary');
  });

  it('does not render a link when only linkUrl is provided', () => {
    render(
      <PromoSection
        title="Big promo"
        linkUrl="/shop"
      />
    );

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('does not render a link when only linkText is provided', () => {
    render(
      <PromoSection
        title="Big promo"
        linkText="Shop now"
      />
    );

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders text block after image block by default when alignment is left', () => {
    render(
      <PromoSection
        title="Big promo"
        imageUrl="/promo.jpg"
      />
    );

    const grid = screen.getByTestId('grid');
    const gridItems = Array.from(grid.children);

    expect(gridItems).toHaveLength(3);

    expect(gridItems[0]).toContainElement(screen.getByRole('img', { name: 'Big promo' }));
    expect(gridItems[1]).toHaveAttribute('aria-hidden', 'true');
    expect(gridItems[2]).toContainElement(
      screen.getByRole('heading', { level: 2, name: 'Big promo' })
    );
  });

  it('renders text block before image block when alignment is right', () => {
    render(
      <PromoSection
        title="Big promo"
        imageUrl="/promo.jpg"
        alignment="right"
      />
    );

    const grid = screen.getByTestId('grid');
    const gridItems = Array.from(grid.children);

    expect(gridItems).toHaveLength(3);

    expect(gridItems[0]).toContainElement(
      screen.getByRole('heading', { level: 2, name: 'Big promo' })
    );
    expect(gridItems[1]).toHaveAttribute('aria-hidden', 'true');
    expect(gridItems[2]).toContainElement(screen.getByRole('img', { name: 'Big promo' }));
  });

  it('does not render a spacer when there is no image', () => {
    render(<PromoSection title="Big promo" />);

    const grid = screen.getByTestId('grid');
    const gridItems = Array.from(grid.children);

    expect(gridItems).toHaveLength(1);
    expect(gridItems[0]).toContainElement(
      screen.getByRole('heading', { level: 2, name: 'Big promo' })
    );
  });

  it('passes the expected gap to Stack', () => {
    render(<PromoSection title="Big promo" />);

    expect(screen.getByTestId('stack')).toHaveAttribute('data-gap', 'md');
  });

  it('renders inside container and grid layout wrappers', () => {
    render(<PromoSection title="Big promo" />);

    expect(screen.getByTestId('container')).toBeInTheDocument();
    expect(screen.getByTestId('grid')).toBeInTheDocument();
  });
});
