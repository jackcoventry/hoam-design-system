import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PromoBlock } from '@/components/Navigation/MainNavigation/PromoBlock/PromoBlock';
import type { PromoBlockProps } from '@/components/Navigation/types';

vi.mock('@/components/Navigation/MainNavigation/PromoBlock/PromoBlock.module.css', () => ({
  default: {
    root: 'root',
    image: 'image',
    textContent: 'textContent',
    subtitle: 'subtitle',
    title: 'title',
  },
}));

function createProps(overrides: Partial<PromoBlockProps> = {}): PromoBlockProps {
  return {
    title: 'Shop',
    subtitle: 'Explore',
    href: '/explore/shop',
    image: '/images/shop.jpg',
    ...overrides,
  };
}

describe('PromoBlock', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders a link when href is provided', () => {
    const props = createProps();

    render(<PromoBlock {...props} />);

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/explore/shop');
  });

  it('renders a div when href is not provided', () => {
    const props = createProps({
      href: '',
    });

    const { container } = render(<PromoBlock {...props} />);

    const root = container.firstElementChild;
    expect(root).toBeInTheDocument();
    expect(root?.tagName).toBe('DIV');
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('applies the root class to the outer element', () => {
    const props = createProps();

    const { container } = render(<PromoBlock {...props} />);

    const root = container.firstElementChild;
    expect(root).toHaveClass('root');
  });

  it('adds interactive data attributes when href is provided', () => {
    const props = createProps();

    render(<PromoBlock {...props} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('data-sub-link');
    expect(link).toHaveAttribute('data-top-cyclable');
  });

  it('does not add interactive data attributes when href is not provided', () => {
    const props = createProps({
      href: '',
    });

    const { container } = render(<PromoBlock {...props} />);

    const root = container.firstElementChild;
    expect(root).not.toHaveAttribute('data-sub-link');
    expect(root).not.toHaveAttribute('data-top-cyclable');
  });

  it('renders the image with the provided src', () => {
    const props = createProps({
      image: '/images/promo.jpg',
    });

    const { container } = render(<PromoBlock {...props} />);

    const image = container.querySelector('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/images/promo.jpg');
  });

  it('renders the image with an empty alt attribute', () => {
    const props = createProps();

    const { container } = render(<PromoBlock {...props} />);

    const image = container.querySelector('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('alt', '');
  });

  it('renders an image element when image is not provided', () => {
    const props = createProps();
    delete (props as { image?: string }).image;

    const { container } = render(<PromoBlock {...props} />);

    const image = container.querySelector('img');
    expect(image).toBeInTheDocument();
    expect(image).not.toHaveAttribute('src');
    expect(image).toHaveAttribute('alt', '');
  });

  it('renders the subtitle in an h4', () => {
    const props = createProps({
      subtitle: 'Discover',
    });

    render(<PromoBlock {...props} />);

    const subtitle = screen.getByText('Discover');
    expect(subtitle.tagName).toBe('H4');
    expect(subtitle).toHaveClass('subtitle');
  });

  it('renders the title in an h3', () => {
    const props = createProps({
      title: 'New Arrivals',
    });

    render(<PromoBlock {...props} />);

    const title = screen.getByText('New Arrivals');
    expect(title.tagName).toBe('H3');
    expect(title).toHaveClass('title');
  });

  it('renders the text content wrapper', () => {
    const props = createProps();

    const { container } = render(<PromoBlock {...props} />);

    const textContent = container.querySelector('.textContent');
    expect(textContent).toBeInTheDocument();
  });

  it('applies the image class to the img element', () => {
    const props = createProps();

    const { container } = render(<PromoBlock {...props} />);

    const image = container.querySelector('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveClass('image');
  });

  it('renders correctly with empty href and empty image', () => {
    const props = createProps({
      href: '',
      image: '',
    });

    const { container } = render(<PromoBlock {...props} />);

    const root = container.firstElementChild;
    const image = container.querySelector('img');

    expect(root?.tagName).toBe('DIV');
    expect(image).toBeInTheDocument();
    expect(image).not.toHaveAttribute('src');
    expect(image).toHaveAttribute('alt', '');
    expect(screen.getByText('Explore')).toBeInTheDocument();
    expect(screen.getByText('Shop')).toBeInTheDocument();
  });

  it('renders subtitle and title inside the outer element', () => {
    const props = createProps();

    const { container } = render(<PromoBlock {...props} />);

    const root = container.firstElementChild;
    const subtitle = screen.getByText('Explore');
    const title = screen.getByText('Shop');

    expect(root).toContainElement(subtitle);
    expect(root).toContainElement(title);
  });
});
