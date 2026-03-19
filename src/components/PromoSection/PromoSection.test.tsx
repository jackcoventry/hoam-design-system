import { render, screen, within } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { PromoSection } from '@/components/PromoSection';

import '@testing-library/jest-dom';

vi.mock('@/components/Button', () => ({
  Button: ({
    children,
    className,
    as,
    href,
  }: {
    children: ReactNode;
    className?: string;
    as?: 'a' | 'button';
    href?: string;
  }) =>
    as === 'a' ? (
      <a
        data-testid="hoam-button"
        className={className}
        href={href}
      >
        {children}
      </a>
    ) : (
      <button
        data-testid="hoam-button"
        className={className}
      >
        {children}
      </button>
    ),
}));

vi.mock('@/components/Layout', () => ({
  Container: ({ children }: { children: ReactNode }) => (
    <div data-testid="container">{children}</div>
  ),
  Grid: ({ children }: { children: ReactNode }) => <div data-testid="grid">{children}</div>,
  GridItem: ({
    children,
    span,
    spanLg,
  }: {
    children?: ReactNode;
    span?: number;
    spanLg?: number;
  }) => (
    <div
      data-testid="grid-item"
      data-span={span}
      data-span-lg={spanLg}
    >
      {children}
    </div>
  ),
}));

const baseProps = {
  title: 'Big Promo',
  subtitle: 'Smaller Subtitle',
  description: 'This is a lovely description.',
  linkUrl: '/promo',
  linkText: 'Shop now',
  imageUrl: 'https://example.com/promo.jpg',
} as const;

describe('<PromoSection />', () => {
  it('renders the required title and image with correct alt text', () => {
    render(
      <PromoSection
        title="Big Promo"
        imageUrl="https://example.com/promo.jpg"
      />
    );

    expect(screen.getByRole('heading', { level: 2, name: 'Big Promo' })).toBeInTheDocument();

    const img = screen.getByRole('img', { name: 'Big Promo' });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/promo.jpg');
  });

  it('renders subtitle and description when provided', () => {
    render(
      <PromoSection
        title={baseProps.title}
        subtitle={baseProps.subtitle}
        description={baseProps.description}
        imageUrl={baseProps.imageUrl}
      />
    );

    expect(screen.getByRole('heading', { level: 3, name: baseProps.subtitle })).toBeInTheDocument();
    expect(screen.getByText(baseProps.description)).toBeInTheDocument();
  });

  it('renders a link button only when both linkUrl and linkText are provided', () => {
    const { rerender } = render(
      <PromoSection
        title={baseProps.title}
        imageUrl={baseProps.imageUrl}
        linkUrl={baseProps.linkUrl}
        linkText={baseProps.linkText}
      />
    );

    const button = screen.getByTestId('hoam-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(baseProps.linkText);
    expect(button).toHaveAttribute('href', baseProps.linkUrl);

    rerender(
      <PromoSection
        title={baseProps.title}
        imageUrl={baseProps.imageUrl}
        linkUrl={baseProps.linkUrl}
      />
    );
    expect(screen.queryByTestId('hoam-button')).not.toBeInTheDocument();

    rerender(
      <PromoSection
        title={baseProps.title}
        imageUrl={baseProps.imageUrl}
        linkText={baseProps.linkText}
      />
    );
    expect(screen.queryByTestId('hoam-button')).not.toBeInTheDocument();
  });

  it('orders image then spacer then text when alignment="left"', () => {
    render(
      <PromoSection
        title={baseProps.title}
        subtitle={baseProps.subtitle}
        description={baseProps.description}
        linkUrl={baseProps.linkUrl}
        linkText={baseProps.linkText}
        imageUrl={baseProps.imageUrl}
        alignment="left"
      />
    );

    const grid = screen.getByTestId('grid');
    const items = within(grid).getAllByTestId('grid-item');

    expect(items).toHaveLength(3);

    const first = items[0];
    const second = items[1];
    const third = items[2];

    if (!first || !second || !third) {
      throw new TypeError('Expected three grid items');
    }

    expect(within(first).getByRole('img', { name: baseProps.title })).toBeInTheDocument();
    expect(second).toBeEmptyDOMElement();
    expect(
      within(third).getByRole('heading', { level: 2, name: baseProps.title })
    ).toBeInTheDocument();

    expect(first).toHaveAttribute('data-span', '12');
    expect(first).toHaveAttribute('data-span-lg', '5');
    expect(second).toHaveAttribute('data-span-lg', '1');
    expect(third).toHaveAttribute('data-span', '12');
    expect(third).toHaveAttribute('data-span-lg', '6');
  });

  it('orders text then spacer then image when alignment="right"', () => {
    render(
      <PromoSection
        title={baseProps.title}
        subtitle={baseProps.subtitle}
        description={baseProps.description}
        linkUrl={baseProps.linkUrl}
        linkText={baseProps.linkText}
        imageUrl={baseProps.imageUrl}
        alignment="right"
      />
    );

    const grid = screen.getByTestId('grid');
    const items = within(grid).getAllByTestId('grid-item');

    expect(items).toHaveLength(3);

    const first = items[0];
    const second = items[1];
    const third = items[2];

    if (!first || !second || !third) {
      throw new TypeError('Expected three grid items');
    }

    expect(
      within(first).getByRole('heading', { level: 2, name: baseProps.title })
    ).toBeInTheDocument();
    expect(second).toBeEmptyDOMElement();
    expect(within(third).getByRole('img', { name: baseProps.title })).toBeInTheDocument();

    expect(first).toHaveAttribute('data-span', '12');
    expect(first).toHaveAttribute('data-span-lg', '6');
    expect(second).toHaveAttribute('data-span-lg', '1');
    expect(third).toHaveAttribute('data-span', '12');
    expect(third).toHaveAttribute('data-span-lg', '5');
  });

  it('does not render optional elements when not provided', () => {
    render(
      <PromoSection
        title="Only Title"
        imageUrl="https://example.com/only.jpg"
      />
    );

    expect(screen.queryByRole('heading', { level: 3 })).not.toBeInTheDocument();
    expect(screen.queryByText(baseProps.description)).not.toBeInTheDocument();
    expect(screen.queryByTestId('hoam-button')).not.toBeInTheDocument();

    expect(screen.getByRole('heading', { level: 2, name: 'Only Title' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Only Title' })).toBeInTheDocument();
  });

  it('does not render image or spacer when imageUrl is not provided', () => {
    render(
      <PromoSection
        title="Text Only"
        subtitle="Subtitle"
        description="Description"
        alignment="left"
      />
    );

    const grid = screen.getByTestId('grid');
    const items = within(grid).getAllByTestId('grid-item');

    const first = items[0];

    if (!first) {
      throw new TypeError('Expected at least one grid item');
    }

    expect(items).toHaveLength(1);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(within(first).getByRole('heading', { level: 2, name: 'Text Only' })).toBeInTheDocument();
  });
});
