import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { PromoSection } from '@/components/PromoSection';

import '@testing-library/jest-dom';

vi.mock('@/components/Button', () => {
  return {
    Button: ({ children, className }: { children: React.ReactNode; className?: string }) => (
      <button
        data-testid="hoam-button"
        className={className}
      >
        {children}
      </button>
    ),
  };
});

const baseProps = {
  title: 'Big Promo',
  subtitle: 'Smaller Subtitle',
  description: 'This is a lovely description.',
  linkUrl: '/promo',
  linkText: 'Shop now',
  imageUrl: 'https://example.com/promo.jpg',
};

function getOrderIndex(el: Element) {
  const grid = el.ownerDocument.querySelector('.grid');
  if (!grid) return null;
  const children = Array.from(grid.children);
  return children.indexOf(el);
}

describe('<PromoSection />', () => {
  it('renders the required title and image with correct alt text', () => {
    render(
      <PromoSection
        title="Big Promo"
        imageUrl="https://example.com/promo.jpg"
      />
    );

    // Title (h2)
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

  it('renders Button only when both linkUrl and linkText are provided', () => {
    const { rerender } = render(
      <PromoSection
        title={baseProps.title}
        imageUrl={baseProps.imageUrl}
        linkUrl={baseProps.linkUrl}
        linkText={baseProps.linkText}
      />
    );
    expect(screen.getByTestId('hoam-button')).toBeInTheDocument();
    expect(screen.getByText(baseProps.linkText)).toBeInTheDocument();

    // Missing linkText
    rerender(
      <PromoSection
        title={baseProps.title}
        imageUrl={baseProps.imageUrl}
        linkUrl={baseProps.linkUrl}
      />
    );
    expect(screen.queryByTestId('hoam-button')).not.toBeInTheDocument();

    // Missing linkUrl
    rerender(
      <PromoSection
        title={baseProps.title}
        imageUrl={baseProps.imageUrl}
        linkText={baseProps.linkText}
      />
    );
    expect(screen.queryByTestId('hoam-button')).not.toBeInTheDocument();
  });

  it('orders image then text when alignment="left"', () => {
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

    const img = screen.getByRole('img', { name: baseProps.title });
    const imageWrapper = img.closest('.span-12');
    expect(imageWrapper).toBeInTheDocument();
    if (!imageWrapper) throw new Error('Expected image wrapper to exist');

    const content = screen.getByText(baseProps.description).closest('.span-12');
    expect(content).toBeInTheDocument();
    if (!content) throw new Error('Expected content wrapper to exist');

    const grid = imageWrapper.ownerDocument.querySelector('.grid');
    expect(grid).toBeInTheDocument();
    if (!grid) throw new Error('Expected grid container to exist');

    const spacer = Array.from(grid.children).find((el) => el.classList.contains('lg:span-1'));
    expect(spacer).toBeInTheDocument();
    if (!spacer) throw new Error('Expected spacer element to exist');

    const imageIndex = getOrderIndex(imageWrapper);
    const spacerIndex = getOrderIndex(spacer);
    const contentIndex = getOrderIndex(content);

    if (imageIndex === null || spacerIndex === null || contentIndex === null) {
      throw new Error('Expected all order indices to exist');
    }

    expect(imageIndex).toBeLessThan(spacerIndex);
    expect(spacerIndex).toBeLessThan(contentIndex);
  });

  it('orders text then image when alignment="right"', () => {
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

    const img = screen.getByRole('img', { name: baseProps.title });
    const imageWrapper = img.closest('.span-12');
    expect(imageWrapper).toBeInTheDocument();
    if (!imageWrapper) throw new Error('Expected image wrapper to exist');

    const content = screen.getByText(baseProps.description).closest('.span-12');
    expect(content).toBeInTheDocument();
    if (!content) throw new Error('Expected content wrapper to exist');

    const grid = imageWrapper.ownerDocument.querySelector('.grid');
    expect(grid).toBeInTheDocument();
    if (!grid) throw new Error('Expected grid container to exist');

    const spacer = Array.from(grid.children).find((el) => el.classList.contains('lg:span-1'));
    expect(spacer).toBeInTheDocument();
    if (!spacer) throw new Error('Expected spacer element to exist');

    const contentIndex = getOrderIndex(content);
    const spacerIndex = getOrderIndex(spacer);
    const imageIndex = getOrderIndex(imageWrapper);

    if (imageIndex === null || spacerIndex === null || contentIndex === null) {
      throw new Error('Expected all order indices to exist');
    }

    expect(contentIndex).toBeLessThan(spacerIndex);
    expect(spacerIndex).toBeLessThan(imageIndex);
  });

  it('does not render optional elements when not provided', () => {
    render(
      <PromoSection
        title="Only Title"
        imageUrl="https://example.com/only.jpg"
      />
    );

    // Subtitle and description not rendered
    expect(screen.queryByRole('heading', { level: 3 })).not.toBeInTheDocument();
    expect(screen.queryByText(baseProps.description)).not.toBeInTheDocument();

    // No button should be rendered
    expect(screen.queryByTestId('hoam-button')).not.toBeInTheDocument();

    // Title and image still present
    expect(screen.getByRole('heading', { level: 2, name: 'Only Title' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Only Title' })).toBeInTheDocument();
  });
});
